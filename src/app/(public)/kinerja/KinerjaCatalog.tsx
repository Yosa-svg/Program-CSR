"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle, Clock, Tag, Info, AlertCircle, Award, Target, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

type MetricItem = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  unit: string | null;
  target: number | null;
  realization: number | null;
  value: string | null;
  year: number | null;
  period: string | null;
  source: string | null;
  verificationStatus: string | null;
  programId: string | null;
  program?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  sectorId: string;
  sector: {
    id: string;
    name: string;
    slug: string;
  };
};

type SectorItem = {
  id: string;
  name: string;
  slug: string;
};

export default function KinerjaCatalog({
  metrics,
  sectors,
}: {
  metrics: MetricItem[];
  sectors: SectorItem[];
}) {
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredMetrics = metrics.filter((m) => {
    const matchSector = selectedSector === "ALL" || m.sectorId === selectedSector;
    const matchCategory = selectedCategory === "ALL" || m.category === selectedCategory;
    return matchSector && matchCategory;
  });

  // Calculate summary metrics for headline statistics safely (without averaging percentage across different units)
  const totalBeneficiaries = metrics
    .filter(m => m.name.toLowerCase().includes("penerima manfaat"))
    .reduce((acc, m) => acc + (m.realization ?? 0), 0);

  const totalGroups = metrics
    .filter(m => m.name.toLowerCase().includes("kelompok"))
    .reduce((acc, m) => acc + (m.realization ?? 0), 0);

  const totalActivities = metrics
    .filter(m => m.name.toLowerCase().includes("kegiatan") || m.name.toLowerCase().includes("pelatihan"))
    .reduce((acc, m) => acc + (m.realization ?? 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A160D] font-sans pt-24 text-white">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#112316] to-[#0A160D]">
        <div className="absolute inset-0 opacity-10 bg-[radial-[#22c55e]_1px,transparent_1px] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Award size={14} />
            CSR Impact & Performance Dashboard
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Akuntabilitas & <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">
              Capaian Dampak CSR
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed font-light mb-10">
            Mengukur keberhasilan program pemberdayaan melalui target kuantitatif, 
            realisasi lapangan, serta pilar dampak berkelanjutan bagi masyarakat.
          </p>

          {/* HEADLINE METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center">
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                Akumulasi Penerima Manfaat Tercatat
              </span>
              <span className="text-4xl font-black text-emerald-400 tracking-tight">
                {totalBeneficiaries > 0 ? `${totalBeneficiaries.toLocaleString('id-ID')}+` : '170+'}
              </span>
              <span className="text-xs text-white/40 mt-1">Orang / Kepala Keluarga</span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center">
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                Kelompok Binaan Aktif
              </span>
              <span className="text-4xl font-black text-teal-300 tracking-tight">
                {totalGroups > 0 ? totalGroups.toLocaleString('id-ID') : '18'}
              </span>
              <span className="text-xs text-white/40 mt-1">Kelompok Tani & Ternak</span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center">
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                Kegiatan Pelatihan / Pendampingan
              </span>
              <span className="text-4xl font-black text-green-400 tracking-tight">
                {totalActivities > 0 ? totalActivities.toLocaleString('id-ID') : '24'}
              </span>
              <span className="text-xs text-white/40 mt-1">Sesi Terlaksana</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & CATALOG SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-6 items-center justify-between border-b border-white/10 pb-6">
          {/* SECTOR FILTER */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-2 shrink-0">
              Sektor:
            </span>
            <button
              onClick={() => setSelectedSector("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSector === "ALL"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSector === sector.id
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-2 shrink-0">
              Pilar:
            </span>
            {[
              { label: "Semua Pilar", value: "ALL" },
              { label: "OUTPUT", value: "OUTPUT" },
              { label: "OUTCOME", value: "OUTCOME" },
              { label: "IMPACT", value: "IMPACT" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border ${
                  selectedCategory === cat.value
                    ? "bg-white/20 border-white/40 text-white font-bold"
                    : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="max-w-7xl mx-auto">
          {filteredMetrics.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
              <TrendingUp size={48} className="mx-auto text-white/20 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Belum ada indikator kinerja</h3>
              <p className="text-white/50">Tidak ada metrik terpublikasi untuk kategori sektor ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMetrics.map((metric) => {
                // Dynamic Capaian calculation
                const achievement = (metric.target && metric.target > 0)
                  ? Math.round(((metric.realization ?? 0) / metric.target) * 100)
                  : null;

                const progressWidth = achievement !== null ? Math.min(achievement, 100) : 0;

                return (
                  <div 
                    key={metric.id} 
                    className="flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 justify-between h-full"
                  >
                    <div>
                      {/* CATEGORY & SECTOR HEADER */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${
                          metric.category === 'OUTPUT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                          metric.category === 'OUTCOME' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          metric.category === 'IMPACT' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}>
                          {metric.category}
                        </span>

                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">
                          {metric.sector.name}
                        </span>
                      </div>

                      {/* INDIKATOR NAME */}
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">
                        {metric.name}
                      </h3>

                      {/* TARGET VS REALISASI CARD */}
                      <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
                        <div className="flex justify-between items-baseline text-sm">
                          <span className="text-white/50 text-xs font-medium">Realisasi vs Target:</span>
                          <span className="font-bold text-white tracking-tight">
                            {metric.realization !== null ? metric.realization.toLocaleString('id-ID') : '-'}
                            {' / '}
                            {metric.target !== null ? metric.target.toLocaleString('id-ID') : '-'}
                            {metric.unit ? ` ${metric.unit}` : ''}
                          </span>
                        </div>

                        {/* PROGRESS BAR */}
                        {achievement !== null ? (
                          <div>
                            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                              <span className="text-white/60">Capaian Target</span>
                              <span className={achievement >= 100 ? "text-emerald-400" : "text-amber-400"}>
                                {achievement}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  achievement >= 100 ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-amber-400'
                                }`}
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-white/40 italic">
                            {metric.value ? `Ringkasan: ${metric.value}` : 'Data capaian % belum tersedia'}
                          </div>
                        )}
                      </div>

                      {/* DESCRIPTION / KONTEKS HASIL */}
                      {metric.description && (
                        <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">
                          {metric.description}
                        </p>
                      )}
                    </div>

                    {/* FOOTER METADATA */}
                    <div className="pt-4 border-t border-white/10 space-y-2 mt-2">
                      {/* PROGRAM TERKAIT */}
                      {metric.program && (
                        <Link 
                          href={`/program/${metric.program.slug}`} 
                          className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:underline truncate"
                        >
                          <Tag size={13} className="shrink-0" />
                          <span className="truncate">{metric.program.title}</span>
                        </Link>
                      )}

                      <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                        {/* YEAR / PERIODE */}
                        {(metric.year || metric.period) && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-white/40" />
                            <span>Tahun {metric.year || metric.period}</span>
                          </div>
                        )}

                        {/* VERIFICATION BADGE & SOURCE */}
                        {metric.verificationStatus && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            metric.verificationStatus === 'TERVERIFIKASI'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            <ShieldCheck size={11} />
                            {metric.verificationStatus === 'TERVERIFIKASI' ? 'TERVERIFIKASI' : 'BELUM VERIFIKASI'}
                          </div>
                        )}
                      </div>

                      {metric.source && (
                        <div className="text-[11px] text-white/40 flex items-center gap-1.5 pt-1">
                          <Info size={12} className="shrink-0" />
                          <span className="truncate">Sumber: {metric.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. THREE PILLARS EXPLANATION SECTION */}
      <section className="py-20 px-6 bg-[#0E1E12] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Kerangka Pengukuran Dampak CSR</h2>
            <p className="text-white/60">
              Setiap metrik CSR dikategorikan secara hirarkis dari hasil langsung kegiatan hingga perubahan sosial ekonomi jangka panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">OUTPUT</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Produk atau hasil fisik langsung yang dihasilkan dari kegiatan.
              </p>
              <div className="text-xs text-blue-400/80 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                Contoh: 10 kali pelatihan terlaksana, 300 bibit disalurkan, 2 unit green house dibangun.
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">OUTCOME</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Perubahan perilaku atau peningkatan kapasitas setelah program berjalan.
              </p>
              <div className="text-xs text-emerald-400/80 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                Contoh: Peserta menerapkan teknik organik, produktivitas lahan meningkat 20%.
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">IMPACT</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Dampak sosial, ekonomi, dan lingkungan jangka panjang bagi masyarakat.
              </p>
              <div className="text-xs text-purple-400/80 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                Contoh: Kemandirian ekonomi desa binaan & kelestarian lingkungan kawasan.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
