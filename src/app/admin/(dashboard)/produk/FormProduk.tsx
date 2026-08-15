"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/produkActions";

type Program = {
  id: string;
  title: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  isPublished: boolean;
  programId: string | null;
  capacity?: string | null;
  unit?: string | null;
  marketing?: string | null;
  certification?: string | null;
  source?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  verificationStatus?: string | null;
};

export default function FormProduk({ 
  onSuccess,
  initialData,
  programs,
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Product | null;
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
      result = await updateProduct(initialData.id, formData);
    } else {
      result = await createProduct(formData);
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
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
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
              Nama Produk <span className="text-red-400">*</span>
            </label>
            <input 
              name="name" 
              required 
              defaultValue={initialData?.name}
              type="text" 
              placeholder="Contoh: Beras Organik"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Program Induk (Opsional)</label>
            <select 
              name="programId"
              defaultValue={initialData?.programId || ""}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">-- Mandiri / Tanpa Program --</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Kategori Produk</label>
              <input 
                name="category" 
                required 
                defaultValue={initialData?.category || "Umum"}
                type="text" 
                placeholder="Pangan, Olahan, dsb"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status Ketersediaan</label>
              <select 
                name="status"
                defaultValue={initialData?.status || "AVAILABLE"}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="OUT_OF_STOCK">Habis</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi Produk</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Jelaskan spesifikasi mengenai produk ini..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Kapasitas Produksi</label>
              <input 
                name="capacity" 
                defaultValue={initialData?.capacity || ""}
                type="text" 
                placeholder="Contoh: 1000"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Satuan Produksi</label>
              <input 
                name="unit" 
                defaultValue={initialData?.unit || ""}
                type="text" 
                placeholder="Kg/Bulan, Liter, dsb"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Jangkauan Pemasaran</label>
              <input 
                name="marketing" 
                defaultValue={initialData?.marketing || ""}
                type="text" 
                placeholder="Lokal, Nasional, dsb"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Sertifikasi & Izin</label>
              <input 
                name="certification" 
                defaultValue={initialData?.certification || ""}
                type="text" 
                placeholder="P-IRT, Halal, dsb"
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
                  placeholder="Contoh: Pendataan Kelompok Binaan"
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
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
