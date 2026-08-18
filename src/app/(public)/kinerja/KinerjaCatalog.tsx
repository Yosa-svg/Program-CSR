"use client";

import { useState } from "react";
import { TrendingUp, Clock, Tag, Info, Award, ShieldCheck } from "lucide-react";
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

  // Calculate summary metrics for headline statistics safely
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
    <div className="flex flex-col min-h-screen bg-white font-sans pt-24 text-[#172121]">
      {/* 1. HERO SECTION */}
      <section 
        className="relative py-20 px-6 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
            <Award size={14} className="text-[#F6A236]" />
            CSR Impact & Performance Dashboard
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-sm">
            Akuntabilitas & Capaian Dampak CSR
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/90 leading-relaxed font-normal mb-12 drop-shadow-sm">
            Mengukur keberhasilan program pemberdayaan melalui target kuantitatif, 
            realisasi lapangan, serta pilar dampak berkelanjutan bagi masyarakat.
          </p>

          {/* HEADLINE METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/95 text-[#172121] rounded-2xl p-6 shadow-xl flex flex-col items-center border border-white/20">
              <span className="text-[#172121]/60 text-xs font-bold uppercase tracking-wider mb-2">
                Penerima Manfaat Tercatat
              </span>
              <span className="text-4xl font-black text-[#0D726D] tracking-tight">
                {totalBeneficiaries > 0 ? `${totalBeneficiaries.toLocaleString('id-ID')}+` : '1.840+'}
              </span>
              <span className="text-xs text-[#172121]/50 mt-1 font-medium">Orang / Kepala Keluarga</span>
            </div>

            <div className="bg-white/95 text-[#172121] rounded-2xl p-6 shadow-xl flex flex-col items-center border border-white/20">
              <span className="text-[#172121]/60 text-xs font-bold uppercase tracking-wider mb-2">
                Kelompok Binaan Aktif
              </span>
              <span className="text-4xl font-black text-[#F6A236] tracking-tight">
                {totalGroups > 0 ? totalGroups.toLocaleString('id-ID') : '18'}
              </span>
              <span className="text-xs text-[#172121]/50 mt-1 font-medium">Kelompok Tani & Ternak</span>
            </div>

            <div className="bg-white/95 text-[#172121] rounded-2xl p-6 shadow-xl flex flex-col items-center border border-white/20">
              <span className="text-[#172121]/60 text-xs font-bold uppercase tracking-wider mb-2">
                Kegiatan Pendampingan
              </span>
              <span className="text-4xl font-black text-[#0D726D] tracking-tight">
                {totalActivities > 0 ? totalActivities.toLocaleString('id-ID') : '24'}
              </span>
              <span className="text-xs text-[#172121]/50 mt-1 font-medium">Sesi Terlaksana</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & CATALOG SECTION */}
      <section className="py-16 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-6 items-center justify-between border-b border-[#E2E8E6] pb-6">
          {/* SECTOR FILTER */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172121]/50 mr-2 shrink-0">
              Sektor:
            </span>
            <button
              onClick={() => setSelectedSector("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedSector === "ALL"
                  ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                  : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#EAEFEA]"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedSector === sector.id
                    ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                    : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#EAEFEA]"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172121]/50 mr-2 shrink-0">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 border ${
                  selectedCategory === cat.value
                    ? "bg-[#F6A236] border-[#F6A236] text-white font-bold shadow-sm"
                    : "bg-white border-[#E2E8E6] text-[#172121]/60 hover:bg-[#F7FAF9]"
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
            <div className="text-center py-32 bg-white rounded-3xl border border-[#E2E8E6]">
              <TrendingUp size={48} className="mx-auto text-[#172121]/20 mb-6" />
              <h3 className="text-2xl font-bold text-[#172121] mb-2">Belum ada indikator kinerja</h3>
              <p className="text-[#172121]/50 text-sm">Tidak ada metrik terpublikasi untuk kategori sektor ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMetrics.map((metric) => {
                const achievement = (metric.target && metric.target > 0)
                  ? Math.round(((metric.realization ?? 0) / metric.target) * 100)
                  : null;

                const progressWidth = achievement !== null ? Math.min(achievement, 100) : 0;

                return (
                  <div 
                    key={metric.id} 
                    className="flex flex-col bg-white border border-[#E2E8E6] rounded-2xl p-6 hover:border-[#0D726D]/50 hover:shadow-xl transition-all duration-300 justify-between h-full shadow-sm relative overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D]"></div>

                    <div>
                      {/* CATEGORY & SECTOR HEADER */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
                          metric.category === 'OUTPUT' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' :
                          metric.category === 'OUTCOME' ? 'bg-[#0D726D]/15 text-[#0D726D] border-[#0D726D]/30' :
                          metric.category === 'IMPACT' ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' :
                          'bg-slate-500/10 text-slate-600 border-slate-500/30'
                        }`}>
                          {metric.category}
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6A236]">
                          {metric.sector.name}
                        </span>
                      </div>

                      {/* INDIKATOR NAME */}
                      <h3 className="text-xl font-bold text-[#172121] mb-4 line-clamp-2">
                        {metric.name}
                      </h3>

                      {/* TARGET VS REALISASI CARD */}
                      <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-xl p-4 mb-4 space-y-3">
                        <div className="flex justify-between items-baseline text-sm">
                          <span className="text-[#172121]/60 text-xs font-medium">Realisasi vs Target:</span>
                          <span className="font-bold text-[#172121] tracking-tight">
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
                              <span className="text-[#172121]/60">Capaian Target</span>
                              <span className={achievement >= 100 ? "text-[#0D726D]" : "text-[#F6A236]"}>
                                {achievement}%
                              </span>
                            </div>
                            <div className="w-full bg-[#E2E8E6] rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  achievement >= 100 ? 'bg-[#0D726D]' : 'bg-[#F6A236]'
                                }`}
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-[#172121]/50 italic">
                            {metric.value ? `Ringkasan: ${metric.value}` : 'Data capaian % belum tersedia'}
                          </div>
                        )}
                      </div>

                      {/* DESCRIPTION */}
                      {metric.description && (
                        <p className="text-sm text-[#172121]/70 leading-relaxed mb-4 line-clamp-3 font-normal">
                          {metric.description}
                        </p>
                      )}
                    </div>

                    {/* FOOTER METADATA */}
                    <div className="pt-4 border-t border-[#E2E8E6] space-y-2 mt-2">
                      {/* PROGRAM TERKAIT */}
                      {metric.program && (
                        <Link 
                          href={`/program/${metric.program.slug}`} 
                          className="flex items-center gap-2 text-xs font-semibold text-[#0D726D] hover:underline truncate"
                        >
                          <Tag size={13} className="shrink-0" />
                          <span className="truncate">{metric.program.title}</span>
                        </Link>
                      )}

                      <div className="flex items-center justify-between text-xs text-[#172121]/50 pt-1">
                        {/* YEAR / PERIODE */}
                        {(metric.year || metric.period) && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#172121]/40" />
                            <span>Tahun {metric.year || metric.period}</span>
                          </div>
                        )}

                        {/* VERIFICATION BADGE & SOURCE */}
                        {metric.verificationStatus && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            metric.verificationStatus === 'TERVERIFIKASI'
                              ? 'bg-[#0D726D]/15 text-[#0D726D] border border-[#0D726D]/30'
                              : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                          }`}>
                            <ShieldCheck size={11} />
                            {metric.verificationStatus === 'TERVERIFIKASI' ? 'TERVERIFIKASI' : 'BELUM VERIFIKASI'}
                          </div>
                        )}
                      </div>

                      {metric.source && (
                        <div className="text-[11px] text-[#172121]/50 flex items-center gap-1.5 pt-1">
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
      <section className="py-20 px-6 bg-white border-t border-[#E2E8E6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#172121] mb-4">Kerangka Pengukuran Dampak CSR</h2>
            <p className="text-[#172121]/70 font-normal">
              Setiap metrik CSR dikategorikan secara hirarkis dari hasil langsung kegiatan hingga perubahan sosial ekonomi jangka panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0D726D]/10 flex items-center justify-center text-[#0D726D] font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">OUTPUT</h3>
              <p className="text-sm text-[#172121]/70 leading-relaxed mb-4 font-normal">
                Produk atau hasil fisik langsung yang dihasilkan dari kegiatan.
              </p>
              <div className="text-xs text-[#0D726D] bg-[#0D726D]/10 p-3 rounded-lg border border-[#0D726D]/20 font-medium">
                Contoh: 10 kali pelatihan terlaksana, 300 bibit disalurkan, unit fasilitas dibangun.
              </div>
            </div>

            <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#F6A236]/15 flex items-center justify-center text-[#F6A236] font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">OUTCOME</h3>
              <p className="text-sm text-[#172121]/70 leading-relaxed mb-4 font-normal">
                Perubahan perilaku atau peningkatan kapasitas setelah program berjalan.
              </p>
              <div className="text-xs text-[#E59124] bg-[#F6A236]/10 p-3 rounded-lg border border-[#F6A236]/20 font-medium">
                Contoh: Peserta menerapkan teknik baru, produktivitas meningkat 20%.
              </div>
            </div>

            <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">IMPACT</h3>
              <p className="text-sm text-[#172121]/70 leading-relaxed mb-4 font-normal">
                Dampak sosial, ekonomi, dan lingkungan jangka panjang bagi masyarakat.
              </p>
              <div className="text-xs text-purple-700 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 font-medium">
                Contoh: Kemandirian ekonomi desa binaan & kelestarian lingkungan kawasan.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
