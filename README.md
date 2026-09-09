# Program CSR — PT ANTAM Tbk UBPN Maluku Utara

Sistem informasi manajemen **Corporate Social Responsibility (CSR)** berbasis web untuk PT ANTAM Tbk Unit Bisnis Pertambangan Nikel (UBPN) Maluku Utara. Dibangun di atas Next.js App Router dengan dua sisi utama: portal publik yang mempresentasikan dampak program CSR kepada masyarakat, dan dasbor manajemen untuk tim pengelola.

---

## Konsep

Program CSR ANTAM UBPN Malut berfokus pada pemberdayaan masyarakat di sekitar wilayah operasi tambang melalui program-program lintas sektor — pertanian, peternakan, lingkungan, industri, kesehatan, dan pendidikan. Sistem ini menjadi alat dokumentasi, monitoring, dan transparansi publik atas seluruh program tersebut.

Aplikasi dibagi menjadi dua lapisan akses:

| Lapisan | Audiens | Path |
|---|---|---|
| **Portal Publik** | Masyarakat umum, pemangku kepentingan | `/` s/d `/kinerja` |
| **Dasbor Admin** | Tim CSR lapangan (`ADMIN_CSR`) | `/admin/*` |
| **Dasbor Administrator** | Sistem administrator (`ADMINISTRATOR`) | `/administrator/*` |

---

## Stack Teknologi

| Lapisan   | Teknologi                                                   |
| --------- | ----------------------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC, Server Actions)                |
| Bahasa    | TypeScript                                                  |
| Styling   | Tailwind CSS + variabel CSS kustom                          |
| Database  | TiDB Cloud (MySQL-compatible), hosted di AWS ap-southeast-1 |
| ORM       | Prisma v5                                                   |
| Auth      | JWT via `jose` + `bcryptjs` + HttpOnly cookie               |
| Animasi   | Framer Motion                                               |
| Chart     | Recharts                                                    |
| Ikon      | Lucide React                                                |
| E2E Test  | Cypress                                                     |

---

## Struktur Direktori

```
src/
├── app/
│   ├── (public)/          # Portal publik (/, /program, /bidang, /produk, /dokumentasi, /kinerja)
│   ├── admin/             # Dasbor admin (diproteksi middleware JWT)
│   │   ├── login/
│   │   └── (dashboard)/   # Program, Kegiatan, Produk, Dokumentasi, Metrik, Sektor, Pengaturan
│   ├── administrator/     # Dasbor administrator sistem
│   │   ├── accounts/      # Manajemen akun ADMIN_CSR
│   │   ├── security/      # Activity Logs & Audit Trail
│   │   └── settings/      # Profil & ganti password administrator
│   └── globals.css        # Token warna dan tema global
├── actions/               # Server Actions (csrActions, kegiatanActions, settingActions, dll.)
├── components/
│   ├── layout/            # Navbar, Footer, Sidebar
│   ├── home/              # Komponen halaman beranda
│   ├── dashboard/         # Grafik, tabel, kartu statistik
│   └── ui/                # Komponen generik (Modal, Badge, Pagination, dll.)
├── lib/
│   ├── auth.ts            # requireAuth() dan requireAdministratorAuth()
│   ├── mediaService.ts    # Upload + validasi magic bytes gambar
│   ├── prisma.ts          # Singleton Prisma client
│   └── queries/           # Query data read-only untuk halaman publik
├── middleware.ts           # Guard rute /admin/* dan /administrator/*
└── types/                 # Definisi TypeScript global
```

---

## Arsitektur Autentikasi & Otorisasi

Sistem menggunakan model **Dual-Role RBAC** dengan dua peran yang sepenuhnya terpisah:

### `ADMIN_CSR` — Admin Lapangan
- Mengelola data CSR: Program, Kegiatan, Produk, Dokumentasi, Metrik, Sektor
- Memiliki **Active Sector Selector** untuk beralih konteks kerja antarsektor
- Dapat mengganti password sendiri (verifikasi password lama wajib)
- Tidak dapat mengakses manajemen akun atau log audit sistem
- Tidak dapat mereset password akun lain

### `ADMINISTRATOR` — Administrator Sistem
- Akses penuh ke dasbor `/administrator/*`
- Mengelola akun `ADMIN_CSR`: lihat, buat, nonaktifkan, reset password
- Melihat Activity Logs secara penuh dengan filter lengkap
- Mengelola profil dan keamanan akun sendiri
- Tidak memiliki akses CRUD ke data CSR (Program, Kegiatan, dll.)

### Alur Keamanan

```
Login → JWT diverifikasi → Role diperiksa → Guard server-side
         ↓                                       ↓
   HttpOnly cookie                  requireAuth() / requireAdministratorAuth()
   (tidak terbaca JS)               dipanggil di setiap Server Action
```

- Seluruh session aktif dicabut otomatis saat password diubah
- Password tidak pernah masuk response, log, atau audit trail
- Magic-bytes validation untuk setiap upload gambar (maks. 10 MB)
- Middleware menangani redirect berbasis role; cross-role access menghasilkan redirect, bukan error 403

---

## Fitur

### Portal Publik
- Katalog program dan kegiatan lapangan per sektor
- Galeri dokumentasi foto terverifikasi
- Halaman kinerja dan metrik dampak (penerima manfaat, desa terhubung)
- Halaman tentang visi & misi CSR ANTAM UBPN Malut
- Slider beranda dengan foto unggulan (pin manual, fallback ke foto terbaru)
- Semua data diambil server-side; data berstatus `DRAFT` tidak bocor ke klien
- Sitemap otomatis (`/sitemap.xml`) untuk SEO

