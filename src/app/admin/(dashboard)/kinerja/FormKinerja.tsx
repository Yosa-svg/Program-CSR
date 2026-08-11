"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createMetric, updateMetric } from "@/actions/kinerjaActions";

type Metric = {
  id: string;
  name: string;
  value: string;
  unit: string | null;
  description: string | null;
  period: string;
  status: string;
};

export default function FormKinerja({ 
  onSuccess,
  initialData,
  isOpen,
  setIsOpen 
}: { 
  onSuccess: () => void;
  initialData?: Metric | null;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Indikator Kinerja" : "Tambah Indikator Baru"}
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
            <label className="block text-sm font-medium text-foreground/70 mb-1">Nama Indikator <span className="text-red-400">*</span></label>
            <input 
              name="name" 
              required 
              defaultValue={initialData?.name}
              type="text" 
              placeholder="Contoh: Petani Binaan, Luas Lahan"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Nilai <span className="text-red-400">*</span></label>
              <input 
                name="value" 
                required 
                defaultValue={initialData?.value}
                type="text" 
                placeholder="Contoh: 120, 25, 5.2"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Satuan</label>
              <input 
                name="unit" 
                defaultValue={initialData?.unit || ""}
                type="text" 
                placeholder="Contoh: Orang, Hektar, %"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Periode <span className="text-red-400">*</span></label>
              <input 
                name="period" 
                required 
                defaultValue={initialData?.period}
                type="text" 
                placeholder="Contoh: 2026, Q1 2026"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status Publikasi <span className="text-red-400">*</span></label>
              <select 
                name="status"
                required
                defaultValue={initialData?.status || "PUBLISHED"}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="PUBLISHED">Publikasikan</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi Tambahan</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={2}
              placeholder="Penjelasan singkat indikator..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
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
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Indikator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
