"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";

// Helper: generate unique URL-safe slug for Product
async function generateUniqueProductSlug(name: string, sectorId: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
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
        program: true,
        sector: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data produk." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string; // Optional

    const capacity = formData.get("capacity") as string;
    const unit = formData.get("unit") as string;
    const marketing = formData.get("marketing") as string;
    const certification = formData.get("certification") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

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

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category,
        status,
        isPublished,
        capacity: capacity || null,
        unit: unit || null,
        marketing: marketing || null,
        certification: certification || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        programId: programId || null,
        sectorId,
        imageUrl: "/images/placeholder.jpg",
      },
    });

    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Gagal menyimpan data produk" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await requireAuth();
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    const capacity = formData.get("capacity") as string;
    const unit = formData.get("unit") as string;
    const marketing = formData.get("marketing") as string;
    const certification = formData.get("certification") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

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

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        status,
        isPublished,
        capacity: capacity || null,
        unit: unit || null,
        marketing: marketing || null,
        certification: certification || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        programId: programId || null,
      },
    });

    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Gagal memperbarui data produk" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAuth();
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/produk");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Gagal menghapus data produk" };
  }
}
