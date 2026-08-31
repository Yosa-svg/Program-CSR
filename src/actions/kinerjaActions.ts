"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";

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
        sector: true,
        program: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
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
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data indikator." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = (formData.get("category") as string) || "OUTCOME";
    const unit = formData.get("unit") as string;

    const targetRaw = formData.get("target") as string;
    const realizationRaw = formData.get("realization") as string;
    const target = targetRaw !== "" && !isNaN(parseFloat(targetRaw)) ? parseFloat(targetRaw) : null;
    const realization = realizationRaw !== "" && !isNaN(parseFloat(realizationRaw)) ? parseFloat(realizationRaw) : null;

    const value = formData.get("value") as string;
    const yearRaw = formData.get("year") as string;
    const year = yearRaw !== "" && !isNaN(parseInt(yearRaw)) ? parseInt(yearRaw) : null;
    const period = formData.get("period") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";
    const programId = formData.get("programId") as string;

    const status = (formData.get("status") as string) || "PUBLISHED";
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
        description: description || null,
        category,
        unit: unit || null,
        target,
        realization,
        value: value || null,
        year,
        period: period || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        programId: programId || null,
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
  } catch (error: any) {
    console.error("Failed to create metric:", error);
    return { success: false, error: error?.message || "Gagal menyimpan data kinerja" };
  }
}

export async function updateMetric(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric tidak ditemukan");

    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = (formData.get("category") as string) || "OUTCOME";
    const unit = (formData.get("unit") as string)?.trim();

    const targetRaw = formData.get("target") as string;
    const realizationRaw = formData.get("realization") as string;
    const target = targetRaw !== "" && !isNaN(parseFloat(targetRaw)) ? parseFloat(targetRaw) : null;
    const realization = realizationRaw !== "" && !isNaN(parseFloat(realizationRaw)) ? parseFloat(realizationRaw) : null;

    const value = formData.get("value") as string;
    const yearRaw = formData.get("year") as string;
    const year = yearRaw !== "" && !isNaN(parseInt(yearRaw)) ? parseInt(yearRaw) : null;
    const period = formData.get("period") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";
    const programId = formData.get("programId") as string;

    const status = (formData.get("status") as string) || "PUBLISHED";
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
      where: { id },
      data: {
        name,
        description: description || null,
        category,
        unit: unit || null,
        target,
        realization,
        value: value || null,
        year,
        period: period || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        programId: programId || null,
        status,
        isPublished,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "METRIC",
      entityId: id,
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
  } catch (error: any) {
    console.error("Failed to update metric:", error);
    return { success: false, error: error?.message || "Gagal memperbarui data kinerja" };
  }
}

export async function deleteMetric(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric tidak ditemukan");

    await prisma.metric.delete({
      where: { id },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "METRIC",
      entityId: id,
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
  } catch (error: any) {
    console.error("Failed to delete metric:", error);
    return { success: false, error: error?.message || "Gagal menghapus data kinerja" };
  }
}
