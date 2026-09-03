import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserX, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck 
} from "lucide-react";
import { requireAdministratorAuth, getCurrentAdminSession } from "@/lib/auth";
import { 
  getAdminSessionManagementStats, 
  getAdministratorSessionsPaged,
  type AdminSessionQueryFilters 
} from "@/lib/administratorService";
import SessionsTableClient from "./SessionsTableClient";

export const dynamic = "force-dynamic";

interface AdminSessionsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    session?: string;
    device?: string;
    date?: string;
    page?: string;
  }>;
}

export default async function AdminSessionsPage({ searchParams }: AdminSessionsPageProps) {
  // 1. Guard Autentikasi Server-Side
  await requireAdministratorAuth();

  const resolvedParams = await searchParams;
  const currentSession = await getCurrentAdminSession();

  const filters: AdminSessionQueryFilters = {
    search: resolvedParams.search,
    status: resolvedParams.status,
    sessionState: resolvedParams.session,
    deviceType: resolvedParams.device,
    dateRange: resolvedParams.date,
    page: resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1,
    pageSize: 20,
  };

  // 2. Ambil summary statistik dan daftar sesi secara paralel dari TiDB Cloud
  const [stats, pagedSessions] = await Promise.all([
    getAdminSessionManagementStats(),
    getAdministratorSessionsPaged(filters),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Session Monitoring</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Pemantauan status koneksi admin, perangkat aktif, IP address, dan riwayat lifecycle sesi secara real-time.
        </p>
      </div>

      {/* Summary Cards (6 Kartu Overview Sesi) */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Ringkasan Status Admin &amp; Sesi
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="session-overview-cards">
          {/* 1. Active Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Active Sesi
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound size={16} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.activeSessions}
              </span>
              <p className="text-[11px] text-foreground/50 mt-0.5">Lifecycle sesi aktif di DB</p>
            </div>
          </div>

          {/* 2. Online Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Online
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.onlineSessions}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-foreground/50 mt-0.5">&lt; 2 mnt aktif</p>
            </div>
          </div>

          {/* 3. Idle Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Idle
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <UserMinus size={16} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.idleSessions}
              </span>
              <p className="text-[11px] text-foreground/50 mt-0.5">2–10 mnt inaktif</p>
            </div>
          </div>

          {/* 4. Offline Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Offline
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <UserX size={16} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {stats.offlineSessions}
              </span>
              <p className="text-[11px] text-foreground/50 mt-0.5">Aktif di DB, tanpa heartbeat &gt; 10 mnt</p>
            </div>
          </div>

          {/* 5. Revoked Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Revoked
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert size={16} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {stats.revokedSessions}
              </span>
              <p className="text-[11px] text-foreground/50 mt-0.5">Sesi dicabut</p>
            </div>
          </div>

          {/* 6. Total Sessions */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Total Sesi
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground">
                {stats.totalSessions}
              </span>
              <p className="text-[11px] text-foreground/50 mt-0.5">Riwayat sesi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Monitoring Section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4">
          Tabel Sesi Administrator
        </h2>
        <SessionsTableClient 
          initialData={pagedSessions} 
          currentSessionId={currentSession?.id || null} 
        />
      </div>
    </div>
  );
}
