"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireSectorAccess } from "@/lib/auth";

// ==========================================
// ACTIVITY (KEGIATAN) ACTIONS
// ==========================================

export async function getActivities() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) return [];
    
    await requireSectorAccess(activeSectorId);

    return await prisma.activity.findMany({
      where: { sectorId: activeSectorId },
      include: {
        program: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}

export async function createActivity(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const programId = formData.get("programId") as string;

    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) throw new Error("No active sector");
    
    await requireSectorAccess(activeSectorId);

    await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        status,
        programId,
        sectorId: activeSectorId,
      },
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create activity:", error);
    return { success: false, error: "Gagal menyimpan data kegiatan" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity not found");
    
    await requireSectorAccess(activity.sectorId);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const programId = formData.get("programId") as string;

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        status,
        programId,
      },
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update activity:", error);
    return { success: false, error: "Gagal memperbarui data kegiatan" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity not found");
    
    await requireSectorAccess(activity.sectorId);

    await prisma.activity.delete({
      where: { id }
    });
    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: "Gagal menghapus data kegiatan" };
  }
}
