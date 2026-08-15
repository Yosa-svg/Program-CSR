"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

// ==========================================
// 1. PROFIL & KEAMANAN (SEMUA ROLE)
// ==========================================

export async function updateProfile(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };

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
    const session = await getSession();
    if (!session) return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };

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
// 2. USER MANAGEMENT (KHUSUS SUPER_ADMIN)
// ==========================================

export async function getUsersList() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN_PUSAT")) {
      return [];
    }

    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sectorId: true,
        sector: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdAt: true,
      },
      orderBy: [
        { role: "asc" },
        { name: "asc" },
      ],
    });
  } catch (error) {
    console.error("Failed to get users list:", error);
    return [];
  }
}

export async function createUser(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return { success: false, error: "Hanya Super Admin yang berwenang menambah akun admin baru." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const sectorId = (formData.get("sectorId") as string) || null;

    if (!name || !email || !password || !role) {
      return { success: false, error: "Nama, email, password, dan role wajib diisi." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    if (role === "ADMIN_SEKTOR" && !sectorId) {
      return { success: false, error: "Admin Sektor wajib dipilihkan sektor yang akan dikelola." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email sudah terdaftar pada sistem." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        role,
        sectorId: role === "ADMIN_SEKTOR" ? sectorId : null,
      },
    });

    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Gagal membuat akun admin baru." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return { success: false, error: "Hanya Super Admin yang berwenang mengubah data akun admin." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const sectorId = (formData.get("sectorId") as string) || null;
    const newPassword = formData.get("password") as string;

    if (!name || !email || !role) {
      return { success: false, error: "Nama, email, dan role wajib diisi." };
    }

    if (role === "ADMIN_SEKTOR" && !sectorId) {
      return { success: false, error: "Admin Sektor wajib dipilihkan sektor yang akan dikelola." };
    }

    const dataToUpdate: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      sectorId: role === "ADMIN_SEKTOR" ? sectorId : null,
    };

    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.trim().length < 6) {
        return { success: false, error: "Password baru minimal 6 karakter." };
      }
      dataToUpdate.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Gagal memperbarui data akun." };
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return { success: false, error: "Hanya Super Admin yang berwenang menghapus akun admin." };
    }

    if (session.userId === id) {
      return { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." };
    }

    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Gagal menghapus akun admin." };
  }
}
