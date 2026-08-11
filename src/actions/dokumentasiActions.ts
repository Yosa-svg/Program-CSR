"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/mediaService";

// ==========================================
// DOCUMENTATION ACTIONS
// ==========================================

export async function getDocumentations() {
  try {
    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });
    
    if (!sector) return [];

    return await prisma.documentation.findMany({
      where: { sectorId: sector.id },
      include: {
        program: true,
        activity: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch documentations:", error);
    return [];
  }
}

export async function createDocumentation(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;
    
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return { success: false, error: "Pilih gambar terlebih dahulu." };
    }

    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });

    if (!sector) throw new Error("Sector Pertanian not found");

    // Upload file
    const uploadResult = await uploadImage(file, "documentation");
    
    if (uploadResult.error || !uploadResult.url) {
      return { success: false, error: uploadResult.error || "Gagal mengunggah gambar." };
    }

    await prisma.documentation.create({
      data: {
        title,
        description: description || null,
        date: dateStr ? new Date(dateStr) : null,
        status,
        programId: programId || null,
        activityId: activityId || null,
        sectorId: sector.id,
        imageUrl: uploadResult.url,
      },
    });

    revalidatePath("/admin/pertanian/dokumentasi");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to create documentation:", error);
    return { success: false, error: "Gagal menyimpan data dokumentasi" };
  }
}

export async function updateDocumentation(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;
    
    const file = formData.get("image") as File;

    // Cek dokumentasi lama
    const oldDoc = await prisma.documentation.findUnique({ where: { id } });
    if (!oldDoc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    let finalImageUrl = oldDoc.imageUrl;

    // Jika ada file baru yang diunggah
    if (file && file.size > 0) {
      const uploadResult = await uploadImage(file, "documentation");
      
      if (uploadResult.error || !uploadResult.url) {
        return { success: false, error: uploadResult.error || "Gagal mengunggah gambar." };
      }
      
      finalImageUrl = uploadResult.url;
      
      // Hapus gambar lama jika berbeda dengan yang baru (menghindari orphan files)
      if (oldDoc.imageUrl) {
        await deleteImage(oldDoc.imageUrl);
      }
    }

    await prisma.documentation.update({
      where: { id },
      data: {
        title,
        description: description || null,
        date: dateStr ? new Date(dateStr) : null,
        status,
        programId: programId || null,
        activityId: activityId || null,
        imageUrl: finalImageUrl,
      },
    });

    revalidatePath("/admin/pertanian/dokumentasi");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to update documentation:", error);
    return { success: false, error: "Gagal memperbarui data dokumentasi" };
  }
}

export async function deleteDocumentation(id: string) {
  try {
    const doc = await prisma.documentation.findUnique({ where: { id } });
    
    if (doc) {
      // Hapus data dari database
      await prisma.documentation.delete({
        where: { id }
      });
      
      // Hapus file fisik dari server
      await deleteImage(doc.imageUrl);
    }
    
    revalidatePath("/admin/pertanian/dokumentasi");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete documentation:", error);
    return { success: false, error: "Gagal menghapus data dokumentasi" };
  }
}
