"use server";

import { prisma } from "@/lib/prisma";
import { requireAdministratorAuth } from "@/lib/auth";
import { revokeAllUserSessions } from "@/lib/adminSession";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { validateId, toSafeErrorMessage } from "@/lib/validation";

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

export type AdminAccountItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  activeSessionCount: number;
};

/**
 * Mengambil daftar seluruh akun administrator / pengelola sistem.
 * Guard: Khusus role ADMINISTRATOR via requireAdministratorAuth().
 * Field sensitif seperti password/hash TIDAK PERNAH disertakan.
 */
export async function getAdminAccountsAction(): Promise<{
  success: boolean;
  accounts?: AdminAccountItem[];
  error?: string;
}> {
  try {
    await requireAdministratorAuth();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: {
              where: {
                isActive: true,
                isRevoked: false,
              },
            },
          },
        },
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });

    const accounts: AdminAccountItem[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      activeSessionCount: u._count.sessions,
    }));

    return { success: true, accounts };
  } catch (error: unknown) {
    console.error("Failed to get admin accounts:", error);
    return {
      success: false,
      error: toSafeErrorMessage(error, "Gagal mengambil daftar akun administrator."),
    };
  }
}

export type AdminResetPasswordParams = {
  targetUserId: string;
  newPassword?: string;
  confirmPassword?: string;
};

/**
 * Server Action untuk mereset kata sandi akun ADMIN_CSR oleh ADMINISTRATOR.
 * 
 * Aturan Otorisasi & Keamanan:
 * 1. Hanya dapat dieksekusi oleh role ADMINISTRATOR (guard requireAdministratorAuth()).
 * 2. Hanya diizinkan mereset akun dengan role ADMIN_CSR.
 * 3. DILARANG mereset sesama ADMINISTRATOR (anti account-takeover).
 * 4. Password lama target TIDAK PERNAH dilihat siapapun.
 * 5. Kata sandi baru divalidasi ketat dan langsung di-hash menggunakan bcryptjs.
 * 6. Seluruh sesi aktif akun target seketika dicabut (invalidation).
 * 7. Dicatat lengkap di ActivityLog tanpa kredensial sensitif.
 */
export async function adminResetPasswordAction(params: AdminResetPasswordParams): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // 1. Guard server-side: Wajib role ADMINISTRATOR
    const currentAdmin = await requireAdministratorAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    // 2. Validasi ID target
    const idResult = validateId(params.targetUserId, "ID Pengguna Target");
    if (!idResult.success) {
      return { success: false, error: idResult.error };
    }
    const targetUserId = idResult.data!;

    // 3. Pastikan user target terdaftar
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!targetUser) {
      return { success: false, error: "Pengguna target tidak ditemukan." };
    }

    // 4. PROTEKSI ATURAN BISNIS & HAK AKSES:
    // Administrator HANYA berwenang mereset akun ADMIN_CSR.
    // Administrator DILARANG mereset sesama Administrator untuk mencegah privilege abuse / account takeover.
    if (targetUser.role !== "ADMIN_CSR") {
      return {
        success: false,
        error: "Akses ditolak: Administrator hanya berwenang mereset kata sandi akun ADMIN_CSR.",
      };
    }

    // 5. Validasi input kata sandi baru
    const newPassword = params.newPassword;
    const confirmPassword = params.confirmPassword;

    if (!newPassword || !confirmPassword) {
      return { success: false, error: "Kata sandi baru dan konfirmasi wajib diisi." };
    }

    if (newPassword.length > 128 || confirmPassword.length > 128) {
      return { success: false, error: "Kata sandi melebihi batas maksimal 128 karakter." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Kata sandi baru minimal 8 karakter." };
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      return {
        success: false,
        error: "Kata sandi baru harus mengandung kombinasi huruf dan angka.",
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi kata sandi baru tidak cocok." };
    }

    // 6. Hash kata sandi baru
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 7. Update kata sandi target di database
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { password: newPasswordHash },
    });

    // 8. Invalidate / Cabut seluruh sesi aktif akun target
    await revokeAllUserSessions(targetUser.id, "ADMIN_PASSWORD_RESET");

    // 9. Catat ActivityLog — TIDAK PERNAH menyimpan password/hash/temporary password
    void logActivity({
      userId: currentAdmin.userId,
      action: ActivityAction.UPDATE,
      entityType: "USER_SECURITY",
      entityId: targetUser.id,
      entityTitle: targetUser.name,
      description: `Administrator ${currentAdmin.name} mereset kata sandi akun ${targetUser.email} (${targetUser.role})`,
      metadata: {
        event: "ADMIN_PASSWORD_RESET",
        targetUserId: targetUser.id,
        targetEmail: targetUser.email,
        targetRole: targetUser.role,
        actorRole: currentAdmin.role,
      },
      ipAddress,
      userAgent,
    });

    // 10. Revalidasi halaman tata kelola
    revalidatePath("/administrator/accounts");
    revalidatePath("/administrator/sessions");
    revalidatePath("/administrator/activity-logs");
    revalidatePath("/administrator");

    return {
      success: true,
      message: `Kata sandi akun ${targetUser.name} (${targetUser.email}) berhasil direset. Seluruh sesi aktif akun tersebut telah dicabut.`,
    };
  } catch (error: unknown) {
    console.error("Failed to reset password by administrator:", error);
    return {
      success: false,
      error: toSafeErrorMessage(error, "Terjadi kesalahan saat memproses reset kata sandi."),
    };
  }
}

