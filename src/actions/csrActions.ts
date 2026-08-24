"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getActiveSectorId, requireAuth } from "@/lib/auth";

// Helper: generate URL-safe slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
    await requireAuth();
    const activeSectorId = await getActiveSectorId();
    const sectorId = (formData.get("sectorId") as string) || activeSectorId;

    if (!sectorId) {
      return { success: false, error: "Harap pilih sektor terlebih dahulu untuk menambahkan data program." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";
    const imageUrl = (formData.get("imageUrl") as string) || "/images/placeholder.jpg";

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (!description || description.trim().length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    const slug = generateSlug(title);

    await prisma.program.create({
      data: {
        title,
        slug,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        imageUrl,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
        sectorId,
      },
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { success: false, error: "Gagal menyimpan data program" };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    await requireAuth();
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program not found");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const beneficiaries = formData.get("beneficiaries") as string;
    const status = formData.get("status") as string;
    const isPublished = formData.get("isPublished") === "true";

    const source = formData.get("source") as string;
    const sourceType = formData.get("sourceType") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const verificationStatus = (formData.get("verificationStatus") as string) || "BELUM_TERVERIFIKASI";

    // Entity-Specific Publication Readiness Guard
    if (isPublished) {
      if (!title || title.trim().length < 3) {
        return { success: false, error: "Judul program terlalu pendek untuk dipublikasikan (min 3 karakter)." };
      }
      if (!description || description.trim().length < 10) {
        return { success: false, error: "Deskripsi program wajib diisi secara detail untuk dipublikasikan." };
      }
      if (!source || source.trim().length === 0) {
        return { success: false, error: "Sumber data wajib diisi sebelum program dipublikasikan." };
      }
      if (verificationStatus === "BELUM_TERVERIFIKASI") {
        return { success: false, error: "Data program harus berstatus Menunggu Verifikasi atau Terverifikasi sebelum dipublikasikan." };
      }
    }

    await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        location,
        beneficiaries,
        status,
        isPublished,
        source: source || null,
        sourceType: sourceType || null,
        sourceUrl: sourceUrl || null,
        verificationStatus,
      },
    });

    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update program:", error);
    return { success: false, error: "Gagal memperbarui data program" };
  }
}

export async function deleteProgram(id: string) {
  try {
    await requireAuth();
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) throw new Error("Program not found");

    await prisma.program.delete({
      where: { id },
    });
    revalidatePath("/admin/program");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete program:", error);
    return { success: false, error: "Gagal menghapus data program" };
  }
}
