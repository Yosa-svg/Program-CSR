"use client";

import { useState, useRef, useEffect } from "react";
import { X, Loader2, ImagePlus, AlertCircle, Star } from "lucide-react";
import Image from "next/image";
import { createDocumentation, updateDocumentation } from "@/actions/dokumentasiActions";

type RelationalData = {
  id: string;
  title: string;
};

type Documentation = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  date: Date | null;
  isPublished: boolean;
  isFeatured?: boolean;
  programId: string | null;
  activityId: string | null;
  productId: string | null;
  source: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  verificationStatus: string | null;
};

export default function FormDokumentasi({ 
  onSuccess,
  initialData,
  programs,
  activities,
  products,
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Documentation | null;
  programs: RelationalData[];
  activities: RelationalData[];
  products: RelationalData[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

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
        setErrorMessage("Ukuran file tidak boleh lebih dari 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
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
      result = await updateDocumentation(initialData.id, formData);
    } else {
      result = await createDocumentation(formData);
    }
    
    setIsSubmitting(false);
    if (result.success) {
      setPreviewUrl(null);
      setIsOpen(false);
      onSuccess();
    } else {
      setErrorMessage(result.error || "Gagal menyimpan data dokumentasi.");
    }
  };

  if (!isOpen) return null;

  const formattedDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50 shrink-0">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Dokumentasi" : "Unggah Dokumentasi Baru"}
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

          {/* Upload Image Section */}
          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
              File Foto / Dokumentasi {!isEditing && <span className="text-red-400">*</span>}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl hover:border-primary/50 transition-colors bg-background/30 relative">
              <div className="space-y-2 text-center flex flex-col items-center">
                {previewUrl ? (
                  <div className="relative w-full max-w-sm h-48 rounded-lg overflow-hidden border border-border">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <ImagePlus className="mx-auto h-12 w-12 text-foreground/30" />
                )}
                
                <div className="flex text-sm text-foreground/60">
                  <label className="relative cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-medium px-3 py-1.5 rounded-lg transition-colors">
                    <span>{previewUrl ? "Ganti Foto" : "Pilih File Foto"}</span>
                    <input 
                      ref={fileInputRef}
                      name="image" 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      required={!isEditing}
                      onChange={handleImageChange}
                      className="sr-only" 
                    />
                  </label>
                </div>
                <p className="text-xs text-foreground/40">PNG, JPG, WEBP hingga 5MB</p>
              </div>
            </div>
          </div>

          {/* Toggle Slider Beranda (Featured) */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Star size={18} className="fill-amber-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Tampilkan di Slider Beranda</div>
                <div className="text-xs text-foreground/60">Pin foto ini agar berputar di carousel utama halaman depan publik</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isFeatured" 
                value="true"
                defaultChecked={initialData?.isFeatured ?? false}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
              Judul Foto / Dokumentasi <span className="text-red-400">*</span>
            </label>
            <input 
              name="title" 
              required 
              defaultValue={initialData?.title}
              type="text" 
              placeholder="Contoh: Panen Raya Bersama Kelompok Tani Binaan"
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Keterangan tambahan terkait dokumentasi kegiatan ini..."
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Tanggal Kegiatan</label>
            <input 
              name="date" 
              defaultValue={formattedDate}
              type="date" 
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
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
                  Nama Sumber Data <span className="text-xs text-amber-500 font-medium">(Wajib untuk publish)</span>
                </label>
                <input 
                  name="source" 
                  defaultValue={initialData?.source || ""}
                  type="text" 
                  placeholder="Contoh: Laporan Dokumentasi Lapangan"
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

          {/* Relasi ke Program / Kegiatan / Produk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Program Terkait</label>
              <select 
                name="programId"
                defaultValue={initialData?.programId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas / Umum --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Kegiatan Terkait</label>
              <select 
                name="activityId"
                defaultValue={initialData?.activityId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas / Umum --</option>
                {activities.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Produk Terkait</label>
              <select 
                name="productId"
                defaultValue={initialData?.productId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas / Umum --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Visibilitas Publik</label>
              <select 
                name="isPublished"
                defaultValue={initialData?.isPublished ? "true" : "false"}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="false">Simpan Draft</option>
                <option value="true">Publikasikan (Tampilkan di Portal)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3 mt-4">
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
              {isSubmitting ? "Mengunggah..." : isEditing ? "Simpan Perubahan" : "Unggah & Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
