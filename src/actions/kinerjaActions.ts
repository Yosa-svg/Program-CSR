"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";

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
    await requireAuth();
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

    await prisma.metric.create({
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

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create metric:", error);
    return { success: false, error: "Gagal menyimpan data kinerja" };
  }
}

export async function updateMetric(id: string, formData: FormData) {
  try {
    await requireAuth();
    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric not found");

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

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update metric:", error);
    return { success: false, error: "Gagal memperbarui data kinerja" };
  }
}

export async function deleteMetric(id: string) {
  try {
    await requireAuth();
    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric not found");

    await prisma.metric.delete({
      where: { id },
    });
    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    revalidatePath("/kinerja");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete metric:", error);
    return { success: false, error: "Gagal menghapus data kinerja" };
  }
}
