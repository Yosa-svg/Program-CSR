"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";
import {
  validateRequiredString,
  validateOptionalString,
  validateEnum,
  validateSafeUrl,
  validateOptionalDate,
  validateId,
  toSafeErrorMessage,
} from "@/lib/validation";

// Helper: extract client IP & User-Agent
async function getRequestMeta() {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || null;
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || null;
    return { ipAddress, userAgent };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

// ==========================================
// ACTIVITY (KEGIATAN) ACTIONS
// ==========================================

export async function getActivities() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.activity.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        program: {
          select: {
            id: true,
            title: true,
          },
        },
        sector: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}

export async function createActivity(formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activeSectorId = await getActiveSectorId();
    const rawSectorId = (formData.get("sectorId") as string) || activeSectorId;

    const sectorIdVal = validateId(rawSectorId, "Sektor");
    if (!sectorIdVal.valid) {
      return { success: false, error: "Harap pilih sektor yang valid terlebih dahulu." };
    }
    const sectorId = sectorIdVal.value;

    // SBAC: Validasi keberadaan sektor di database
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!sector) {
      return { success: false, error: "Sektor yang dipilih tidak valid atau tidak ditemukan." };
    }

    const titleVal = validateRequiredString(formData.get("title"), "Judul kegiatan", 3, 255);
    if (!titleVal.valid) return { success: false, error: titleVal.error };
    const title = titleVal.value;

    const descVal = validateOptionalString(formData.get("description"), 10000);
    if (!descVal.valid) return { success: false, error: descVal.error };
    const description = descVal.value || "";

    const locVal = validateOptionalString(formData.get("location"), 255);
    if (!locVal.valid) return { success: false, error: locVal.error };
    const location = locVal.value;

    const dateVal = validateOptionalDate(formData.get("date"), "Tanggal kegiatan");
    if (!dateVal.valid) return { success: false, error: dateVal.error };
    const date = dateVal.value;

    const statusVal = validateEnum(formData.get("status"), ["UPCOMING", "ONGOING", "COMPLETED"], "UPCOMING", "Status kegiatan");
    if (!statusVal.valid) return { success: false, error: statusVal.error };
    const status = statusVal.value;

    const isPublished = formData.get("isPublished") === "true";

    const rawProgramId = formData.get("programId") as string;
    let programId: string | null = null;
    if (rawProgramId && rawProgramId.trim() !== "") {
      const progIdVal = validateId(rawProgramId, "Program Induk");
      if (!progIdVal.valid) return { success: false, error: progIdVal.error };
      programId = progIdVal.value;

      // Server-Side Relational Consistency Check
      const parentProgram = await prisma.program.findUnique({ where: { id: progIdVal.value } });
      if (!parentProgram || parentProgram.sectorId !== sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari kegiatan ini." };
      }
    }

    const srcVal = validateOptionalString(formData.get("source"), 255);
    if (!srcVal.valid) return { success: false, error: srcVal.error };
    const source = srcVal.value;

    const srcTypeRaw = formData.get("sourceType");
    const srcTypeVal = srcTypeRaw && String(srcTypeRaw).trim() !== ""
      ? validateEnum(srcTypeRaw, ["RESMI_ANTAM", "PEMERINTAH", "JURNAL_AKADEMIK", "MEDIA_MASSA", "DOKUMEN_LAPORAN"], undefined, "Tipe sumber")
      : { valid: true as const, value: null };
    if (!srcTypeVal.valid) return { success: false, error: srcTypeVal.error };
    const sourceType = srcTypeVal.value;

    const srcUrlVal = validateSafeUrl(formData.get("sourceUrl"), { allowRelative: false, maxLen: 1000, fieldName: "URL Sumber" });
    if (!srcUrlVal.valid) return { success: false, error: srcUrlVal.error };
    const sourceUrl = srcUrlVal.value;

    const verifVal = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "BELUM_TERVERIFIKASI",
      "Status verifikasi"
    );
    if (!verifVal.valid) return { success: false, error: verifVal.error };
    const verificationStatus = verifVal.value;

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (title.length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
      if (!programId || programId.length === 0) {
        return { success: false, error: "Kegiatan wajib dikaitkan dengan Program Induk sebelum dipublikasikan." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum kegiatan dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data kegiatan harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const created = await prisma.activity.create({
      data: {
        title,
        description,
        location: location || null,
        date,
        status,
        isPublished,
        programId: programId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "ACTIVITY",
      entityId: created.id,
      entityTitle: created.title,
      description: `Admin membuat kegiatan baru: ${created.title}`,
      metadata: {
        status,
        isPublished,
        sectorId,
        programId: programId || null,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create activity:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menyimpan data kegiatan.") };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idVal = validateId(id, "ID Kegiatan");
    if (!idVal.valid) return { success: false, error: idVal.error };

    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      return { success: false, error: "Kegiatan tidak ditemukan atau telah dihapus." };
    }

    const titleVal = validateRequiredString(formData.get("title"), "Judul kegiatan", 3, 255);
    if (!titleVal.valid) return { success: false, error: titleVal.error };
    const title = titleVal.value;

    const descVal = validateOptionalString(formData.get("description"), 10000);
    if (!descVal.valid) return { success: false, error: descVal.error };
    const description = descVal.value || "";

    const locVal = validateOptionalString(formData.get("location"), 255);
    if (!locVal.valid) return { success: false, error: locVal.error };
    const location = locVal.value;

    const dateVal = validateOptionalDate(formData.get("date"), "Tanggal kegiatan");
    if (!dateVal.valid) return { success: false, error: dateVal.error };
    const date = dateVal.value;

    const statusVal = validateEnum(formData.get("status"), ["UPCOMING", "ONGOING", "COMPLETED"], "UPCOMING", "Status kegiatan");
    if (!statusVal.valid) return { success: false, error: statusVal.error };
    const status = statusVal.value;

    const isPublished = formData.get("isPublished") === "true";

    const rawProgramId = formData.get("programId") as string;
    let programId: string | null = null;
    if (rawProgramId && rawProgramId.trim() !== "") {
      const progIdVal = validateId(rawProgramId, "Program Induk");
      if (!progIdVal.valid) return { success: false, error: progIdVal.error };
      programId = progIdVal.value;

      // Server-Side Relational Consistency Check
      const parentProgram = await prisma.program.findUnique({ where: { id: progIdVal.value } });
      if (!parentProgram || parentProgram.sectorId !== activity.sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari kegiatan ini." };
      }
    }

    const srcVal = validateOptionalString(formData.get("source"), 255);
    if (!srcVal.valid) return { success: false, error: srcVal.error };
    const source = srcVal.value;

    const srcTypeRaw = formData.get("sourceType");
    const srcTypeVal = srcTypeRaw && String(srcTypeRaw).trim() !== ""
      ? validateEnum(srcTypeRaw, ["RESMI_ANTAM", "PEMERINTAH", "JURNAL_AKADEMIK", "MEDIA_MASSA", "DOKUMEN_LAPORAN"], undefined, "Tipe sumber")
      : { valid: true as const, value: null };
    if (!srcTypeVal.valid) return { success: false, error: srcTypeVal.error };
    const sourceType = srcTypeVal.value;

    const srcUrlVal = validateSafeUrl(formData.get("sourceUrl"), { allowRelative: false, maxLen: 1000, fieldName: "URL Sumber" });
    if (!srcUrlVal.valid) return { success: false, error: srcUrlVal.error };
    const sourceUrl = srcUrlVal.value;

    const verifVal = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "BELUM_TERVERIFIKASI",
      "Status verifikasi"
    );
    if (!verifVal.valid) return { success: false, error: verifVal.error };
    const verificationStatus = verifVal.value;

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (title.length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
      if (!programId || programId.length === 0) {
        return { success: false, error: "Kegiatan wajib dikaitkan dengan Program Induk sebelum dipublikasikan." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum kegiatan dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data kegiatan harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const changedFields: string[] = [];
    if (title !== activity.title) changedFields.push("title");
    if (description !== activity.description) changedFields.push("description");
    if (location !== activity.location) changedFields.push("location");
    if (status !== activity.status) changedFields.push("status");
    if (isPublished !== activity.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== activity.verificationStatus) changedFields.push("verificationStatus");
    if ((programId || null) !== activity.programId) changedFields.push("programId");

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        location: location || null,
        date,
        status,
        isPublished,
        programId: programId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "ACTIVITY",
      entityId: id,
      entityTitle: title,
      description: `Admin memperbarui kegiatan: ${title}`,
      metadata: {
        changedFields,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update activity:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal memperbarui data kegiatan.") };
  }
}

export async function deleteActivity(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idVal = validateId(id, "ID Kegiatan");
    if (!idVal.valid) return { success: false, error: idVal.error };

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            documentations: true,
          },
        },
      },
    });
    if (!activity) {
      return { success: false, error: "Kegiatan tidak ditemukan atau telah dihapus." };
    }

    if (activity._count.documentations > 0) {
      return {
        success: false,
        error: `Kegiatan tidak dapat dihapus karena masih memiliki ${activity._count.documentations} dokumentasi terkait. Hapus atau alihkan dokumentasi terkait terlebih dahulu.`,
      };
    }

    await prisma.activity.delete({
      where: { id },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "ACTIVITY",
      entityId: id,
      entityTitle: activity.title,
      description: `Admin menghapus kegiatan: ${activity.title}`,
      metadata: {
        sectorId: activity.sectorId,
        programId: activity.programId,
        status: activity.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menghapus data kegiatan.") };
  }
}
