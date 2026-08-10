import Link from "next/link";
import { ArrowRight, Layers, Box, Sprout, Image as ImageIcon, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Revalidate on every request (dynamic page)
export const revalidate = 0;

export default async function PertanianDashboard() {
  const sector = await prisma.sector.findUnique({
    where: { slug: "pertanian" }
  });

  const programCount = sector ? await prisma.program.count({ where: { sectorId: sector.id } }) : 0;
  const activityCount = sector ? await prisma.activity.count({ where: { sectorId: sector.id } }) : 0;
  const productCount = sector ? await prisma.product.count({ where: { sectorId: sector.id } }) : 0;
  const documentationCount = sector ? await prisma.documentation.count({ where: { sectorId: sector.id } }) : 0;
  const metricCount = sector ? await prisma.metric.count({ where: { sectorId: sector.id } }) : 0;

  const menuItems = [
    {
      title: "Kelola Program",
      description: "Manajemen program seperti Agro Edu Wisata.",
      icon: <Layers size={24} className="text-primary" />,
      href: "/admin/pertanian/program",
      count: programCount,
    },
    {
      title: "Kelola Kegiatan",
      description: "Jadwal dan aktivitas lapangan.",
      icon: <Sprout size={24} className="text-emerald-500" />,
      href: "/admin/pertanian/kegiatan",
      count: activityCount,
    },
    {
      title: "Kelola Produk",
      description: "Katalog hasil tani unggulan.",
      icon: <Box size={24} className="text-orange-500" />,
      href: "/admin/pertanian/produk",
      count: productCount,
    },
    {
      title: "Dokumentasi",
      description: "Galeri foto kegiatan sektor.",
      icon: <ImageIcon size={24} className="text-blue-500" />,
      href: "/admin/pertanian/dokumentasi",
      count: documentationCount,
    },
    {
      title: "Kinerja & Dampak",
      description: "Statistik keberhasilan sektor.",
      icon: <BarChart3 size={24} className="text-purple-500" />,
      href: "/admin/pertanian/kinerja",
      count: metricCount,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Ringkasan Sektor Pertanian</h1>
        <p className="text-white/60">
          Pilih modul di bawah ini untuk mengelola data yang tampil di halaman publik Pertanian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-white/40 group-hover:text-primary transition-colors">
                Buka Modul <ArrowRight size={14} />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/50 flex-1">{item.description}</p>
            
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-white/40 uppercase tracking-wider">Total Data</span>
              <span className="font-mono text-sm font-bold text-white">{item.count}</span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Sprout size={20} className="text-primary" />
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">Pratinjau Halaman Publik</h4>
          <p className="text-sm text-white/60 mb-4">
            Lihat bagaimana data yang Anda kelola tampil di website utama masyarakat.
          </p>
          <Link 
            href="/bidang/pertanian" 
            target="_blank"
            className="inline-flex items-center justify-center px-4 py-2 bg-background border border-border text-white text-sm rounded-md hover:bg-card hover:border-primary/50 transition-colors"
          >
            Lihat Halaman Pertanian
          </Link>
        </div>
      </div>
    </div>
  );
}
