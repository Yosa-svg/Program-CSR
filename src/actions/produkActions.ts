"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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

// Helper: generate unique URL-safe slug for Product
async function generateUniqueProductSlug(name: string, sectorId: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug || "produk";
  let counter = 1;

  let existing = await prisma.product.findUnique({ where: { slug } });
  while (existing) {
    if (existing.sectorId === sectorId && existing.name.toLowerCase() === name.toLowerCase()) {
      return existing.slug;
    }
    slug = `${baseSlug}-${counter}`;
    existing = await prisma.product.findUnique({ where: { slug } });
    counter++;
  }
  return slug;
}

// ==========================================
// PRODUCT (PRODUK) ACTIONS
// ==========================================

export async function getProducts() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.product.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        program: {
          select: {
            id: true,
            title: true,
          },
        },
        sector: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
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

    // Validate name
    const nameResult = validateRequiredString(formData.get("name"), "Nama produk", 3, 255);
    if (!nameResult.success) {
      return { success: false, error: nameResult.error };
    }
    const name = nameResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi produk", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || "";

    // Validate category
    const catResult = validateRequiredString(formData.get("category"), "Kategori produk", 1, 100);
    if (!catResult.success) {
      return { success: false, error: catResult.error };
    }
    const category = catResult.data!;

    // Validate status
    const statusResult = validateEnum(
      formData.get("status"),
      ["AVAILABLE", "OUT_OF_STOCK", "Tersedia", "Habis"],
      "Status produk",
      "AVAILABLE"
    );
    if (!statusResult.success) {
      return { success: false, error: statusResult.error };
    }
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";

    // Validate programId
    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) {
      return { success: false, error: programIdResult.error };
    }
    const programId = programIdResult.data || null;

    // Validate optional strings
    const capResult = validateOptionalString(formData.get("capacity"), "Kapasitas", 100);
    if (!capResult.success) return { success: false, error: capResult.error };
    const capacity = capResult.data || null;

    const unitResult = validateOptionalString(formData.get("unit"), "Satuan", 50);
    if (!unitResult.success) return { success: false, error: unitResult.error };
    const unit = unitResult.data || null;

    const mktResult = validateOptionalString(formData.get("marketing"), "Pemasaran", 255);
    if (!mktResult.success) return { success: false, error: mktResult.error };
    const marketing = mktResult.data || null;

    const certResult = validateOptionalString(formData.get("certification"), "Sertifikasi", 255);
    if (!certResult.success) return { success: false, error: certResult.error };
    const certification = certResult.data || null;

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

    // Server-Side Relational Consistency Check
    if (programId) {
      const parentProgram = await prisma.program.findUnique({ where: { id: programId } });
      if (!parentProgram || parentProgram.sectorId !== sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari produk ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama produk terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum produk dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data produk harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const slug = await generateUniqueProductSlug(name, sectorId);

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category,
        status,
        isPublished,
        capacity,
        unit,
        marketing,
        certification,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        programId,
        sectorId,
        imageUrl: "/images/placeholder.jpg",
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "PRODUCT",
      entityId: created.id,
      entityTitle: created.name,
      description: `Admin membuat produk baru: ${created.name}`,
      metadata: {
        category,
        status,
        isPublished,
        sectorId,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menyimpan data produk.") };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Produk");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const product = await prisma.product.findUnique({ where: { id: idResult.data! } });
    if (!product) {
      return { success: false, error: "Produk tidak ditemukan atau telah dihapus." };
    }

    // Validate name
    const nameResult = validateRequiredString(formData.get("name"), "Nama produk", 3, 255);
    if (!nameResult.success) {
      return { success: false, error: nameResult.error };
    }
    const name = nameResult.data!;

    // Validate description
    const descResult = validateOptionalString(formData.get("description"), "Deskripsi produk", 10000);
    if (!descResult.success) {
      return { success: false, error: descResult.error };
    }
    const description = descResult.data || "";

    // Validate category
    const catResult = validateRequiredString(formData.get("category"), "Kategori produk", 1, 100);
    if (!catResult.success) {
      return { success: false, error: catResult.error };
    }
    const category = catResult.data!;

    // Validate status
    const statusResult = validateEnum(
      formData.get("status"),
      ["AVAILABLE", "OUT_OF_STOCK", "Tersedia", "Habis"],
      "Status produk",
      "AVAILABLE"
    );
    if (!statusResult.success) {
      return { success: false, error: statusResult.error };
    }
    const status = statusResult.data!;

    const isPublished = formData.get("isPublished") === "true";

    // Validate programId
    const programIdResult = validateOptionalId(formData.get("programId"), "Program Induk");
    if (!programIdResult.success) {
      return { success: false, error: programIdResult.error };
    }
    const programId = programIdResult.data || null;

    // Validate optional strings
    const capResult = validateOptionalString(formData.get("capacity"), "Kapasitas", 100);
    if (!capResult.success) return { success: false, error: capResult.error };
    const capacity = capResult.data || null;

    const unitResult = validateOptionalString(formData.get("unit"), "Satuan", 50);
    if (!unitResult.success) return { success: false, error: unitResult.error };
    const unit = unitResult.data || null;

    const mktResult = validateOptionalString(formData.get("marketing"), "Pemasaran", 255);
    if (!mktResult.success) return { success: false, error: mktResult.error };
    const marketing = mktResult.data || null;

    const certResult = validateOptionalString(formData.get("certification"), "Sertifikasi", 255);
    if (!certResult.success) return { success: false, error: certResult.error };
    const certification = certResult.data || null;

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

    // Server-Side Relational Consistency Check
    if (programId) {
      const parentProgram = await prisma.program.findUnique({ where: { id: programId } });
      if (!parentProgram || parentProgram.sectorId !== product.sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari produk ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama produk terlalu pendek untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum produk dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data produk harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const changedFields: string[] = [];
    if (name !== product.name) changedFields.push("name");
    if (description !== product.description) changedFields.push("description");
    if (category !== product.category) changedFields.push("category");
    if (status !== product.status) changedFields.push("status");
    if (isPublished !== product.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== product.verificationStatus) changedFields.push("verificationStatus");

    await prisma.product.update({
      where: { id: product.id },
      data: {
        name,
        description,
        category,
        status,
        isPublished,
        capacity,
        unit,
        marketing,
        certification,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        programId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "PRODUCT",
      entityId: product.id,
      entityTitle: name,
      description: `Admin memperbarui produk: ${name}`,
      metadata: {
        changedFields,
        category,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update product:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal memperbarui data produk.") };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const idResult = validateId(id, "ID Produk");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }

    const product = await prisma.product.findUnique({
      where: { id: idResult.data! },
      include: {
        _count: {
          select: {
            documentations: true,
          },
        },
      },
    });
    if (!product) {
      return { success: false, error: "Produk tidak ditemukan atau telah dihapus." };
    }

    if (product._count.documentations > 0) {
      return {
        success: false,
        error: `Produk tidak dapat dihapus karena masih memiliki ${product._count.documentations} dokumentasi terkait. Hapus atau alihkan dokumentasi terkait terlebih dahulu.`,
      };
    }

    await prisma.product.delete({
      where: { id: product.id },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "PRODUCT",
      entityId: product.id,
      entityTitle: product.name,
      description: `Admin menghapus produk: ${product.name}`,
      metadata: {
        category: product.category,
        sectorId: product.sectorId,
        status: product.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);
    return { success: false, error: toSafeErrorMessage(error, "Gagal menghapus data produk.") };
  }
}
