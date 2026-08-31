import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Activity,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { requireAdministratorAuth } from "@/lib/auth";
import {
  getAdministratorSecurityStats,
  getAdministratorSecurityEvents,
} from "@/lib/administratorService";
import SecurityTableClient from "./SecurityTableClient";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export default async function SecurityConsolePage({ searchParams }: PageProps) {
  // 1. Authorization Guard (Server-Side)
  await requireAdministratorAuth();

  // 2. Resolve Async searchParams
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSearch = resolvedParams.search || "";
  const currentAction = resolvedParams.action || "ALL";
  const currentDateRange = resolvedParams.dateRange || "all";
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = Number(resolvedParams.pageSize) || 20;

  // 3. Fetch Real Data Paralel
  const [securityStats, securityEventsResult] = await Promise.all([
    getAdministratorSecurityStats(),
    getAdministratorSecurityEvents({
      search: currentSearch,
      action: currentAction,
      dateRange: currentDateRange,
      page: currentPage,
      pageSize,
    }),
  ]);

  const { overview, comparison, suspiciousIps } = securityStats;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <ShieldCheck className="text-primary" size={26} />
            Security Console
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Pemantauan keamanan real-time, analisis percobaan login gagal, dan integritas session administrator.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Radio size={12} className="animate-pulse" />
            Live Security Monitoring
          </span>
        </div>
      </div>

      {/* 1. Security Overview — 7 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Card 1: Failed Login Today */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Failed Today</span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ShieldAlert size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600 mt-2">
            {overview.failedLoginToday}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Login gagal hari ini</span>
        </div>

        {/* Card 2: Failed Login 7 Days */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Failed 7 Hari</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-600 mt-2">
            {overview.failedLogin7Days}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Total gagal 7 hari</span>
        </div>

        {/* Card 3: Successful Login Today */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Login Today</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-2">
            {overview.successLoginToday}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Login berhasil hari ini</span>
        </div>

        {/* Card 4: Active Sessions */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Active Session</span>
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Activity size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-600 mt-2">
            {overview.activeSessions}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Sesi aktif berjalan</span>
        </div>

        {/* Card 5: Revoked Sessions */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Revoked</span>
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Lock size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-600 mt-2">
            {overview.revokedSessions}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Sesi telah dicabut</span>
        </div>

        {/* Card 6: Active Admins */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Active Admins</span>
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Users size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-cyan-600 mt-2">
            {overview.activeAdmins}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Online + Idle admin</span>
        </div>

        {/* Card 7: Total Security Events */}
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">Security Events</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={13} />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-600 mt-2">
            {overview.totalSecurityEvents}
          </div>
          <span className="text-[10px] text-foreground/40 mt-0.5 block">Total event audit</span>
        </div>
      </div>

      {/* 2. Login Security Statistics Comparison & Session Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison Section (2 Columns width on lg) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Statistik Autentikasi & Rasio Keamanan
              </h2>
              <p className="text-xs text-foreground/60 mt-0.5">
                Perbandingan login berhasil dan gagal dalam beberapa periode waktu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Today */}
            <div className="bg-muted-bg/40 border border-border/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Hari Ini</span>
                <span className="text-[11px] text-foreground/50">Today</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Berhasil
                  </span>
                  <span className="font-semibold text-foreground">{comparison.today.login}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <XCircle size={12} />
                    Gagal
                  </span>
                  <span className="font-semibold text-foreground">{comparison.today.failed}</span>
                </div>
              </div>
              {/* Ratio Bar */}
              <div className="h-2 w-full bg-border rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${
                      comparison.today.login + comparison.today.failed === 0
                        ? 100
                        : (comparison.today.login /
                            (comparison.today.login + comparison.today.failed)) *
                          100
                    }%`,
                  }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{
                    width: `${
                      comparison.today.login + comparison.today.failed === 0
                        ? 0
                        : (comparison.today.failed /
                            (comparison.today.login + comparison.today.failed)) *
                          100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Last 7 Days */}
            <div className="bg-muted-bg/40 border border-border/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">7 Hari Terakhir</span>
                <span className="text-[11px] text-foreground/50">Last 7 Days</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Berhasil
                  </span>
                  <span className="font-semibold text-foreground">{comparison.last7Days.login}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <XCircle size={12} />
                    Gagal
                  </span>
                  <span className="font-semibold text-foreground">{comparison.last7Days.failed}</span>
                </div>
              </div>
              {/* Ratio Bar */}
              <div className="h-2 w-full bg-border rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${
                      comparison.last7Days.login + comparison.last7Days.failed === 0
                        ? 100
                        : (comparison.last7Days.login /
                            (comparison.last7Days.login + comparison.last7Days.failed)) *
                          100
                    }%`,
                  }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{
                    width: `${
                      comparison.last7Days.login + comparison.last7Days.failed === 0
                        ? 0
                        : (comparison.last7Days.failed /
                            (comparison.last7Days.login + comparison.last7Days.failed)) *
                          100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Last 30 Days */}
            <div className="bg-muted-bg/40 border border-border/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">30 Hari Terakhir</span>
                <span className="text-[11px] text-foreground/50">Last 30 Days</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Berhasil
                  </span>
                  <span className="font-semibold text-foreground">{comparison.last30Days.login}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <XCircle size={12} />
                    Gagal
                  </span>
                  <span className="font-semibold text-foreground">{comparison.last30Days.failed}</span>
                </div>
              </div>
              {/* Ratio Bar */}
              <div className="h-2 w-full bg-border rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${
                      comparison.last30Days.login + comparison.last30Days.failed === 0
                        ? 100
                        : (comparison.last30Days.login /
                            (comparison.last30Days.login + comparison.last30Days.failed)) *
                          100
                    }%`,
                  }}
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{
                    width: `${
                      comparison.last30Days.login + comparison.last30Days.failed === 0
                        ? 0
                        : (comparison.last30Days.failed /
                            (comparison.last30Days.login + comparison.last30Days.failed)) *
                          100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Session Security Overview */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Session Security
              </h2>
              <p className="text-xs text-foreground/60 mt-0.5">Status aktivitas sesi admin</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted-bg/40 border border-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">Online Admins</span>
              </div>
              <span className="font-bold text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                {overview.onlineAdmins} admin
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted-bg/40 border border-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-foreground">Idle Admins</span>
              </div>
              <span className="font-bold text-xs text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                {overview.idleAdmins} admin
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted-bg/40 border border-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-foreground">Offline Admins</span>
              </div>
              <span className="font-bold text-xs text-foreground/70 bg-muted-bg px-2 py-0.5 rounded">
                {overview.offlineAdmins} admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Suspicious Login Activity */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Suspicious Activity Detection
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Pemantauan IP address dengan frekuensi percobaan login gagal tinggi.
            </p>
          </div>
        </div>

        {suspiciousIps.length === 0 ? (
          <div className="py-6 px-4 text-center rounded-xl bg-muted-bg/20 border border-border/40">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-xs font-medium text-foreground">No suspicious activity detected</p>
            <p className="text-[11px] text-foreground/50 mt-0.5">
              Tidak ada anomali atau akumulasi login gagal yang mencurigakan di database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suspiciousIps.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border bg-muted-bg/30 border-border/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Globe size={13} className="text-foreground/40" />
                    {item.ipAddress}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.status === "HIGH"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : item.status === "MODERATE"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {item.status} ({item.failedCount} Failed)
                  </span>
                </div>
                <div className="text-[11px] text-foreground/60 flex items-center gap-1">
                  <Clock size={11} className="text-foreground/40" />
                  Percobaan terakhir: {new Date(item.lastFailedAt).toLocaleTimeString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Security Events Table & Audit Trail */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            Security Events & Audit Log
          </h2>
          <p className="text-xs text-foreground/60 mt-0.5">
            Daftar kronologis event autentikasi (LOGIN, LOGIN_FAILED, LOGOUT) di sistem.
          </p>
        </div>

        <SecurityTableClient
          events={securityEventsResult.logs}
          totalCount={securityEventsResult.totalCount}
          currentPage={securityEventsResult.page}
          pageSize={securityEventsResult.pageSize}
          totalPages={securityEventsResult.totalPages}
          currentSearch={currentSearch}
          currentAction={currentAction}
          currentDateRange={currentDateRange}
        />
      </div>
    </div>
  );
}
