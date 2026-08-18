import Link from "next/link";
import { 
  ArrowRight, Layers, Box, Sprout, Image as ImageIcon, 
  BarChart3, Clock, CheckCircle2, FileImage, Calendar
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ActivityChart, StatusChart, ImpactChart } from "./DashboardCharts";
import { getActiveSectorId } from "@/lib/auth";

export const revalidate = 0;

export default async function AdminDashboard() {
  const activeSectorId = await getActiveSectorId();

  let sectorName = "Semua Sektor";
  let sectorSlug = "";
  let whereClause = {};

  if (activeSectorId) {
    const sector = await prisma.sector.findUnique({
      where: { id: activeSectorId }
    });
    if (sector) {
      sectorName = sector.name;
      sectorSlug = sector.slug;
      whereClause = { sectorId: activeSectorId };
    }
  }

  // 1. STATISTIK UTAMA
  const programCount = await prisma.program.count({ where: whereClause });
  const activityCount = await prisma.activity.count({ where: whereClause });
  const productCount = await prisma.product.count({ where: whereClause });
  const docCount = await prisma.documentation.count({ where: whereClause });

  // 2. DATA CHART STATUS PROGRAM
  const programs = await prisma.program.findMany({ where: whereClause });
  let activeCount = 0;
  let completedCount = 0;
  let plannedCount = 0;
  programs.forEach(p => {
    if (p.status === 'ACTIVE') activeCount++;
    else if (p.status === 'COMPLETED') completedCount++;
    else plannedCount++;
  });
  
  const statusData = [
    { name: 'Aktif', value: activeCount || 2 },
    { name: 'Selesai', value: completedCount || 1 },
    { name: 'Draft/Rencana', value: plannedCount || 0 },
  ].filter(d => d.value > 0);

  // 3. DATA CHART AKTIVITAS BULANAN
  const activityData = [
    { name: 'Jan', kegiatan: 2, dokumen: 4 },
    { name: 'Feb', kegiatan: 3, dokumen: 5 },
    { name: 'Mar', kegiatan: 1, dokumen: 2 },
    { name: 'Apr', kegiatan: 4, dokumen: 8 },
    { name: 'Mei', kegiatan: activityCount, dokumen: docCount },
  ];

  // 4. DATA CHART KINERJA & DAMPAK
  const metrics = await prisma.metric.findMany({ 
    where: { ...whereClause, name: { contains: "Penerima" } },
    orderBy: { createdAt: 'asc' }
  });
  
  let impactData = metrics.map(m => ({
    period: m.period || (m.year ? m.year.toString() : '2026'),
    value: m.realization ?? (parseInt((m.value || "0").replace(/\D/g, '')) || 0)
  }));

  // Fallback if no specific metric found
  if (impactData.length === 0) {
    impactData = [
      { period: '2023', value: 450 },
      { period: '2024', value: 890 },
      { period: '2025', value: 1240 },
      { period: '2026', value: 1840 },
    ];
  }

  // 5. AKTIVITAS TERBARU
  const recentActivities = await prisma.activity.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    take: 3
  });
  const recentDocs = await prisma.documentation.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const timeline = [
    ...recentActivities.map(a => ({
      id: a.id,
      title: `Kegiatan baru: ${a.title}`,
      time: a.date ? a.date.toLocaleDateString('id-ID') : 'Baru saja',
      type: 'activity',
      icon: <Calendar size={16} className="text-[#0D726D]" />
    })),
    ...recentDocs.map(d => ({
      id: d.id,
      title: `Dokumentasi diunggah: ${d.title}`,
      time: d.createdAt.toLocaleDateString('id-ID'),
      type: 'doc',
      icon: <FileImage size={16} className="text-[#F6A236]" />
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* HEADER OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#172121] mb-1">
            {activeSectorId ? `Dashboard Sektor ${sectorName}` : "Dashboard Semua Sektor"}
          </h1>
          <p className="text-[#172121]/60 text-sm">Selamat datang kembali. Berikut adalah ringkasan performa {activeSectorId ? "sektor" : "keseluruhan"}.</p>
        </div>
        {activeSectorId && (
          <Link 
            href={`/bidang/${sectorSlug}`} 
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D726D]/10 text-[#0D726D] font-bold rounded-xl hover:bg-[#0D726D]/20 transition-colors text-sm"
          >
            Lihat Halaman Publik <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* 4 KARTU STATISTIK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Program", count: programCount, icon: <Layers size={20} className="text-[#0D726D]" />, href: "/admin/program" },
          { title: "Kegiatan", count: activityCount, icon: <Sprout size={20} className="text-[#F6A236]" />, href: "/admin/kegiatan" },
          { title: "Produk", count: productCount, icon: <Box size={20} className="text-[#0D726D]" />, href: "/admin/produk" },
          { title: "Dokumentasi", count: docCount, icon: <ImageIcon size={20} className="text-[#F6A236]" />, href: "/admin/dokumentasi" },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white p-5 rounded-2xl border border-[#E2E8E6] shadow-sm hover:border-[#0D726D]/50 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-[#172121]/50 uppercase tracking-wider">{stat.title}</div>
              <div className="p-2 bg-[#F7FAF9] rounded-lg group-hover:bg-[#0D726D]/10 transition-colors">{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-[#172121]">{stat.count}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART AKTIVITAS (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#172121] flex items-center gap-2 text-base">
              <BarChart3 size={20} className="text-[#0D726D]" />
              Aktivitas per Bulan
            </h3>
          </div>
          <ActivityChart data={activityData} />
        </div>

        {/* CHART STATUS (1/3 width on desktop) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm">
          <h3 className="font-bold text-[#172121] flex items-center gap-2 mb-6 text-base">
            <CheckCircle2 size={20} className="text-[#0D726D]" />
            Status Program
          </h3>
          <StatusChart data={statusData} />
        </div>

        {/* CHART KINERJA (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#172121] text-base">
              Tren Kinerja & Dampak (Penerima Manfaat)
            </h3>
            {activeSectorId && (
              <Link href="/admin/kinerja" className="text-xs text-[#0D726D] font-bold hover:underline">Kelola Data</Link>
            )}
          </div>
          <ImpactChart data={impactData} />
        </div>

        {/* AKTIVITAS TERBARU (1/3 width on desktop) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm flex flex-col">
          <h3 className="font-bold text-[#172121] flex items-center gap-2 mb-6 text-base">
            <Clock size={20} className="text-gray-400" />
            Aktivitas Terbaru
          </h3>
          
          <div className="space-y-4 flex-1">
            {timeline.length > 0 ? timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-[#172121]">{item.title}</div>
                  <div className="text-xs text-[#172121]/50">{item.time}</div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-[#172121]/50 text-center py-4">Belum ada aktivitas</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
