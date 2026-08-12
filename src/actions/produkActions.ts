"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireSectorAccess, requireAuth } from "@/lib/auth";

// ==========================================
// PRODUCT (PRODUK) ACTIONS
// ==========================================

export async function getProducts() {
  try {
    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) {
      const session = await requireAuth();
      if (session.role === "ADMIN_SEKTOR") return []; 
      
      return await prisma.product.findMany({
        include: { sector: true },
        orderBy: { name: 'asc' }
      });
    }

    await requireSectorAccess(activeSectorId);

    return await prisma.product.findMany({
      where: { sectorId: activeSectorId },
      include: {
        program: true
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string; // Optional

    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama produk terlalu pendek untuk dipublikasikan." };
      }
    }

    const activeSectorId = await getActiveSectorId();
    if (!activeSectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data." };
    }
    
    await requireSectorAccess(activeSectorId);

    await prisma.product.create({
      data: {
        name,
        description,
        category,
        status,
        isPublished,
        programId: programId || null,
        sectorId: activeSectorId,
        imageUrl: "/images/placeholder.jpg", // Akan dikembangkan di fase dokumentasi
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
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");
    
    await requireSectorAccess(product.sectorId);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    if (isPublished) {
      if (!name || name.trim().length < 3) {
        return { success: false, error: "Nama produk terlalu pendek untuk dipublikasikan." };
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
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");
    
    await requireSectorAccess(product.sectorId);

    await prisma.product.delete({
      where: { id }
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
