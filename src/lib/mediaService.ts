import { put, del } from "@vercel/blob";
import crypto from "crypto";

// Ukuran maksimal file (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Tipe MIME yang diizinkan
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validasi Magic Bytes / File Signature pada server buffer
 * untuk mencegah file berbahaya (seperti .php, .exe, .sh) yang disamarkan tipe MIME-nya.
 */
function validateMagicBytes(buffer: Buffer): { isValid: boolean; extension: string } {
  if (buffer.length < 12) {
    return { isValid: false, extension: "" };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, extension: "jpg" };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, extension: "png" };
  }

  // 3. WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, extension: "webp" };
  }

  return { isValid: false, extension: "" };
}

export async function uploadImage(file: File, folder: string): Promise<{ url?: string; error?: string }> {
  try {
    // 1. Validasi awal
    if (!file) {
      return { error: "File tidak ditemukan." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { error: "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: "Ukuran file terlalu besar. Maksimal 5MB." };
    }

    // 2. Konversi ke Buffer & Validasi Magic Bytes (Server-Side File Signature)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { isValid, extension } = validateMagicBytes(buffer);
    if (!isValid) {
      return { error: "File tidak valid atau terindikasi rusak/tidak sesuai format gambar resmi." };
    }

    // 3. Sanitasi folder dan nama file
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const pathname = `uploads/${safeFolder}/${fileName}`;

    // 4. Upload ke Vercel Blob (bukan filesystem lokal — filesystem Vercel
    // bersifat sementara/read-only saat runtime produksi)
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType:
        extension === "jpg" ? "image/jpeg" : extension === "png" ? "image/png" : "image/webp",
    });

    // 5. Kembalikan URL publik dari Vercel Blob
    return { url: blob.url };

  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
    return { error: "Terjadi kesalahan sistem saat menyimpan gambar." };
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Hanya hapus URL yang memang berasal dari Vercel Blob storage
    if (!imageUrl || !imageUrl.includes(".public.blob.vercel-storage.com")) {
      return;
    }

    await del(imageUrl);
  } catch (error) {
    console.error("Gagal menghapus gambar:", error);
  }
}