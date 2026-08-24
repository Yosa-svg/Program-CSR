import Link from "next/link";
import { 
  Sprout, Settings,
  Layers, Box, ImageIcon, BarChart3, LayoutDashboard
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

  const sectors = await prisma.sector.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  const activeSectorId = await getActiveSectorId();
  const allowAll = true;

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111E1D] border-r border-[#1D3331] flex flex-col text-white">
        <div className="p-6 border-b border-[#1D3331]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0D726D] rounded-lg flex items-center justify-center text-white font-bold text-xs tracking-widest shadow-sm relative overflow-hidden">
              <span>KEB</span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#F6A236] rounded-bl-md"></div>
            </div>
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              Dashboard CSR
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <LayoutDashboard size={18} className="text-[#0D726D]" />
            Overview
          </Link>

          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 mt-6 px-3">
            Data CSR
          </div>
          <Link href="/admin/program" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Layers size={18} className="text-[#0D726D]" />
            Program
          </Link>
          <Link href="/admin/kegiatan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Sprout size={18} className="text-[#F6A236]" />
            Kegiatan
          </Link>
          <Link href="/admin/produk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Box size={18} className="text-[#0D726D]" />
            Produk
          </Link>
          <Link href="/admin/dokumentasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <ImageIcon size={18} className="text-[#F6A236]" />
            Dokumentasi
          </Link>
          <Link href="/admin/kinerja" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <BarChart3 size={18} className="text-[#0D726D]" />
            Kinerja & Dampak
          </Link>

          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 mt-6 px-3">
            Sistem
          </div>
          <Link href="/admin/pengaturan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Settings size={18} className="text-white/60" />
            Pengaturan
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1D3331]">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-theme flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden bg-[#F7FAF9] text-[#172121]">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#E2E8E6] flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-[#172121] font-bold text-base">Dashboard CSR</h2>
            
            {/* Filter Sektor untuk Seluruh Admin CSR */}
            <SectorSelector sectors={sectors} activeSectorId={activeSectorId} allowAll={allowAll} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#172121]/70 font-medium">{session.name}</span>
              <div className="w-8 h-8 bg-[#0D726D] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
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
