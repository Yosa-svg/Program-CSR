"use client";

import { useState, useRef } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";
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
  programId: string | null;
  activityId: string | null;
  productId: string | null;
  source: string | null;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file tidak boleh lebih dari 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
      alert(result.error);
    }
  };

  if (!isOpen) return null;

  const formattedDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
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
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* FOTO UPLOAD AREA */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/70">Foto Dokumentasi <span className="text-red-400">*</span></label>
            <div 
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors overflow-hidden group
                ${previewUrl ? 'border-primary/50 bg-black/40' : 'border-border bg-background hover:bg-white/[0.02] hover:border-primary/50 cursor-pointer'}
              `}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/10 backdrop-blur text-foreground rounded-lg border border-white/20 text-sm font-medium"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <ImagePlus className="w-10 h-10 text-foreground/20 mb-3" />
                  <p className="mb-1 text-sm text-foreground/70"><span className="font-semibold text-primary">Klik untuk unggah</span></p>
                  <p className="text-xs text-foreground/40">JPG, PNG atau WEBP (Maks. 5MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                name="image"
                type="file" 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
                required={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Judul Dokumentasi <span className="text-red-400">*</span></label>
              <input 
                name="title" 
                required 
                defaultValue={initialData?.title}
                type="text" 
                placeholder="Contoh: Panen Raya Q3"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Tanggal</label>
              <input 
                name="date" 
                defaultValue={formattedDate}
                type="date" 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary [color-scheme:dark]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Ceritakan momen dalam foto ini..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Sumber Dokumentasi</label>
              <input 
                name="source" 
                defaultValue={initialData?.source || ""}
                type="text" 
                placeholder="Contoh: Internal ANTAM"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status Verifikasi</label>
              <select 
                name="verificationStatus"
                defaultValue={initialData?.verificationStatus || "Menunggu Verifikasi"}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-background border border-border rounded-xl">
            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Program Induk</label>
              <select 
                name="programId"
                defaultValue={initialData?.programId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Kegiatan</label>
              <select 
                name="activityId"
                defaultValue={initialData?.activityId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas --</option>
                {activities.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Produk</label>
              <select 
                name="productId"
                defaultValue={initialData?.productId || ""}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">-- Bebas --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">Visibilitas</label>
              <select 
                name="isPublished"
                defaultValue={initialData?.isPublished ? "true" : "false"}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="true">Publikasikan</option>
                <option value="false">Simpan Draft</option>
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
