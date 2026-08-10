"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// PROGRAM ACTIONS
// ==========================================

export async function getPrograms() {
  try {
    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });
    
    if (!sector) return [];

    return await prisma.program.findMany({
      where: { sectorId: sector.id },
      orderBy: { title: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function createProgram(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;
    const imageUrl = formData.get("imageUrl") as string || "/images/placeholder.jpg";

    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });

    if (!sector) throw new Error("Sector Pertanian not found");

    await prisma.program.create({
      data: {
        title,
        description,
        location,
        beneficiaries,
        status,
        imageUrl,
        sectorId: sector.id,
      },
    });

    revalidatePath("/admin/pertanian/program");
    revalidatePath("/admin/pertanian");
    revalidatePath("/bidang/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { success: false, error: "Gagal menyimpan data" };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;

    await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        location,
        beneficiaries,
        status,
      },
    });

    revalidatePath("/admin/pertanian/program");
    revalidatePath("/admin/pertanian");
    revalidatePath("/bidang/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to update program:", error);
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteProgram(id: string) {
  try {
    await prisma.program.delete({
      where: { id }
    });
    revalidatePath("/admin/pertanian/program");
    revalidatePath("/admin/pertanian");
    revalidatePath("/bidang/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete program:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}
