"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertCircle, Upload, ImagePlus } from "lucide-react";
import Image from "next/image";
import { createProgram, updateProgram } from "@/actions/csrActions";

type Program = {
  id: string;
  title: string;
  description: string;
  location: string;
  beneficiaries: string;
  status: string;
  isPublished: boolean;
  imageUrl?: string;
  source?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  verificationStatus?: string | null;
  sectorId?: string;
};

type SectorOption = {
  id: string;
  name: string;
};

export default function FormProgram({ 
  onSuccess,
  initialData,
  sectors = [],
  activeSectorId,
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Program | null;
  sectors?: SectorOption[];
  activeSectorId?: string | null;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditing = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setPreviewUrl(initialData?.imageUrl || null);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran gambar melebihi 5MB.");
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    const formData = new FormData(e.currentTarget);
    let result;
    
    if (isEditing && initialData) {
      result = await updateProgram(initialData.id, formData);
    } else {
      result = await createProgram(formData);
    }
    
    setIsSubmitting(false);
    if (result.success) {
      setIsOpen(false);
      onSuccess();
    } else {
      setErrorMessage(result.error || "Gagal menyimpan data program.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50 shrink-0">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Program" : "Tambah Program Baru"}
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/50 hover:text-foreground bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Sektor Dropdown (jika tersedia banyak sektor) */}
          {sectors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Sektor Program <span className="text-red-400">*</span>
              </label>
              <select
                name="sectorId"
                defaultValue={initialData?.sectorId || activeSectorId || sectors[0]?.id}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                required
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Nama Program <span className="text-red-400">*</span>
            </label>
            <input 
              name="title" 
              required 
              defaultValue={initialData?.title}
              type="text" 
              placeholder="Contoh: Agro Edu Wisata"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Deskripsi Program <span className="text-red-400">*</span>
            </label>
            <textarea 
              name="description" 
              required 
              defaultValue={initialData?.description}
              rows={3}
              placeholder="Jelaskan secara singkat mengenai program ini..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Lokasi</label>
              <input 
                name="location" 
                required 
                defaultValue={initialData?.location || "Desa Binaan CSR"}
                type="text" 
                placeholder="Desa Suka Maju"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Penerima Manfaat</label>
              <input 
                name="beneficiaries" 
                required 
                defaultValue={initialData?.beneficiaries || "Masyarakat Sekitar"}
                type="text" 
                placeholder="120+ KK"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Upload Foto Program / Cover Banner */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Foto Sampul / Banner Program
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl hover:border-primary/50 transition-colors bg-background/30 relative">
              <div className="space-y-3 text-center flex flex-col items-center w-full">
                {previewUrl ? (
                  <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-border shadow-sm">
                    <Image 
                      src={previewUrl} 
                      alt="Preview Cover Program" 
                      fill 
                      className="object-cover" 
                      unoptimized={previewUrl.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-foreground/40">
                    <ImagePlus className="h-12 w-12 mb-2 opacity-50" />
                    <span className="text-xs">Belum ada foto yang dipilih</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 rounded-lg transition-colors text-sm inline-flex items-center gap-2">
                    <Upload size={16} />
                    <span>{previewUrl ? "Ganti File Foto" : "Unggah File Foto Program"}</span>
                    <input 
                      ref={fileInputRef}
                      name="image" 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handleImageChange}
                      className="sr-only" 
                    />
                  </label>
                </div>
                <p className="text-xs text-foreground/40">Mendukung format JPG, PNG, atau WEBP (Maksimal 5MB)</p>
              </div>
            </div>
            {/* Hidden field to keep existing imageUrl if no new file is selected */}
            <input 
              type="hidden" 
              name="imageUrl" 
              value={initialData?.imageUrl || "/images/placeholder.jpg"} 
            />
          </div>

          {/* Section Source Management & Verification */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground/60 border-b border-border/60 pb-2">
              Integritas & Sumber Data Resmi (Verifikasi)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">
                  Nama Sumber Data <span className="text-xs text-amber-500 font-medium">(Wajib jika dipublikasikan)</span>
                </label>
                <input 
                  name="source" 
                  defaultValue={initialData?.source || ""}
                  type="text" 
                  placeholder="Contoh: Laporan Keberlanjutan 2025"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Jenis Sumber Data</label>
                <select 
                  name="sourceType"
                  defaultValue={initialData?.sourceType || "RESMI_ANTAM"}
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
                <label className="block text-xs font-medium text-foreground/70 mb-1">
                  Status Verifikasi <span className="text-xs text-amber-500 font-medium">(Wajib Terverifikasi/Review untuk publish)</span>
                </label>
                <select 
                  name="verificationStatus"
                  defaultValue={initialData?.verificationStatus || "TERVERIFIKASI"}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="TERVERIFIKASI">TERVERIFIKASI (Sah / Valid)</option>
                  <option value="MENUNGGU_VERIFIKASI">MENUNGGU VERIFIKASI (Proses Review)</option>
                  <option value="BELUM_TERVERIFIKASI">BELUM TERVERIFIKASI (Mentah)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status Operasional</label>
              <select 
                name="status"
                defaultValue={initialData?.status || "ACTIVE"}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="ACTIVE">Aktif (Sedang Berjalan)</option>
                <option value="PLANNED">Direncanakan</option>
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
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
