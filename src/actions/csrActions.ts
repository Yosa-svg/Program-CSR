"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireSectorAccess } from "@/lib/auth";

// ==========================================
// PROGRAM ACTIONS
// ==========================================

export async function getPrograms() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) return [];

    // Verifikasi bahwa user punya akses ke sektor ini (kalau dia ADMIN_SEKTOR)
    await requireSectorAccess(activeSectorId);

    return await prisma.program.findMany({
      where: { sectorId: activeSectorId },
      orderBy: { title: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function createProgram(formData: FormData) {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) throw new Error("No active sector");

    await requireSectorAccess(activeSectorId);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const imageUrl = formData.get("imageUrl") as string || "/images/placeholder.jpg";

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan." };
      }
      if (!description || description.trim().length < 10) {
        return { success: false, error: "Deskripsi program harus lebih detail untuk dipublikasikan." };
      }
    }

    await prisma.program.create({
      data: {
        title,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        sectorId: activeSectorId,
      },
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { success: false, error: "Gagal menyimpan data" };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    // Kita harus memverifikasi bahwa program yang akan diedit ada di sektor yang user punya akses
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program not found");
    
    await requireSectorAccess(program.sectorId);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan." };
      }
      if (!description || description.trim().length < 10) {
        return { success: false, error: "Deskripsi program harus lebih detail untuk dipublikasikan." };
      }
    }

    await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
      },
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update program:", error);
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteProgram(id: string) {
  try {
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program not found");
    
    await requireSectorAccess(program.sectorId);

    await prisma.program.delete({
      where: { id }
    });
    revalidatePath("/admin/program");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete program:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}
