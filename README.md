<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  
  <h1>🌱 Sistem Informasi Program CSR Terpadu</h1>
  <p>Dasbor Admin dan Portal Publik untuk Manajemen Corporate Social Responsibility (CSR)</p>
</div>

---

## 📖 Tentang Proyek

Sistem Informasi Program CSR adalah sebuah platform web modern berbasis **Next.js App Router** yang dirancang khusus untuk mengelola, memantau, dan mempublikasikan seluruh kegiatan tanggung jawab sosial perusahaan (CSR). 

Sistem ini memiliki dua pilar utama:
1. **Portal Publik**: Etalase visual interaktif yang menampilkan komitmen perusahaan kepada masyarakat luas (Program, Kinerja, Produk, Dokumentasi).
2. **Dasbor Admin**: Pusat kendali terpadu yang memfasilitasi tim pengelola CSR dalam melakukan input data (CRUD) secara instan tanpa perlu bantuan teknis (*Server Actions*).

## ✨ Fitur Utama (Fase 1-12)

Sistem telah dilengkapi dengan modul fungsional yang tangguh dan terhubung (*relational*):

- 🏢 **Manajemen Program**: Buat dan pantau inisiatif CSR (contoh: *Agro Edu Wisata*).
- 📅 **Manajemen Kegiatan**: Jadwalkan agenda lapangan dan kaitkan langsung ke Program Induk.
- 📦 **Katalog Produk Binaan**: Kelola hasil karya atau panen dari masyarakat binaan, dengan opsi penautan ke program tertentu.
- 📸 **Arsitektur Media & Galeri**: Sistem *upload* gambar terpusat (*Media Upload Service*) yang mendukung validasi tipe file, otomatisasi penamaan (UUID), serta *lazy loading* menggunakan `next/image`.
- ⚡ **Performa Tinggi**: Dibangun dengan pola **Clean Architecture** memisahkan rute `(public)` dan Admin, serta memanfaatkan *Next.js Server Actions* untuk manipulasi data secepat kilat tanpa jeda *refresh*.

## 🛠️ Teknologi yang Digunakan

* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Database & ORM**: [SQLite](https://www.sqlite.org/index.html) + [Prisma ORM](https://www.prisma.io/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Panduan Instalasi & Menjalankan (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan sistem di komputer lokal Anda:

### 1. Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/Yosa-svg/Program-CSR.git
cd Program-CSR
npm install
```

### 2. Konfigurasi Database (Prisma)
Sistem menggunakan SQLite agar mudah dijalankan tanpa konfigurasi *database server* yang rumit. Terapkan skema ke database dan masukkan data awal (*seed*):
```bash
# Generate tipe Prisma Client
npx prisma generate

# Dorong skema tabel ke database lokal
npx prisma db push

# Isi database dengan data percontohan (Dummy Data)
npx prisma db seed
```

### 3. Jalankan Server
```bash
npm run dev
```

Buka peramban (browser) Anda dan akses:
- **Portal Publik**: [http://localhost:3000](http://localhost:3000)
- **Dasbor Admin (Pertanian)**: [http://localhost:3000/admin/pertanian](http://localhost:3000/admin/pertanian)

---

## 📁 Struktur Direktori Utama

```text
/
├── prisma/
│   ├── schema.prisma   # Struktur relasi database
│   ├── seed.ts         # Script pengisian data awal
│   └── dev.db          # File database lokal (SQLite)
├── public/
│   └── uploads/        # Direktori terpusat untuk berkas media (diabaikan oleh git)
├── src/
│   ├── actions/        # Kumpulan Server Actions (Logika CRUD)
│   ├── app/
│   │   ├── (public)/   # Halaman untuk masyarakat luas
│   │   └── admin/      # Halaman khusus Dasbor Admin
│   ├── components/     # Komponen UI (Navbar, Footer, Card, dll)
│   └── lib/            # Fungsi bantuan (Prisma Client, Media Service)
```

---

<div align="center">
  <p>Didesain dengan 💚 untuk ekosistem CSR yang lebih berkelanjutan.</p>
</div>
