import Link from "next/link";
import { 
  Sprout, Store, Droplets, Lightbulb, Settings, LogOut,
  Layers, Box, ImageIcon, BarChart3, Star, LayoutDashboard
} from "lucide-react";
import { getSession, getActiveSectorId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SectorSelector from "./SectorSelector";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const activeSectorId = await getActiveSectorId();
  const sectors = await prisma.sector.findMany();
  const activeSector = sectors.find(s => s.id === activeSectorId);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#112316] border-r border-[#2a412f] flex flex-col text-white">
        <div className="p-6 border-b border-[#2a412f]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center text-[#a3c3aa] font-bold text-xs tracking-widest">
              KEB
            </div>
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              Dashboard
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-6 px-3">
            Data CSR
          </div>
          <Link href="/admin/program" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Layers size={18} />
            Program
          </Link>
          <Link href="/admin/kegiatan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Sprout size={18} />
            Kegiatan
          </Link>
          <Link href="/admin/produk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Box size={18} />
            Produk
          </Link>
          <Link href="/admin/dokumentasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <ImageIcon size={18} />
            Dokumentasi
          </Link>
          <Link href="/admin/kinerja" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <BarChart3 size={18} />
            Kinerja & Dampak
          </Link>
          <Link href="/admin/testimoni" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Star size={18} />
            Testimoni
          </Link>

          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-6 px-3">
            Sistem
          </div>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={18} />
            Pengaturan
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2a412f]">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-theme flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden bg-background text-foreground">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-foreground font-semibold">Dashboard CSR</h2>
            
            {/* Pemilihan Sektor untuk Admin Pusat / Super Admin */}
            {session.role !== "ADMIN_SEKTOR" ? (
              <SectorSelector sectors={sectors} activeSectorId={activeSectorId} />
            ) : (
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                Sektor Aktif: {activeSector?.name} 🔒
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-foreground/60">{session.name}</span>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                {session.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
