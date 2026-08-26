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

  // 2. DATA CHART STATUS PROGRAM (Tanpa data fiktif)
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
    { name: 'Aktif', value: activeCount },
    { name: 'Selesai', value: completedCount },
    { name: 'Draft/Rencana', value: plannedCount },
  ].filter(d => d.value > 0);

  // 3. DATA CHART AKTIVITAS BULANAN (Agregasi Tanggal Aktual Prisma)
  const allActivities = await prisma.activity.findMany({
    where: whereClause,
    select: { date: true }
  });
  const allDocs = await prisma.documentation.findMany({
    where: whereClause,
    select: { date: true, createdAt: true }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const now = new Date();
  
  const activityData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    
    const kegiatan = allActivities.filter(a => {
      if (!a.date) return false;
      const ad = new Date(a.date);
      return ad.getFullYear() === y && ad.getMonth() === m;
    }).length;

    const dokumen = allDocs.filter(doc => {
      const dd = doc.date ? new Date(doc.date) : new Date(doc.createdAt);
      return dd.getFullYear() === y && dd.getMonth() === m;
    }).length;

    activityData.push({
      name: monthNames[m],
      kegiatan,
      dokumen,
    });
  }

  // 4. DATA CHART KINERJA & DAMPAK (Data Asli Tanpa Angka Palsu)
  const metrics = await prisma.metric.findMany({ 
    where: whereClause,
    orderBy: [{ year: 'asc' }, { createdAt: 'asc' }]
  });
  
  const impactData = metrics
    .map(m => ({
      period: m.period || (m.year ? m.year.toString() : m.name),
      value: m.realization ?? (parseInt((m.value || "0").replace(/\D/g, '')) || 0)
    }))
    .filter(d => d.value > 0);

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
      title: `Kegiatan: ${a.title}`,
      time: a.date ? a.date.toLocaleDateString('id-ID') : 'Baru saja',
      type: 'activity',
      icon: <Calendar size={16} className="text-primary" />
    })),
    ...recentDocs.map(d => ({
      id: d.id,
      title: `Dokumentasi: ${d.title}`,
      time: d.createdAt.toLocaleDateString('id-ID'),
      type: 'doc',
      icon: <FileImage size={16} className="text-secondary" />
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* HEADER OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {activeSectorId 
              ? (sectorName.toLowerCase().startsWith("sektor") ? `Dashboard ${sectorName}` : `Dashboard Sektor ${sectorName}`)
              : "Dashboard Semua Sektor"}
          </h1>
          <p className="text-foreground/60 text-sm">
            Selamat datang kembali. Berikut adalah ringkasan performa {activeSectorId ? `sektor ${sectorName.replace(/^sektor\s+/i, '')}` : "seluruh sektor CSR"}.
          </p>
        </div>
        {activeSectorId && (
          <Link 
            href={`/bidang/${sectorSlug}`} 
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors text-sm"
          >
            Lihat Halaman Publik <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* 4 KARTU STATISTIK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Program", count: programCount, icon: <Layers size={20} className="text-primary" />, href: "/admin/program" },
          { title: "Kegiatan", count: activityCount, icon: <Sprout size={20} className="text-secondary" />, href: "/admin/kegiatan" },
          { title: "Produk", count: productCount, icon: <Box size={20} className="text-primary" />, href: "/admin/produk" },
          { title: "Dokumentasi", count: docCount, icon: <ImageIcon size={20} className="text-secondary" />, href: "/admin/dokumentasi" },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-foreground/50 uppercase tracking-wider">{stat.title}</div>
              <div className="p-2 bg-muted-bg rounded-lg group-hover:bg-primary/10 transition-colors">{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-foreground">{stat.count}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART AKTIVITAS (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
              <BarChart3 size={20} className="text-primary" />
              Aktivitas per Bulan
            </h3>
          </div>
          <ActivityChart data={activityData} />
        </div>

        {/* CHART STATUS (1/3 width on desktop) */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-6 text-base">
            <CheckCircle2 size={20} className="text-primary" />
            Status Program
          </h3>
          <StatusChart data={statusData} />
        </div>

        {/* CHART KINERJA (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-foreground text-base">
              Tren Kinerja & Dampak (Penerima Manfaat)
            </h3>
            {activeSectorId && (
              <Link href="/admin/kinerja" className="text-xs text-primary font-bold hover:underline">Kelola Data</Link>
            )}
          </div>
          <ImpactChart data={impactData} />
        </div>

        {/* AKTIVITAS TERBARU (1/3 width on desktop) */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-6 text-base">
            <Clock size={20} className="text-foreground/40" />
            Aktivitas Terbaru
          </h3>
          
          <div className="space-y-4 flex-1">
            {timeline.length > 0 ? timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-foreground/50">{item.time}</div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-foreground/50 text-center py-4">Belum ada aktivitas</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
