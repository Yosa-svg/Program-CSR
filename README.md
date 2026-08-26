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
- [🏢 Sektor Program CSR Terintegrasi](#-sektor-program-csr-terintegrasi)
- [🚀 Tahapan & Alur Pengembangan Proyek](#-tahapan--alur-pengembangan-proyek)
- [✨ Fitur-Fitur Utama Platform](#-fitur-fitur-utama-platform)
- [💻 Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
- [🔑 Kredensial Pengujian (Development Seed)](#-kredensial-pengujian-development-seed)
- [📁 Struktur Direktori](#-struktur-direktori)

---

## 📖 Tentang Proyek

**Kawasan Ekonomi Keberkelanjutan (KEK) CSR App** adalah platform web terintegrasi berbasis **Next.js (App Router)** yang dikembangkan untuk mengelola, memantau, mendokumentasikan, dan mempublikasikan seluruh pelaksanaan inisiatif Tanggung Jawab Sosial dan Lingkungan (TJSL / CSR).

Platform ini dirancang dengan dua pilar utama:

1. **Portal Publik Transparan**: Etalase visual modern dan interaktif yang menyajikan komitmen keberlanjutan, profil sektor, program pemberdayaan, produk binaan masyarakat, galeri dokumentasi terverifikasi, hingga dasbor indikator capaian dampak (_Impact Metrics_).
2. **Dasbor Manajemen Admin**: Pusat kendali terisolasi dengan **Role-Based Access Control (RBAC)** untuk tim pengelola CSR dalam melakukan operasi data (_Create, Read, Update, Delete_) secara aman, cepat, dan terisolasi antar sektor binaan.

---

## 🛠️ Teknologi & Peralatan yang Digunakan

Proyek ini dibangun menggunakan ekosistem teknologi modern (_Modern Fullstack TypeScript_):

### 1. Frontend & Antarmuka Pengguna

- **[Next.js 16 (App Router)](https://nextjs.org/)**: Framework React modern dengan _Server Components (RSC)_ untuk optimasi SEO, rendering cepat, dan arsitektur route yang terstruktur.
- **[TypeScript](https://www.typescriptlang.org/)**: Menjamin _type-safety_, meminimalkan runtime error, dan mempercepat proses refaktorisasi.
- **[Tailwind CSS](https://tailwindcss.com/) & Vanilla Design Tokens**: Pengelolaan sistem styling terpusat berbasis variabel CSS dengan palet resmi perusahaan.
- **[Framer Motion](https://www.framer.com/motion/)**: Animasi mikro dinamis, transisi kartu, dan interaksi visual yang halus (_fluid micro-interactions_).
- **[Lucide React](https://lucide.dev/)**: Kumpulan ikon SVG konsisten untuk navigasi dan indikator data.
- **[Recharts](https://recharts.org/)**: Visualisasi grafik interaktif pada dashboard admin (distribusi kegiatan, status program, tren penerima manfaat).
- **[date-fns](https://date-fns.org/)**: Format penanggalan terstandarisasi dengan lokalisasi Bahasa Indonesia (`id`).

### 2. Backend, Database & Arsitektur Data

- **Next.js Server Actions**: Mutasi data backend secara native tanpa perlu konfigurasi boilerplate REST API manual.
- **[Prisma ORM](https://www.prisma.io/)**: Pemetaan data relasional skema MySQL, migrasi terotomatisasi, dan query data bertipe aman (_type-safe queries_).
### 2. Backend, Database & Arsitektur Data

- **Next.js Server Actions**: Mutasi data backend secara native tanpa perlu konfigurasi boilerplate REST API manual.
- **[Prisma ORM (v5.22)](https://www.prisma.io/)**: Pemetaan data relasional skema MySQL, migrasi terotomatisasi, dan query data bertipe aman (_type-safe queries_).
- **[TiDB Cloud / MySQL](https://tidbcloud.com/)**: Database relasional terdistribusi cloud berkinerja tinggi dengan enkripsi SSL/TLS ketat (`sslaccept=strict`).

### 3. Keamanan & Autentikasi

- **[Jose (JWT)](https://github.com/panva/jose)**: Manajemen token otentikasi sesi admin berbasis enkripsi JSON Web Token yang disimpan di `HttpOnly, Secure Cookie`.
- **[Bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Algoritma hashing _salted_ satu arah untuk mengamankan kata sandi seluruh akun admin.
- **Unified Single-Role Admin CSR (`ADMIN_CSR`)**: Akses terpadu dan fleksibel untuk mengelola seluruh sektor program CSR melalui fitur *Active Sector Selector*.
- **Next.js Middleware Guard**: Proteksi rute dinamis pada jalur `/admin/*` untuk memblokir akses tanpa token valid.
- **Multi-Layer Server Pipeline Guard**: Validasi otorisasi di tingkat Server Action mencakup verifikasi role, _Sector Selector Guard_, dan _Relational Consistency Guard_.
- **Magic Bytes Validation (`mediaService.ts`)**: Pemeriksaan header biner asli file gambar yang diunggah untuk mencegah eksploitasi ekstensi berbahaya.

---

## 🎨 Konsep Desain & Identitas Visual

Desain platform mengusung konsep **Clean, Spacious, and Premium Editorial White Space** yang mengadopsi palet identitas resmi dengan variabel CSS terpusat (`.admin-theme` & `:root`):

### 1. Palet Warna Resmi
| Warna Identitas             | Kode HEX / Token CSS                                |       Porsi       | Penerapan Desain                                                                              |
| --------------------------- | --------------------------------------------------- | :---------------: | --------------------------------------------------------------------------------------------- |
| **Teal ANTAM**              | `--primary` (`#0D726D`)                             | **70%** (Dominan) | Tombol utama, badge logo KEK, teks menu aktif, wadah icon, heading utama, dan angka statistik |
| **Orange ANTAM**            | `--secondary` (`#F6A236`)                           |  **30%** (Aksen)  | Subtitle program, garis aksen kartu, tag kategori, indikator progress bar, dan icon kontak    |
| **Clean White**             | `--card` (`#FFFFFF`)                                |       Utama       | Latar belakang halaman utama, kontainer kartu program, produk, dan sektor                     |
| **Soft Gray**               | `--muted-bg` (`#F7FAF9`)                            |       Seksi       | Latar belakang seksi selang-seling dan dasbor admin                                           |
| **Dark Text & Footer**      | `--foreground` (`#172121`)                          |      Kontras      | Tipografi teks utama yang kontras tinggi dan latar belakang footer                            |
| **Sidebar Dark & Border**   | `--admin-sidebar-bg` (`#111E1D`) / `#1D3331`        |       Admin       | Panel samping navigasi dasbor admin yang elegan dan modern                                    |
| **Hero Gradient (135°)**    | `linear-gradient(135deg, #0D726D 0%, #F6A236 100%)` |     Selektif      | Header Hero Section bergradasi elegan dengan teks putih kontras tinggi                        |

### 2. Tipografi & Font Sistem
Platform memadukan dua font Google pilihan via `next/font/google` untuk estetika visual yang kontras, terstruktur, dan mudah dibaca:
* **🔤 Inter (`--font-inter` / `--font-sans`)**:
  * **Fungsi**: Font utama (Sans-Serif) untuk seluruh teks body, antarmuka pengguna (UI), menu navigasi, tabel admin, formulir, badge status, dan angka metrik.
  * **Karakteristik**: Sangat bersih, modern, dengan keterbacaan tinggi (*high readability*) di segala ukuran layar.
* **🖋️ Playfair Display (`--font-playfair` / `--font-serif`)**:
  * **Fungsi**: Font editorial (Serif) untuk judul utama (*Hero Headings* `H1`), judul seksi (`H2`, `H3`), dan kartu bidang CSR pada portal publik.
  * **Karakteristik**: Memberikan sentuhan elegan, berwibawa, dan bernuansa premium khas publikasi korporat bertaraf internasional.

### 3. Arsitektur Tata Letak (Layouts) & Komponen UI
* **🌐 Portal Publik (`/src/app/(public)`)**:
  * **Header & Navbar**: Desain mengambang (*Sticky Navbar*) dengan efek *Glassmorphism* halus (`backdrop-blur-md`) dan menu drop-down responsif.
  * **Hero Section**: Area sambutan visual dengan *taxonomy pill*, tipografi Playfair Display, dan tombol aksi utama (*Call-to-Action*).
  * **Infinite Photo Slider**: Komponen slider foto kegiatan interaktif yang berputar otomatis tanpa henti menggunakan animasi CSS murni (`@keyframes marquee` 35 detik).
  * **Grid Modular Responsif**: Menggunakan CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4`) dengan pembatas kontainer terstandar `max-w-7xl mx-auto px-6`.
  * **Kartu Produk & Program**: Mengadopsi sudut membulat modern (`rounded-2xl`), border tipis (`border-border`), serta efek hover dinamis.
* **🛠️ Dasbor Admin (`/src/app/admin`)**:
  * **Multi-Column Layout**: Navigasi sidebar gelap elegan di sebelah kiri (`w-64 bg-admin-sidebar`) dan area kerja utama di sebelah kanan.
  * **Top Bar Interaktif**: Header ringkas yang memuat judul dasbor, info admin aktif, dan *Sector Selector Dropdown* untuk berganti konteks sektor secara instan.
  * **Wide-Screen Optimized Container**: Area konten terpusat berukuran `max-w-7xl mx-auto` dengan padding adaptif (`p-4 sm:p-6 lg:p-8`) untuk kenyamanan kerja di layar lebar.
  * **Modular Widgets & Charts**: Kartu ringkasan statistik (Program, Kegiatan, Produk, Dokumentasi) yang terintegrasi dengan grafik interaktif Recharts.
  * **Modal & Dialog Form**: Antarmuka input data pop-up terisolasi dengan latar *dark blur* (`backdrop-blur-sm`).

---

## 🏢 Sektor Program CSR Terintegrasi

Platform mengelola sektor-sektor pemberdayaan masyarakat dan pelestarian lingkungan dalam Kawasan Ekonomi Keberkelanjutan:

1. **🌱 Sektor Pertanian (_Agro Edu Wisata_)**:
   - Pertanian ramah lingkungan terintegrasi pariwisata edukatif.
   - Produk: Beras Organik Premium, sayuran hidroponik, dan edukasi pertanian modern.
2. **🐄 Sektor Peternakan (_Inkubator Bisnis Peternakan_)**:
   - Inkubasi usaha ternak komunal dan formulasi pakan silase mandiri.
   - Produk: Daging sapi/kambing berkualitas, olahan susu, dan pupuk kandang.
3. **♻️ Sektor Lingkungan (_Pengolahan Sampah Plastik & Pupuk Diversoil_)**:
   - Pengolahan limbah anorganik sirkular serta komposting pupuk organik bermutu tinggi (_Pupuk Diversoil_).
4. **🥥 Sektor Industri Kelapa (_Industri Kelapa Terpadu_)**:
   - Hilirisasi sabut kelapa menjadi produk ekspor dan bernilai tambah tinggi (_Coconet, Cocopeat, Cocopot, & Sapu Serat Kelapa_).
5. **🏢 Sektor Tambahan yang Dikelola Mandiri**:
   - Admin dapat menambahkan sektor baru secara dinamis (misal: *Pendidikan*, *Kesehatan*, *UMKM*, dsb.) langsung melalui Dasbor Admin.

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
             │                                                  └─────────────────────────┘
             ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  Tahap 7: Migrasi Cloud │ ──> │ Tahap 8: Eliminasi Data │ ──> │ Tahap 9: Manajemen      │
│  & Single-Role RBAC     │     │ Fiktif & Desain Token   │     │ Sektor & Kontekstualisasi│
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
                                                                             │
                                                                             ▼
                                                                ┌─────────────────────────┐
                                                                │ Tahap 10: Kurasi Slider │
                                                                │ Beranda Dinamis         │
                                                                └─────────────────────────┘
```

### 🔹 Tahap 1: Perancangan Arsitektur Basis Data & Relasi Prisma
- Menyusun model data relasional pada [`prisma/schema.prisma`](file:///e:/Coding/CSR/prisma/schema.prisma): `User`, `Sector`, `Program`, `Activity`, `Product`, `Documentation`, `Metric`.

### 🔹 Tahap 2: Otentikasi & Keamanan Sesi Awal
- Implementasi sistem login dengan enkripsi password Bcrypt dan token JWT berbasis `jose`.
- Pembuatan Next.js Middleware untuk pengamanan rute `/admin/*`.

### 🔹 Tahap 3: Pembangunan Dasbor Admin & Server Actions
- Membangun antarmuka dashboard admin yang responsif untuk Program, Kegiatan, Produk, Dokumentasi, Kinerja, dan Pengaturan.

### 🔹 Tahap 4: Pengembangan Portal Publik & Katalog Interaktif
- Pembuatan halaman Beranda (`/`), Katalog Program (`/program`), Produk (`/produk`), Dokumentasi (`/dokumentasi`), Kinerja (`/kinerja`), dan Bidang Sektor (`/bidang`).

### 🔹 Tahap 5: Integritas Data & Validasi Sumber Resmi
- Standardisasi atribusi sumber data resmi (`RESMI_ANTAM`, `PEMERINTAH`, dll.) serta verifikasi data.

### 🔹 Tahap 6: Redesain Identitas Visual & Optimasi Responsivitas
- Transformasi skema warna menyeluruh ke **Teal ANTAM (`#0D726D`)** & **Orange ANTAM (`#F6A236`)**.
- Optimasi tata letak responsif pada tampilan mobile.

### 🔹 Tahap 7: Migrasi TiDB Cloud & Unifikasi Role Admin CSR
- Migrasi database ke **TiDB Cloud (AWS ap-southeast-1)** dengan koneksi terenkripsi SSL.
- Unifikasi model RBAC menjadi single role **`ADMIN_CSR`** yang dapat mengelola seluruh sektor program secara terpadu melalui *Sector Selector*.
- Pembersihan akun lama dan inisialisasi akun administrator CSR baru.

### 🔹 Tahap 8: Eliminasi Data Fiktif, Empty States & Sentralisasi Token Desain
- **Real-Data Chart Aggregation**: Menghapus data fiktif grafik aktivitas bulanan dan menggantinya dengan agregasi tanggal aktual 6 bulan dari tabel `Activity` dan `Documentation`.
- **Zero Fallback & Empty State**: Mengganti angka fallback buatan dengan komponen *Empty State* visual yang elegan saat data kosong.
- **Sentralisasi CSS Theme Tokens**: Memindahkan seluruh warna hardcoded hex ke variabel CSS `.admin-theme` di [`globals.css`](file:///e:/Coding/CSR/src/app/globals.css).
- **Wide-Screen Layout Optimization**: Memperluas lebar dashboard menjadi `max-w-7xl` untuk pengalaman visual yang lebih lega di monitor layar lebar.

### 🔹 Tahap 9: Manajemen Sektor Dinamis & Kontekstualisasi Sektor Aktif
- **Fitur CRUD Sektor di Admin**: Admin dapat menambah sektor baru (dengan otomatisasi *URL slug*), mengubah, atau menghapus sektor dengan proteksi relasi basis data di menu Pengaturan.
- **Katalog Sektor Publik Dinamis (`/bidang`)**: Halaman `/bidang` mengambil data sektor secara *real-time* dari basis data Prisma.
- **Dynamic Public Route (`/bidang/[slug]`)**: Template halaman publik otomatis untuk setiap sektor baru yang ditambahkan oleh admin.
- **Kontekstualisasi Judul & Deskripsi Dasbor**: Seluruh modul manager (`Program`, `Kegiatan`, `Produk`, `Dokumentasi`, `Kinerja`, dan `Dashboard Overview`) secara dinamis menampilkan nama sektor yang sedang dipilih di filter header (menghapus seluruh teks statis yang sebelumnya kaku).

### 🔹 Tahap 10: Kurasi & Manajemen Slider Beranda Dinamis
- **Kolom `isFeatured` di Prisma & Database TiDB**: Menyimpan preferensi foto yang disematkan ke slider utama dengan indeks performa tinggi.
- **1-Click Star Toggle & Filter di Admin**: Administrator dapat mem-pin/unpin foto ke slider utama dengan 1 klik ikon bintang atau toggle di formulir dokumentasi, disertai tab filter khusus *Slider Beranda*.
- **Integrasi Slider Beranda Publik (`PhotoSlider.tsx`)**: Mengganti kotak abu-abu placeholder dengan foto dokumentasi asli berkualitas tinggi, lengkap dengan badge sektor (*🌱 Pertanian*, dsb.), judul kegiatan, *dark gradient overlay*, dan animasi *infinite marquee auto-scroll*.
- **Smart Fallback Mechanism**: Jika belum ada foto yang di-pin secara manual oleh admin, slider otomatis mengambil foto-foto dokumentasi terbaru yang telah dipublikasikan.

---

## ✨ Fitur-Fitur Utama Platform

- 🌐 **Public-Facing Impact Dashboard**: Menampilkan capaian riil CSR (penerima manfaat, desa binaan, kegiatan binaan).
- 🔒 **Unified ADMIN_CSR Role**: Tata kelola lintas sektor terpusat dengan filter sektor aktif yang fleksibel.
- 📈 **Real-Time Data Analytics**: Grafik aktivitas bulanan dan capaian metrik kinerja yang terhubung langsung dengan basis data riil tanpa rekayasa data.
- ⚡ **Zero Client-Side Leakage**: Data berstatus _Draft_ tidak pernah terkirim ke klien pada portal publik.
- 📊 **Dynamic Percentage Calculation**: Perhitungan capaian target (%) secara otomatis dengan penanganan aman _division by zero_.
- 🖼️ **Secure Media Upload**: Layanan unggah media dengan validasi MIME-Type dan Magic Bytes.
- 📱 **Fully Responsive & Wide-Screen Optimized**: Tampilan adaptif mulai dari smartphone hingga monitor layar lebar (`max-w-7xl`).

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### Prasyarat:

- [Node.js](https://nodejs.org/) versi 18.18+ atau 20+
- Database MySQL / TiDB Cloud

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

Buat file `.env` di root direktori:

```env
DATABASE_URL="mysql://username:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/csr?sslaccept=strict"
JWT_SECRET="masukkan-string-jwt-secret-acak-anda"
NODE_ENV="development"
```

### 4. Sinkronisasi Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Kredensial Pengujian (Development Seed)

Semua akun pengujian telah terkonfigurasi dengan kata sandi terenkripsi Bcrypt:

| Email | Peran (Role) | Lingkup Hak Akses |
| :--- | :--- | :--- |
| **`admin1@csr.com`** | `ADMIN_CSR` | Akses penuh seluruh modul & seluruh sektor CSR |
| **`admin2@csr.com`** | `ADMIN_CSR` | Akses penuh seluruh modul & seluruh sektor CSR |

*Kata sandi default:* `AdminCSR2026!`

---

## 📁 Struktur Direktori

```text
├── prisma/
│   ├── schema.prisma          # Skema model basis data relasional (MySQL / TiDB)
│   ├── migrations/            # Riwayat migrasi skema database Prisma
│   └── seed.ts                # Skrip pembenihan data awal & akun admin
├── public/
│   ├── images/                # Aset gambar & ilustrasi statis
│   └── uploads/               # Direktori penyimpanan media unggahan lokal
├── src/
│   ├── actions/               # Server Actions (Program, Kegiatan, Produk, Dokumentasi, Kinerja, Auth)
│   ├── app/
│   │   ├── (public)/          # Halaman portal publik (beranda, bidang, program, produk, galeri, kinerja)
│   │   ├── admin/             # Panel dasbor admin terproteksi JWT & RBAC
│   │   ├── globals.css        # Variabel token warna & style global (.admin-theme)
│   │   └── layout.tsx         # Layout dasar aplikasi
│   ├── components/            # Komponen modular UI (Navbar, Footer, Hero, Managers, Charts, Forms)
│   ├── lib/
│   │   ├── auth.ts            # Manajemen otentikasi JWT & validasi sesi Admin CSR
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
