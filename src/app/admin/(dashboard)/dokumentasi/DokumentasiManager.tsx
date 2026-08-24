"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, LayoutGrid, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import FormDokumentasi from "./FormDokumentasi";
import { deleteDocumentation } from "@/actions/dokumentasiActions";

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
  program?: { title: string } | null;
  activity?: {
    title: string;
  } | null;
  product?: { name?: string; title?: string } | null;
  sector?: { name: string };
};

export default function DokumentasiManager({ 
  documentations, 
  programs, 
  activities,
  products,
  activeSectorId
}: { 
  documentations: Documentation[];
  programs: { id: string, title: string }[];
  activities: { id: string, title: string }[];
  products: { id: string, title: string }[];
  activeSectorId: string | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null);

  const handleAdd = () => {
    setEditingDoc(null);
    setIsFormOpen(true);
  };

  const handleEdit = (doc: Documentation) => {
    setEditingDoc(doc);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setEditingDoc(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Galeri Dokumentasi</h1>
          <p className="text-foreground/60">Kelola arsip foto kegiatan dan dokumentasi visual sektor Pertanian.</p>
        </div>
        
        {activeSectorId ? (
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Tambah Dokumentasi
          </button>
        ) : (
          <div className="text-sm px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg font-medium border border-orange-500/20">
            Pilih sektor spesifik untuk menambah data
          </div>
        )}
      </div>

      <FormDokumentasi 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingDoc}
        programs={programs}
        activities={activities}
        products={products}
        onSuccess={handleSuccess} 
      />

      {documentations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
          <ImageIcon className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Belum Ada Dokumentasi</h3>
          <p className="text-foreground/50 max-w-sm mx-auto">Galeri masih kosong. Silakan unggah foto kegiatan untuk melengkapi portofolio sektor Pertanian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentations.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col h-full">
              {/* Image Preview Container */}
              <div className="relative w-full aspect-video bg-black/40 overflow-hidden">
                <Image 
                  src={doc.imageUrl} 
                  alt={doc.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Status Badge overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md
                    ${doc.isPublished ? 'bg-primary/80 text-primary-foreground' : 'bg-foreground/20 text-foreground'}
                  `}>
                    {doc.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                {/* Action buttons overlay (visible on hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 gap-2">
                  <button 
                    onClick={() => handleEdit(doc)}
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-foreground transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <form action={async () => {
                    if(confirm("Hapus foto dokumentasi ini? File asli juga akan dihapus dari server.")) {
                      await deleteDocumentation(doc.id);
                    }
                  }}>
                    <button type="submit" className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-foreground transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="font-semibold text-foreground mb-1">{doc.title}</div>
                {!activeSectorId && doc.sector && (
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] uppercase font-bold tracking-wider mb-1">
                    {doc.sector.name}
                  </span>
                )}
                <div className="text-xs text-foreground/50 line-clamp-1 max-w-[250px]">{doc.description || "-"}</div>

                <div className="space-y-2 mt-auto pt-3 border-t border-border">
                  {doc.date && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                      <Calendar size={12} className="text-[#D85A30]" />
                      {new Date(doc.date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  )}
                  
                  {(doc.program || doc.activity || doc.product) && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                      <LayoutGrid size={12} className="text-blue-500" />
                      <span className="line-clamp-1">
                        {doc.program?.title || doc.activity?.title || doc.product?.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
