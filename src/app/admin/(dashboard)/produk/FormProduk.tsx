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
  programId: string | null;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h3 className="font-semibold text-foreground">
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
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
            <label className="block text-sm font-medium text-foreground/70 mb-1">Nama Produk</label>
            <input 
              name="name" 
              required 
              defaultValue={initialData?.name}
              type="text" 
              placeholder="Contoh: Beras Organik"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Kategori</label>
              <input 
                name="category" 
                required 
                defaultValue={initialData?.category || "Umum"}
                type="text" 
                placeholder="Pangan, Sayuran, dsb"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Status</label>
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
            <label className="block text-sm font-medium text-foreground/70 mb-1">Deskripsi</label>
            <textarea 
              name="description" 
              required 
              defaultValue={initialData?.description}
              rows={3}
              placeholder="Jelaskan detail mengenai produk ini..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Program Terkait (Opsional)</label>
            <select 
              name="programId"
              defaultValue={initialData?.programId || ""}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">-- Tidak Terikat Program Khusus --</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
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
