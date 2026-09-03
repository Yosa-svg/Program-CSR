import {
  FileText,
  Clock,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  PlusCircle,
  Edit3,
  Trash2,
  Activity
} from "lucide-react";
import { requireAdministratorAuth } from "@/lib/auth";
import {
  getActivityLogStats,
  getAdministratorActivityLogs,
  type ActivityLogQueryFilters
} from "@/lib/administratorService";
import ActivityLogsTableClient from "./ActivityLogsTableClient";

export const dynamic = "force-dynamic";

interface ActivityLogsPageProps {
  searchParams?: Promise<{
    search?: string;
    action?: string;
    entity?: string;
    date?: string;
    page?: string;
  }>;
}

export default async function AdministratorActivityLogsPage({
  searchParams,
}: ActivityLogsPageProps) {
  // 1. Authorization server-side guard
  await requireAdministratorAuth();

  // 2. Resolve URL query searchParams
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSearch = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const currentAction = typeof resolvedParams.action === "string" ? resolvedParams.action : "ALL";
  const currentEntity = typeof resolvedParams.entity === "string" ? resolvedParams.entity : "ALL";
  const currentDateRange = typeof resolvedParams.date === "string" ? resolvedParams.date : "all";
  const currentPage = typeof resolvedParams.page === "string" ? Math.max(1, parseInt(resolvedParams.page, 10) || 1) : 1;

  const filters: ActivityLogQueryFilters = {
    search: currentSearch,
    action: currentAction,
    entityType: currentEntity,
    dateRange: currentDateRange,
    page: currentPage,
    pageSize: 20,
  };

  // 3. Fetch statistics and paginated logs in parallel
  const [stats, logsResult] = await Promise.all([
    getActivityLogStats(),
    getAdministratorActivityLogs(filters),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Logs &amp; Audit Trail</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Rekaman audit komprehensif atas seluruh aktivitas autentikasi, lifecycle sesi, dan operasi CRUD administratif.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          Statistik Aktivitas Administratif
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {/* 1. Total Activity */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Total Log
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-foreground">{stats.totalActivity}</span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Semua entri log</p>
            </div>
          </div>

          {/* 2. Today Activity */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Hari Ini
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Clock size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.todayActivity}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Aktivitas hari ini</p>
            </div>
          </div>

          {/* 3. Login Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Login
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.loginCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Login sukses</p>
            </div>
          </div>

          {/* 4. Login Failed Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Login Gagal
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {stats.loginFailedCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Anomali / salah</p>
            </div>
          </div>

          {/* 5. Logout Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Logout
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <LogOut size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-slate-600 dark:text-slate-400">
                {stats.logoutCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Logout berhasil</p>
            </div>
          </div>

          {/* 6. Create Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Create
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <PlusCircle size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {stats.createCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Data dibuat</p>
            </div>
          </div>

          {/* 7. Update Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Update
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Edit3 size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {stats.updateCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Data diedit</p>
            </div>
          </div>

          {/* 8. Delete Count */}
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
                Delete
              </span>
              <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Trash2 size={15} />
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {stats.deleteCount}
              </span>
              <p className="text-[10px] text-foreground/50 mt-0.5">Data dihapus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4">
          Tabel Riwayat Aktivitas
        </h2>
        <ActivityLogsTableClient
          initialResult={logsResult}
          currentSearch={currentSearch}
          currentAction={currentAction}
          currentEntity={currentEntity}
          currentDateRange={currentDateRange}
        />
      </div>
    </div>
  );
}
