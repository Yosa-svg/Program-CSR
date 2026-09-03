"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  RefreshCw,
  Clock,
  FileText,
  User,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Edit3,
  Trash2,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Calendar,
  Layers,
  Code
} from "lucide-react";
import type { ActivityLogItem, ActivityLogsResult } from "@/lib/administratorService";

interface ActivityLogsTableClientProps {
  initialResult: ActivityLogsResult;
  currentSearch: string;
  currentAction: string;
  currentEntity: string;
  currentDateRange: string;
}

export default function ActivityLogsTableClient({
  initialResult,
  currentSearch,
  currentAction,
  currentEntity,
  currentDateRange,
}: ActivityLogsTableClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  // Update query params in URL
  function applyFilters(updates: Record<string, string | number>) {
    const params = new URLSearchParams(searchParams?.toString() || "");

    for (const [key, value] of Object.entries(updates)) {
      if (value === "" || value === "ALL" || value === "all" || (key === "page" && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    // Jika filter diubah (bukan perpindahan halaman), reset page ke 1
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters({ search: searchInput.trim() });
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffSeconds < 60) return "Baru saja";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} mnt lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} hari lalu`;
    return formatDate(date);
  }

  function getActionBadge(action: string) {
    switch (action) {
      case "LOGIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <LogIn size={12} />
            LOGIN
          </span>
        );
      case "LOGIN_FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert size={12} />
            LOGIN_FAILED
          </span>
        );
      case "LOGOUT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <LogOut size={12} />
            LOGOUT
          </span>
        );
      case "CREATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <PlusCircle size={12} />
            CREATE
          </span>
        );
      case "UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Edit3 size={12} />
            UPDATE
          </span>
        );
      case "DELETE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Trash2 size={12} />
            DELETE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted-bg text-foreground/70 border border-border">
            {action}
          </span>
        );
    }
  }

  function getEntityBadge(entityType: string) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted-bg text-foreground/70 border border-border">
        {entityType}
      </span>
    );
  }

  const { logs, totalCount, page, pageSize, totalPages } = initialResult;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Cari nama admin, email, deskripsi, entitas, IP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-sm bg-muted-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/40"
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Cari
            </button>
          </form>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Action */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Filter size={14} className="text-foreground/50" />
              <select
                value={currentAction}
                onChange={(e) => applyFilters({ action: e.target.value })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Aksi"
              >
                <option value="ALL">Semua Aksi</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGIN_FAILED">LOGIN_FAILED</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            {/* Filter Entity */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Layers size={14} className="text-foreground/50" />
              <select
                value={currentEntity}
                onChange={(e) => applyFilters({ entity: e.target.value })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Entitas"
              >
                <option value="ALL">Semua Entitas</option>
                <option value="AUTH">AUTH</option>
                <option value="PROGRAM">PROGRAM</option>
                <option value="ACTIVITY">ACTIVITY</option>
                <option value="PRODUCT">PRODUCT</option>
                <option value="DOCUMENTATION">DOCUMENTATION</option>
                <option value="METRIC">METRIC</option>
                <option value="SECTOR">SECTOR</option>
                <option value="SETTINGS">SETTINGS</option>
              </select>
            </div>

            {/* Filter Date Range */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Calendar size={14} className="text-foreground/50" />
              <select
                value={currentDateRange}
                onChange={(e) => applyFilters({ date: e.target.value })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Rentang Waktu"
              >
                <option value="all">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="7days">7 Hari Terakhir</option>
                <option value="30days">30 Hari Terakhir</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-card border border-border hover:bg-muted-bg text-foreground rounded-lg transition-colors disabled:opacity-50"
              title="Perbarui Data Log"
            >
              <RefreshCw size={14} className={isPending ? "animate-spin text-primary" : "text-foreground/60"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" data-testid="activity-logs-table">
            <thead className="bg-muted-bg/60 border-b border-border text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Aksi</th>
                <th className="py-3.5 px-4">Entitas</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4">IP Address &amp; Device</th>
                <th className="py-3.5 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <FileText size={36} className="text-foreground/30 mb-2" />
                      <p className="font-medium text-sm">
                        {currentSearch || currentAction !== "ALL" || currentEntity !== "ALL" || currentDateRange !== "all"
                          ? "Tidak ada aktivitas yang sesuai dengan filter."
                          : "Tidak ada aktivitas ditemukan."}
                      </p>
                      <p className="text-xs text-foreground/40 mt-1">
                        {currentSearch || currentAction !== "ALL" || currentEntity !== "ALL" || currentDateRange !== "all"
                          ? "Coba ubah kata kunci pencarian atau sesuaikan opsi filter Anda."
                          : "Belum ada riwayat aktivitas administratif yang tercatat di database."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted-bg/40 transition-colors"
                      data-testid={`activity-row-${log.id}`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-xs text-foreground/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-foreground/40 shrink-0" />
                          <div>
                            <span className="block font-medium text-foreground text-xs">
                              {formatDate(log.createdAt)}
                            </span>
                            <span className="text-[11px] text-foreground/50">
                              {formatRelativeTime(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Admin User */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {log.adminName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block text-xs leading-tight">
                              {log.adminName}
                            </span>
                            <span className="text-[11px] text-foreground/50 leading-tight">
                              {log.adminEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div>{getEntityBadge(log.entityType)}</div>
                          {log.entityTitle && (
                            <span className="text-xs text-foreground/80 font-medium block truncate max-w-[160px]" title={log.entityTitle}>
                              {log.entityTitle}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-xs text-foreground/80 max-w-[240px]">
                        <span className="line-clamp-2" title={log.description}>
                          {log.description}
                        </span>
                      </td>

                      {/* IP & Device */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs text-foreground/70 bg-muted-bg px-2 py-0.5 rounded border border-border/60 block w-fit">
                            {log.ipAddress || "-"}
                          </span>
                          <span className="text-[11px] text-foreground/50 block truncate max-w-[140px]" title={log.userAgent || ""}>
                            {log.userAgentSummary}
                          </span>
                        </div>
                      </td>

                      {/* Detail Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-card border border-border hover:bg-muted-bg text-foreground rounded-lg transition-colors"
                          title="Lihat Detail Log"
                          data-testid={`btn-detail-${log.id}`}
                        >
                          <Eye size={13} className="text-primary" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer Controls */}
        <div className="py-3.5 px-4 bg-muted-bg/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <div>
            Showing <span className="font-semibold text-foreground">{startItem}</span> -{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount}</span> aktivitas
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => applyFilters({ page: page - 1 })}
              disabled={page <= 1 || isPending}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              aria-label="Halaman Sebelumnya"
              data-testid="pagination-prev"
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </button>

            <span className="px-2 font-medium text-foreground text-xs">
              Halaman {page} dari {totalPages}
            </span>

            <button
              onClick={() => applyFilters({ page: page + 1 })}
              disabled={page >= totalPages || isPending}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              aria-label="Halaman Selanjutnya"
              data-testid="pagination-next"
            >
              Selanjutnya
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="py-4 px-6 border-b border-border flex items-center justify-between bg-muted-bg/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Detail Log Aktivitas</h3>
                  <p className="text-xs text-foreground/50 font-mono">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-muted-bg transition-colors"
                title="Tutup Detail"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              {/* Top Overview Grid */}
              <div className="grid grid-cols-2 gap-4 bg-muted-bg/30 p-4 rounded-xl border border-border/60">
                <div>
                  <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block">
                    Waktu Kejadian
                  </span>
                  <span className="font-medium text-foreground text-xs mt-0.5 block">
                    {formatDate(selectedLog.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block">
                    Aksi &amp; Status
                  </span>
                  <div className="mt-0.5">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block">
                    Pelaku / Administrator
                  </span>
                  <span className="font-medium text-foreground text-xs mt-0.5 block">
                    {selectedLog.adminName} ({selectedLog.adminEmail})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block">
                    Entitas Target
                  </span>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {getEntityBadge(selectedLog.entityType)}
                    {selectedLog.entityTitle && (
                      <span className="text-xs text-foreground font-medium truncate">
                        {selectedLog.entityTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs font-semibold text-foreground/70 block mb-1">
                  Deskripsi Lengkap
                </span>
                <div className="p-3 bg-muted-bg/50 rounded-lg border border-border text-foreground text-xs leading-relaxed">
                  {selectedLog.description}
                </div>
              </div>

              {/* Client Network & Device */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-foreground/70 block mb-1">
                    IP Address
                  </span>
                  <div className="p-2.5 bg-muted-bg/50 rounded-lg border border-border font-mono text-xs text-foreground">
                    {selectedLog.ipAddress || "-"}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground/70 block mb-1">
                    Device / Browser Summary
                  </span>
                  <div className="p-2.5 bg-muted-bg/50 rounded-lg border border-border text-xs text-foreground truncate">
                    {selectedLog.userAgentSummary}
                  </div>
                </div>
              </div>

              {/* User Agent Full */}
              {selectedLog.userAgent && (
                <div>
                  <span className="text-xs font-semibold text-foreground/70 block mb-1">
                    Raw User Agent
                  </span>
                  <div className="p-2.5 bg-muted-bg/40 rounded-lg border border-border text-[11px] font-mono text-foreground/70 break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}

              {/* Metadata JSON Viewer */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground/70 flex items-center gap-1">
                    <Code size={13} className="text-primary" />
                    Metadata Terformat (Sanitized JSON)
                  </span>
                </div>
                <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl border border-border/80 text-xs font-mono overflow-x-auto max-h-48 leading-relaxed">
                  {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0
                    ? JSON.stringify(selectedLog.metadata, null, 2)
                    : "// Tidak ada metadata tambahan"}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="py-3 px-6 border-t border-border bg-muted-bg/40 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
