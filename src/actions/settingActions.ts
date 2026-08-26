"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession, requireAuth } from "@/lib/auth";

// ==========================================
// 1. PROFIL & KEAMANAN (ADMIN_CSR)
// ==========================================

export async function updateProfile(formData: FormData) {
  try {
    const session = await requireAuth();

    const name = formData.get("name") as string;
    if (!name || name.trim().length < 3) {
      return { success: false, error: "Nama minimal 3 karakter." };
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { name: name.trim() },
    });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Gagal memperbarui profil." };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const session = await requireAuth();

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua kolom kata sandi wajib diisi." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Kata sandi baru minimal 6 karakter." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi kata sandi baru tidak cocok." };
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { success: false, error: "Pengguna tidak ditemukan." };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Kata sandi saat ini salah." };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: newPasswordHash },
    });

    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { success: false, error: "Gagal memperbarui kata sandi." };
  }
}

// ==========================================
// 2. USER DIRECTORY (ADMIN_CSR)
// ==========================================

export async function getUsersList() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN_CSR") {
      return [];
    }

    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { name: "asc" },
      ],
    });
  } catch (error) {
    console.error("Failed to get users list:", error);
    return [];
  }
}

export async function createUser(formData: FormData) {
  return { 
    success: false, 
    error: "Penambahan akun admin secara dinamis dinonaktifkan pada model dua akun ADMIN_CSR." 
  };
}

export async function updateUser(id: string, formData: FormData) {
  return { 
    success: false, 
    error: "Perubahan akun admin lain dinonaktifkan pada model dua akun ADMIN_CSR. Silakan perbarui profil Anda sendiri di tab Profil." 
  };
}

export async function deleteUser(id: string) {
  return { 
    success: false, 
    error: "Penghapusan akun admin dinonaktifkan pada model dua akun ADMIN_CSR." 
  };
}

// ==========================================
// 3. MANAJEMEN SEKTOR (ADMIN_CSR)
// ==========================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createSector(formData: FormData) {
  try {
    await requireAuth();
    const name = formData.get("name") as string;
    if (!name || name.trim().length < 3) {
      return { success: false, error: "Nama sektor minimal 3 karakter." };
    }

    const trimmedName = name.trim();
    const slug = generateSlug(trimmedName);

    // Check duplicate
    const existing = await prisma.sector.findFirst({
      where: {
        OR: [
          { name: { equals: trimmedName } },
          { slug: { equals: slug } }
        ]
      }
    });

    if (existing) {
      return { success: false, error: "Sektor dengan nama atau slug ini sudah ada." };
    }

    await prisma.sector.create({
      data: {
        name: trimmedName,
        slug: slug,
      }
    });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/admin", "layout");
    revalidatePath("/bidang");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create sector:", error);
    return { success: false, error: "Gagal menambahkan sektor baru." };
  }
}

export async function updateSector(id: string, formData: FormData) {
  try {
    await requireAuth();
    const name = formData.get("name") as string;
    if (!name || name.trim().length < 3) {
      return { success: false, error: "Nama sektor minimal 3 karakter." };
    }

    const trimmedName = name.trim();
    const slug = generateSlug(trimmedName);

    // Check duplicate with another sector
    const existing = await prisma.sector.findFirst({
      where: {
        id: { not: id },
        OR: [
          { name: { equals: trimmedName } },
          { slug: { equals: slug } }
        ]
      }
    });

    if (existing) {
      return { success: false, error: "Sektor lain dengan nama atau slug ini sudah ada." };
    }

    await prisma.sector.update({
      where: { id },
      data: {
        name: trimmedName,
        slug: slug,
      }
    });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/admin", "layout");
    revalidatePath("/bidang");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update sector:", error);
    return { success: false, error: "Gagal memperbarui sektor." };
  }
}

export async function deleteSector(id: string) {
  try {
    await requireAuth();

    // Check if sector has related items
    const sector = await prisma.sector.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            programs: true,
            activities: true,
            products: true,
            documentations: true,
            metrics: true,
          }
        }
      }
    });

    if (!sector) {
      return { success: false, error: "Sektor tidak ditemukan." };
    }

    const totalRelated = 
      sector._count.programs + 
      sector._count.activities + 
      sector._count.products + 
      sector._count.documentations + 
      sector._count.metrics;

    if (totalRelated > 0) {
      return { 
        success: false, 
        error: `Sektor tidak dapat dihapus karena masih memiliki ${totalRelated} data terkait (${sector._count.programs} program, ${sector._count.activities} kegiatan, ${sector._count.products} produk, ${sector._count.documentations} dokumentasi, ${sector._count.metrics} metrik). Hapus atau pindahkan data terkait terlebih dahulu.` 
      };
    }

    await prisma.sector.delete({
      where: { id }
    });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/admin", "layout");
    revalidatePath("/bidang");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete sector:", error);
    return { success: false, error: "Gagal menghapus sektor." };
  }
}
