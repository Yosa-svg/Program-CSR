import Link from "next/link";
import { LayoutDashboard, Leaf, Sprout, Store, Droplets, Lightbulb, Settings, LogOut } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | CSR App",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin/pertanian" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center text-accent font-bold text-xs tracking-widest">
              KEB
            </div>
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              Dashboard
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-4 px-3">
            Sektor CSR
          </div>
          <Link href="/admin/pertanian" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-accent font-medium transition-colors">
            <Sprout size={18} />
            Pertanian
          </Link>
          <Link href="/admin/umkm" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Store size={18} />
            UMKM
          </Link>
          <Link href="/admin/lingkungan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Droplets size={18} />
            Lingkungan
          </Link>
          <Link href="/admin/inovasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Lightbulb size={18} />
            Inovasi
          </Link>

          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 mt-8 px-3">
            Sistem
          </div>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={18} />
            Pengaturan
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h2 className="text-white font-medium">Pengelolaan Sektor Pertanian</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-white/70">
              A
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background p-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
