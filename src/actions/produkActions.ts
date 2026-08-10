"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// PRODUCT (PRODUK) ACTIONS
// ==========================================

export async function getProducts() {
  try {
    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });
    
    if (!sector) return [];

    return await prisma.product.findMany({
      where: { sectorId: sector.id },
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
    const programId = formData.get("programId") as string; // Optional

    const sector = await prisma.sector.findUnique({
      where: { slug: "pertanian" },
    });

    if (!sector) throw new Error("Sector Pertanian not found");

    await prisma.product.create({
      data: {
        name,
        description,
        category,
        status,
        programId: programId || null,
        sectorId: sector.id,
        imageUrl: "/images/placeholder.jpg", // Akan dikembangkan di fase dokumentasi
      },
    });

    revalidatePath("/admin/pertanian/produk");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Gagal menyimpan data produk" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const programId = formData.get("programId") as string;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        status,
        programId: programId || null,
      },
    });

    revalidatePath("/admin/pertanian/produk");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Gagal memperbarui data produk" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/pertanian/produk");
    revalidatePath("/admin/pertanian");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Gagal menghapus data produk" };
  }
}
