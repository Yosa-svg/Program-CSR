"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/mediaService";
import { getActiveSectorId, requireSectorAccess } from "@/lib/auth";

// ==========================================
// DOCUMENTATION ACTIONS
// ==========================================

export async function getDocumentations() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) return [];
    
    await requireSectorAccess(activeSectorId);

    return await prisma.documentation.findMany({
      where: { sectorId: activeSectorId },
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
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul dokumentasi terlalu pendek untuk dipublikasikan." };
      }
    }
    
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return { success: false, error: "Pilih gambar terlebih dahulu." };
    }

    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) throw new Error("No active sector");
    
    await requireSectorAccess(activeSectorId);

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
        isPublished,
        programId: programId || null,
        activityId: activityId || null,
        sectorId: activeSectorId,
        imageUrl: uploadResult.url,
      },
    });

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
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
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;

    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul dokumentasi terlalu pendek untuk dipublikasikan." };
      }
    }
    
    const file = formData.get("image") as File;

    // Cek dokumentasi lama
    const oldDoc = await prisma.documentation.findUnique({ where: { id } });
    if (!oldDoc) return { success: false, error: "Dokumentasi tidak ditemukan." };
    
    await requireSectorAccess(oldDoc.sectorId);

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
        isPublished,
        programId: programId || null,
        activityId: activityId || null,
        imageUrl: finalImageUrl,
      },
    });

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
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
      await requireSectorAccess(doc.sectorId);
      // Hapus data dari database
      await prisma.documentation.delete({
        where: { id }
      });
      
      // Hapus file fisik dari server
      await deleteImage(doc.imageUrl);
    }
    
    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete documentation:", error);
    return { success: false, error: "Gagal menghapus data dokumentasi" };
  }
}
