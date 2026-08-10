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
  programId: string | null;
  imageUrl: string;
  program?: {
    title: string;
  } | null;
};

export default function ProdukManager({ 
  products,
  programs 
}: { 
  products: Product[];
  programs: Program[];
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
          <h1 className="text-2xl font-bold text-white mb-1">Daftar Produk</h1>
          <p className="text-white/60">Kelola katalog produk unggulan dari sektor Pertanian.</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
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
          <div className="p-8 text-center text-white/50">
            Belum ada data produk. Silakan tambahkan produk baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-white/40">
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
                          <div className="font-semibold text-white mb-1">{prod.name}</div>
                          <div className="text-xs text-white/50 line-clamp-1 max-w-[250px]">{prod.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-white/70">
                          <Tag size={14} className="text-orange-500" />
                          {prod.category}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Box size={14} className="text-blue-500" />
                          {prod.program ? `Program: ${prod.program.title}` : 'Independen'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                        ${prod.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${prod.status === 'OUT_OF_STOCK' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      `}>
                        {prod.status === 'AVAILABLE' ? 'Tersedia' : 'Habis'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(prod)}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <form action={async () => {
                          if(confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                            await deleteProduct(prod.id);
                          }
                        }}>
                          <button type="submit" className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
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
