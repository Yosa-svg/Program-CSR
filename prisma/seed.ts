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
      name: 'Pertanian',
      slug: 'pertanian',
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
      }
    ]
  })

  // Seed Program
  const program = await prisma.program.create({
    data: {
      title: 'Agro Edu Wisata',
      description: 'Kawasan terpadu yang memadukan kegiatan pariwisata ekologis dengan edukasi pertanian.',
      location: 'Desa Suka Maju, Area Utara',
      beneficiaries: '120+ Kepala Keluarga',
      status: 'ACTIVE',
      imageUrl: '/images/sectors/agro-edu.jpg',
      sectorId: pertanian.id,
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
  ]
  await prisma.activity.createMany({ data: activities })

  // Seed Products
  const products = [
    {
      name: 'Beras Organik',
      description: 'Beras sehat tanpa residu kimia.',
      category: 'Pangan',
      status: 'AVAILABLE',
      imageUrl: '/images/products/beras.jpg',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Sayur Hidroponik',
      description: 'Segar langsung dari rumah kaca.',
      category: 'Sayuran',
      status: 'AVAILABLE',
      imageUrl: '/images/products/sayur.jpg',
      programId: program.id,
      sectorId: pertanian.id,
    },
    {
      name: 'Pupuk Kompos',
      description: 'Diolah dari sisa pertanian kawasan.',
      category: 'Sarana Pertanian',
      status: 'OUT_OF_STOCK',
      imageUrl: '/images/products/pupuk.jpg',
      programId: program.id,
      sectorId: pertanian.id,
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

  // Seed Metrics
  const metrics = [
    {
      name: 'Petani Binaan',
      value: '120',
      unit: 'Orang',
      period: '2026',
      description: 'Kepala keluarga di 5 desa',
      status: 'PUBLISHED',
      sectorId: pertanian.id,
    },
    {
      name: 'Luas Lahan',
      value: '25',
      unit: 'Hektar',
      period: '2026',
      description: 'Dikelola secara organik',
      status: 'PUBLISHED',
      sectorId: pertanian.id,
    },
    {
      name: 'Hasil Produksi',
      value: '5.2',
      unit: 'Ton',
      period: 'Januari 2026',
      description: 'Peningkatan hasil panen',
      status: 'PUBLISHED',
      sectorId: pertanian.id,
    },
    {
      name: 'Peningkatan Hasil',
      value: '18',
      unit: '%',
      period: '2026',
      description: 'Dibandingkan tahun sebelumnya',
      status: 'PUBLISHED',
      sectorId: pertanian.id,
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
