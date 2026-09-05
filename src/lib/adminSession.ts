import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

/**
 * Menghasilkan SHA-256 hash dari raw token.
 * Token mentah / JWT asli TIDAK PERNAH disimpan langsung ke database.
 */
export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Klasifikasi sederhana tipe perangkat dari User Agent tanpa library eksternal.
 */
export function parseDeviceType(userAgent?: string | null): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return "Mobile";
  }
  if (/windows|macintosh|linux|cros/i.test(ua)) {
    return "Desktop";
  }
  return "Unknown";
}

export type CreateSessionParams = {
  userId: string;
  rawToken?: string;
  sessionToken?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

/**
 * Membuat record AdminSession baru di database.
 * Menyimpan hash SHA-256 dari session token.
 */
export async function createAdminSession(params: CreateSessionParams) {
  try {
    // Tentukan token hash
    const tokenToHash = params.rawToken || params.sessionToken;
    if (!tokenToHash) {
      throw new Error("Token diperlukan untuk inisiasi AdminSession");
    }

    const hashedToken = params.rawToken
      ? hashSessionToken(params.rawToken)
      : params.sessionToken!;

    const deviceType = parseDeviceType(params.userAgent);
    const sanitizedIp = params.ipAddress ? params.ipAddress.slice(0, 45) : null;
    const sanitizedUa = params.userAgent ? params.userAgent.slice(0, 500) : null;

    const session = await prisma.adminSession.create({
      data: {
        userId: params.userId,
        sessionToken: hashedToken,
        ipAddress: sanitizedIp,
        userAgent: sanitizedUa,
        deviceType: deviceType,
        isActive: true,
        isRevoked: false,
        lastActiveAt: new Date(),
        createdAt: new Date(),
      },
    });

    return session;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AdminSession] Gagal membuat session:", error);
    }
    throw error;
  }
}

/**
 * Mengambil data sesi aktif berdasarkan token hash.
 * Sesi dinyatakan valid jika isActive === true dan isRevoked === false.
 */
export async function getAdminSession(rawOrHashedToken: string, isRaw: boolean = false) {
  try {
    const hashedToken = isRaw ? hashSessionToken(rawOrHashedToken) : rawOrHashedToken;

    const session = await prisma.adminSession.findUnique({
      where: {
        sessionToken: hashedToken,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!session) return null;

    // Verifikasi validitas keaktifan sesi
    if (!session.isActive || session.isRevoked) {
      return null;
    }

    // SEC-06 | Idle Session Timeout Enforcement
    // Sesi ditolak jika tidak aktif selama lebih dari 120 menit (2 jam) atau total umur sesi melebihi 24 jam
    const MAX_IDLE_MINUTES = 120;
    const MAX_LIFETIME_HOURS = 24;
    const now = Date.now();
    const idleMinutes = (now - new Date(session.lastActiveAt).getTime()) / (1000 * 60);
    const lifetimeHours = (now - new Date(session.createdAt).getTime()) / (1000 * 60 * 60);

    if (idleMinutes > MAX_IDLE_MINUTES || lifetimeHours > MAX_LIFETIME_HOURS) {
      void prisma.adminSession.update({
        where: { id: session.id },
        data: {
          isActive: false,
          endedAt: new Date(),
          revokedReason:
            idleMinutes > MAX_IDLE_MINUTES
              ? "Idle Timeout Exceeded (Inactivity)"
              : "Maximum Lifetime Exceeded",
        },
      }).catch(() => {});

      return null;
    }

    return session;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AdminSession] Gagal mengambil session:", error);
    }
    return null;
  }
}

/**
 * Menutup sesi secara normal saat logout (isActive = false, endedAt = now()).
 * Record sesi tetap dipertahankan untuk histori audit.
 */
export async function endAdminSession(rawOrHashedToken: string, isRaw: boolean = false) {
  try {
    const hashedToken = isRaw ? hashSessionToken(rawOrHashedToken) : rawOrHashedToken;

    return await prisma.adminSession.updateMany({
      where: {
        sessionToken: hashedToken,
        isActive: true,
      },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AdminSession] Gagal mengakhiri session:", error);
    }
    return null;
  }
}

/**
 * Mencabut sesi secara paksa (isRevoked = true, isActive = false, revokedAt = now()).
 */
export async function revokeAdminSession(
  rawOrHashedToken: string,
  reason: string = "Manual Revocation",
  isRaw: boolean = false
) {
  try {
    const hashedToken = isRaw ? hashSessionToken(rawOrHashedToken) : rawOrHashedToken;

    return await prisma.adminSession.updateMany({
      where: {
        sessionToken: hashedToken,
      },
      data: {
        isRevoked: true,
        isActive: false,
        revokedAt: new Date(),
        revokedReason: reason.slice(0, 255),
        endedAt: new Date(),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AdminSession] Gagal mencabut session:", error);
    }
    return null;
  }
}

/**
 * Memperbarui timestamp lastActiveAt untuk pemantauan online/idle.
 */
export async function touchAdminSession(rawOrHashedToken: string, isRaw: boolean = false) {
  try {
    const hashedToken = isRaw ? hashSessionToken(rawOrHashedToken) : rawOrHashedToken;

    return await prisma.adminSession.updateMany({
      where: {
        sessionToken: hashedToken,
        isActive: true,
        isRevoked: false,
      },
      data: {
        lastActiveAt: new Date(),
      },
    });
  } catch (error) {
    // Fail silently agar tidak mengganggu request utama
    return null;
  }
}

/**
 * Menghitung status aktivitas sesi secara dinamis berdasarkan timestamp lastActiveAt.
 * ONLINE: < 2 menit
 * IDLE: 2 - 10 menit
 * OFFLINE: > 10 menit atau tidak aktif / revoked
 */
export function calculateSessionStatus(
  lastActiveAt: Date | string,
  isActive: boolean = true,
  isRevoked: boolean = false
): "ONLINE" | "IDLE" | "OFFLINE" {
  if (!isActive || isRevoked) {
    return "OFFLINE";
  }

  const lastActiveTime = new Date(lastActiveAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - lastActiveTime) / (1000 * 60);

  if (diffMinutes < 2) {
    return "ONLINE";
  }
  if (diffMinutes <= 10) {
    return "IDLE";
  }
  return "OFFLINE";
}

