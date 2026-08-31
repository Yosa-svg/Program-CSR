"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";

// Helper: extract client IP & User-Agent
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

// ==========================================
// ACTIVITY (KEGIATAN) ACTIONS
// ==========================================

export async function getActivities() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.activity.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: {
        program: true,
        sector: true,
      },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}

export async function createActivity(formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activeSectorId = await getActiveSectorId();
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data kegiatan." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Server-Side Relational Consistency Check
    if (programId) {
      const parentProgram = await prisma.program.findUnique({ where: { id: programId } });
      if (!parentProgram || parentProgram.sectorId !== sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari kegiatan ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
      if (!programId || programId.trim().length === 0) {
        return { success: false, error: "Kegiatan wajib dikaitkan dengan Program Induk sebelum dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum kegiatan dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data kegiatan harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const created = await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: dateStr ? new Date(dateStr) : null,
        status,
        isPublished,
        programId: programId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "ACTIVITY",
      entityId: created.id,
      entityTitle: created.title,
      description: `Admin membuat kegiatan baru: ${created.title}`,
      metadata: {
        status,
        isPublished,
        sectorId,
        programId: programId || null,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create activity:", error);
    return { success: false, error: error?.message || "Gagal menyimpan data kegiatan" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity tidak ditemukan");

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const dateStr = formData.get("date") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const programId = formData.get("programId") as string;

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Server-Side Relational Consistency Check
    if (programId) {
      const parentProgram = await prisma.program.findUnique({ where: { id: programId } });
      if (!parentProgram || parentProgram.sectorId !== activity.sectorId) {
        return { success: false, error: "Program Induk yang dipilih berada di luar Sektor dari kegiatan ini." };
      }
    }

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul kegiatan terlalu pendek untuk dipublikasikan." };
      }
      if (!programId || programId.trim().length === 0) {
        return { success: false, error: "Kegiatan wajib dikaitkan dengan Program Induk sebelum dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum kegiatan dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data kegiatan harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const changedFields: string[] = [];
    if (title !== activity.title) changedFields.push("title");
    if (description !== activity.description) changedFields.push("description");
    if (location !== activity.location) changedFields.push("location");
    if (status !== activity.status) changedFields.push("status");
    if (isPublished !== activity.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== activity.verificationStatus) changedFields.push("verificationStatus");
    if ((programId || null) !== activity.programId) changedFields.push("programId");

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: dateStr ? new Date(dateStr) : null,
        status,
        isPublished,
        programId: programId || null,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "ACTIVITY",
      entityId: id,
      entityTitle: title,
      description: `Admin memperbarui kegiatan: ${title}`,
      metadata: {
        changedFields,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update activity:", error);
    return { success: false, error: error?.message || "Gagal memperbarui data kegiatan" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity tidak ditemukan");

    await prisma.activity.delete({
      where: { id },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "ACTIVITY",
      entityId: id,
      entityTitle: activity.title,
      description: `Admin menghapus kegiatan: ${activity.title}`,
      metadata: {
        sectorId: activity.sectorId,
        programId: activity.programId,
        status: activity.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: error?.message || "Gagal menghapus data kegiatan" };
  }
}
