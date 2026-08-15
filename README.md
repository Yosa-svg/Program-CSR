<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  
  <h1>🌱 Sistem Informasi Program CSR Terpadu</h1>
  <p>Dasbor Admin & Portal Publik Transparan Manajemen Corporate Social Responsibility (CSR)</p>
</div>

---

## 📖 Tentang Proyek

Sistem Informasi Program CSR adalah platform web modern berbasis **Next.js App Router** yang dirancang khusus untuk mengelola, memantau, dan mempublikasikan seluruh kegiatan tanggung jawab sosial perusahaan (CSR) dalam Kawasan Ekonomi Berkelanjutan.

Sistem memiliki dua pilar utama:
1. **Portal Publik**: Etalase visual interaktif yang menampilkan komitmen dan bukti dampak nyata kepada masyarakat luas (Sektor, Program, Produk Binaan, Galeri Dokumentasi, dan Kinerja & Impact Dashboard).
2. **Dasbor Admin**: Pusat kendali terpadu dengan sistem **Role-Based Access Control (RBAC)** untuk tim pengelola CSR dalam melakukan mutasi data (*Server Actions*) secara aman, cepat, dan terisolasi antar sektor.

---

## ✨ Fitur Utama & Fase Pengembangan

- 🏢 **Fase 15.1: Manajemen Program & Detail Slug (`/program` & `/program/[slug]`)**:
  - Halaman katalog program publik dengan filter sektor interaktif.
  - Halaman detail program berbasis `slug` unik.
  - Isolasi ketat relasi: Kegiatan, Produk, dan Dokumentasi yang masih *Draft* tidak akan pernah bocor ke halaman publik.
- 📦 **Fase 15.2: Katalog Produk Binaan (`/produk` & `/produk/[slug]`)**:
  - Katalog karya dan produk olahan kelompok binaan CSR.
  - Atribut lengkap: Kapasitas produksi, unit/satuan, saluran pemasaran, sertifikasi, dan sumber data resmi.
- 📸 **Fase 15.3: CSR Impact Gallery (`/dokumentasi`)**:
  - Galeri dokumentasi aksi nyata CSR di lapangan.
  - Informasi jenis sumber data dan status verifikasi.
  - Penautan otomatis ke Program, Kegiatan, atau Produk terkait.
- 📊 **Fase 15.4: Kinerja, Metrics & Impact Dashboard (`/kinerja`)**:
  - Pelacakan kuantitatif **Target**, **Realisasi**, dan kalkulasi **Capaian (%)** secara *dynamic on-the-fly*.
  - Penanganan aman `target = 0` (tanpa error *division by zero*) dan visual progress bar klem rapi untuk capaian `>100%`.
  - Pengelompokan 3 Pilar Dampak: **OUTPUT** (Hasil langsung), **OUTCOME** (Perubahan kapasitas), dan **IMPACT** (Dampak jangka panjang).
- 🛡️ **Fase 15.5: Data Integrity & Source Management**:
  - Standarisasi jenis sumber data: `RESMI_ANTAM`, `PEMERINTAH`, `JURNAL_AKADEMIK`, `MEDIA_MASSA`, `DOKUMEN_LAPORAN`.
  - Pipa keamanan backend 6-lapis (*Multi-Layer Server Pipeline*): Otentikasi, RBAC, Sector Access Guard, Relational Consistency Guard (mencegah anak beda sektor dari induk), dan Publication Readiness Guard.
- ⚙️ **Pengaturan Sistem & Manajemen Pengguna (`/admin/pengaturan`)**:
  - Manajemen akun admin (Tambah, Edit Peran, Pindah Sektor, Reset Password, Hapus Akun).
  - Profil mandiri dan pergantian kata sandi dengan enkripsi bcrypt.
  - Statistik agregasi database dan pemantauan sektor aktif.

---

## 🔒 Panduan Keamanan & Deployment Production

> [!CAUTION]
> **PENTING: Jangan Gunakan Secret / Password Default di Server Publik!**

Sebelum mempublikasikan aplikasi ke server produksi (Vercel/Cloud):

1. **Rotasi JWT Secret**:
   Pastikan environment variable `JWT_SECRET` diisi dengan string acak yang panjang dan aman. Contoh generate di terminal:
   ```bash
   openssl rand -base64 32
   ```
2. **Ganti Kredensial Default**:
   Password default testing (`password123`) wajib diganti untuk semua akun admin sebelum deploy melalui halaman **Pengaturan > Profil & Keamanan**.
3. **Database Cloud & Migrasi**:
   Gunakan MySQL Server Production (cth: Aiven, PlanetScale, Railway) dan jalankan:
   ```bash
   npx prisma migrate deploy
   ```
4. **Proteksi File Sensitif**:
   Pastikan file `.env` dan database SQLite tidak ter-track oleh Git.

---

## 🔑 Kredensial Pengujian Lokal (Development Only)

Password default untuk seluruh akun pengujian lokal: **`password123`**

| Peran (Role) | Email Login | Hak Akses & Sektor Binaan |
| --- | --- | --- |
| **Super Admin** | `super@csr.com` | Akses penuh ke seluruh sektor & manajemen admin |
| **Admin Pusat** | `pusat@csr.com` | Akses monitoring seluruh sektor |
| **Admin Pertanian** | `pertanian@csr.com` | Terisolasi ke sektor **Pertanian** (Agro Edu Wisata) |
| **Admin Peternakan** | `peternakan@csr.com` | Terisolasi ke sektor **Peternakan** (Inkubator Bisnis) |
| **Admin Lingkungan** | `lingkungan@csr.com` | Terisolasi ke sektor **Lingkungan** (Pengolahan Sampah & Pupuk) |
| **Admin Industri Kelapa** | `kelapa@csr.com` | Terisolasi ke sektor **Industri Kelapa** (Industri Kelapa Terpadu) |
| **Admin UMKM** | `umkm@csr.com` | Terisolasi ke sektor **UMKM** |

---

## 📁 Struktur Direktori Utama

```text
/
├── prisma/
│   ├── schema.prisma       # Skema relasi database Prisma (MySQL)
│   ├── migrations/         # Riwayat migrasi database
│   └── seed.ts             # Script seeding taksonomi & akun percontohan
├── public/
│   ├── images/             # Gambar & berkas aset terpusat
│   └── uploads/            # Direktori hasil unggahan media lokal
├── src/
│   ├── actions/            # Server Actions (Program, Produk, Kegiatan, Docs, Kinerja, Settings, Auth)
│   ├── app/
│   │   ├── (public)/       # Halaman portal publik (program, produk, dokumentasi, kinerja, sektor)
│   │   └── admin/          # Dasbor Admin terproteksi RBAC (termasuk pengaturan)
│   ├── components/         # Komponen UI Reusable (Navbar, Managers, Forms, Cards)
│   ├── middleware.ts       # Route guard middleware berbasis JWT token
│   └── lib/
│       ├── auth.ts         # Enkripsi/Dekripsi JWT & Validasi Akses Sektor
│       ├── mediaService.ts # Service upload media dengan validasi Magic Bytes
│       └── prisma.ts       # Prisma Client Instance
```

---

<div align="center">
  <p>Didesain dengan 💚 untuk ekosistem CSR yang lebih berkelanjutan.</p>
</div>