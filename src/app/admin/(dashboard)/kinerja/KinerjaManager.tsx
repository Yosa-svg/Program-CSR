"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, TrendingUp, Clock, Info, CheckCircle, AlertCircle, ShieldAlert, Tag } from "lucide-react";
import FormKinerja from "./FormKinerja";
import { deleteMetric } from "@/actions/kinerjaActions";

type Metric = {
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
  status: string;
  isPublished: boolean;
  program?: { id: string; title: string } | null;
  sector?: { name: string };
};

type ProgramOption = {
  id: string;
  title: string;
};

export default function KinerjaManager({ 
  metrics,
  programs = [],
  activeSectorId,
  activeSectorName
}: { 
  metrics: Metric[];
  programs?: ProgramOption[];
  activeSectorId: string | null;
  activeSectorName?: string | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);

  const handleAdd = () => {
    setEditingMetric(null);
    setIsFormOpen(true);
  };

  const handleEdit = (metric: Metric) => {
    setEditingMetric(metric);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setEditingMetric(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {activeSectorName ? `Kinerja & Dampak CSR (${activeSectorName})` : "Kinerja & Dampak Seluruh Sektor"}
          </h1>
          <p className="text-foreground/60">
            {activeSectorName 
              ? `Kelola metrik capaian target dan indikator hasil sektor ${activeSectorName}.`
              : "Kelola metrik capaian target, indikator hasil, serta dampak jangka panjang seluruh program CSR."}
          </p>
        </div>
        
        {activeSectorId ? (
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tambah Indikator
          </button>
        ) : (
          <div className="text-sm px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg font-medium border border-orange-500/20">
            Pilih sektor spesifik di atas untuk menambah data
          </div>
        )}
      </div>

      <FormKinerja 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingMetric}
        programs={programs}
        onSuccess={handleSuccess} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric) => {
          // Dynamic calculation of Capaian %
          const achievement = (metric.target && metric.target > 0)
            ? Math.round(((metric.realization ?? 0) / metric.target) * 100)
            : null;

          const progressWidth = achievement !== null ? Math.min(achievement, 100) : 0;

          return (
            <div key={metric.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col justify-between group relative">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase
                      ${metric.category === 'OUTPUT' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        metric.category === 'OUTCOME' ? 'bg-[#D85A30]/15 text-[#D85A30] border border-[#D85A30]/30' :
                        metric.category === 'IMPACT' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                        'bg-slate-500/15 text-slate-400 border border-slate-500/30'}
                    `}>
                      {metric.category}
                    </span>
                    
                    {!activeSectorId && metric.sector && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] uppercase font-bold tracking-wider">
                        {metric.sector.name}
                      </span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                    ${metric.isPublished ? 'bg-[#D85A30]/15 text-[#D85A30]' : 'bg-foreground/10 text-foreground/50'}
                  `}>
                    {metric.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Indikator Name */}
                <h3 className="font-bold text-foreground text-lg mb-2">{metric.name}</h3>

                {/* Target vs Realisasi */}
                <div className="bg-background/60 border border-border/60 rounded-lg p-3 mb-3 space-y-2">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-foreground/60 text-xs">Realisasi / Target:</span>
                    <span className="font-semibold text-foreground">
                      {metric.realization !== null ? metric.realization.toLocaleString('id-ID') : '-'}
                      {' / '}
                      {metric.target !== null ? metric.target.toLocaleString('id-ID') : '-'}
                      {metric.unit ? ` ${metric.unit}` : ''}
                    </span>
                  </div>

                  {/* Progress Bar & Capaian */}
                  {achievement !== null ? (
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-foreground/50">Capaian</span>
                        <span className={achievement >= 100 ? "text-[#D85A30] font-bold" : "text-primary"}>
                          {achievement}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            achievement >= 100 ? 'bg-[#D85A30]' : 'bg-primary'
                          }`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-foreground/40 italic">
                      {metric.value ? `Ringkasan: ${metric.value}` : 'Data capaian % belum tersedia'}
                    </div>
                  )}
                </div>

                {/* Program Terkait */}
                {metric.program && (
                  <div className="flex items-center gap-1.5 text-xs text-foreground/70 mb-2">
                    <Tag size={12} className="text-primary shrink-0" />
                    <span className="truncate">{metric.program.title}</span>
                  </div>
                )}

                {/* Description */}
                {metric.description && (
                  <p className="text-xs text-foreground/60 line-clamp-2 mb-3">
                    {metric.description}
                  </p>
                )}
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-foreground/50 mt-2">
                <div className="flex items-center gap-2">
                  {(metric.year || metric.period) && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{metric.year || metric.period}</span>
                    </div>
                  )}

                  {metric.verificationStatus && (
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      metric.verificationStatus === 'TERVERIFIKASI' 
                        ? 'text-[#D85A30] bg-[#D85A30]/10' 
                        : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {metric.verificationStatus === 'TERVERIFIKASI' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {metric.verificationStatus === 'TERVERIFIKASI' ? 'TERVERIFIKASI' : 'BELUM VERIFIKASI'}
                    </span>
                  )}
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(metric)}
                    className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-white/10 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <form action={async () => {
                    if(confirm("Apakah Anda yakin ingin menghapus indikator ini?")) {
                      await deleteMetric(metric.id);
                    }
                  }}>
                    <button type="submit" className="p-1.5 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
          <Info className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Belum Ada Indikator Kinerja</h3>
          <p className="text-foreground/50 max-w-sm mx-auto">Tambahkan metrik target dan realisasi untuk mengukur dampak program CSR.</p>
        </div>
      )}
    </div>
  );
}
