"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/activityLog";
import { headers } from "next/headers";

// Helper: extract client IP & User-Agent dari request headers
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

// Helper: generate unique URL-safe slug from title
async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!base) {
    base = "program";
  }

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.program.findFirst({
      where: {
        slug,
        ...(currentId ? { id: { not: currentId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    counter++;
    slug = `${base}-${counter}`;
  }
}

// ==========================================
// PROGRAM ACTIONS
// ==========================================

export async function getPrograms() {
  try {
    await requireAuth();
    const activeSectorId = await getActiveSectorId();

    return await prisma.program.findMany({
      where: activeSectorId ? { sectorId: activeSectorId } : {},
      include: { sector: true },
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function createProgram(formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const activeSectorId = await getActiveSectorId();
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data program." };
    }

    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return { success: false, error: "Nama program wajib diisi." };
    }

    const description = (formData.get("description") as string)?.trim() || "";
    const location = (formData.get("location") as string)?.trim() || "-";
    const beneficiaries = (formData.get("beneficiaries") as string)?.trim() || "-";
    const status = (formData.get("status") as string) || "ACTIVE";
    const isPublished = formData.get("isPublished") === "true";
    const imageUrl = (formData.get("imageUrl") as string)?.trim() || "/images/placeholder.jpg";

    const source = (formData.get("source") as string)?.trim() || null;
    const sourceType = (formData.get("sourceType") as string)?.trim() || null;
    const sourceUrl = (formData.get("sourceUrl") as string)?.trim() || null;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (!description || description.length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan (min 10 karakter)." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const slug = await generateUniqueSlug(title);

    const created = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking, setelah operasi bisnis berhasil
    void logActivity({
      userId: session.userId,
      action: ActivityAction.CREATE,
      entityType: "PROGRAM",
      entityId: created.id,
      entityTitle: created.title,
      description: `Admin membuat program baru: ${created.title}`,
      metadata: {
        status,
        isPublished,
        sectorId,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create program:", error);
    return { success: false, error: error?.message || "Gagal menyimpan data program" };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program tidak ditemukan");

    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return { success: false, error: "Nama program wajib diisi." };
    }

    const description = (formData.get("description") as string)?.trim() || "";
    const location = (formData.get("location") as string)?.trim() || "-";
    const beneficiaries = (formData.get("beneficiaries") as string)?.trim() || "-";
    const status = (formData.get("status") as string) || "ACTIVE";
    const isPublished = formData.get("isPublished") === "true";
    const sectorId = (formData.get("sectorId") as string) || program.sectorId;
    const imageUrl = (formData.get("imageUrl") as string)?.trim() || program.imageUrl;

    const source = (formData.get("source") as string)?.trim() || null;
    const sourceType = (formData.get("sourceType") as string)?.trim() || null;
    const sourceUrl = (formData.get("sourceUrl") as string)?.trim() || null;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (!description || description.length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan (min 10 karakter)." };
      }
      if (!source || source.length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    let slug = program.slug;
    if (title !== program.title) {
      slug = await generateUniqueSlug(title, id);
    }

    // Catat changedFields secara aman
    const changedFields: string[] = [];
    if (title !== program.title) changedFields.push("title");
    if (description !== program.description) changedFields.push("description");
    if (location !== program.location) changedFields.push("location");
    if (beneficiaries !== program.beneficiaries) changedFields.push("beneficiaries");
    if (status !== program.status) changedFields.push("status");
    if (isPublished !== program.isPublished) changedFields.push("isPublished");
    if (verificationStatus !== program.verificationStatus) changedFields.push("verificationStatus");

    await prisma.program.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        source,
        sourceType,
        sourceUrl,
        verificationStatus,
        sectorId,
      },
    });

    // ActivityLog — non-blocking
    void logActivity({
      userId: session.userId,
      action: ActivityAction.UPDATE,
      entityType: "PROGRAM",
      entityId: id,
      entityTitle: title,
      description: `Admin memperbarui program: ${title}`,
      metadata: {
        changedFields,
        status,
        isPublished,
        verificationStatus,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update program:", error);
    return { success: false, error: error?.message || "Gagal memperbarui data program" };
  }
}

export async function deleteProgram(id: string) {
  try {
    const session = await requireAuth();
    const { ipAddress, userAgent } = await getRequestMeta();

    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program tidak ditemukan");

    await prisma.program.delete({
      where: { id },
    });

    // ActivityLog — non-blocking, setelah delete berhasil
    void logActivity({
      userId: session.userId,
      action: ActivityAction.DELETE,
      entityType: "PROGRAM",
      entityId: id,
      entityTitle: program.title,
      description: `Admin menghapus program: ${program.title}`,
      metadata: {
        sectorId: program.sectorId,
        status: program.status,
      },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete program:", error);
    return { success: false, error: error?.message || "Gagal menghapus data program" };
  }
}
