"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/mediaService";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";

// Helper: extract client IP & User-Agent
async function getRequestMeta() {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || null;
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || null;
    return { ipAddress, userAgent };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

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
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

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

    const isFeatured = formData.get("isFeatured") === "true";

    // Upload file
    const uploadResult = await uploadImage(file, "documentation");
    if (uploadResult.error || !uploadResult.url) {
      return { success: false, error: uploadResult.error || "Gagal mengunggah gambar." };
    }

    const created = await prisma.documentation.create({
      data: {
        title,
        description: description || null,
        date: dateStr ? new Date(dateStr) : null,
        status: status || "Active",
        isPublished,
        isFeatured,
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

    // ActivityLog — non-blocking, tidak menyimpan URL gambar atau data binary
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "DOCUMENTATION",
      entityId: created.id,
      entityTitle: created.title,
      description: `Admin membuat dokumentasi baru: ${created.title}`,
      metadata: {
        status,
        isPublished,
        isFeatured,
        sectorId,
        verificationStatus,
        hasImage: true,
      },
      ipAddress,
      userAgent,
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
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const oldDoc = await prisma.documentation.findUnique({ where: { id } });
    if (!oldDoc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
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
    const imageChanged = imageFile && imageFile.size > 0;
    if (imageChanged) {
      const uploadResult = await uploadImage(imageFile, "documentation");
      if (uploadResult.error || !uploadResult.url) {
        return { success: false, error: uploadResult.error || "Gagal mengunggah gambar." };
      }
      if (oldDoc.imageUrl) {
        await deleteImage(oldDoc.imageUrl);
      }
      finalImageUrl = uploadResult.url;
    }

    const changedFields: string[] = [];
    if (title !== oldDoc.title) changedFields.push("title");
    if (description !== oldDoc.description) changedFields.push("description");
    if (status !== oldDoc.status) changedFields.push("status");
    if (isPublished !== oldDoc.isPublished) changedFields.push("isPublished");
    if (isFeatured !== oldDoc.isFeatured) changedFields.push("isFeatured");
    if (verificationStatus !== oldDoc.verificationStatus) changedFields.push("verificationStatus");
    if (imageChanged) changedFields.push("imageUrl");

    await prisma.documentation.update({
      where: { id },
      data: {
        title,
        description: description || null,
        date: dateStr ? new Date(dateStr) : null,
        status: status || "Active",
        isPublished,
        isFeatured,
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

    // ActivityLog — non-blocking, tidak menyimpan URL gambar atau credential
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "DOCUMENTATION",
      entityId: id,
      entityTitle: title,
      description: `Admin memperbarui dokumentasi: ${title}`,
      metadata: {
        changedFields,
        status,
        isPublished,
        isFeatured,
        verificationStatus,
      },
      ipAddress,
      userAgent,
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

export async function toggleFeaturedDocumentation(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const doc = await prisma.documentation.findUnique({ where: { id } });
    if (!doc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    const updated = await prisma.documentation.update({
      where: { id },
      data: { isFeatured: !doc.isFeatured },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "DOCUMENTATION",
      entityId: id,
      entityTitle: doc.title,
      description: `Admin ${updated.isFeatured ? "menambahkan" : "menghapus"} dokumentasi dari slider beranda: ${doc.title}`,
      metadata: {
        event: "TOGGLE_FEATURED",
        isFeatured: updated.isFeatured,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true, isFeatured: updated.isFeatured };
  } catch (error: any) {
    console.error("Failed to toggle featured status:", error);
    return { success: false, error: error?.message || "Gagal mengubah status slider beranda." };
  }
}

export async function deleteDocumentation(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const doc = await prisma.documentation.findUnique({ where: { id } });

    if (doc) {
      await prisma.documentation.delete({
        where: { id },
      });
      await deleteImage(doc.imageUrl);

      // ActivityLog — non-blocking, setelah delete berhasil
      void logActivity({
        userId: session.userId,
        action: ActivityAction.DELETE,
        entityType: "DOCUMENTATION",
        entityId: id,
        entityTitle: doc.title,
        description: `Admin menghapus dokumentasi: ${doc.title}`,
        metadata: {
          sectorId: doc.sectorId,
          status: doc.status,
          isFeatured: doc.isFeatured,
        },
        ipAddress,
        userAgent,
      });
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
