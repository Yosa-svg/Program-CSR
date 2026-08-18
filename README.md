<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/JWT-Jose_Auth-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  
  <br/>
  <h1>🌿 Kawasan Ekonomi Keberkelanjutan (KEK)</h1>
  <p><strong>Sistem Informasi Manajemen Program & Portal Publik Corporate Social Responsibility (CSR) Terpadu</strong></p>
</div>

---

## 📑 Daftar Isi
- [📖 Tentang Proyek](#-tentang-proyek)
- [🛠️ Teknologi & Peralatan yang Digunakan](#️-teknologi--peralatan-yang-digunakan)
- [🎨 Konsep Desain & Identitas Visual](#-konsep-desain--identitas-visual)
- [🏢 4 Sektor Program Utama CSR](#-4-sektor-program-utama-csr)
- [🚀 Tahapan & Alur Pengembangan Proyek](#-tahapan--alur-pengembangan-proyek)
- [✨ Fitur-Fitur Utama Platform](#-fitur-fitur-utama-platform)
- [💻 Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
- [🔑 Kredensial Pengujian (Development Seed)](#-kredensial-pengujian-development-seed)
- [📁 Struktur Direktori](#-struktur-direktori)

---

## 📖 Tentang Proyek

**Kawasan Ekonomi Keberkelanjutan (KEK) CSR App** adalah platform web terintegrasi berbasis **Next.js (App Router)** yang dikembangkan untuk mengelola, memantau, mendokumentasikan, dan mempublikasikan seluruh pelaksanaan inisiatif Tanggung Jawab Sosial dan Lingkungan (TJSL / CSR).

Platform ini dirancang dengan dua pilar utama:
1. **Portal Publik Transparan**: Etalase visual modern dan interaktif yang menyajikan komitmen keberlanjutan, profil sektor, program pemberdayaan, produk binaan masyarakat, galeri dokumentasi terverifikasi, hingga dasbor indikator capaian dampak (*Impact Metrics*).
2. **Dasbor Manajemen Admin**: Pusat kendali terisolasi dengan **Role-Based Access Control (RBAC)** untuk tim pengelola CSR dalam melakukan operasi data (*Create, Read, Update, Delete*) secara aman, cepat, dan terisolasi antar sektor binaan.

---

## 🛠️ Teknologi & Peralatan yang Digunakan

Proyek ini dibangun menggunakan ekosistem teknologi modern (*Modern Fullstack TypeScript*):

### 1. Frontend & Antarmuka Pengguna
- **[Next.js 16 (App Router)](https://nextjs.org/)**: Framework React modern dengan *Server Components (RSC)* untuk optimasi SEO, rendering cepat, dan arsitektur route yang terstruktur.
- **[TypeScript](https://www.typescriptlang.org/)**: Menjamin *type-safety*, meminimalkan runtime error, dan mempercepat proses refaktorisasi.
- **[Tailwind CSS](https://tailwindcss.com/) & Vanilla Design Tokens**: Pengelolaan sistem styling terpusat berbasis variabel CSS dengan palet resmi perusahaan.
- **[Framer Motion](https://www.framer.com/motion/)**: Animasi mikro dinamis, transisi kartu, dan interaksi visual yang halus (*fluid micro-interactions*).
- **[Lucide React](https://lucide.dev/)**: Kumpulan ikon SVG konsisten untuk navigasi dan indikator data.
- **[Recharts](https://recharts.org/)**: Visualisasi grafik interaktif pada dashboard admin (distribusi kegiatan, status program, tren penerima manfaat).
- **[date-fns](https://date-fns.org/)**: Format penanggalan terstandarisasi dengan lokalisasi Bahasa Indonesia (`id`).

### 2. Backend, Database & Arsitektur Data
- **Next.js Server Actions**: Mutasi data backend secara native tanpa perlu konfigurasi boilerplate REST API manual.
- **[Prisma ORM](https://www.prisma.io/)**: Pemetaan data relasional skema MySQL, migrasi terotomatisasi, dan query data bertipe aman (*type-safe queries*).
- **[MySQL](https://www.mysql.com/)**: Database relasional utama untuk menyimpan entitas Pengguna, Sektor, Program, Kegiatan, Produk, Dokumentasi, dan Metrik Kinerja.

### 3. Keamanan & Autentikasi
- **[Jose (JWT)](https://github.com/panva/jose)**: Manajemen token otentikasi sesi admin berbasis enkripsi JSON Web Token yang disimpan di `HttpOnly, Secure Cookie`.
- **[Bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Algoritma hashing *salted* satu arah untuk mengamankan kata sandi seluruh level akun admin.
- **Next.js Middleware Guard**: Proteksi rute dinamis pada jalur `/admin/*` untuk memblokir akses tanpa token valid.
- **Multi-Layer Server Pipeline Guard**: Validasi otorisasi di tingkat Server Action mencakup verifikasi role, *Sector Isolation Guard*, dan *Relational Consistency Guard*.
- **Magic Bytes Validation (`mediaService.ts`)**: Pemeriksaan header biner asli file gambar yang diunggah untuk mencegah eksploitasi ekstensi berbahaya.

---

## 🎨 Konsep Desain & Identitas Visual

Desain platform mengusung konsep **Clean, Spacious, and Premium White Space** yang mengadopsi palet identitas resmi:

| Warna Identitas | Kode HEX | Porsi | Penerapan Desain |
|---|---|:---:|---|
| 🟢 **Teal ANTAM** | `#0D726D` | **70%** (Dominan) | Tombol utama, badge logo KEK, teks menu aktif, wadah icon, heading utama, dan angka statistik |
| 🟠 **Orange ANTAM** | `#F6A236` | **30%** (Aksen) | Subtitle program, garis aksen kartu, tag kategori, indikator progress bar, dan icon kontak |
| ⚪ **Clean White** | `#FFFFFF` | Utama | Latar belakang halaman utama, kontainer kartu program, produk, dan sektor |
| ◻️ **Soft Gray** | `#F7FAF9` | Seksi | Latar belakang seksi selang-seling (Program Unggulan, Dampak & Kerangka Kerja) |
| ⚫ **Dark Text & Footer** | `#172121` | Kontras | Tipografi teks utama yang kontras tinggi dan latar belakang footer |
| 🌈 **Hero Gradient (135°)** | `linear-gradient(135deg, #0D726D 0%, #F6A236 100%)` | Selektif | Header Hero Section bergradasi elegan dengan teks putih kontras tinggi |

---

## 🏢 4 Sektor Program Utama CSR

Platform mengintegrasikan 4 sektor utama Kawasan Ekonomi Keberkelanjutan:

1. **🌱 Sektor Pertanian (*Agro Edu Wisata*)**:
   - Pertanian ramah lingkungan terintegrasi pariwisata edukatif.
   - Produk: Beras Organik Premium, sayuran hidroponik, dan edukasi pertanian modern.
2. **🐄 Sektor Peternakan (*Inkubator Bisnis Peternakan*)**:
   - Inkubasi usaha ternak komunal dan formulasi pakan silase mandiri.
   - Produk: Daging sapi/kambing berkualitas, olahan susu, dan pupuk kandang.
3. **♻️ Sektor Lingkungan (*Pengolahan Sampah Plastik & Pupuk Diversoil*)**:
   - Pengolahan limbah anorganik sirkular serta komposting pupuk organik bermutu tinggi (*Pupuk Diversoil*).
4. **🥥 Sektor Industri Kelapa (*Industri Kelapa Terpadu*)**:
   - Hilirisasi sabut kelapa menjadi produk ekspor dan bernilai tambah tinggi (*Coconet, Cocopeat, Cocopot, & Sapu Serat Kelapa*).
5. **🏪 Sektor UMKM & Ekonomi Lokal**:
   - Pendampingan legalitas, sertifikasi halal/P-IRT, dan perluasan akses pasar produk warga binaan.

---

## 🚀 Tahapan & Alur Pengembangan Proyek

Proses perancangan dan pembangunan aplikasi dilakukan secara terstruktur melalui fase-fase berikut:

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Tahap 1: Arsitektur   │ ──> │  Tahap 2: Autentikasi   │ ──> │ Tahap 3: Dasbor Admin   │
│   Database & Relasi     │     │  & Keamanan (RBAC)      │     │ & Modul CRUD            │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
                                                                             │
┌─────────────────────────┐     ┌─────────────────────────┐                  ▼
│  Tahap 6: Redesain      │ <── │ Tahap 5: Integritas     │ <── ┌─────────────────────────┐
│  Brand & Visual Polish  │     │ Data & Verifikasi Sumber│     │ Tahap 4: Portal Publik  │
└─────────────────────────┘     └─────────────────────────┘     │ & Katalog Interaktif    │
                                                                └─────────────────────────┘
```

### 🔹 Tahap 1: Perancangan Arsitektur Basis Data & Relasi Prisma
- Menyusun model data relasional pada [`prisma/schema.prisma`](file:///e:/Coding/CSR/prisma/schema.prisma):
  - `User`: Akun pengguna dan pemetaan hak akses sektor.
  - `Sector`: Master taksonomi 4 sektor program utama.
  - `Program`: Program inisiatif CSR berjenjang dengan relasi ke kegiatan, produk, dan metrik.
  - `Activity`: Jadwal dan rincian kegiatan lapangan yang terhubung ke program/sektor.
  - `Product`: Etalase komoditas/produk binaan dengan atribut kapasitas dan sertifikasi.
  - `Documentation`: Galeri foto kegiatan dengan status verifikasi dan keterhubungan multi-entitas.
  - `Metric`: Indikator kinerja terukur (Target, Realisasi, Satuan, Tahun, Kategori Pilar).
- Pembuatan seeder database otomatis ([`prisma/seed.ts`](file:///e:/Coding/CSR/prisma/seed.ts)) berisi data percontohan riil.

### 🔹 Tahap 2: Otentikasi, Keamanan Sesi & RBAC
- Implementasi sistem login dengan enkripsi password Bcrypt dan token JWT berbasis `jose`.
- Pemisahan 3 tingkatan hak akses (*Roles*):
  - **SUPER_ADMIN**: Akses penuh ke seluruh data sektor dan manajemen akun pengguna.
  - **ADMIN_PUSAT**: Pemantauan lintas sektor (*read-only* atau monitoring agregat).
  - **ADMIN_SEKTOR**: Akses mutasi yang diisolasi ketat hanya ke sektor miliknya.
- Pembuatan Next.js Middleware untuk pengamanan rute `/admin/*` dan sanitasi env `JWT_SECRET`.

### 🔹 Tahap 3: Pembangunan Dasbor Admin & Server Actions
- Membangun antarmuka dashboard admin yang responsif dan terpadu:
  - **Overview Dashboard** (`/admin`): Grafik aktivitas, rasio status program, dan ringkasan angka dampak.
  - **Modul Program** (`/admin/program`): Pengelolaan program, status publikasi, dan keterhubungan sektor.
  - **Modul Kegiatan** (`/admin/kegiatan`): Penjadwalan agenda, lokasi, dan deskripsi kegiatan lapangan.
  - **Modul Produk** (`/admin/produk`): Manajemen katalog komoditas, stok, kapasitas, dan sertifikasi.
  - **Modul Dokumentasi** (`/admin/dokumentasi`): Media manager dengan fitur upload gambar terverifikasi.
  - **Modul Kinerja** (`/admin/kinerja`): Pengisian target kuantitatif dan realisasi metrik program.
  - **Modul Pengaturan** (`/admin/pengaturan`): Manajemen akun admin, ganti password mandiri, dan monitoring sektor.

### 🔹 Tahap 4: Pengembangan Portal Publik & Katalog Interaktif
- Pembuatan halaman publik berorientasi pengguna:
  - **Beranda (`/`)**: Hero section visual, statistik dampak masyarakat, preview sektor, program, dan produk.
  - **Katalog Program (`/program` & `/program/[slug]`)**: Filter sektor interaktif dan halaman detail narasi program.
  - **Katalog Produk (`/produk` & `/produk/[slug]`)**: Etalase produk karya binaan dengan spesifikasi lengkap.
  - **Galeri Dokumentasi (`/dokumentasi`)**: Grid dokumentasi beresolusi tinggi dengan filter sektor.
  - **Dasbor Kinerja & Dampak (`/kinerja`)**: Visualisasi capaian target, persentase realisasi, dan penjelasan 3 pilar (Output, Outcome, Impact).
  - **Halaman Bidang Sektor (`/bidang`, `/bidang/[slug]`)**: Rincian mendalam tiap sektor (Pertanian, Peternakan, Lingkungan, Industri Kelapa).

### 🔹 Tahap 5: Integritas Data & Validasi Sumber Resmi
- Penambahan standardisasi atribusi sumber pada setiap data (`RESMI_ANTAM`, `PEMERINTAH`, `JURNAL_AKADEMIK`, dll.).
- Badge status verifikasi data (*Terverifikasi / Belum Terverifikasi*).
- *Relational Integrity Guard* untuk memastikan kegiatan, produk, atau dokumentasi tidak terhubung silang ke program sektor lain.

### 🔹 Tahap 6: Redesain Identitas Visual & Optimasi Responsivitas
- Transformasi skema warna menyeluruh ke **Teal ANTAM (`#0D726D`)** & **Orange ANTAM (`#F6A236`)** dengan *white space* bersih.
- Optimasi tata letak responsif pada tampilan mobile (perbaikan flexbox alignment agar tidak bergeser di layar HP).
- Verifikasi build penuh (`npm run build`) dengan 100% rute statis & dinamis lulus tanpa kendala.

---

## ✨ Fitur-Fitur Utama Platform

- 🌐 **Public-Facing Impact Dashboard**: Menampilkan capaian riil CSR (penerima manfaat, desa binaan, pohon tertanam).
- 🔒 **Sector-Isolated RBAC**: Mencegah admin sektor A mengubah atau melihat draft admin sektor B.
- ⚡ **Zero Client-Side Leakage**: Data berstatus *Draft* tidak pernah terkirim ke klien pada portal publik.
- 📊 **Dynamic Percentage Calculation**: Perhitungan capaian target (%) secara otomatis dengan penanganan aman *division by zero*.
- 🖼️ **Secure Media Upload**: Layanan unggah media lokal dengan validasi MIME-Type dan Magic Bytes.
- 📱 **Fully Responsive Layout**: Tampilan adaptif yang nyaman diakses dari smartphone, tablet, maupun layar desktop.

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### Prasyarat:
- [Node.js](https://nodejs.org/) versi 18.18+ atau 20+
- Database [MySQL](https://www.mysql.com/) lokal (XAMPP / MySQL Server) atau cloud

### 1. Clone & Masuk ke Direktori Proyek
```bash
git clone https://github.com/Yosa-svg/Program-CSR.git
cd Program-CSR
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Buat file `.env` di root direktori atau sesuaikan dengan contoh:
```env
DATABASE_URL="mysql://root:@localhost:3306/csr"
JWT_SECRET="masukkan-string-jwt-secret-acak-anda"
NODE_ENV="development"
```

### 4. Sinkronisasi Database & Seeding Data
Jalankan migrasi Prisma dan script seeding:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Kredensial Pengujian (Development Seed)

Semua akun pengujian lokal telah terkonfigurasi dengan kata sandi terenkripsi Bcrypt:

| Peran (Role) | Email Login | Kata Sandi (*Password*) | Lingkup Hak Akses |
| --- | --- | --- | --- |
| **Super Admin** | `super@csr.com` | `super2026` | Akses penuh seluruh sektor & manajemen pengguna |
| **Admin Pusat** | `pusat@csr.com` | `pusat2026` | Monitoring agregat seluruh sektor CSR |
| **Admin Pertanian** | `pertanian@csr.com` | `tani2026` | Pengelolaan data sektor **Pertanian** |
| **Admin Peternakan** | `peternakan@csr.com` | `ternak2026` | Pengelolaan data sektor **Peternakan** |
| **Admin Lingkungan** | `lingkungan@csr.com` | `lingkungan2026` | Pengelolaan data sektor **Lingkungan** |
| **Admin Industri Kelapa** | `kelapa@csr.com` | `kelapa2026` | Pengelolaan data sektor **Industri Kelapa** |
| **Admin UMKM** | `umkm@csr.com` | `umkm2026` | Pengelolaan data sektor **UMKM** |

---

## 📁 Struktur Direktori

```text
├── prisma/
│   ├── schema.prisma          # Skema model basis data relasional (MySQL)
│   └── seed.ts                # Skrip pembenihan data awal & akun admin
├── public/
│   ├── images/                # Aset gambar & ilustrasi statis
│   └── uploads/               # Direktori penyimpanan media unggahan lokal
├── src/
│   ├── actions/               # Server Actions (Mutasi data program, produk, docs, kinerja, auth)
│   ├── app/
│   │   ├── (public)/          # Halaman portal publik (beranda, bidang, program, produk, galeri, kinerja)
│   │   ├── admin/             # Panel dasbor admin terproteksi RBAC
│   │   ├── globals.css        # Variabel token warna & style global
│   │   └── layout.tsx         # Layout dasar aplikasi
│   ├── components/            # Komponen modular UI (Navbar, Footer, Hero, Managers, Forms)
│   ├── lib/
│   │   ├── auth.ts            # Manajemen otentikasi JWT & validasi izin sektor
│   │   ├── mediaService.ts    # Layanan upload & validasi magic bytes gambar
│   │   ├── prisma.ts          # Singleton Prisma Client Instance
│   │   └── queries/           # Helper query data aman untuk halaman publik
│   └── middleware.ts          # Route protection guard untuk rute /admin/*
└── README.md                  # Dokumentasi teknis proyek
```

---

<div align="center">
  <p>Dikembangkan dengan dedikasi untuk transparansi & keberlanjutan program CSR Kawasan Ekonomi Keberkelanjutan.</p>
</div>