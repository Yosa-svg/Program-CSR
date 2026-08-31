"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Users, 
  Monitor, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  Search, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Wifi, 
  Filter,
  Eye,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Calendar,
  Layers
} from "lucide-react";
import type { AdminSessionItem, AdminSessionsPagedResult } from "@/lib/administratorService";
import { revokeAdminSessionAction } from "@/actions/sessionActions";

interface SessionsTableClientProps {
  initialData: AdminSessionsPagedResult;
  currentSessionId: string | null;
}

export default function SessionsTableClient({ initialData, currentSessionId }: SessionsTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search and filter states from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const statusFilter = searchParams.get("status") || "ALL";
  const stateFilter = searchParams.get("session") || "ALL";
  const deviceFilter = searchParams.get("device") || "ALL";
  const dateFilter = searchParams.get("date") || "all";

  // Detail Modal State
  const [selectedSession, setSelectedSession] = useState<AdminSessionItem | null>(null);

  // Revoke Confirmation Modal State
  const [revokeTarget, setRevokeTarget] = useState<AdminSessionItem | null>(null);
  const [revokeReason, setRevokeReason] = useState("Administrator revoked session");
  const [isRevoking, setIsRevoking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function updateQuery(params: Record<string, string | null>) {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, val]) => {
      if (val === null || val === "" || val === "ALL" || val === "all") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`/administrator/sessions?${current.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({ search: searchQuery.trim(), page: "1" });
  }

  function handleResetFilters() {
    setSearchQuery("");
    startTransition(() => {
      router.push("/administrator/sessions");
    });
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > initialData.totalPages) return;
    updateQuery({ page: newPage.toString() });
  }

  async function handleConfirmRevoke() {
    if (!revokeTarget) return;
    setIsRevoking(true);
    setFeedback(null);

    try {
      const res = await revokeAdminSessionAction(revokeTarget.id, revokeReason);
      if (res.error) {
        setFeedback({ type: "error", message: res.error });
      } else {
        setFeedback({ type: "success", message: res.message || "Session berhasil dicabut." });
        setRevokeTarget(null);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Gagal mencabut sesi" });
    } finally {
      setIsRevoking(false);
    }
  }

  function getDeviceIcon(deviceType: string) {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return <Smartphone size={15} className="text-amber-500 shrink-0" />;
      case "tablet":
        return <Tablet size={15} className="text-purple-500 shrink-0" />;
      case "desktop":
      default:
        return <Monitor size={15} className="text-blue-500 shrink-0" />;
    }
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

  function formatDuration(createdAt: Date | string, endedAt?: Date | string | null): string {
    const start = new Date(createdAt).getTime();
    const end = endedAt ? new Date(endedAt).getTime() : Date.now();
    const diffMs = Math.max(0, end - start);

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}h ${hours % 24}j`;
    if (hours > 0) return `${hours}j ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}d`;
    return `${seconds}d`;
  }

  const { sessions, totalCount, page, pageSize, totalPages } = initialData;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="space-y-4">
      {/* Alert Feedback Banner */}
      {feedback && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            feedback.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
          }`}
          data-testid="session-feedback-alert"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {feedback.type === "success" ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Cari admin, email, IP address, perangkat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-24 py-2 text-sm bg-muted-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/40"
              data-testid="session-search-input"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Cari
            </button>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Filter size={14} className="text-foreground/50" />
              <select
                value={statusFilter}
                onChange={(e) => updateQuery({ status: e.target.value, page: "1" })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Status Aktivitas"
                data-testid="filter-status"
              >
                <option value="ALL">Semua Status</option>
                <option value="ONLINE">Online</option>
                <option value="IDLE">Idle</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>

            {/* Session State Filter */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Layers size={14} className="text-foreground/50" />
              <select
                value={stateFilter}
                onChange={(e) => updateQuery({ session: e.target.value, page: "1" })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Keaktifan Sesi"
                data-testid="filter-session-state"
              >
                <option value="ALL">Semua Sesi</option>
                <option value="ACTIVE">Active</option>
                <option value="ENDED">Ended</option>
                <option value="REVOKED">Revoked</option>
              </select>
            </div>

            {/* Device Filter */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <select
                value={deviceFilter}
                onChange={(e) => updateQuery({ device: e.target.value, page: "1" })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Perangkat"
                data-testid="filter-device"
              >
                <option value="ALL">Semua Perangkat</option>
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 bg-muted-bg border border-border rounded-lg px-2.5 py-1.5">
              <Calendar size={14} className="text-foreground/50" />
              <select
                value={dateFilter}
                onChange={(e) => updateQuery({ date: e.target.value, page: "1" })}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter Rentang Waktu"
                data-testid="filter-date"
              >
                <option value="all">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="7days">7 Hari Terakhir</option>
                <option value="30days">30 Hari Terakhir</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(searchQuery || statusFilter !== "ALL" || stateFilter !== "ALL" || deviceFilter !== "ALL" || dateFilter !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground bg-muted-bg hover:bg-muted-bg/80 border border-border rounded-lg transition-colors"
                title="Reset Semua Filter"
              >
                Reset
              </button>
            )}

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => startTransition(() => router.refresh())}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-card border border-border hover:bg-muted-bg text-foreground rounded-lg transition-colors disabled:opacity-50"
              title="Perbarui Data Sesi"
            >
              <RefreshCw size={14} className={isPending ? "animate-spin text-primary" : "text-foreground/60"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sessions Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" data-testid="sessions-table">
            <thead className="bg-muted-bg/60 border-b border-border text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Login Time</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Session State</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <Users size={36} className="text-foreground/30 mb-2" />
                      <p className="font-medium text-sm">Tidak ada session ditemukan.</p>
                      <p className="text-xs text-foreground/40 mt-1">
                        {searchQuery || statusFilter !== "ALL" || stateFilter !== "ALL" || deviceFilter !== "ALL"
                          ? "Coba ubah filter atau kata kunci pencarian Anda."
                          : "Belum ada sesi admin yang tercatat di database."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const isCurrent = currentSessionId === session.id;
                  const canRevoke = session.isActive && !session.isRevoked && !isCurrent;

                  return (
                    <tr 
                      key={session.id} 
                      className="hover:bg-muted-bg/40 transition-colors"
                      data-testid={`session-row-${session.id}`}
                    >
                      {/* Admin Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {session.adminName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground block text-sm leading-tight">
                                {session.adminName}
                              </span>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/15 text-primary border border-primary/20">
                                  <Lock size={10} /> Sesi Ini
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-foreground/50 leading-tight">
                              {session.adminEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Indicator */}
                      <td className="py-3.5 px-4">
                        {session.status === "ONLINE" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ONLINE
                          </span>
                        )}
                        {session.status === "IDLE" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                            IDLE
                          </span>
                        )}
                        {session.status === "OFFLINE" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                            OFFLINE
                          </span>
                        )}
                      </td>

                      {/* Device & UA */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.deviceType)}
                          <div>
                            <span className="font-medium text-foreground text-xs block">
                              {session.deviceType}
                            </span>
                            <span className="text-[11px] text-foreground/50 block truncate max-w-[130px]" title={session.userAgent || ""}>
                              {session.userAgentSummary}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs text-foreground/70 bg-muted-bg px-2 py-0.5 rounded border border-border/60">
                          {session.ipAddress || "127.0.0.1"}
                        </span>
                      </td>

                      {/* Login Time */}
                      <td className="py-3.5 px-4 text-xs text-foreground/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-foreground/40 shrink-0" />
                          <span>{formatDate(session.createdAt)}</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-xs text-foreground/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-foreground/40 shrink-0" />
                          <span>{formatDate(session.lastActiveAt)}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-xs text-foreground/70 whitespace-nowrap font-medium">
                        {formatDuration(session.createdAt, session.endedAt)}
                      </td>

                      {/* Session State */}
                      <td className="py-3.5 px-4">
                        {session.sessionState === "Active" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <ShieldCheck size={12} />
                            Active
                          </span>
                        )}
                        {session.sessionState === "Ended" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                            Ended
                          </span>
                        )}
                        {session.sessionState === "Revoked" && (
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                            title={session.revokedReason ? `Alasan: ${session.revokedReason}` : "Dicabut"}
                          >
                            <ShieldAlert size={12} />
                            Revoked
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSession(session)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-foreground/80 bg-muted-bg hover:bg-muted-bg/80 border border-border rounded-lg transition-colors"
                            data-testid={`session-detail-btn-${session.id}`}
                          >
                            <Eye size={12} />
                            Detail
                          </button>

                          {canRevoke && (
                            <button
                              onClick={() => {
                                setRevokeTarget(session);
                                setRevokeReason("Administrator revoked session");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                              data-testid={`session-revoke-btn-${session.id}`}
                            >
                              <ShieldAlert size={12} />
                              Revoke
                            </button>
                          )}

                          {isCurrent && (
                            <span 
                              className="text-[11px] font-medium text-foreground/40 italic px-1 cursor-default"
                              title="Current session cannot be revoked from this console."
                            >
                              Dilindungi
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="py-3.5 px-4 bg-muted-bg/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <div>
            <span>
              Showing <strong className="text-foreground">{startItem}</strong> - <strong className="text-foreground">{endItem}</strong> of <strong className="text-foreground">{totalCount}</strong> sessions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-foreground/50">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isPending}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
                data-testid="pagination-prev"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isPending}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
                data-testid="pagination-next"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
            data-testid="session-detail-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  Detail Sesi Administrator
                </h3>
                <p className="text-xs text-foreground/50 font-mono mt-0.5">
                  ID: {selectedSession.id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-muted-bg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Nama Admin</span>
                <span className="font-semibold text-foreground text-sm">{selectedSession.adminName}</span>
              </div>
              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Email Admin</span>
                <span className="font-semibold text-foreground text-sm">{selectedSession.adminEmail}</span>
              </div>

              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Perangkat</span>
                <span className="font-medium text-foreground">{selectedSession.deviceType} ({selectedSession.userAgentSummary})</span>
              </div>
              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">IP Address</span>
                <span className="font-mono text-foreground font-semibold">{selectedSession.ipAddress || "127.0.0.1"}</span>
              </div>

              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Waktu Login (Created)</span>
                <span className="text-foreground">{formatDate(selectedSession.createdAt)}</span>
              </div>
              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Aktivitas Terakhir</span>
                <span className="text-foreground">{formatDate(selectedSession.lastActiveAt)}</span>
              </div>

              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Status Aktivitas</span>
                <span className="font-bold text-foreground">{selectedSession.status}</span>
              </div>
              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50">
                <span className="text-foreground/50 block mb-1">Session State</span>
                <span className="font-bold text-foreground">{selectedSession.sessionState}</span>
              </div>

              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50 col-span-2">
                <span className="text-foreground/50 block mb-1">Durasi Sesi</span>
                <span className="font-medium text-foreground">{formatDuration(selectedSession.createdAt, selectedSession.endedAt)}</span>
              </div>

              {selectedSession.isRevoked && (
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 col-span-2">
                  <span className="text-red-600 dark:text-red-400 font-semibold block mb-1">Informasi Pencabutan Sesi</span>
                  <p className="text-xs text-foreground/80">Waktu Dicabut: {formatDate(selectedSession.revokedAt)}</p>
                  <p className="text-xs text-foreground/80 mt-0.5">Alasan: {selectedSession.revokedReason || "Administrator revoked session"}</p>
                </div>
              )}

              {selectedSession.endedAt && !selectedSession.isRevoked && (
                <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50 col-span-2">
                  <span className="text-foreground/50 block mb-1">Waktu Sesi Berakhir (Logout)</span>
                  <span className="text-foreground">{formatDate(selectedSession.endedAt)}</span>
                </div>
              )}

              <div className="bg-muted-bg/50 p-3 rounded-lg border border-border/50 col-span-2">
                <span className="text-foreground/50 block mb-1">User Agent Lengkap</span>
                <p className="font-mono text-[11px] text-foreground/70 break-all">{selectedSession.userAgent || "-"}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 text-xs font-semibold bg-muted-bg hover:bg-muted-bg/80 text-foreground rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Revoke Confirmation Dialog */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150" data-testid="revoke-confirm-modal">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Cabut Sesi Administrator?
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Sesi ini akan langsung dihentikan dan akses admin terkait akan dicabut.
                </p>
              </div>
            </div>

            {/* Target Information */}
            <div className="bg-muted-bg/50 border border-border/60 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground/50">Admin Target:</span>
                <span className="font-semibold text-foreground">{revokeTarget.adminName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Email:</span>
                <span className="font-mono text-foreground">{revokeTarget.adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Perangkat:</span>
                <span className="text-foreground">{revokeTarget.deviceType} ({revokeTarget.userAgentSummary})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">IP Address:</span>
                <span className="font-mono text-foreground">{revokeTarget.ipAddress || "127.0.0.1"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Aktif Terakhir:</span>
                <span className="text-foreground">{formatDate(revokeTarget.lastActiveAt)}</span>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70 block">
                Alasan Pencabutan (Opsional):
              </label>
              <input
                type="text"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Contoh: Administrator revoked session"
                className="w-full px-3 py-2 text-xs bg-muted-bg border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                disabled={isRevoking}
                className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground bg-muted-bg hover:bg-muted-bg/80 rounded-lg transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={isRevoking}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                data-testid="confirm-revoke-btn"
              >
                {isRevoking ? <RefreshCw size={13} className="animate-spin" /> : <ShieldAlert size={13} />}
                <span>{isRevoking ? "Mencabut Sesi..." : "Cabut Sesi"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
