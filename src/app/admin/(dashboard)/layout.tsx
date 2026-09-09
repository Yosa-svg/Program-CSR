import Link from "next/link";
import Image from "next/image";
import { 
  Sprout, Settings,
  Layers, Box, ImageIcon, BarChart3, LayoutDashboard
} from "lucide-react";
import { getSession, getActiveSectorId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SectorSelector from "./SectorSelector";
import LogoutButton from "./LogoutButton";
import SessionHeartbeat from "./SessionHeartbeat";

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
    <div className="min-h-screen bg-muted-bg flex flex-col md:flex-row font-sans">
      <SessionHeartbeat />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-admin-sidebar border-r border-admin-sidebar-border flex flex-col text-white">
        <div className="p-5 border-b border-admin-sidebar-border">
          <Link href="/admin" className="flex flex-col gap-3 group">
            <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-center shadow-sm w-full group-hover:shadow-md transition-all">
              <Image
                src="/images/antam-logo.png"
                alt="Logo ANTAM"
                width={130}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </div>
            <div className="px-1">
              <span className="font-bold text-sm text-white uppercase tracking-wider block">
                Dashboard CSR
              </span>
              <span className="text-xs text-white/60 block font-normal mt-0.5">
                ANTAM UBPN Malut
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <LayoutDashboard size={18} className="text-primary" />
            Overview
          </Link>

          <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 mt-6 px-3">
            Data CSR
          </div>
          <Link href="/admin/program" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Layers size={18} className="text-primary" />
            Program
          </Link>
          <Link href="/admin/kegiatan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Sprout size={18} className="text-secondary" />
            Kegiatan
          </Link>
          <Link href="/admin/produk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <Box size={18} className="text-primary" />
            Produk
          </Link>
          <Link href="/admin/dokumentasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <ImageIcon size={18} className="text-secondary" />
            Dokumentasi
          </Link>
          <Link href="/admin/kinerja" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
            <BarChart3 size={18} className="text-primary" />
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

        <div className="p-4 border-t border-admin-sidebar-border">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-theme flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden bg-muted-bg text-foreground">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-foreground font-bold text-base">Dashboard CSR</h2>
            
            {/* Filter Sektor untuk Seluruh Admin CSR */}
            <SectorSelector sectors={sectors} activeSectorId={activeSectorId} allowAll={allowAll} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-foreground/70 font-medium">{session.name}</span>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                {session.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
