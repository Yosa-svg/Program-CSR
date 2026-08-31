"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Calendar,
  Monitor,
  Globe,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import type { ActivityLogItem } from "@/lib/administratorService";

type SecurityTableClientProps = {
  events: ActivityLogItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  currentSearch?: string;
  currentAction?: string;
  currentDateRange?: string;
};

export default function SecurityTableClient({
  events,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  currentSearch = "",
  currentAction = "ALL",
  currentDateRange = "all",
}: SecurityTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [selectedAction, setSelectedAction] = useState(currentAction);
  const [selectedDateRange, setSelectedDateRange] = useState(currentDateRange);

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<ActivityLogItem | null>(null);

  // Helper untuk update URL query params
  const applyFilters = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "ALL" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset ke halaman 1 jika filter berubah kecuali jika key yang diupdate adalah page
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`/administrator/security?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAction("ALL");
    setSelectedDateRange("all");
    startTransition(() => {
      router.push("/administrator/security");
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Helper badge warna aksi keamanan
  const getActionBadge = (action: string) => {
    switch (action) {
      case "LOGIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck size={12} />
            LOGIN
          </span>
        );
      case "LOGIN_FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <ShieldAlert size={12} />
            LOGIN_FAILED
          </span>
        );
      case "LOGOUT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <LogOut size={12} />
            LOGOUT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            {action}
          </span>
        );
    }
  };

  // Helper format tanggal & waktu
  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      full: d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      relative: getRelativeTime(d),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Baru saja";
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return `${diffDay} hari lalu`;
  };

  // Pagination bounds
  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Form Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <input
              type="text"
              placeholder="Cari admin, email, IP address, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Cari
            </button>
          </form>

          {/* Filter Dropdowns & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Event Aksi */}
            <div className="relative">
              <select
                aria-label="Filter Event Keamanan"
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                  applyFilters({ action: e.target.value });
                }}
                className="pl-3 pr-8 py-2 bg-background border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="ALL">Semua Event</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGIN_FAILED">LOGIN_FAILED</option>
                <option value="LOGOUT">LOGOUT</option>
              </select>
              <Filter
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
              />
            </div>

            {/* Filter Rentang Tanggal */}
            <div className="relative">
              <select
                aria-label="Filter Rentang Waktu"
                value={selectedDateRange}
                onChange={(e) => {
                  setSelectedDateRange(e.target.value);
                  applyFilters({ dateRange: e.target.value });
                }}
                className="pl-3 pr-8 py-2 bg-background border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="7days">7 Hari Terakhir</option>
                <option value="30days">30 Hari Terakhir</option>
              </select>
              <Calendar
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
              />
            </div>

            {/* Reset Button */}
            {(currentSearch || currentAction !== "ALL" || currentDateRange !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 bg-muted-bg hover:bg-muted-bg/80 text-foreground/70 rounded-lg text-xs font-medium transition-colors"
              >
                Reset
              </button>
            )}

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isPending}
              title="Refresh Data"
              className="p-2 bg-background border border-border hover:bg-muted-bg text-foreground/70 rounded-lg text-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isPending ? "animate-spin text-primary" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Security Events */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted-bg/60 border-b border-border text-foreground/60 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Admin / Target</th>
                <th className="py-3.5 px-4">Event Keamanan</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Perangkat</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-muted-bg flex items-center justify-center mx-auto text-foreground/40">
                        <Info size={20} />
                      </div>
                      <p className="font-medium text-foreground">Tidak ada event keamanan ditemukan</p>
                      <p className="text-xs text-foreground/60">
                        {currentSearch || currentAction !== "ALL" || currentDateRange !== "all"
                          ? "Coba ubah kata kunci pencarian atau sesuaikan opsi filter."
                          : "Belum ada catatan aktivitas keamanan di database."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const time = formatDateTime(event.createdAt);
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-muted-bg/30 transition-colors group"
                    >
                      {/* Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-foreground">{time.full}</div>
                        <div className="text-[11px] text-foreground/50">{time.relative}</div>
                      </td>

                      {/* Admin / Target */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs shrink-0">
                            {event.adminName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-foreground truncate max-w-[150px]">
                              {event.adminName}
                            </div>
                            <div className="text-[11px] text-foreground/50 truncate max-w-[150px]">
                              {event.adminEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Event Keamanan */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getActionBadge(event.action)}
                      </td>

                      {/* Deskripsi */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-xs text-foreground/90 font-medium truncate">
                          {event.description}
                        </div>
                        {event.entityTitle && (
                          <div className="text-[11px] text-foreground/50 truncate">
                            Target: {event.entityTitle}
                          </div>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-foreground/80 bg-muted-bg px-2 py-0.5 rounded border border-border/50">
                          {event.ipAddress || "Unknown IP"}
                        </span>
                      </td>

                      {/* Perangkat */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-foreground/70">
                        <div className="flex items-center gap-1.5">
                          <Monitor size={13} className="text-foreground/40 shrink-0" />
                          <span>{event.userAgentSummary}</span>
                        </div>
                      </td>

                      {/* Tombol Detail */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          title="Lihat Detail Event"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary hover:text-primary-foreground hover:bg-primary rounded-md transition-colors border border-primary/20 hover:border-primary"
                        >
                          <Eye size={12} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination Footer */}
        <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/70 bg-card">
          <div className="font-medium">
            Showing <span className="font-semibold text-foreground">{startRecord}</span> -{" "}
            <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount}</span> security events
            {totalPages > 1 && (
              <span className="ml-2 text-foreground/50">
                (Halaman {currentPage} dari {totalPages})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="pagination-prev"
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => applyFilters({ page: currentPage - 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-background border border-border hover:bg-muted-bg rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </button>
            <button
              data-testid="pagination-next"
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => applyFilters({ page: currentPage + 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-background border border-border hover:bg-muted-bg rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Security Event */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-card border border-border rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted-bg/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground">
                    Detail Event Keamanan
                  </h3>
                  <p className="text-xs text-foreground/50 font-mono">ID: {selectedEvent.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-muted-bg rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                  <span className="text-foreground/50 block mb-1">Waktu Kejadian</span>
                  <span className="font-medium text-foreground block">
                    {formatDateTime(selectedEvent.createdAt).full}
                  </span>
                  <span className="text-[11px] text-foreground/50">
                    ({formatDateTime(selectedEvent.createdAt).relative})
                  </span>
                </div>

                <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                  <span className="text-foreground/50 block mb-1">Aksi Keamanan</span>
                  <div>{getActionBadge(selectedEvent.action)}</div>
                </div>
              </div>

              <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                <span className="text-foreground/50 block mb-1">Admin / Akun Terkait</span>
                <div className="font-medium text-foreground">{selectedEvent.adminName}</div>
                <div className="text-foreground/60">{selectedEvent.adminEmail}</div>
                {selectedEvent.userId && (
                  <div className="text-[11px] font-mono text-foreground/40 mt-1">
                    User ID: {selectedEvent.userId}
                  </div>
                )}
              </div>

              <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                <span className="text-foreground/50 block mb-1">Deskripsi</span>
                <p className="text-foreground font-medium">{selectedEvent.description}</p>
                {selectedEvent.entityTitle && (
                  <p className="text-foreground/60 mt-1">Target: {selectedEvent.entityTitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                  <span className="text-foreground/50 flex items-center gap-1 mb-1">
                    <Globe size={12} />
                    IP Address
                  </span>
                  <span className="font-mono text-foreground font-medium">
                    {selectedEvent.ipAddress || "Unknown"}
                  </span>
                </div>

                <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                  <span className="text-foreground/50 flex items-center gap-1 mb-1">
                    <Monitor size={12} />
                    Ringkasan Perangkat
                  </span>
                  <span className="text-foreground font-medium">
                    {selectedEvent.userAgentSummary}
                  </span>
                </div>
              </div>

              {selectedEvent.userAgent && (
                <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                  <span className="text-foreground/50 block mb-1">Full User Agent</span>
                  <p className="font-mono text-[11px] text-foreground/70 break-all">
                    {selectedEvent.userAgent}
                  </p>
                </div>
              )}

              {/* Metadata Viewer (Sanitized) */}
              <div className="bg-muted-bg/40 p-3 rounded-xl border border-border/50">
                <span className="text-foreground/50 block mb-1 font-semibold">
                  Metadata Audit (Tersanitasi)
                </span>
                <pre className="font-mono text-[11px] bg-background/80 p-2.5 rounded-lg border border-border text-foreground/80 overflow-x-auto max-h-40">
                  {JSON.stringify(selectedEvent.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted-bg/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
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
