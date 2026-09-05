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
  validateId,
  toSafeErrorMessage,
} from "@/lib/validation";

// Helper: extract client IP & User-Agent dari request headers
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

// Helper: generate unique URL-safe slug from title
async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!base) {
    base = "program";
  }

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.program.findFirst({
      where: {
        slug,
        ...(currentId ? { id: { not: currentId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    counter++;
    slug = `${base}-${counter}`;
  }
}

// ==========================================
// PROGRAM ACTIONS
// ==========================================

export async function getPrograms() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.program.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        sector: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { title: "asc" },
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function createProgram(formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activeSectorId = await getActiveSectorId();
    const rawSectorId = (formData.get("sectorId") as string) || activeSectorId;

    const sectorIdValidation = validateId(rawSectorId, "Sektor");
    if (!sectorIdValidation.valid) {
      return { success: false, error: "Harap pilih sektor yang valid terlebih dahulu." };
    }
    const sectorId = sectorIdValidation.value;

    // SBAC: Validasi keberadaan sektor di database
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!sector) {
      return { success: false, error: "Sektor yang dipilih tidak valid atau tidak ditemukan." };
    }

    // Input Validation
    const titleVal = validateRequiredString(formData.get("title"), "Nama program", 3, 255);
    if (!titleVal.valid) return { success: false, error: titleVal.error };
    const title = titleVal.value;

    const descVal = validateOptionalString(formData.get("description"), 10000);
    if (!descVal.valid) return { success: false, error: descVal.error };
    const description = descVal.value || "";

    const locVal = validateOptionalString(formData.get("location"), 255);
    if (!locVal.valid) return { success: false, error: locVal.error };
    const location = locVal.value || "-";

    const benVal = validateOptionalString(formData.get("beneficiaries"), 255);
    if (!benVal.valid) return { success: false, error: benVal.error };
    const beneficiaries = benVal.value || "-";

    const statusVal = validateEnum(formData.get("status"), ["ACTIVE", "PLANNED", "COMPLETED"], "ACTIVE", "Status program");
    if (!statusVal.valid) return { success: false, error: statusVal.error };
    const status = statusVal.value;

    const isPublished = formData.get("isPublished") === "true";

    const rawImageUrl = (formData.get("imageUrl") as string)?.trim() || "/images/placeholder.jpg";
    const imageVal = validateSafeUrl(rawImageUrl, { allowRelative: true, maxLen: 1000, fieldName: "URL Gambar" });
    if (!imageVal.valid) return { success: false, error: imageVal.error };
    const imageUrl = imageVal.value || "/images/placeholder.jpg";

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
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (description.length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan (min 10 karakter)." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const slug = await generateUniqueSlug(title);

    const created = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking, setelah operasi bisnis berhasil
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "PROGRAM",
      entityId: created.id,
      entityTitle: created.title,
      description: `Admin membuat program baru: ${created.title}`,
      metadata: {
        status,
        isPublished,
        sectorId,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create program:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menyimpan data program.") };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idVal = validateId(id, "ID Program");
    if (!idVal.valid) return { success: false, error: idVal.error };

    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) {
      return { success: false, error: "Program tidak ditemukan atau telah dihapus." };
    }

    const titleVal = validateRequiredString(formData.get("title"), "Nama program", 3, 255);
    if (!titleVal.valid) return { success: false, error: titleVal.error };
    const title = titleVal.value;

    const descVal = validateOptionalString(formData.get("description"), 10000);
    if (!descVal.valid) return { success: false, error: descVal.error };
    const description = descVal.value || "";

    const locVal = validateOptionalString(formData.get("location"), 255);
    if (!locVal.valid) return { success: false, error: locVal.error };
    const location = locVal.value || "-";

    const benVal = validateOptionalString(formData.get("beneficiaries"), 255);
    if (!benVal.valid) return { success: false, error: benVal.error };
    const beneficiaries = benVal.value || "-";

    const statusVal = validateEnum(formData.get("status"), ["ACTIVE", "PLANNED", "COMPLETED"], "ACTIVE", "Status program");
    if (!statusVal.valid) return { success: false, error: statusVal.error };
    const status = statusVal.value;

    const isPublished = formData.get("isPublished") === "true";
    const rawSectorId = (formData.get("sectorId") as string) || program.sectorId;
    const sectorIdVal = validateId(rawSectorId, "Sektor");
    if (!sectorIdVal.valid) return { success: false, error: sectorIdVal.error };
    const sectorId = sectorIdVal.value;

    // SBAC: Validasi bahwa target sektor ada di database
    const targetSector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!targetSector) {
      return { success: false, error: "Sektor yang dipilih tidak valid atau tidak ditemukan." };
    }

    const rawImageUrl = (formData.get("imageUrl") as string)?.trim() || program.imageUrl;
    const imageVal = validateSafeUrl(rawImageUrl, { allowRelative: true, maxLen: 1000, fieldName: "URL Gambar" });
    if (!imageVal.valid) return { success: false, error: imageVal.error };
    const imageUrl = imageVal.value || program.imageUrl;

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
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (description.length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan (min 10 karakter)." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    let slug = program.slug;
    if (title !== program.title) {
      slug = await generateUniqueSlug(title, id);
    }

    // Catat changedFields secara aman
    const changedFields: string[] = [];
    if (title !== program.title) changedFields.push("title");
    if (description !== program.description) changedFields.push("description");
    if (location !== program.location) changedFields.push("location");
    if (beneficiaries !== program.beneficiaries) changedFields.push("beneficiaries");
    if (status !== program.status) changedFields.push("status");
    if (isPublished !== program.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== program.verificationStatus) changedFields.push("verificationStatus");

    await prisma.program.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "PROGRAM",
      entityId: id,
      entityTitle: title,
      description: `Admin memperbarui program: ${title}`,
      metadata: {
        changedFields,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update program:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal memperbarui data program.") };
  }
}

export async function deleteProgram(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idVal = validateId(id, "ID Program");
    if (!idVal.valid) return { success: false, error: idVal.error };

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            activities: true,
            products: true,
            documentations: true,
            metrics: true,
          },
        },
      },
    });
    if (!program) {
      return { success: false, error: "Program tidak ditemukan atau telah dihapus." };
    }

    const totalRelated =
      program._count.activities +
      program._count.products +
      program._count.documentations +
      program._count.metrics;

    if (totalRelated > 0) {
      return {
        success: false,
        error: `Program tidak dapat dihapus karena masih memiliki ${totalRelated} data terkait (${program._count.activities} kegiatan, ${program._count.products} produk, ${program._count.documentations} dokumentasi, ${program._count.metrics} metrik). Hapus atau alihkan data terkait terlebih dahulu.`,
      };
    }

    await prisma.program.delete({
      where: { id },
    });

    // ActivityLog — non-blocking, setelah delete berhasil
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "PROGRAM",
      entityId: id,
      entityTitle: program.title,
      description: `Admin menghapus program: ${program.title}`,
      metadata: {
        sectorId: program.sectorId,
        status: program.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete program:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menghapus data program.") };
  }
}
