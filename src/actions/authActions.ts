"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Sederhana In-Memory Rate Limiting untuk proteksi brute force
type RateLimitRecord = {
  attempts: number;
  lockedUntil: number;
};

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 menit

function checkRateLimit(key: string): { isLocked: boolean; remainingMinutes: number } {
  const record = loginAttempts.get(key);
  if (!record) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { isLocked: true, remainingMinutes };
  }

  // Jika waktu lockout telah berlalu, hapus record
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(key);
  }

  return { isLocked: false, remainingMinutes: 0 };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_TIME_MS;
  }

  loginAttempts.set(key, record);
}

function clearRateLimit(key: string) {
  loginAttempts.delete(key);
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email")?.toString()?.trim().toLowerCase();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { error: "Email dan password wajib diisi." };
    }

    // Rate Limiting Check
    const rateLimitStatus = checkRateLimit(email);
    if (rateLimitStatus.isLocked) {
      return { 
        error: `Terlalu banyak percobaan login gagal. Akun sementara dikunci. Silakan coba lagi dalam ${rateLimitStatus.remainingMinutes} menit.` 
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      recordFailedAttempt(email);
      return { error: "Email atau password yang Anda masukkan salah." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      recordFailedAttempt(email);
      return { error: "Email atau password yang Anda masukkan salah." };
    }

    // Bersihkan catatan percobaan jika login berhasil
    clearRateLimit(email);

    const session = await encrypt({
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("LOGIN_ACTION_ERROR:", error);
    return { error: `Gagal login: ${error?.message || "Kesalahan koneksi database."}` };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("active_sector");
}

export async function switchActiveSectorAction(sectorId: string) {
  const cookieStore = await cookies();
  
  if (sectorId === "ALL") {
    cookieStore.delete("active_sector");
  } else {
    cookieStore.set("active_sector", sectorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
  }
}
