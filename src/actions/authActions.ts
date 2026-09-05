"use server";

import { prisma } from "@/lib/prisma";
import { encrypt, decrypt, requireAuth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createAdminSession, endAdminSession, touchAdminSession, parseDeviceType } from "@/lib/adminSession";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { validateEmail, validateId } from "@/lib/validation";


// Persistent Database-Backed Rate Limiting untuk proteksi brute force
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 menit

async function checkRateLimit(
  email: string,
  ipAddress: string | null
): Promise<{ isLocked: boolean; remainingMinutes: number }> {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - LOCKOUT_TIME_MS);

    // Hitung berapa kali percobaan login gagal untuk email atau IP ini dalam 15 menit terakhir
    const failedLogs = await prisma.activityLog.findMany({
      where: {
        action: ActivityAction.LOGIN_FAILED,
        createdAt: { gte: fifteenMinutesAgo },
        OR: [
          { entityTitle: email },
          ...(ipAddress ? [{ ipAddress }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: MAX_ATTEMPTS,
      select: { createdAt: true },
    });

    if (failedLogs.length >= MAX_ATTEMPTS) {
      const mostRecentTime = failedLogs[0].createdAt.getTime();
      const elapsed = Date.now() - mostRecentTime;
      if (elapsed < LOCKOUT_TIME_MS) {
        const remainingMinutes = Math.max(1, Math.ceil((LOCKOUT_TIME_MS - elapsed) / 60000));
        return { isLocked: true, remainingMinutes };1
      }
    }

    return { isLocked: false, remainingMinutes: 0 };
  } catch {
    // Fail safe: jangan hentikan flow jika ada kendala pembacaan audit log
    return { isLocked: false, remainingMinutes: 0 };
  }
}

async function extractClientInfo() {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || null;
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || null;

    return { ipAddress, userAgent };
  } catch (error) {
    return { ipAddress: null, userAgent: null };
  }
}

export async function loginAction(formData: FormData) {
  const { ipAddress, userAgent } = await extractClientInfo();

  try {
    const rawEmail = formData.get("email")?.toString();
    const rawPassword = formData.get("password")?.toString();

    if (!rawEmail || !rawPassword) {
      return { error: "Email dan password wajib diisi." };
    }

    const emailValidation = validateEmail(rawEmail);
    if (!emailValidation.valid) {
      return { error: emailValidation.error };
    }
    const email = emailValidation.value;

    if (rawPassword.length > 128) {
      return { error: "Password melebihi batas panjang yang diizinkan." };
    }
    const password = rawPassword;

    // Persistent Rate Limiting Check
    const rateLimitStatus = await checkRateLimit(email, ipAddress);
    if (rateLimitStatus.isLocked) {
      await logActivity({
        userId: null,
        action: ActivityAction.LOGIN_FAILED,
        entityType: "AUTH",
        entityTitle: email,
        description: "Percobaan login admin gagal: Akun sementara terkunci (rate limited)",
        metadata: {
          reason: "rate_limited",
          remainingMinutes: rateLimitStatus.remainingMinutes,
        },
        ipAddress,
        userAgent,
      });

      return { 
        error: `Terlalu banyak percobaan login gagal. Akun sementara dikunci. Silakan coba lagi dalam ${rateLimitStatus.remainingMinutes} menit.` 
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      await logActivity({
        userId: null,
        action: ActivityAction.LOGIN_FAILED,
        entityType: "AUTH",
        entityTitle: email,
        description: "Percobaan login admin gagal: Kredensial tidak valid",
        metadata: {
          reason: "invalid_credentials",
        },
        ipAddress,
        userAgent,
      });

      return { error: "Email atau password yang Anda masukkan salah." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      await logActivity({
        userId: user.id,
        action: ActivityAction.LOGIN_FAILED,
        entityType: "AUTH",
        entityTitle: email,
        description: "Percobaan login admin gagal: Kredensial tidak valid",
        metadata: {
          reason: "invalid_credentials",
        },
        ipAddress,
        userAgent,
      });

      return { error: "Email atau password yang Anda masukkan salah." };
    }

    if (user.role !== "ADMIN_CSR") {
      await logActivity({
        userId: user.id,
        action: ActivityAction.LOGIN_FAILED,
        entityType: "AUTH",
        entityTitle: email,
        description: "Percobaan login admin gagal: Role bukan ADMIN_CSR",
        metadata: {
          reason: "unauthorized_role",
        },
        ipAddress,
        userAgent,
      });

      return { error: "Email atau password yang Anda masukkan salah." };
    }

    // 1. Buat token JWT
    const session = await encrypt({
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    // 2. Buat AdminSession di database (hanya menyimpan SHA-256 hash dari JWT)
    try {
      await createAdminSession({
        userId: user.id,
        rawToken: session,
        ipAddress,
        userAgent,
      });
    } catch (sessionError) {
      if (process.env.NODE_ENV !== "production") {
        console.error("ADMIN_SESSION_CREATION_ERROR:", sessionError);
      }
      return { error: "Gagal menginisiasi sesi login. Silakan coba beberapa saat lagi." };
    }

    // 3. Catat ActivityLog LOGIN (non-blocking)
    const deviceType = parseDeviceType(userAgent);
    await logActivity({
      userId: user.id,
      action: ActivityAction.LOGIN,
      entityType: "AUTH",
      entityId: user.id,
      entityTitle: user.name,
      description: `Admin ${user.name} berhasil login`,
      metadata: {
        deviceType,
        loginMethod: "email_password",
      },
      ipAddress,
      userAgent,
    });

    // 4. Set cookie session
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("LOGIN_ACTION_ERROR:", error);
    return { error: "Terjadi kesalahan saat memproses login. Silakan coba lagi." };
  }
}

export async function logoutAction() {
  const { ipAddress, userAgent } = await extractClientInfo();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    try {
      const payload = await decrypt(sessionToken);

      // 1. Nonaktifkan AdminSession di database
      await endAdminSession(sessionToken, true);

      // 2. Catat ActivityLog LOGOUT
      if (payload) {
        await logActivity({
          userId: payload.userId,
          action: ActivityAction.LOGOUT,
          entityType: "AUTH",
          entityId: payload.userId,
          entityTitle: payload.name,
          description: `Admin ${payload.name} berhasil logout`,
          metadata: {
            method: "user_initiated",
          },
          ipAddress,
          userAgent,
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("LOGOUT_RECORDING_ERROR:", error);
      }
    }
  }

  // Hapus cookie sesi dan filter aktif
  cookieStore.delete("session");
  cookieStore.delete("active_sector");
  return { success: true };
}

/**
 * Heartbeat untuk memperbarui lastActiveAt sesi admin yang sedang aktif.
 * Identitas diambil secara eksklusif dari cookie session terenkripsi (bukan dari input client).
 */
export async function heartbeatAction() {
  try {
    // 1. Wajib memiliki sesi ADMIN_CSR yang valid dan aktif di DB
    await requireAuth();

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return { error: "Sesi tidak ditemukan" };
    }

    // 2. Perbarui lastActiveAt pada AdminSession menggunakan token hash
    await touchAdminSession(sessionToken, true);

    return { success: true, timestamp: new Date().toISOString() };
  } catch (error: any) {
    return { error: error?.message || "Gagal memperbarui heartbeat sesi" };
  }
}

export async function switchActiveSectorAction(sectorId: string) {
  // Hanya ADMIN_CSR yang boleh mengganti active sector
  await requireAuth();

  const cookieStore = await cookies();

  if (sectorId === "ALL") {
    cookieStore.delete("active_sector");
    return { success: true };
  }

  const idValidation = validateId(sectorId, "Sektor");
  if (!idValidation.valid) {
    return { error: "ID Sektor tidak valid" };
  }

  // Verifikasi keberadaan sektor di DB
  const sectorExists = await prisma.sector.findUnique({
    where: { id: idValidation.value },
    select: { id: true },
  });

  if (!sectorExists) {
    return { error: "Sektor tidak ditemukan" };
  }

  cookieStore.set("active_sector", sectorExists.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 hari
    path: "/",
  });

  return { success: true };
}

