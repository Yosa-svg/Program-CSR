# Program CSR — Kawasan Ekonomi Keberkelanjutan

Sistem informasi manajemen CSR berbasis web untuk PT ANTAM Tbk UBPN Malut. Dibangun di atas Next.js App Router dengan dua sisi: portal publik yang mempresentasikan program kepada masyarakat umum, dan dasbor admin untuk tim pengelola.

---

## Stack

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

## Struktur Aplikasi

```
src/
├── app/
│   ├── (public)/          # Portal publik (/, /program, /bidang, /produk, /dokumentasi, /kinerja)
│   ├── admin/             # Dasbor admin (diproteksi middleware JWT)
│   └── globals.css        # Token warna dan tema global
├── actions/               # Server Actions (mutasi data tanpa REST API manual)
├── components/            # Komponen UI modular
├── lib/
│   ├── auth.ts            # Validasi sesi JWT dan RBAC
│   ├── mediaService.ts    # Upload + validasi magic bytes gambar
│   ├── prisma.ts          # Singleton Prisma client
│   └── queries/           # Query data read-only untuk halaman publik
└── middleware.ts          # Guard rute /admin/*
```

---

## Fitur

**Portal Publik**

- Katalog program, kegiatan lapangan, dan produk binaan per sektor
- Galeri dokumentasi foto terverifikasi
- Halaman kinerja dan metrik dampak CSR (penerima manfaat, desa terhubung)
- Slider beranda foto dokumentasi dinamis (pin oleh admin, fallback ke terbaru)
- Semua data diambil server-side; data draft tidak bocor ke klien

**Dasbor Admin**

- CRUD penuh: Program, Kegiatan, Produk, Dokumentasi, Metrik, Sektor, Akun
- Role tunggal `ADMIN_CSR` dengan _Active Sector Selector_ untuk beralih konteks sektor
- Grafik aktivitas bulanan dan distribusi status program (data riil, tanpa angka rekayasa)
- Upload gambar dengan validasi MIME type dan magic bytes (maks. 10 MB)

---

## Sektor yang Dikelola

Sektor dibuat secara dinamis dari database. Sektor yang sudah ada:

- Pertanian (Agro Edu Wisata)
- Peternakan
- Lingkungan (Pengolahan Sampah & Pupuk Diversoil)
- Industri Kelapa Terpadu
- Kesehatan (G-BEST)
- Pendidikan

Sektor baru dapat ditambahkan langsung dari menu Pengaturan di dasbor admin.

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

---

## Instalasi

**Prasyarat:** Node.js 18.18+ dan akses database MySQL / TiDB Cloud.

```bash
git clone https://github.com/Yosa-svg/Program-CSR.git
cd Program-CSR
npm install
```

Buat file `.env`:

```env
DATABASE_URL="mysql://user:pass@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/csr?sslaccept=strict"
JWT_SECRET="secret-acak-anda"
NODE_ENV="development"
```

Sinkronisasi database dan jalankan:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Buka `http://localhost:3000`.

---

## Akun Pengujian

| Email            | Role        |
| ---------------- | ----------- |
| `admin1@csr.com` | `ADMIN_CSR` |
| `admin2@csr.com` | `ADMIN_CSR` |

---

## Catatan Teknis

- **Body size limit Server Actions** dikonfigurasi ke `10mb` di `next.config.ts` untuk mendukung upload foto resolusi tinggi.
- **Rute sektor** sepenuhnya dinamis via `/bidang/[slug]` — rute statis per sektor telah dihapus.
- **Data chart** diagregasi langsung dari tabel `Activity` dan `Documentation` berdasarkan tanggal aktual 6 bulan terakhir.
- **Slider beranda** mendukung pin manual foto via kolom `isFeatured` di tabel `Documentation`.
