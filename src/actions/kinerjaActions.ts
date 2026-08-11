"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireSectorAccess } from "@/lib/auth";

// ==========================================
// KINERJA (METRIC) ACTIONS
// ==========================================

export async function getMetrics() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) return [];
    
    await requireSectorAccess(activeSectorId);

    return await prisma.metric.findMany({
      where: { sectorId: activeSectorId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return [];
  }
}

export async function createMetric(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const value = formData.get("value") as string;
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const period = formData.get("period") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama indikator terlalu pendek untuk dipublikasikan." };
      }
    }

    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) throw new Error("No active sector");
    
    await requireSectorAccess(activeSectorId);

    await prisma.metric.create({
      data: {
        name,
        value,
        unit: unit || null,
        description: description || null,
        period,
        status,
        isPublished,
        sectorId: activeSectorId,
      },
    });

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create metric:", error);
    return { success: false, error: "Gagal menyimpan data kinerja" };
  }
}

export async function updateMetric(id: string, formData: FormData) {
  try {
    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric not found");
    
    await requireSectorAccess(metric.sectorId);
    const name = formData.get("name") as string;
    const value = formData.get("value") as string;
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const period = formData.get("period") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama indikator terlalu pendek untuk dipublikasikan." };
      }
    }

    await prisma.metric.update({
      where: { id },
      data: {
        name,
        value,
        unit: unit || null,
        description: description || null,
        period,
        status,
        isPublished,
      },
    });

    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update metric:", error);
    return { success: false, error: "Gagal memperbarui data kinerja" };
  }
}

export async function deleteMetric(id: string) {
  try {
    const metric = await prisma.metric.findUnique({ where: { id } });
    if (!metric) throw new Error("Metric not found");
    
    await requireSectorAccess(metric.sectorId);

    await prisma.metric.delete({
      where: { id }
    });
    revalidatePath("/admin/kinerja");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete metric:", error);
    return { success: false, error: "Gagal menghapus data kinerja" };
  }
}
