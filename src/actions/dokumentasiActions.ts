"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "@/lib/mediaService";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";
import {
  validateRequiredString,
  validateOptionalString,
  validateSafeUrl,
  validateEnum,
  validateId,
  validateOptionalId,
  validateOptionalDate,
  toSafeErrorMessage,
} from "@/lib/validation";

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
        sector: {
          select: {
            id: true,
            name: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
          },
        },
        activity: {
          select: {
            id: true,
            title: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
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
    const rawSectorId = (formData.get("sectorId") as string) || activeSectorId;

    const sectorIdResult = validateId(rawSectorId, "Sektor");
    if (!sectorIdResult.success) {
      return { success: false, error: sectorIdResult.error };
    }
    const sectorId = sectorIdResult.data!;

    // SBAC: Validasi keberadaan sektor di database
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
    if (!sector) {
      return { success: false, error: "Sektor yang dipilih tidak valid atau tidak ditemukan." };
    }

    // Validate title
    const titleResult = validateRequiredString(formData.get("title"), "Judul dokumentasi", 3, 255);
    if (!titleResult.success) {
      return { success: false, error: titleResult.error };
    }
    const title = titleResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi dokumentasi", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || null;

    // Validate date
    const dateResult = validateOptionalDate(formData.get("date"), "Tanggal dokumentasi");
    if (!dateResult.success) {
      return { success: false, error: dateResult.error };
    }
    const date = dateResult.data || null;

    // Validate status
    const statusResult = validateEnum(
      formData.get("status"),
      ["PUBLISHED", "Active", "Draft", "ARCHIVED"],
      "Status",
      "Active"
    );
    if (!statusResult.success) {
      return { success: false, error: statusResult.error };
    }
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    // Validate relational IDs
    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) return { success: false, error: programIdResult.error };
    const programId = programIdResult.data || null;

    const activityIdResult = validateOptionalId(formData.get("activityId"), "Kegiatan");
    if (!activityIdResult.success) return { success: false, error: activityIdResult.error };
    const activityId = activityIdResult.data || null;

    const productIdResult = validateOptionalId(formData.get("productId"), "Produk");
    if (!productIdResult.success) return { success: false, error: productIdResult.error };
    const productId = productIdResult.data || null;

    // Validate optional strings
    const srcResult = validateOptionalString(formData.get("source"), "Sumber data", 255);
    if (!srcResult.success) return { success: false, error: srcResult.error };
    const source = srcResult.data || null;

    const srcTypeResult = validateOptionalString(formData.get("sourceType"), "Jenis sumber", 100);
    if (!srcTypeResult.success) return { success: false, error: srcTypeResult.error };
    const sourceType = srcTypeResult.data || null;

    const srcUrlResult = validateSafeUrl(formData.get("sourceUrl"), "URL Sumber");
    if (!srcUrlResult.success) return { success: false, error: srcUrlResult.error };
    const sourceUrl = srcUrlResult.data || null;

    const verResult = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "Status verifikasi",
      "BELUM_TERVERIFIKASI"
    );
    if (!verResult.success) return { success: false, error: verResult.error };
    const verificationStatus = verResult.data!;

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

    const created = await prisma.documentation.create({
      data: {
        title,
        description,
        date,
        status,
        isPublished,
        isFeatured,
        programId,
        activityId,
        productId,
        source,
        sourceType,
        sourceUrl,
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
  } catch (error: unknown) {
    console.error("Failed to create documentation:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menyimpan data dokumentasi.") };
  }
}

export async function updateDocumentation(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Dokumentasi");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const oldDoc = await prisma.documentation.findUnique({ where: { id: idResult.data! } });
    if (!oldDoc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    // Validate title
    const titleResult = validateRequiredString(formData.get("title"), "Judul dokumentasi", 3, 255);
    if (!titleResult.success) {
      return { success: false, error: titleResult.error };
    }
    const title = titleResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi dokumentasi", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || null;

    // Validate date
    const dateResult = validateOptionalDate(formData.get("date"), "Tanggal dokumentasi");
    if (!dateResult.success) {
      return { success: false, error: dateResult.error };
    }
    const date = dateResult.data || null;

    // Validate status
    const statusResult = validateEnum(
      formData.get("status"),
      ["PUBLISHED", "Active", "Draft", "ARCHIVED"],
      "Status",
      "Active"
    );
    if (!statusResult.success) {
      return { success: false, error: statusResult.error };
    }
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    // Validate relational IDs
    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) return { success: false, error: programIdResult.error };
    const programId = programIdResult.data || null;

    const activityIdResult = validateOptionalId(formData.get("activityId"), "Kegiatan");
    if (!activityIdResult.success) return { success: false, error: activityIdResult.error };
    const activityId = activityIdResult.data || null;

    const productIdResult = validateOptionalId(formData.get("productId"), "Produk");
    if (!productIdResult.success) return { success: false, error: productIdResult.error };
    const productId = productIdResult.data || null;

    // Validate optional strings
    const srcResult = validateOptionalString(formData.get("source"), "Sumber data", 255);
    if (!srcResult.success) return { success: false, error: srcResult.error };
    const source = srcResult.data || null;

    const srcTypeResult = validateOptionalString(formData.get("sourceType"), "Jenis sumber", 100);
    if (!srcTypeResult.success) return { success: false, error: srcTypeResult.error };
    const sourceType = srcTypeResult.data || null;

    const srcUrlResult = validateSafeUrl(formData.get("sourceUrl"), "URL Sumber");
    if (!srcUrlResult.success) return { success: false, error: srcUrlResult.error };
    const sourceUrl = srcUrlResult.data || null;

    const verResult = validateEnum(
      formData.get("verificationStatus"),
      ["BELUM_TERVERIFIKASI", "MENUNGGU_VERIFIKASI", "TERVERIFIKASI"],
      "Status verifikasi",
      "BELUM_TERVERIFIKASI"
    );
    if (!verResult.success) return { success: false, error: verResult.error };
    const verificationStatus = verResult.data!;

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
      where: { id: oldDoc.id },
      data: {
        title,
        description,
        date,
        status,
        isPublished,
        isFeatured,
        programId,
        activityId,
        productId,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        imageUrl: finalImageUrl,
      },
    });

    // ActivityLog — non-blocking, tidak menyimpan URL gambar atau credential
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "DOCUMENTATION",
      entityId: oldDoc.id,
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
  } catch (error: unknown) {
    console.error("Failed to update documentation:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal memperbarui data dokumentasi.") };
  }
}

export async function toggleFeaturedDocumentation(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Dokumentasi");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const doc = await prisma.documentation.findUnique({ where: { id: idResult.data! } });
    if (!doc) return { success: false, error: "Dokumentasi tidak ditemukan." };

    const updated = await prisma.documentation.update({
      where: { id: doc.id },
      data: { isFeatured: !doc.isFeatured },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "DOCUMENTATION",
      entityId: doc.id,
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
  } catch (error: unknown) {
    console.error("Failed to toggle featured status:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal mengubah status slider beranda.") };
  }
}

export async function deleteDocumentation(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Dokumentasi");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const doc = await prisma.documentation.findUnique({ where: { id: idResult.data! } });
    if (!doc) {
      return { success: false, error: "Dokumentasi tidak ditemukan atau telah dihapus." };
    }

    await prisma.documentation.delete({
      where: { id: doc.id },
    });
    await deleteImage(doc.imageUrl);

    // ActivityLog — non-blocking, setelah delete berhasil
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "DOCUMENTATION",
      entityId: doc.id,
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

    revalidatePath("/admin/dokumentasi");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete documentation:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menghapus data dokumentasi.") };
  }
}
