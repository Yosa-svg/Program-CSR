"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createMetric, updateMetric } from "@/actions/kinerjaActions";

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
  sourceType?: string | null;
  sourceUrl?: string | null;
  verificationStatus: string | null;
  programId: string | null;
  status: string;
  isPublished: boolean;
};

type ProgramOption = {
  id: string;
  title: string;
};

export default function FormKinerja({ 
  onSuccess,
  initialData,
  programs = [],
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Metric | null;
  programs?: ProgramOption[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    let result;
    
    if (isEditing && initialData) {
      result = await updateMetric(initialData.id, formData);
    } else {
      result = await createMetric(formData);
    }
    
    setIsSubmitting(false);
    if (result.success) {
      setIsOpen(false);
      onSuccess();
    } else {
      alert(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Indikator Kinerja" : "Tambah Indikator Baru"}
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/50 hover:text-foreground bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Nama Indikator <span className="text-red-400">*</span>
              </label>
              <input 
                name="name" 
                required 
                defaultValue={initialData?.name}
                type="text" 
                placeholder="Contoh: Penerima Manfaat, Kelompok Binaan"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Kategori Impact <span className="text-red-400">*</span>
              </label>
              <select 
                name="category"
                defaultValue={initialData?.category || "OUTCOME"}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="OUTPUT">OUTPUT (Hasil Langsung Kegiatan)</option>
                <option value="OUTCOME">OUTCOME (Perubahan Setelah Program)</option>
                <option value="IMPACT">IMPACT (Dampak Jangka Panjang)</option>
                <option value="INDIKATOR">INDIKATOR (Kategori Umum)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Target Angka</label>
              <input 
                name="target" 
                defaultValue={initialData?.target ?? ""}
                type="number" 
                step="any"
                placeholder="Contoh: 50"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Realisasi Angka</label>
              <input 
                name="realization" 
                defaultValue={initialData?.realization ?? ""}
                type="number" 
                step="any"
                placeholder="Contoh: 40"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Satuan (Unit)</label>
              <input 
                name="unit" 
                defaultValue={initialData?.unit || ""}
                type="text" 
                placeholder="Contoh: orang, kelompok, kg, ha"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Tahun Data</label>
              <input 
                name="year" 
                defaultValue={initialData?.year || new Date().getFullYear()}
                type="number" 
                placeholder="2026"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Periode Data (Opsional)</label>
              <input 
                name="period" 
                defaultValue={initialData?.period || ""}
                type="text" 
                placeholder="Contoh: Q1 2026, Semester 1"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section Source Management & Verification */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground/60 border-b border-border/60 pb-2">
              Integritas & Sumber Data Resmi (Fase 15.5)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">
                  Nama Sumber Data <span className="text-xs text-amber-400">(Wajib untuk publish)</span>
                </label>
                <input 
                  name="source" 
                  defaultValue={initialData?.source || ""}
                  type="text" 
                  placeholder="Contoh: Laporan Monev Q4"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Jenis Sumber Data</label>
                <select 
                  name="sourceType"
                  defaultValue={initialData?.sourceType || ""}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  <option value="RESMI_ANTAM">Sumber Resmi ANTAM (Internal)</option>
                  <option value="PEMERINTAH">Instansi Pemerintah / Dinas</option>
                  <option value="JURNAL_AKADEMIK">Jurnal Ilmiah / Akademik</option>
                  <option value="MEDIA_MASSA">Media Massa / Pemberitaan</option>
                  <option value="DOKUMEN_LAPORAN">Dokumen Laporan / Audit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">URL Rujukan (Opsional)</label>
                <input 
                  name="sourceUrl" 
                  defaultValue={initialData?.sourceUrl || ""}
                  type="url" 
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Status Verifikasi</label>
                <select 
                  name="verificationStatus"
                  defaultValue={initialData?.verificationStatus || "BELUM_TERVERIFIKASI"}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="BELUM_TERVERIFIKASI">BELUM TERVERIFIKASI (Mentah)</option>
                  <option value="MENUNGGU_VERIFIKASI">MENUNGGU VERIFIKASI (Proses Review)</option>
                  <option value="TERVERIFIKASI">TERVERIFIKASI (Sah / Valid)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-background border border-border rounded-xl">
            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Program Terkait (Opsional)
              </label>
              <select 
                name="programId"
                defaultValue={initialData?.programId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Indikator Agregat Sektor (Bebas) --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Status Visibilitas
              </label>
              <select 
                name="isPublished"
                defaultValue={initialData?.isPublished ? "true" : "false"}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="false">Simpan Draft</option>
                <option value="true">Publikasikan</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi Hasil & Konteks</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Penjelasan konteks indikator/dampak..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-3 border-t border-border mt-4">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Indikator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
