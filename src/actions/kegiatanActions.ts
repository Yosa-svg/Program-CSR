"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";

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
    await requireAuth();
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

    await prisma.activity.create({
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

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create activity:", error);
    return { success: false, error: "Gagal menyimpan data kegiatan" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    await requireAuth();
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity not found");

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

    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update activity:", error);
    return { success: false, error: "Gagal memperbarui data kegiatan" };
  }
}

export async function deleteActivity(id: string) {
  try {
    await requireAuth();
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new Error("Activity not found");

    await prisma.activity.delete({
      where: { id },
    });
    revalidatePath("/admin/kegiatan");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: "Gagal menghapus data kegiatan" };
  }
}
