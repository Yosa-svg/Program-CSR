import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserX, 
  KeyRound, 
  Activity, 
  ShieldAlert,
  ShieldCheck,
  Clock
} from "lucide-react";
import { getAdministratorDashboardStats } from "@/lib/administratorService";
import { requireAdministratorAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdministratorDashboardPage() {
  await requireAdministratorAuth();
  const stats = await getAdministratorDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Administrator Dashboard</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Monitoring status sesi admin, integritas sistem, dan ringkasan log aktivitas CSR.
        </p>
      </div>

      {/* Admin Status Section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users size={16} className="text-primary" />
          Status Akun Admin
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Admin */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Total Admin
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-foreground">{stats.totalAdmin}</span>
              <p className="text-xs text-foreground/50 mt-1">Akun terdaftar dalam sistem</p>
            </div>
          </div>

          {/* 2. Online */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Admin Online
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.onlineAdmin}
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">Aktif &lt; 2 menit terakhir</p>
            </div>
          </div>

          {/* 3. Idle */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Admin Idle
              </span>
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <UserMinus size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.idleAdmin}
              </span>
              <p className="text-xs text-foreground/50 mt-1">2 - 10 menit tanpa aktivitas</p>
            </div>
          </div>

          {/* 4. Offline */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Admin Offline
              </span>
              <div className="w-9 h-9 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <UserX size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                {stats.offlineAdmin}
              </span>
              <p className="text-xs text-foreground/50 mt-1">&gt; 10 menit / sesi berakhir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session & Activity Stats Section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          Sesi & Aktivitas Sistem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 5. Active Sessions */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Active Sessions
              </span>
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <KeyRound size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.activeSessions}
              </span>
              <p className="text-xs text-foreground/50 mt-1">Sesi token aktif di database</p>
            </div>
          </div>

          {/* 6. Activity Today */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Activity Today
              </span>
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {stats.activityToday}
              </span>
              <p className="text-xs text-foreground/50 mt-1">Total log operasi hari ini</p>
            </div>
          </div>

          {/* 7. Failed Login Today */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Failed Login Today
              </span>
              <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.failedLoginToday}
              </span>
              <p className="text-xs text-foreground/50 mt-1">Percobaan login gagal hari ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Integrity Info Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Fondasi Keamanan Sistem Aktif</h3>
            <p className="text-sm text-foreground/70 mt-1">
              Sistem verifikasi sesi berlapis (JWT Signature + Database Active Session) dan SHA-256 token hashing berjalan aktif.
              Seluruh operasi administratif tercatat otomatis pada ActivityLog.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-foreground/60">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-primary" />
                Heartbeat Interval: 60 detik
              </span>
              <span className="flex items-center gap-1.5">
                <KeyRound size={14} className="text-secondary" />
                Session Token: SHA-256 Hashed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
