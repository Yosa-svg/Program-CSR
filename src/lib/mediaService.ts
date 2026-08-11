import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import fs from "fs";

// Ukuran maksimal file (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Tipe MIME yang diizinkan
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(file: File, folder: string): Promise<{ url?: string; error?: string }> {
  try {
    // 1. Validasi
    if (!file) {
      return { error: "File tidak ditemukan." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { error: "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: "Ukuran file terlalu besar. Maksimal 5MB." };
    }

    // 2. Persiapkan direktori
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dapatkan ekstensi dari mime type (contoh: image/jpeg -> jpeg)
    const ext = file.type.split("/")[1];
    const fileName = `${crypto.randomUUID()}.${ext}`;
    
    // Path direktori upload
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    
    // Pastikan folder ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. Simpan file fisik
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // 4. Kembalikan URL publik
    const publicUrl = `/uploads/${folder}/${fileName}`;
    return { url: publicUrl };
    
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
    return { error: "Terjadi kesalahan sistem saat menyimpan gambar." };
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Hindari menghapus gambar placeholder atau gambar external
    if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
      return;
    }

    const filePath = join(process.cwd(), "public", imageUrl);
    
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("Gagal menghapus gambar:", error);
    // Tidak me-throw error agar proses hapus data di database tetap lanjut
  }
}
