import { prisma } from "@/lib/prisma";
import { ActivityAction } from "@prisma/client";

export { ActivityAction };

const SENSITIVE_KEYS = [
  "password",
  "passwordhash",
  "token",
  "jwt",
  "jwt_secret",
  "secret",
  "authorization",
  "database_url",
  "credential",
  "apikey",
  "cookie",
];

/**
 * Membersihkan metadata dari atribut kredensial sensitif secara rekursif.
 */
export function sanitizeMetadata(data: any): any {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeMetadata(item));
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive));

    if (isSensitive) {
      cleaned[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      cleaned[key] = sanitizeMetadata(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

export type LogActivityParams = {
  userId?: string | null;
  action: ActivityAction;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  description: string;
  metadata?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

/**
 * Mencatat aktivitas administratif ke tabel ActivityLog.
 * Error ditangani secara non-blocking agar tidak menggagalkan aksi bisnis utama.
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const sanitizedMeta = params.metadata ? sanitizeMetadata(params.metadata) : undefined;
    const sanitizedIp = params.ipAddress ? params.ipAddress.slice(0, 45) : null;
    const sanitizedUa = params.userAgent ? params.userAgent.slice(0, 500) : null;
    const sanitizedDesc = params.description.slice(0, 500);
    const sanitizedTitle = params.entityTitle ? params.entityTitle.slice(0, 255) : null;
    const sanitizedType = params.entityType.slice(0, 50);

    return await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        entityType: sanitizedType,
        entityId: params.entityId || null,
        entityTitle: sanitizedTitle,
        description: sanitizedDesc,
        metadata: sanitizedMeta,
        ipAddress: sanitizedIp,
        userAgent: sanitizedUa,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    // Non-blocking: kegagalan logging tidak boleh menghentikan transaksi utama
    if (process.env.NODE_ENV !== "production") {
      console.error("[ActivityLog] Gagal mencatat log aktivitas:", error);
    }
    return null;
  }
}
