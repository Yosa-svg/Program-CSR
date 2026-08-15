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

Sistem Informasi Program CSR adalah platform web modern berbasis **Next.js App Router** yang dirancang khusus untuk mengelola, memantau, dan mempublikasikan seluruh kegiatan tanggung jawab sosial perusahaan (CSR). 

Sistem memiliki dua pilar utama:
1. **Portal Publik**: Etalase visual interaktif yang menampilkan komitmen dan bukti dampak nyata kepada masyarakat luas (Program, Produk Binaan, Galeri Dokumentasi, dan Kinerja & Impact Dashboard).
2. **Dasbor Admin**: Pusat kendali terpadu dengan sistem **Role-Based Access Control (RBAC)** untuk tim pengelola CSR dalam melakukan mutasi data (*Server Actions*) secara aman, cepat, dan terisolasi antar sektor.

---

## ✨ Fitur Utama & Fase Pengembangan (Fase 1 - 15.4)

- 🏢 **Fase 15.1: Manajemen Program & Detail Slug (`/program` & `/program/[slug]`)**:
  - Halaman katalog program publik dengan filter sektor interaktif.
  - Halaman detail program berbasis `slug` unik.
  - Isolasi ketat relasi: Kegiatan, Produk, dan Dokumentasi yang masih *Draft* tidak akan pernah bocor ke halaman publik.
- 📦 **Fase 15.2: Katalog Produk Binaan (`/produk` & `/produk/[slug]`)**:
  - Katalog karya dan panen kelompok tani/ternak binaan.
  - Atribut lengkap: Kapasitas produksi, unit/satuan, saluran pemasaran, sertifikasi, dan sumber produk.
  - PenautanOpsional ke Program Induk.
- 📸 **Fase 15.3: CSR Impact Gallery (`/dokumentasi`)**:
  - Galeri dokumentasi aksi nyata CSR di lapangan.
  - Informasi sumber dokumentasi (Internal/Vendor) dan status verifikasi.
  - Penautan otomatis ke Program atau Produk terkait.
- 📊 **Fase 15.4: Kinerja, Metrics & Impact Dashboard (`/kinerja`)**:
  - Pelacakan kuantitatif **Target**, **Realisasi**, dan kalkulasi **Capaian (%)** secara *dynamic on-the-fly*.
  - Penanganan aman `target = 0` (tanpa error *division by zero*) dan visual progress bar klem rapi untuk capaian `>100%`.
  - Pengelompokan 3 Pilar Dampak: **OUTPUT** (Hasil langsung), **OUTCOME** (Perubahan kapasitas), dan **IMPACT** (Dampak jangka panjang).
  - Badge verifikasi data (*TERVERIFIKASI*, *BELUM VERIFIKASI*) dan transparansi tanpa melibatkan nilai anggaran/harga.
- 🔐 **Autentikasi & RBAC Multi-Sektor**:
  - Admin Sektor (seperti Pertanian atau Peternakan) hanya dapat mengakses dan mengedit data sektornya.
  - Super Admin dan Admin Pusat memiliki kapabilitas melakukan agregasi dan *switch sector* secara fleksibel.
- 📸 **Media Upload Service**:
  - Layanan unggah gambar terpusat dengan penamaan otomatis UUID, validasi tipe file, dan optimasi `next/image`.

---

## 🛠️ Teknologi yang Digunakan

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Database & ORM**: [MySQL](https://www.mysql.com/) + [Prisma ORM](https://www.prisma.io/)
* **Styling & Animas**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
* **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Panduan Instalasi & Menjalankan (Local Development)

### 1. Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/Yosa-svg/Program-CSR.git
cd Program-CSR
npm install
```

### 2. Konfigurasi Environment (`.env`)
Buat atau sesuaikan file `.env` di direktori utama:
```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/csr_db"
```

### 3. Migrasi & Seed Database
Jalankan migrasi aman Prisma untuk membuat tabel di MySQL dan mengisi data percontohan (Dummy Data):
```bash
# Generate tipe Prisma Client
npx prisma generate

# Jalankan migrasi schema ke MySQL
npx prisma migrate dev --name init_mysql

# Isi data percontohan awal (Users, Sectors, Programs, Products, Metrics, Docs)
npx prisma db seed
```

### 4. Jalankan Server
```bash
npm run dev
```

Buka peramban (browser) Anda dan akses:
* **Portal Publik**: [http://localhost:3000](http://localhost:3000)
* **Katalog Program**: [http://localhost:3000/program](http://localhost:3000/program)
* **Katalog Produk**: [http://localhost:3000/produk](http://localhost:3000/produk)
* **Galeri Dokumentasi**: [http://localhost:3000/dokumentasi](http://localhost:3000/dokumentasi)
* **Dashboard Kinerja & Dampak**: [http://localhost:3000/kinerja](http://localhost:3000/kinerja)
* **Dasbor Admin Utama**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Kredensial Login (Local Testing)

Semua akun secara default menggunakan password: **`password123`**

| Peran (Role) | Email Login | Hak Akses & Sektor |
| --- | --- | --- |
| **Super Admin** | `super@csr.com` | Akses penuh ke seluruh sektor & manajemen admin |
| **Admin Pusat** | `pusat@csr.com` | Akses monitoring seluruh sektor |
| **Admin Pertanian** | `pertanian@csr.com` | Terisolasi hanya ke sektor **Pertanian Terpadu** |
| **Admin Peternakan** | `peternakan@csr.com` | Terisolasi hanya ke sektor **Peternakan** |
| **Admin UMKM** | `umkm@csr.com` | Terisolasi hanya ke sektor **UMKM** |

---

## 📁 Struktur Direktori Utama

```text
/
├── prisma/
│   ├── schema.prisma       # Skema relasi database Prisma (MySQL)
│   ├── migrations/         # Riwayat migrasi database
│   └── seed.ts             # Script seeding data percontohan
├── public/
│   ├── images/             # Gambar & berkas aset terpusat
│   └── uploads/            # Direktori hasil unggahan media
├── src/
│   ├── actions/            # Server Actions (Mutasi/CRUD Admin: Program, Produk, Kinerja, Docs)
│   ├── app/
│   │   ├── (public)/       # Halaman publik (program, produk, dokumentasi, kinerja)
│   │   └── admin/          # Dasbor Admin terproteksi RBAC
│   ├── components/         # Komponen UI Reusable (Navbar, Managers, Forms, Cards)
│   └── lib/
│       ├── auth.ts         # Middleware JWT & Validasi Akses Sektor
│       ├── prisma.ts       # Prisma Client Instance
│       └── queries/        # Abstraksi query read-only publik (programs, products, metrics, docs)
```

---

<div align="center">
  <p>Didesain dengan 💚 untuk ekosistem CSR yang lebih berkelanjutan.</p>
</div>