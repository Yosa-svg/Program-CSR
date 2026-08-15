"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createActivity, updateActivity } from "@/actions/kegiatanActions";

type Program = {
  id: string;
  title: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  date: Date | null;
  status: string;
  isPublished: boolean;
  programId: string | null;
  source?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  verificationStatus?: string | null;
};

export default function FormKegiatan({ 
  onSuccess,
  initialData,
  programs,
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Activity | null;
  programs: Program[];
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
      result = await updateActivity(initialData.id, formData);
    } else {
      result = await createActivity(formData);
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

  const formattedDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/50 hover:text-foreground bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Program Induk <span className="text-red-400">*</span>
            </label>
            <select 
              name="programId"
              required
              defaultValue={initialData?.programId || ""}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="" disabled>-- Pilih Program --</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Nama Kegiatan <span className="text-red-400">*</span>
            </label>
            <input 
              name="title" 
              required 
              defaultValue={initialData?.title}
              type="text" 
              placeholder="Contoh: Pelatihan Petani Muda"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Tanggal</label>
              <input 
                name="date" 
                required 
                defaultValue={formattedDate}
                type="date" 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Lokasi</label>
              <input 
                name="location" 
                required 
                defaultValue={initialData?.location || ""}
                type="text" 
                placeholder="Balai Desa"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi Ringkas</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Penjelasan singkat mengenai pelaksanaan kegiatan..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
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
                  placeholder="Contoh: Absensi & Berita Acara"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status Pelaksanaan</label>
              <select 
                name="status"
                defaultValue={initialData?.status || "UPCOMING"}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="UPCOMING">Akan Datang</option>
                <option value="ONGOING">Sedang Berlangsung</option>
                <option value="COMPLETED">Selesai</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Visibilitas Publik</label>
              <select 
                name="isPublished"
                defaultValue={initialData?.isPublished ? "true" : "false"}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="false">Draft (Sembunyikan dari Publik)</option>
                <option value="true">Publikasikan (Tampilkan di Portal)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
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
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Kegiatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
