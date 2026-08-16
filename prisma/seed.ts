import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed taxonomy realignment...')

  // Reset existing data in order
  await prisma.metric.deleteMany()
  await prisma.documentation.deleteMany()
  await prisma.product.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.program.deleteMany()
  await prisma.user.deleteMany()
  await prisma.sector.deleteMany()

  // 1. Create Sectors
  const pertanian = await prisma.sector.create({
    data: {
      name: 'Pertanian',
      slug: 'pertanian',
    },
  })

  const peternakan = await prisma.sector.create({
    data: {
      name: 'Peternakan',
      slug: 'peternakan',
    },
  })

  const lingkungan = await prisma.sector.create({
    data: {
      name: 'Lingkungan',
      slug: 'lingkungan',
    },
  })

  const industriKelapa = await prisma.sector.create({
    data: {
      name: 'Industri Kelapa',
      slug: 'industri-kelapa',
    },
  })

  const umkm = await prisma.sector.create({
    data: {
      name: 'UMKM',
      slug: 'umkm',
    },
  })

  // 2. Create Users / Admin Accounts with Simple & Memorable Passwords
  const superAdminHash = await bcrypt.hash('super2026', 10)
  const pusatAdminHash = await bcrypt.hash('pusat2026', 10)
  const taniAdminHash = await bcrypt.hash('tani2026', 10)
  const ternakAdminHash = await bcrypt.hash('ternak2026', 10)
  const lingkunganAdminHash = await bcrypt.hash('lingkungan2026', 10)
  const kelapaAdminHash = await bcrypt.hash('kelapa2026', 10)
  const umkmAdminHash = await bcrypt.hash('umkm2026', 10)

  await prisma.user.createMany({
    data: [
      {
        name: 'Super Admin',
        email: 'super@csr.com',
        password: superAdminHash,
        role: 'SUPER_ADMIN',
      },
      {
        name: 'Admin Pusat',
        email: 'pusat@csr.com',
        password: pusatAdminHash,
        role: 'ADMIN_PUSAT',
      },
      {
        name: 'Admin Pertanian',
        email: 'pertanian@csr.com',
        password: taniAdminHash,
        role: 'ADMIN_SEKTOR',
        sectorId: pertanian.id,
      },
      {
        name: 'Admin Peternakan',
        email: 'peternakan@csr.com',
        password: ternakAdminHash,
        role: 'ADMIN_SEKTOR',
        sectorId: peternakan.id,
      },
      {
        name: 'Admin Lingkungan',
        email: 'lingkungan@csr.com',
        password: lingkunganAdminHash,
        role: 'ADMIN_SEKTOR',
        sectorId: lingkungan.id,
      },
      {
        name: 'Admin Industri Kelapa',
        email: 'kelapa@csr.com',
        password: kelapaAdminHash,
        role: 'ADMIN_SEKTOR',
        sectorId: industriKelapa.id,
      },
      {
        name: 'Admin UMKM',
        email: 'umkm@csr.com',
        password: umkmAdminHash,
        role: 'ADMIN_SEKTOR',
        sectorId: umkm.id,
      },
    ],
  })

  // 3. Seed Programs
  const progPertanian = await prisma.program.create({
    data: {
      title: 'Agro Edu Wisata',
      slug: 'agro-edu-wisata',
      description: 'Kawasan terpadu yang memadukan pariwisata ekologis dengan edukasi budidaya pertanian organik.',
      location: 'Desa Suka Maju',
      beneficiaries: '120+ Kepala Keluarga',
      status: 'ACTIVE',
      isPublished: true,
      imageUrl: '/images/sectors/agro-edu.jpg',
      source: 'Laporan Keberlanjutan CSR 2025',
      sourceType: 'RESMI_ANTAM',
      verificationStatus: 'TERVERIFIKASI',
      sectorId: pertanian.id,
    },
  })

  const progPeternakan = await prisma.program.create({
    data: {
      title: 'Inkubator Bisnis',
      slug: 'inkubator-bisnis-peternakan',
      description: 'Program inkubasi usaha peternakan terpadu meliputi pembibitan, formulasi pakan, dan pengolahan hasil ternak.',
      location: 'Kawasan Peternakan Komunal',
      beneficiaries: '45 Peternak Terbina',
      status: 'ACTIVE',
      isPublished: true,
      imageUrl: '/images/sectors/pembibitan-sapi.jpg',
      source: 'Dokumen Program CSR 2025',
      sourceType: 'RESMI_ANTAM',
      verificationStatus: 'TERVERIFIKASI',
      sectorId: peternakan.id,
    },
  })

  const progLingkungan = await prisma.program.create({
    data: {
      title: 'Pengolahan Sampah Plastik & Pupuk Diversoil',
      slug: 'pengolahan-sampah-plastik-dan-pupuk-diversoil',
      description: 'Inisiatif daur ulang anorganik serta komposting limbah organik menjadi produk Pupuk Diversoil ramah lingkungan.',
      location: 'Pusat Daur Ulang Mandiri',
      beneficiaries: '85 Warga Binaan',
      status: 'ACTIVE',
      isPublished: true,
      imageUrl: '/images/sectors/lingkungan.jpg',
      source: 'Laporan Monitoring Lingkungan 2025',
      sourceType: 'RESMI_ANTAM',
      verificationStatus: 'TERVERIFIKASI',
      sectorId: lingkungan.id,
    },
  })

  const progKelapa = await prisma.program.create({
    data: {
      title: 'Industri Kelapa Terpadu',
      slug: 'industri-kelapa-terpadu',
      description: 'Pengembangan hilirisasi kelapa terpadu untuk mengolah sabut, tempurung, dan daging kelapa menjadi produk bernilai tambah.',
      location: 'Sentra Olahan Kelapa',
      beneficiaries: '60 Pengrajin & Petani Kelapa',
      status: 'ACTIVE',
      isPublished: true,
      imageUrl: '/images/sectors/kelapa-terpadu.jpg',
      source: 'Studi Kelayakan CSR 2025',
      sourceType: 'RESMI_ANTAM',
      verificationStatus: 'TERVERIFIKASI',
      sectorId: industriKelapa.id,
    },
  })

  // 4. Seed Products / Outputs
  await prisma.product.createMany({
    data: [
      // Products Pertanian
      {
        name: 'Beras Organik',
        slug: 'beras-organik',
        description: 'Beras sehat berkualitas tanpa residu pestisida kimia.',
        category: 'Pangan Organik',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '5000',
        unit: 'Kg/Panen',
        source: 'Kelompok Tani Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPertanian.id,
        sectorId: pertanian.id,
      },
      {
        name: 'Sayur Hidroponik',
        slug: 'sayur-hidroponik',
        description: 'Sayuran segar hidroponik bebas pestisida.',
        category: 'Sayuran',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '200',
        unit: 'Kg/Minggu',
        source: 'Greenhouse Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPertanian.id,
        sectorId: pertanian.id,
      },

      // Products Peternakan
      {
        name: 'Susu Segar Pasteurisasi',
        slug: 'susu-segar-pasteurisasi',
        description: 'Susu murni olahan higienis dari peternakan binaan.',
        category: 'Olahan Ternak',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '1200',
        unit: 'Liter/Bulan',
        source: 'Koperasi Peternak',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPeternakan.id,
        sectorId: peternakan.id,
      },
      {
        name: 'Pakan Silase Organik',
        slug: 'pakan-silase-organik',
        description: 'Pakan ternak bergizi tinggi dari fermentasi hijauan.',
        category: 'Pakan Ternak',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '1500',
        unit: 'Kg/Bulan',
        source: 'Unit Pakan Mandiri',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPeternakan.id,
        sectorId: peternakan.id,
      },

      // Products Lingkungan
      {
        name: 'Pupuk Diversoil',
        slug: 'pupuk-diversoil',
        description: 'Pupuk bio-organik pembenah tanah hasil komposting limbah organik.',
        category: 'Pupuk Organik',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '3000',
        unit: 'Kg/Bulan',
        source: 'Unit Pengolahan Organik',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progLingkungan.id,
        sectorId: lingkungan.id,
      },

      // Products Industri Kelapa Terpadu (4 produk resmi)
      {
        name: 'Coconet',
        slug: 'coconet',
        description: 'Jaring sabut kelapa pencegah erosi dan penguat struktur tanah pada reklamasi lahan.',
        category: 'Produk Sabut',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '800',
        unit: 'M/Bulan',
        source: 'Sentra Kelapa Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
      {
        name: 'Cocopeat',
        slug: 'cocopeat',
        description: 'Serbuk sabut kelapa sebagai media tanam organik penyimpan air tinggi.',
        category: 'Media Tanam',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '2000',
        unit: 'Kg/Bulan',
        source: 'Sentra Kelapa Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
      {
        name: 'Cocopot',
        slug: 'cocopot',
        description: 'Pot tanaman organik biodegredable dari serat sabut kelapa.',
        category: 'Kerajinan Sabut',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '500',
        unit: 'Pcs/Bulan',
        source: 'Sentra Kelapa Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
      {
        name: 'Sapu Sabut Kelapa',
        slug: 'sapu-sabut-kelapa',
        description: 'Sapu ramah lingkungan berbahan dasar serat sabut kelapa olahan.',
        category: 'Alat Rumah Tangga',
        status: 'AVAILABLE',
        isPublished: true,
        capacity: '300',
        unit: 'Pcs/Bulan',
        source: 'Sentra Kelapa Binaan',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
    ],
  })

  // 5. Seed Activities
  await prisma.activity.createMany({
    data: [
      {
        title: 'Pelatihan Budidaya Pertanian Organik',
        description: 'Bimbingan teknik tanam ramah lingkungan tanpa pestisida kimia.',
        location: 'Kawasan Agro Edu Wisata',
        date: new Date(),
        status: 'COMPLETED',
        isPublished: true,
        source: 'Absensi Pelatihan 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPertanian.id,
        sectorId: pertanian.id,
      },
      {
        title: 'Workshop Formulasi Pakan Ternak Organik',
        description: 'Pelatihan pembuatan pakan silase dan suplemen herbal ternak.',
        location: 'Kandang Komunal',
        date: new Date(),
        status: 'COMPLETED',
        isPublished: true,
        source: 'Absensi Workshop 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progPeternakan.id,
        sectorId: peternakan.id,
      },
      {
        title: 'Pelatihan Pengolahan Limbah Sampah & Pupuk Diversoil',
        description: 'Workshop pemilahan limbah dan teknik komposting cepat menjadi Pupuk Diversoil.',
        location: 'Pusat Daur Ulang',
        date: new Date(),
        status: 'COMPLETED',
        isPublished: true,
        source: 'Berita Acara Kegiatan 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progLingkungan.id,
        sectorId: lingkungan.id,
      },
      {
        title: 'Pelatihan Pembuatan Coconet & Cocopeat',
        description: 'Bimbingan teknis menganyam jaring Coconet dan mengepres Cocopeat untuk komoditas ekspor.',
        location: 'Sentra Olahan Kelapa',
        date: new Date(),
        status: 'COMPLETED',
        isPublished: true,
        source: 'Berita Acara Pelatihan 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
    ],
  })

  // 6. Seed Metrics
  await prisma.metric.createMany({
    data: [
      {
        name: 'Penerima Manfaat Tani Organik',
        category: 'OUTCOME',
        target: 50,
        realization: 40,
        unit: 'orang',
        year: 2026,
        period: '2026',
        description: 'Petani binaan yang aktif menerapkan teknik pertanian ramah lingkungan.',
        source: 'Laporan Monev Q4 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        isPublished: true,
        programId: progPertanian.id,
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
        description: 'Peternak binaan yang terampil mengelola pakan dan kesehatan ternak.',
        source: 'Laporan Pendampingan 2025',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        isPublished: true,
        programId: progPeternakan.id,
        sectorId: peternakan.id,
      },
      {
        name: 'Produksi Pupuk Diversoil',
        category: 'OUTPUT',
        target: 3000,
        realization: 3200,
        unit: 'kg/bulan',
        year: 2026,
        period: '2026',
        description: 'Total akumulasi produksi pupuk bio-organik pembenah tanah.',
        source: 'Laporan Penimbangan Pabrikasi',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        isPublished: true,
        programId: progLingkungan.id,
        sectorId: lingkungan.id,
      },
      {
        name: 'Produksi Coconet & Sabut Kelapa',
        category: 'OUTPUT',
        target: 800,
        realization: 850,
        unit: 'm/bulan',
        year: 2026,
        period: '2026',
        description: 'Total jaring sabut kelapa yang diproduksi untuk reklamasi lahan.',
        source: 'Laporan Produksi Sentra Kelapa',
        sourceType: 'RESMI_ANTAM',
        verificationStatus: 'TERVERIFIKASI',
        isPublished: true,
        programId: progKelapa.id,
        sectorId: industriKelapa.id,
      },
    ],
  })

  console.log('Taxonomy realignment seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
