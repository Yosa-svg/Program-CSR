"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";
import {
  validateRequiredString,
  validateOptionalString,
  validateSafeUrl,
  validateEnum,
  validateId,
  validateOptionalId,
  validateOptionalNumber,
  validateOptionalInteger,
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
// KINERJA (METRIC) ACTIONS
// ==========================================

export async function getMetrics() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.metric.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        sector: {
          select: {
            id: true,
            name: true,
          },
        },
        program: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return [];
  }
}

export async function createMetric(formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activeSectorId = await getActiveSectorId();
    const rawSectorId = (formData.get("sectorId") as string) || activeSectorId;

    const sectorIdResult = validateId(rawSectorId, "Sektor");
    if (!sectorIdResult.success) {
      return { success: false, error: sectorIdResult.error };
    }
    const sectorId = sectorIdResult.data!;

    // SBAC: Validasi keberadaan sektor di database
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!sector) {
      return { success: false, error: "Sektor yang dipilih tidak valid atau tidak ditemukan." };
    }

    // Validate name
    const nameResult = validateRequiredString(formData.get("name"), "Nama indikator", 3, 255);
    if (!nameResult.success) {
      return { success: false, error: nameResult.error };
    }
    const name = nameResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi indikator", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || null;

    // Validate category
    const catResult = validateEnum(
      formData.get("category"),
      ["OUTPUT", "OUTCOME", "IMPACT", "INDIKATOR"],
      "Kategori",
      "OUTCOME"
    );
    if (!catResult.success) return { success: false, error: catResult.error };
    const category = catResult.data!;

    // Validate unit
    const unitResult = validateOptionalString(formData.get("unit"), "Satuan", 50);
    if (!unitResult.success) return { success: false, error: unitResult.error };
    const unit = unitResult.data || null;

    // Validate target & realization
    const targetResult = validateOptionalNumber(formData.get("target"), "Target", -1e12, 1e12);
    if (!targetResult.success) return { success: false, error: targetResult.error };
    const target = targetResult.data ?? null;

    const realizationResult = validateOptionalNumber(formData.get("realization"), "Realisasi", -1e12, 1e12);
    if (!realizationResult.success) return { success: false, error: realizationResult.error };
    const realization = realizationResult.data ?? null;

    // Validate value
    const valueResult = validateOptionalString(formData.get("value"), "Nilai", 255);
    if (!valueResult.success) return { success: false, error: valueResult.error };
    const value = valueResult.data || null;

    // Validate year
    const yearResult = validateOptionalInteger(formData.get("year"), "Tahun", 1900, 2100);
    if (!yearResult.success) return { success: false, error: yearResult.error };
    const year = yearResult.data ?? null;

    // Validate period
    const periodResult = validateOptionalString(formData.get("period"), "Periode", 100);
    if (!periodResult.success) return { success: false, error: periodResult.error };
    const period = periodResult.data || null;

    // Validate source fields
    const srcResult = validateOptionalString(formData.get("source"), "Sumber data", 255);
    if (!srcResult.success) return { success: false, error: srcResult.error };
    const source = srcResult.data || null;

    const srcTypeResult = validateOptionalString(formData.get("sourceType"), "Jenis sumber", 100);
    if (!srcTypeResult.success) return { success: false, error: srcTypeResult.error };
    const sourceType = srcTypeResult.data || null;

    const srcUrlResult = validateSafeUrl(formData.get("sourceUrl"), "URL Sumber");
    if (!srcUrlResult.success) return { success: false, error: srcUrlResult.error };
    const sourceUrl = srcUrlResult.data || null;

    const verResult = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "Status verifikasi",
      "BELUM_TERVERIFIKASI"
    );
    if (!verResult.success) return { success: false, error: verResult.error };
    const verificationStatus = verResult.data!;

    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) return { success: false, error: programIdResult.error };
    const programId = programIdResult.data || null;

    const statusResult = validateEnum(
      formData.get("status"),
      ["PUBLISHED", "DRAFT", "ARCHIVED"],
      "Status",
      "PUBLISHED"
    );
    if (!statusResult.success) return { success: false, error: statusResult.error };
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";

    // Server-Side Relational Consistency Check
    if (programId) {
      const p = await prisma.program.findUnique({ where: { id: programId } });
      if (!p || p.sectorId !== sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari indikator ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama indikator terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum indikator dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data indikator harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const created = await prisma.metric.create({
      data: {
        name,
        description,
        category,
        unit,
        target,
        realization,
        value,
        year,
        period,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        programId,
        status,
        isPublished,
        sectorId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "METRIC",
      entityId: created.id,
      entityTitle: created.name,
      description: `Admin membuat indikator kinerja baru: ${created.name}`,
      metadata: {
        category,
        year,
        period: period || null,
        status,
        isPublished,
        sectorId,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to create metric:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menyimpan data kinerja.") };
  }
}

export async function updateMetric(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Indikator");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const metric = await prisma.metric.findUnique({ where: { id: idResult.data! } });
    if (!metric) {
      return { success: false, error: "Indikator kinerja tidak ditemukan atau telah dihapus." };
    }

    // Validate name
    const nameResult = validateRequiredString(formData.get("name"), "Nama indikator", 3, 255);
    if (!nameResult.success) {
      return { success: false, error: nameResult.error };
    }
    const name = nameResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi indikator", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || null;

    // Validate category
    const catResult = validateEnum(
      formData.get("category"),
      ["OUTPUT", "OUTCOME", "IMPACT", "INDIKATOR"],
      "Kategori",
      "OUTCOME"
    );
    if (!catResult.success) return { success: false, error: catResult.error };
    const category = catResult.data!;

    // Validate unit
    const unitResult = validateOptionalString(formData.get("unit"), "Satuan", 50);
    if (!unitResult.success) return { success: false, error: unitResult.error };
    const unit = unitResult.data || null;

    // Validate target & realization
    const targetResult = validateOptionalNumber(formData.get("target"), "Target", -1e12, 1e12);
    if (!targetResult.success) return { success: false, error: targetResult.error };
    const target = targetResult.data ?? null;

    const realizationResult = validateOptionalNumber(formData.get("realization"), "Realisasi", -1e12, 1e12);
    if (!realizationResult.success) return { success: false, error: realizationResult.error };
    const realization = realizationResult.data ?? null;

    // Validate value
    const valueResult = validateOptionalString(formData.get("value"), "Nilai", 255);
    if (!valueResult.success) return { success: false, error: valueResult.error };
    const value = valueResult.data || null;

    // Validate year
    const yearResult = validateOptionalInteger(formData.get("year"), "Tahun", 1900, 2100);
    if (!yearResult.success) return { success: false, error: yearResult.error };
    const year = yearResult.data ?? null;

    // Validate period
    const periodResult = validateOptionalString(formData.get("period"), "Periode", 100);
    if (!periodResult.success) return { success: false, error: periodResult.error };
    const period = periodResult.data || null;

    // Validate source fields
    const srcResult = validateOptionalString(formData.get("source"), "Sumber data", 255);
    if (!srcResult.success) return { success: false, error: srcResult.error };
    const source = srcResult.data || null;

    const srcTypeResult = validateOptionalString(formData.get("sourceType"), "Jenis sumber", 100);
    if (!srcTypeResult.success) return { success: false, error: srcTypeResult.error };
    const sourceType = srcTypeResult.data || null;

    const srcUrlResult = validateSafeUrl(formData.get("sourceUrl"), "URL Sumber");
    if (!srcUrlResult.success) return { success: false, error: srcUrlResult.error };
    const sourceUrl = srcUrlResult.data || null;

    const verResult = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "Status verifikasi",
      "BELUM_TERVERIFIKASI"
    );
    if (!verResult.success) return { success: false, error: verResult.error };
    const verificationStatus = verResult.data!;

    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) return { success: false, error: programIdResult.error };
    const programId = programIdResult.data || null;

    const statusResult = validateEnum(
      formData.get("status"),
      ["PUBLISHED", "DRAFT", "ARCHIVED"],
      "Status",
      "PUBLISHED"
    );
    if (!statusResult.success) return { success: false, error: statusResult.error };
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";

    // Server-Side Relational Consistency Check
    if (programId) {
      const p = await prisma.program.findUnique({ where: { id: programId } });
      if (!p || p.sectorId !== metric.sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari indikator ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama indikator terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum indikator dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data indikator harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const changedFields: string[] = [];
    if (name !== metric.name) changedFields.push("name");
    if (description !== metric.description) changedFields.push("description");
    if (category !== metric.category) changedFields.push("category");
    if (status !== metric.status) changedFields.push("status");
    if (isPublished !== metric.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== metric.verificationStatus) changedFields.push("verificationStatus");
    if (target !== metric.target) changedFields.push("target");
    if (realization !== metric.realization) changedFields.push("realization");
    if (year !== metric.year) changedFields.push("year");

    await prisma.metric.update({
      where: { id: metric.id },
      data: {
        name,
        description,
        category,
        unit,
        target,
        realization,
        value,
        year,
        period,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        programId,
        status,
        isPublished,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "METRIC",
      entityId: metric.id,
      entityTitle: name,
      description: `Admin memperbarui indikator kinerja: ${name}`,
      metadata: {
        changedFields,
        category,
        year,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update metric:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal memperbarui data kinerja.") };
  }
}

export async function deleteMetric(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Indikator");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const metric = await prisma.metric.findUnique({ where: { id: idResult.data! } });
    if (!metric) {
      return { success: false, error: "Indikator kinerja tidak ditemukan atau telah dihapus." };
    }

    await prisma.metric.delete({
      where: { id: metric.id },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "METRIC",
      entityId: metric.id,
      entityTitle: metric.name,
      description: `Admin menghapus indikator kinerja: ${metric.name}`,
      metadata: {
        category: metric.category,
        sectorId: metric.sectorId,
        year: metric.year,
        status: metric.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete metric:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menghapus data kinerja.") };
  }
}
