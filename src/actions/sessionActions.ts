"use server";

import { prisma } from "@/lib/prisma";
import { requireAdministratorAuth, getCurrentAdminSession } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { validateId, validateOptionalString, toSafeErrorMessage } from "@/lib/validation";

async function extractClientInfo() {
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

/**
 * Server Action untuk mencabut (revoke) sesi admin tertentu berdasarkan ID record.
 * Wajib memiliki autentikasi ADMIN_CSR aktif melalui requireAdministratorAuth().
 * Melindungi sesi aktif yang sedang digunakan admin (Self-Revocation Prevention).
 */
export async function revokeAdminSessionAction(sessionId: string, reason?: string) {
  // 1. Guard Autentikasi Server-Side
  const currentAdmin = await requireAdministratorAuth();
  const { ipAddress, userAgent } = await extractClientInfo();

  const idResult = validateId(sessionId, "Session ID");
  if (!idResult.success) {
    return { error: idResult.error };
  }
  const validSessionId = idResult.data!;

  const reasonResult = validateOptionalString(reason, "Alasan pencabutan", 255);
  if (!reasonResult.success) {
    return { error: reasonResult.error };
  }

  try {
    // 2. Proteksi Self-Revocation (Mencegah admin mengunci diri sendiri dari konsol)
    const currentSession = await getCurrentAdminSession();
    if (currentSession && currentSession.id === validSessionId) {
      return { error: "Current session cannot be revoked from this console." };
    }

    // 3. Cari target session di database
    const targetSession = await prisma.adminSession.findUnique({
      where: { id: validSessionId },
      select: {
        id: true,
        userId: true,
        isActive: true,
        isRevoked: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!targetSession) {
      return { error: "Sesi tidak ditemukan" };
    }

    // 4. Mencegah duplicate revoke / logging jika sesi sudah tidak aktif
    if (targetSession.isRevoked || !targetSession.isActive) {
      return { 
        success: true, 
        message: "Sesi sudah dalam status tidak aktif atau telah dicabut sebelumnya" 
      };
    }

    const revokeReason = reasonResult.data || "Administrator revoked session";
    const now = new Date();

    // 5. Update status sesi di database
    await prisma.adminSession.update({
      where: { id: validSessionId },
      data: {
        isRevoked: true,
        isActive: false,
        revokedAt: now,
        revokedReason: revokeReason,
        endedAt: now,
      },
    });

    // 6. Catat ActivityLog (UPDATE AUTH) secara non-blocking
    try {
      await logActivity({
        userId: currentAdmin.userId,
        action: ActivityAction.UPDATE,
        entityType: "AUTH",
        entityId: targetSession.userId,
        entityTitle: targetSession.user?.name || "Admin Session",
        description: `Sesi admin ${targetSession.user?.name || targetSession.userId} dicabut oleh ${currentAdmin.name}: ${revokeReason}`,
        metadata: {
          event: "SESSION_REVOKED",
          sessionId: validSessionId,
          targetUserId: targetSession.userId,
          reason: revokeReason,
        },
        ipAddress,
        userAgent,
      });
    } catch (logErr) {
      // Non-blocking logging failure
      if (process.env.NODE_ENV !== "production") {
        console.error("[SessionRevocation] LogActivity non-blocking error:", logErr);
      }
    }

    // 7. Revalidate cache halaman
    revalidatePath("/administrator/sessions");
    revalidatePath("/administrator");
    revalidatePath("/administrator/security");

    return { success: true, message: "Session berhasil dicabut." };
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[SessionRevocation] Gagal mencabut sesi admin:", error);
    }
    return { error: toSafeErrorMessage(error, "Terjadi kesalahan saat mencabut sesi admin.") };
  }
}
