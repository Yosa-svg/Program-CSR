"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, TrendingUp, Clock, Info } from "lucide-react";
import FormKinerja from "./FormKinerja";
import { deleteMetric } from "@/actions/kinerjaActions";

type Metric = {
  id: string;
  name: string;
  value: string;
  unit: string | null;
  description: string | null;
  period: string;
  status: string;
};

export default function KinerjaManager({ metrics }: { metrics: Metric[] }) {
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Kinerja & Dampak</h1>
          <p className="text-foreground/60">Kelola indikator statistik dan metrik capaian sektor Pertanian.</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-foreground font-medium rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} />
          Tambah Indikator
        </button>
      </div>

      <FormKinerja 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingMetric}
        onSuccess={handleSuccess} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                ${metric.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}
              `}>
                {metric.status === 'PUBLISHED' ? 'Publik' : 'Draft'}
              </span>
            </div>
            
            <div className="mb-1">
              <span className="text-3xl font-bold text-foreground tracking-tight">{metric.value}</span>
              {metric.unit && <span className="text-lg text-foreground/50 ml-1">{metric.unit}</span>}
            </div>
            
            <h3 className="font-medium text-foreground mb-2">{metric.name}</h3>
            
            {metric.description && (
              <p className="text-sm text-foreground/50 line-clamp-2 mb-4 flex-grow">{metric.description}</p>
            )}

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                <Clock size={14} />
                {metric.period}
              </div>
              
              {/* Action buttons appear on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(metric)}
                  className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-md transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <form action={async () => {
                  if(confirm("Apakah Anda yakin ingin menghapus indikator ini?")) {
                    await deleteMetric(metric.id);
                  }
                }}>
                  <button type="submit" className="p-1.5 text-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
          <Info className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Belum Ada Indikator</h3>
          <p className="text-foreground/50 max-w-sm mx-auto">Tambahkan metrik dan indikator kinerja untuk menunjukkan dampak dari sektor Pertanian.</p>
        </div>
      )}
    </div>
  );
}