### Dasbor ADMIN_CSR (`/admin`)
- CRUD penuh: Program, Kegiatan, Produk, Dokumentasi, Metrik, Sektor
- Active Sector Selector — beralih konteks sektor tanpa logout
- Grafik aktivitas bulanan dan distribusi status program (data riil)
- Upload gambar dengan validasi MIME type dan magic bytes
- Ganti password sendiri dengan verifikasi password lama

### Dasbor ADMINISTRATOR (`/administrator`)
- Manajemen akun `ADMIN_CSR`: tambah, lihat, nonaktifkan, reset password
- Activity Logs: pencarian, filter aksi, filter entitas, filter rentang tanggal, pagination
- Profil administrator: ubah nama dan ganti password

---

## Sektor yang Dikelola

Sektor dibuat secara dinamis dari database dan dapat ditambah langsung dari menu **Pengaturan** di dasbor admin:

- Pertanian (Agro Edu Wisata)
- Peternakan
- Lingkungan (Pengolahan Sampah & Pupuk Diversoil)
- Industri Kelapa Terpadu
- Kesehatan (G-BEST)
- Pendidikan

---

## Identitas Visual

Palet warna mengikuti identitas resmi ANTAM, didefinisikan sebagai variabel CSS di `globals.css`:

| Token          | Nilai     | Fungsi                                     |
| -------------- | --------- | ------------------------------------------ |
| `--primary`    | `#0D726D` | Teal ANTAM — elemen utama, tombol, heading |
| `--secondary`  | `#F6A236` | Orange ANTAM — aksen, badge, progress      |
| `--foreground` | `#172121` | Teks utama gelap                           |
| `--card`       | `#FFFFFF` | Latar kartu                                |
| `--muted-bg`   | `#F7FAF9` | Latar seksi selang-seling                  |

Font: **Playfair Display** (heading editorial) + **Inter** (body & UI).

Asset logo:
- `public/images/logo-antam.webp` — logo lengkap, digunakan di Navbar, Footer, Login, Sidebar
- `public/images/asset-logo.webp` — simbol/ikon, digunakan sebagai favicon

---

## Instalasi

**Prasyarat:** Node.js 18.18+ dan akses database MySQL / TiDB Cloud.

```bash
git clone https://github.com/Yosa-svg/Program-CSR.git
cd Program-CSR
npm install
```

Buat file `.env` (lihat `.env.example` untuk referensi lengkap):

```env
DATABASE_URL="mysql://user:pass@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/csr?sslaccept=strict"
JWT_SECRET="secret-acak-minimal-32-karakter"
NODE_ENV="development"
```

Sinkronisasi database dan jalankan server pengembangan:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Buka `http://localhost:3000`.

---

## Provisioning Akun

Gunakan script `scripts/provision_accounts.ts` untuk membuat akun produksi secara terisolasi:

```bash
# Buat akun ADMIN_CSR
npx tsx scripts/provision_accounts.ts

# Buat akun ADMINISTRATOR saja (tidak menyentuh akun ADMIN_CSR yang sudah ada)
npx tsx scripts/provision_accounts.ts --administrator-only
```

Variabel environment yang dibutuhkan (lihat `.env.example`):

```env
# Untuk mode default (ADMIN_CSR)
ADMIN_CSR_EMAIL="..."
ADMIN_CSR_PASSWORD="..."
ADMIN_CSR_NAME="..."

# Untuk mode --administrator-only
ADMINISTRATOR_EMAIL="..."
ADMINISTRATOR_PASSWORD="..."
ADMINISTRATOR_NAME="..."
```

> **Catatan keamanan:** Script hanya membuat atau memperbarui nama akun yang ditarget. Akun dengan email berbeda tidak pernah disentuh. Jika email target sudah ada dengan role yang berbeda, proses akan dihentikan.

---

## Pengujian

```bash
# Regression test provisioning akun
npx tsx scripts/provisioning_regression_test.ts

# Regression test manajemen password
npx tsx scripts/password_management_regression_test.ts

# Regression test RBAC
npx tsx scripts/rbac_regression_test.ts

# TypeScript check
npx tsc --noEmit

# Production build
npm run build
```

---

## Catatan Teknis

- **Body size limit Server Actions** dikonfigurasi ke `10mb` di `next.config.ts` untuk mendukung upload foto resolusi tinggi.
- **Rute sektor** sepenuhnya dinamis via `/bidang/[slug]` — tidak ada rute statis per sektor.
- **Data chart** diagregasi langsung dari tabel `Activity` dan `Documentation` berdasarkan tanggal aktual 6 bulan terakhir.
- **Slider beranda** mendukung pin manual foto via kolom `isFeatured` di tabel `Documentation`.
- **Audit log** menggunakan tabel `ActivityLog` dengan sanitasi wajib — password, hash, dan token tidak pernah dicatat.
- **Session revocation** — seluruh session aktif di tabel `AdminSession` dicabut otomatis saat password diubah.
- **Middleware** (`src/middleware.ts`) menangani redirect berbasis role; rute `/admin/*` hanya untuk `ADMIN_CSR`, rute `/administrator/*` hanya untuk `ADMINISTRATOR`.
