"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, LayoutGrid, Image as ImageIcon, Star } from "lucide-react";
import Image from "next/image";
import FormDokumentasi from "./FormDokumentasi";
import { deleteDocumentation, toggleFeaturedDocumentation } from "@/actions/dokumentasiActions";

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
  activeSectorId,
  activeSectorName
}: { 
  documentations: Documentation[];
  programs: { id: string, title: string }[];
  activities: { id: string, title: string }[];
  products: { id: string, title: string }[];
  activeSectorId: string | null;
  activeSectorName?: string | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null);
  const [filterMode, setFilterMode] = useState<"ALL" | "FEATURED">("ALL");
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const handleToggleFeatured = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingId(id);
    await toggleFeaturedDocumentation(id);
    setTogglingId(null);
  };

  const featuredCount = documentations.filter((d) => d.isFeatured).length;
  const displayedDocs = filterMode === "FEATURED" 
    ? documentations.filter((d) => d.isFeatured) 
    : documentations;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {activeSectorName ? `Galeri Dokumentasi (${activeSectorName})` : "Galeri Seluruh Dokumentasi"}
          </h1>
          <p className="text-foreground/60">
            {activeSectorName 
              ? `Kelola arsip foto kegiatan dan dokumentasi visual sektor ${activeSectorName}.`
              : "Kelola arsip foto kegiatan dan dokumentasi visual dari seluruh sektor CSR."}
          </p>
        </div>
        
        {activeSectorId ? (
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto"
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

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setFilterMode("ALL")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            filterMode === "ALL"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card hover:bg-muted-bg text-foreground/70 border border-border"
          }`}
        >
          Semua Foto ({documentations.length})
        </button>
        <button
          onClick={() => setFilterMode("FEATURED")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            filterMode === "FEATURED"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-card hover:bg-muted-bg text-foreground/70 border border-border"
          }`}
        >
          <Star size={15} className={filterMode === "FEATURED" ? "fill-white" : "text-amber-500 fill-amber-500"} />
          Slider Beranda ({featuredCount})
        </button>
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

      {displayedDocs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-foreground/20 mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">
            {filterMode === "FEATURED" ? "Belum Ada Foto di Slider Beranda" : "Belum Ada Dokumentasi"}
          </h3>
          <p className="text-foreground/50 max-w-sm mx-auto text-sm">
            {filterMode === "FEATURED"
              ? "Klik ikon bintang pada kartu foto untuk mem-pin foto ke carousel slider halaman beranda."
              : "Galeri masih kosong. Silakan unggah foto kegiatan untuk melengkapi portofolio dokumentasi."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedDocs.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col h-full shadow-sm hover:shadow-md">
              {/* Image Preview Container */}
              <div className="relative w-full aspect-video bg-black/40 overflow-hidden">
                <Image 
                  src={doc.imageUrl} 
                  alt={doc.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md
                    ${doc.isPublished ? 'bg-primary/90 text-primary-foreground' : 'bg-black/60 text-white'}
                  `}>
                    {doc.isPublished ? 'Published' : 'Draft'}
                  </span>

                  {doc.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md backdrop-blur-md">
                      <Star size={10} className="fill-white" /> Slider
                    </span>
                  )}
                </div>

                {/* 1-Click Star Toggle Button in top right */}
                <button
                  onClick={(e) => handleToggleFeatured(doc.id, e)}
                  disabled={togglingId === doc.id}
                  title={doc.isFeatured ? "Keluarkan dari Slider Beranda" : "Tampilkan di Slider Beranda"}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md shadow-md transition-all z-10 ${
                    doc.isFeatured 
                      ? "bg-amber-500 text-white hover:bg-amber-600 scale-105" 
                      : "bg-black/50 text-white/80 hover:bg-amber-500 hover:text-white"
                  }`}
                >
                  <Star size={14} className={doc.isFeatured ? "fill-white" : ""} />
                </button>
                
                {/* Action buttons overlay (visible on hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 gap-2">
                  <button 
                    onClick={() => handleEdit(doc)}
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-colors"
                    title="Edit Dokumentasi"
                  >
                    <Edit2 size={16} />
                  </button>
                  <form action={async () => {
                    if(confirm("Hapus foto dokumentasi ini? File asli juga akan dihapus dari server.")) {
                      await deleteDocumentation(doc.id);
                    }
                  }}>
                    <button 
                      type="submit" 
                      className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-white transition-colors"
                      title="Hapus Dokumentasi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="font-bold text-foreground mb-1 line-clamp-1">{doc.title}</div>
                {!activeSectorId && doc.sector && (
                  <span className="inline-block self-start px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] uppercase font-bold tracking-wider mb-2">
                    {doc.sector.name}
                  </span>
                )}
                <div className="text-xs text-foreground/60 line-clamp-2 mb-3">{doc.description || "-"}</div>

                <div className="space-y-1.5 mt-auto pt-3 border-t border-border">
                  {doc.date && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                      <Calendar size={12} className="text-[#F6A236]" />
                      {new Date(doc.date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  )}
                  
                  {(doc.program || doc.activity || doc.product) && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                      <LayoutGrid size={12} className="text-[#0D726D]" />
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
