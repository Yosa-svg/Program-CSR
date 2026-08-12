"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Tag, Box, Image as ImageIcon } from "lucide-react";
import FormProduk from "./FormProduk";
import { deleteProduct } from "@/actions/produkActions";

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
  imageUrl: string;
  program?: {
    title: string;
  } | null;
  sector?: { name: string };
};

export default function ProdukManager({ 
  products,
  programs,
  activeSectorId
}: { 
  products: Product[];
  programs: Program[];
  activeSectorId: string | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Daftar Produk</h1>
          <p className="text-foreground/60">Kelola katalog produk unggulan dari sektor Pertanian.</p>
        </div>
        
        {activeSectorId ? (
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Tambah Produk
          </button>
        ) : (
          <div className="text-sm px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg font-medium border border-orange-500/20">
            Pilih sektor spesifik untuk menambah data
          </div>
        )}
      </div>

      <FormProduk 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingProduct}
        programs={programs}
        onSuccess={handleSuccess} 
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">
            Belum ada data produk. Silakan tambahkan produk baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-foreground/40">
                  <th className="p-4 font-medium">Produk</th>
                  <th className="p-4 font-medium">Kategori & Relasi</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden relative shrink-0">
                          <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-orange-500/50">
                            <ImageIcon size={16} />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground mb-1">{prod.name}</div>
                          {!activeSectorId && prod.sector && (
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] uppercase font-bold tracking-wider mb-1">
                              {prod.sector.name}
                            </span>
                          )}
                          <div className="text-xs text-foreground/50 line-clamp-1 max-w-[250px]">{prod.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                          <Tag size={14} className="text-orange-500" />
                          {prod.category}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                          <Box size={14} className="text-blue-500" />
                          {prod.program ? `Program: ${prod.program.title}` : 'Independen'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${prod.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${prod.status === 'OUT_OF_STOCK' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                        `}>
                          {prod.status === 'AVAILABLE' ? 'Tersedia' : 'Habis'}
                        </span>
                        
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${prod.isPublished ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/50 border-foreground/10'}
                        `}>
                          {prod.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(prod)}
                          className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <form action={async () => {
                          if(confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                            await deleteProduct(prod.id);
                          }
                        }}>
                          <button type="submit" className="p-2 text-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
