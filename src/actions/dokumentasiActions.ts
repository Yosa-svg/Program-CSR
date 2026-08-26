"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/mediaService";
import { getActiveSectorId, requireAuth } from "@/lib/auth";

// ==========================================
// DOCUMENTATION ACTIONS
// ==========================================

export async function getDocumentations() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.documentation.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        sector: true,
        program: true,
        activity: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch documentations:", error);
    return [];
  }
}

export async function createDocumentation(formData: FormData) {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data dokumentasi." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;
    const productId = formData.get("productId") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Server-Side Relational Consistency Checks
    if (programId) {
      const p = await prisma.program.findUnique({ where: { id: programId } });
      if (!p || p.sectorId !== sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }
    if (activityId) {
      const a = await prisma.activity.findUnique({ where: { id: activityId } });
      if (!a || a.sectorId !== sectorId) {
        return { success: false, error: "Kegiatan yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }
    if (productId) {
      const prod = await prisma.product.findUnique({ where: { id: productId } });
      if (!prod || prod.sectorId !== sectorId) {
        return { success: false, error: "Produk yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }

    const file = formData.get("image") as File;
    if (!file || file.size === 0) {
      return { success: false, error: "Pilih gambar terlebih dahulu." };
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul dokumentasi terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum dokumentasi dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data dokumentasi harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

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
        status: status || "Active",
        isPublished,
        programId: programId || null,
        activityId: activityId || null,
        productId: productId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        sectorId,
        imageUrl: uploadResult.url,
      },
    });

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create documentation:", error);
    return { success: false, error: error?.message || "Gagal menyimpan data dokumentasi" };
  }
}

export async function updateDocumentation(id: string, formData: FormData) {
  try {
    await requireAuth();
    const oldDoc = await prisma.documentation.findUnique({ where: { id } });
    if (!oldDoc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;
    const activityId = formData.get("activityId") as string;
    const productId = formData.get("productId") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Server-Side Relational Consistency Checks
    if (programId) {
      const p = await prisma.program.findUnique({ where: { id: programId } });
      if (!p || p.sectorId !== oldDoc.sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }
    if (activityId) {
      const a = await prisma.activity.findUnique({ where: { id: activityId } });
      if (!a || a.sectorId !== oldDoc.sectorId) {
        return { success: false, error: "Kegiatan yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }
    if (productId) {
      const prod = await prisma.product.findUnique({ where: { id: productId } });
      if (!prod || prod.sectorId !== oldDoc.sectorId) {
        return { success: false, error: "Produk yang dipilih berada di luar Sektor dari dokumentasi ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul dokumentasi terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum dokumentasi dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data dokumentasi harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }
    
    let finalImageUrl = oldDoc.imageUrl;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadImage(imageFile, "documentation");
      if (uploadResult.error || !uploadResult.url) {
        return { success: false, error: uploadResult.error || "Gagal mengunggah gambar." };
      }
      if (oldDoc.imageUrl) {
        await deleteImage(oldDoc.imageUrl);
      }
      finalImageUrl = uploadResult.url;
    }

    await prisma.documentation.update({
      where: { id },
      data: {
        title,
        description: description || null,
        date: dateStr ? new Date(dateStr) : null,
        status: status || "Active",
        isPublished,
        programId: programId || null,
        activityId: activityId || null,
        productId: productId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        imageUrl: finalImageUrl,
      },
    });

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update documentation:", error);
    return { success: false, error: error?.message || "Gagal memperbarui data dokumentasi" };
  }
}

export async function deleteDocumentation(id: string) {
  try {
    await requireAuth();
    const doc = await prisma.documentation.findUnique({ where: { id } });
    
    if (doc) {
      await prisma.documentation.delete({
        where: { id },
      });
      await deleteImage(doc.imageUrl);
    }
    
    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete documentation:", error);
    return { success: false, error: error?.message || "Gagal menghapus data dokumentasi" };
  }
}