export type CreateAdminAccountParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "ADMIN_CSR" | "ADMINISTRATOR";
};

/**
 * Server Action untuk membuat akun administrator / admin CSR baru.
 * 
 * Aturan Otorisasi & Keamanan:
 * 1. Hanya dapat dieksekusi oleh role ADMINISTRATOR (guard requireAdministratorAuth()).
 * 2. Validasi nama lengkap (2 - 100 karakter).
 * 3. Validasi format email & pencegahan duplikasi email.
 * 4. Validasi kekuatan kata sandi (minimal 8 karakter).
 * 5. Password di-hash menggunakan bcryptjs.
 * 6. Dicatat ke ActivityLog tanpa kredensial sensitif.
 * 7. Revalidasi halaman tata kelola akun.
 */
export async function createAdminAccountAction(params: CreateAdminAccountParams): Promise<{
  success: boolean;
  message?: string;
  account?: AdminAccountItem;
  error?: string;
}> {
  try {
    const currentAdmin = await requireAdministratorAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const name = params.name?.trim();
    if (!name || name.length < 2 || name.length > 100) {
      return { success: false, error: "Nama lengkap harus antara 2 hingga 100 karakter." };
    }

    const email = params.email?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Format email tidak valid." };
    }

    const role = params.role;
    if (role !== "ADMIN_CSR" && role !== "ADMINISTRATOR") {
      return { success: false, error: "Role pengguna tidak valid. Pilih Admin CSR atau Administrator." };
    }

    const password = params.password;
    if (!password || password.length < 8) {
      return { success: false, error: "Kata sandi harus memiliki panjang minimal 8 karakter." };
    }

    if (params.confirmPassword !== undefined && params.confirmPassword !== password) {
      return { success: false, error: "Konfirmasi kata sandi tidak cocok." };
    }

    // Cek duplikasi email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { success: false, error: "Alamat email ini sudah terdaftar dalam sistem." };
    }

    // Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Catat ActivityLog
    void logActivity({
      userId: currentAdmin.userId,
      action: ActivityAction.CREATE,
      entityType: "USER",
      entityId: newUser.id,
      entityTitle: newUser.name,
      description: `Administrator ${currentAdmin.name} membuat akun admin baru: ${newUser.name} (${newUser.email}) sebagai ${newUser.role}`,
      metadata: {
        event: "ADMIN_ACCOUNT_CREATED",
        createdUserId: newUser.id,
        createdEmail: newUser.email,
        createdRole: newUser.role,
        actorRole: currentAdmin.role,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/administrator/accounts");
    revalidatePath("/administrator");

    return {
      success: true,
      message: `Akun ${newUser.name} (${newUser.email}) berhasil dibuat dengan role ${newUser.role === "ADMINISTRATOR" ? "Administrator" : "Admin CSR"}.`,
      account: {
        ...newUser,
        activeSessionCount: 0,
      },
    };
  } catch (error: unknown) {
    console.error("Failed to create admin account:", error);
    return {
      success: false,
      error: toSafeErrorMessage(error, "Terjadi kesalahan saat memproses pembuatan akun."),
    };
  }
}
