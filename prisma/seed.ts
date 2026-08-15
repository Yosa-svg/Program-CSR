import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Reset existing data
  await prisma.metric.deleteMany()
  await prisma.documentation.deleteMany()
  await prisma.product.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.program.deleteMany()
  await prisma.user.deleteMany()
  await prisma.sector.deleteMany()

  // Create Sectors
  const pertanian = await prisma.sector.create({
    data: {
      name: 'Pertanian Terpadu',
      slug: 'pertanian',
    },
  })
  const peternakan = await prisma.sector.create({
    data: {
      name: 'Peternakan',
      slug: 'peternakan',
    },
  })
  const umkm = await prisma.sector.create({
    data: {
      name: 'UMKM',
      slug: 'umkm',
    },
  })

  // Create Users
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Super Admin',
        email: 'super@csr.com',
        password: passwordHash,
        role: 'SUPER_ADMIN',
      },
      {
        name: 'Admin Pusat',
        email: 'pusat@csr.com',
        password: passwordHash,
        role: 'ADMIN_PUSAT',
      },
      {
        name: 'Admin Pertanian',
        email: 'pertanian@csr.com',
        password: passwordHash,
        role: 'ADMIN_SEKTOR',
        sectorId: pertanian.id,
      },
      {
        name: 'Admin UMKM',
        email: 'umkm@csr.com',
        password: passwordHash,
        role: 'ADMIN_SEKTOR',
        sectorId: umkm.id,
      },
      {
        name: 'Admin Peternakan',
        email: 'peternakan@csr.com',
        password: passwordHash,
        role: 'ADMIN_SEKTOR',
        sectorId: peternakan.id,
      }
    ]
  })

  // Seed Program
  const program = await prisma.program.create({
    data: {
      title: 'Agro Edu Wisata',
      slug: 'agro-edu-wisata',
      description: 'Kawasan terpadu yang memadukan kegiatan pariwisata ekologis dengan edukasi pertanian.',
      location: 'Desa Suka Maju, Area Utara',
      beneficiaries: '120+ Kepala Keluarga',
      status: 'ACTIVE',
      imageUrl: '/images/sectors/agro-edu.jpg',
      sectorId: pertanian.id,
    },
  })

  const programPeternakan = await prisma.program.create({
    data: {
      title: 'Pembibitan Sapi Terpadu',
      slug: 'pembibitan-sapi-terpadu',
      description: 'Program pembibitan sapi unggul dengan pendekatan manajemen pakan organik dan integrasi limbah.',
      location: 'Blok Peternakan, Area Selatan',
      beneficiaries: '45 Peternak Lokal',
      status: 'ACTIVE',
      imageUrl: '/images/sectors/pembibitan-sapi.jpg',
      sectorId: peternakan.id,
    },
  })

  // Seed Activities
  const activities = [
    {
      title: 'Penyuluhan Pertanian Organik',
      description: 'Diskusi dan praktik lapangan bersama agronom.',
      location: 'Balai Desa',
      date: new Date(),
      status: 'UPCOMING',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      title: 'Distribusi Bibit Unggul',
      description: 'Pembagian bibit sayur dan buah kepada kelompok tani mitra.',
      location: 'Gudang Pertanian',
      date: new Date(),
      status: 'ONGOING',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      title: 'Festival Panen Raya',
      description: 'Perayaan hasil bumi yang melibatkan seluruh elemen masyarakat.',
      location: 'Alun-alun Desa',
      date: new Date(),
      status: 'COMPLETED',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      title: 'Pelatihan Formulasi Pakan Organik',
      description: 'Workshop pemanfaatan limbah pertanian menjadi pakan ternak bergizi.',
      location: 'Balai Warga',
      date: new Date(),
      status: 'COMPLETED',
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
    {
      title: 'Distribusi Bibit Sapi Unggul',
      description: 'Penyerahan anakan sapi kepada kelompok peternak binaan tahap I.',
      location: 'Kandang Komunal',
      date: new Date(),
      status: 'ONGOING',
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
  ]
  await prisma.activity.createMany({ data: activities })

  // Seed Products
  const products = [
    {
      name: 'Beras Organik',
      slug: 'beras-organik',
      description: 'Beras sehat tanpa residu kimia.',
      category: 'Pangan',
      status: 'AVAILABLE',
      imageUrl: '/images/products/beras.jpg',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Sayur Hidroponik',
      slug: 'sayur-hidroponik',
      description: 'Segar langsung dari rumah kaca.',
      category: 'Sayuran',
      status: 'AVAILABLE',
      imageUrl: '/images/products/sayur.jpg',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Pupuk Kompos',
      slug: 'pupuk-kompos',
      description: 'Diolah dari sisa pertanian kawasan.',
      category: 'Sarana Pertanian',
      status: 'OUT_OF_STOCK',
      imageUrl: '/images/products/pupuk.jpg',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Pakan Silase Organik',
      slug: 'pakan-silase-organik',
      description: 'Pakan ternak hasil fermentasi hijau.',
      category: 'Pakan Ternak',
      status: 'AVAILABLE',
      imageUrl: '/images/products/pakan-silase.jpg',
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
    {
      name: 'Susu Segar Pasteurisasi',
      slug: 'susu-segar-pasteurisasi',
      description: 'Susu murni dari sapi perah kawasan.',
      category: 'Pangan Ternak',
      status: 'AVAILABLE',
      imageUrl: '/images/products/susu-segar.jpg',
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
  ]
  await prisma.product.createMany({ data: products })

  // Seed Documentation
  const photos = [
    '/images/sectors/pertanian-doc-1.jpg',
    '/images/sectors/pertanian-doc-2.jpg',
    '/images/sectors/pertanian-doc-3.jpg',
    '/images/sectors/pertanian-doc-4.jpg',
    '/images/sectors/pertanian-doc-5.jpg',
    '/images/sectors/pertanian-doc-6.jpg',
  ]
  await prisma.documentation.createMany({
    data: photos.map((url, index) => ({
      title: `Dokumentasi ${index + 1}`,
      imageUrl: url,
      sectorId: pertanian.id,
    }))
  })

  const photosPeternakan = [
    '/images/sectors/peternakan-doc-1.jpg',
    '/images/sectors/peternakan-doc-2.jpg',
    '/images/sectors/peternakan-doc-3.jpg',
  ]
  await prisma.documentation.createMany({
    data: photosPeternakan.map((url, index) => ({
      title: `Dokumentasi Peternakan ${index + 1}`,
      imageUrl: url,
      sectorId: peternakan.id,
    }))
  })

  // Seed Metrics (Phase 15.4)
  const metrics = [
    {
      name: 'Penerima Manfaat Tani',
      category: 'OUTCOME',
      target: 50,
      realization: 40,
      unit: 'orang',
      year: 2026,
      period: '2026',
      description: 'Petani binaan yang aktif menerapkan teknik pertanian ramah lingkungan.',
      source: 'Laporan Monev Q4',
      verificationStatus: 'TERVERIFIKASI',
      isPublished: true,
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Kegiatan Pelatihan Budidaya',
      category: 'OUTPUT',
      target: 10,
      realization: 12,
      unit: 'kegiatan',
      year: 2026,
      period: '2026',
      description: 'Sesi bimbingan teknis pembuatan pupuk organik dan pengelolaan lahan.',
      source: 'Absensi & Berita Acara',
      verificationStatus: 'TERVERIFIKASI',
      isPublished: true,
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Peningkatan Kemandirian Usaha Tani',
      category: 'IMPACT',
      target: 0,
      realization: 0,
      value: 'Dampak Jangka Panjang',
      unit: 'kelompok',
      year: 2026,
      period: '2026',
      description: 'Kelompok mampu mengelola rantai pasok dan pemasaran produk secara mandiri.',
      source: 'Survei Lapangan Dampak',
      verificationStatus: 'TERVERIFIKASI',
      isPublished: true,
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Peternak Sapi Terbina',
      category: 'OUTCOME',
      target: 20,
      realization: 20,
      unit: 'orang',
      year: 2026,
      period: '2026',
      description: 'Peternak yang lulus sertifikasi manajemen pakan dan kesehatan ternak.',
      source: 'Laporan Pendampingan',
      verificationStatus: 'TERVERIFIKASI',
      isPublished: true,
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
    {
      name: 'Produksi Susu Segar',
      category: 'OUTPUT',
      target: 1000,
      realization: 1200,
      unit: 'liter/bulan',
      year: 2026,
      period: '2026',
      description: 'Total pengumpulan susu sapi dari kelompok peternak binaan.',
      source: 'Catatan Penimbangan Koperasi',
      verificationStatus: 'TERVERIFIKASI',
      isPublished: true,
      programId: programPeternakan.id,
      sectorId: peternakan.id,
    },
  ]
  await prisma.metric.createMany({ data: metrics })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
