"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireSectorAccess, requireAuth } from "@/lib/auth";

// ==========================================
// ACTIVITY (KEGIATAN) ACTIONS
// ==========================================

export async function getActivities() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) {
      const session = await requireAuth();
      if (session.role === "ADMIN_SEKTOR") return []; 
      
      return await prisma.activity.findMany({
        include: { sector: true, program: true },
        orderBy: { date: 'desc' }
      });
    }

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
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
    }

    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data." };
    }
    
    await requireSectorAccess(activeSectorId);

    await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        status,
        isPublished,
        programId,
        sectorId: activeSectorId,
      },
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
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
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
    }

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        status,
        isPublished,
        programId,
      },
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
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
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: "Gagal menghapus data kegiatan" };
  }
}
