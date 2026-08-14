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

  // Format date for input type="date"
  const formattedDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Program Induk</label>
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
            <label className="block text-sm font-medium text-foreground/70 mb-1">Nama Kegiatan</label>
            <input 
              name="title" 
              required 
              defaultValue={initialData?.title}
              type="text" 
              placeholder="Contoh: Pelatihan Petani Muda"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi</label>
            <textarea 
              name="description" 
              required 
              defaultValue={initialData?.description}
              rows={3}
              placeholder="Detail kegiatan yang dilakukan..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Status Kegiatan</label>
            <select 
              name="status"
              defaultValue={initialData?.status || "UPCOMING"}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="UPCOMING">Akan Datang</option>
              <option value="ONGOING">Sedang Berjalan</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Visibilitas</label>
            <select 
              name="isPublished"
              defaultValue={initialData?.isPublished ? "true" : "false"}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="false">Draft (Sembunyikan dari Publik)</option>
              <option value="true">Publikasikan (Tampilkan di Website)</option>
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
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Kegiatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
