import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Reset existing data
  await prisma.metric.deleteMany()
  await prisma.documentation.deleteMany()
  await prisma.product.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.program.deleteMany()
  await prisma.sector.deleteMany()

  // Create Pertanian Sector
  const pertanian = await prisma.sector.create({
    data: {
      name: 'Pertanian',
      slug: 'pertanian',
    },
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
      indicator: 'Petani Binaan',
      value: '450+',
      description: 'Kepala keluarga di 5 desa',
      icon: 'Users',
      color: 'bg-blue-500',
      sectorId: pertanian.id,
    },
    {
      indicator: 'Luas Lahan',
      value: '120 Ha',
      description: 'Dikelola secara organik',
      icon: 'Sprout',
      color: 'bg-emerald-500',
      sectorId: pertanian.id,
    },
    {
      indicator: 'Peningkatan Hasil',
      value: '35%',
      description: 'Dibandingkan tahun sebelumnya',
      icon: 'TrendingUp',
      color: 'bg-orange-500',
      sectorId: pertanian.id,
    },
    {
      indicator: 'Omzet Bulanan',
      value: 'Rp 250Jt',
      description: 'Rata-rata penjualan produk',
      icon: 'HandCoins',
      color: 'bg-purple-500',
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
