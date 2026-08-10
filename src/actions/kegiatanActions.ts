"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// ACTIVITY (KEGIATAN) ACTIONS
// ==========================================

export async function getActivities() {
  try {
    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });
    
    if (!sector) return [];

    return await prisma.activity.findMany({
      where: { sectorId: sector.id },
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

    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });

    if (!sector) throw new Error("Sector Pertanian not found");

    await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        status,
        programId,
        sectorId: sector.id,
      },
    });

    revalidatePath("/admin/pertanian/kegiatan");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to create activity:", error);
    return { success: false, error: "Gagal menyimpan data kegiatan" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
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

    revalidatePath("/admin/pertanian/kegiatan");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to update activity:", error);
    return { success: false, error: "Gagal memperbarui data kegiatan" };
  }
}

export async function deleteActivity(id: string) {
  try {
    await prisma.activity.delete({
      where: { id }
    });
    revalidatePath("/admin/pertanian/kegiatan");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: "Gagal menghapus data kegiatan" };
  }
}
