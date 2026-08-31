import Link from "next/link";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users2, 
  FileText, 
  ShieldCheck, 
  ArrowLeft 
} from "lucide-react";
import { requireAdministratorAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/admin/(dashboard)/LogoutButton";
import SessionHeartbeat from "@/app/admin/(dashboard)/SessionHeartbeat";

export default async function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdministratorAuth().catch(() => null);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted-bg flex flex-col md:flex-row font-sans">
      <SessionHeartbeat />

      {/* Administrator Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-white">
        <div className="p-6 border-b border-slate-800">
          <Link href="/administrator" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600/90 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm relative">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="font-bold text-sm text-white uppercase tracking-wider block">
                Administrator
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                System & Security Console
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Monitoring
          </div>
          <Link
            href="/administrator"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <LayoutDashboard size={18} className="text-red-500" />
            Dashboard
          </Link>
          <Link
            href="/administrator/sessions"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <Users2 size={18} className="text-amber-500" />
            Admin Sessions
          </Link>
          <Link
            href="/administrator/activity-logs"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <FileText size={18} className="text-blue-500" />
            Activity Logs
          </Link>
          <Link
            href="/administrator/security"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <ShieldCheck size={18} className="text-emerald-500" />
            Security
          </Link>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">
            Navigasi Cepat
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} className="text-slate-400" />
            Dashboard CSR
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-theme flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden bg-muted-bg text-foreground">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50">
              Console Mode
            </span>
            <h2 className="text-foreground font-bold text-base hidden sm:inline">
              Administrator System Console
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-right">
                <span className="text-foreground font-medium block leading-tight">
                  {session.name}
                </span>
                <span className="text-[11px] text-foreground/50 leading-tight">
                  {session.role}
                </span>
              </div>
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
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
