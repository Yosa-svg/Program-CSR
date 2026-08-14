"use client";

import { useState } from "react";
import { Filter, Calendar, Info, MapPin, Tag, Box, LayoutGrid, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

type Documentation = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  date: Date | null;
  source: string | null;
  verificationStatus: string | null;
  sectorId: string;
  sector: {
    id: string;
    name: string;
  };
  program?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  activity?: {
    id: string;
    title: string;
  } | null;
  product?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Sector = {
  id: string;
  name: string;
  slug: string;
};

export default function DokumentasiCatalog({
  documentations,
  sectors,
}: {
  documentations: Documentation[];
  sectors: Sector[];
}) {
  const [activeSector, setActiveSector] = useState<string>("ALL");

  const filtered =
    activeSector === "ALL"
      ? documentations
      : documentations.filter((d) => d.sectorId === activeSector);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F0D] font-sans">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-[#112316] to-[#0A0F0D]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold tracking-widest uppercase mb-6">
            Bukti Aksi Nyata
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            CSR <span className="text-primary">Impact</span> Gallery
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Kumpulan dokumentasi pelaksanaan, kegiatan, dan hasil program Tanggung Jawab Sosial Lingkungan (TJSL) di berbagai sektor secara transparan dan akuntabel.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="px-6 py-6 border-y border-white/5 bg-[#0A0F0D] sticky top-[72px] z-30 backdrop-blur-xl bg-opacity-80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/70">
            <Filter size={18} />
            <span className="font-medium text-sm">Filter Sektor:</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => setActiveSector("ALL")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeSector === "ALL"
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSector === sector.id
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
              <LayoutGrid size={48} className="mx-auto text-white/20 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Belum ada dokumentasi</h3>
              <p className="text-white/50">Galeri belum memiliki foto kegiatan untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((doc) => {
                const relationLink = doc.program?.slug
                  ? `/program/${doc.program.slug}`
                  : doc.product?.slug
                  ? `/produk/${doc.product.slug}`
                  : null;

                const cardContent = (
                  <div className="group flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 h-full">
                    
                    {/* PHOTO AREA */}
                    <div className="relative h-64 bg-black/50 overflow-hidden w-full">
                      {doc.imageUrl && !doc.imageUrl.includes("placeholder") ? (
                        <Image 
                          src={doc.imageUrl} 
                          alt={doc.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LayoutGrid size={48} className="text-white/10 group-hover:scale-110 transition-all duration-500" />
                        </div>
                      )}
                      
                      {doc.verificationStatus === "Terverifikasi" && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 text-white rounded-md text-[10px] font-bold tracking-wider shadow-lg backdrop-blur-sm">
                          <CheckCircle size={12} />
                          TERVERIFIKASI
                        </div>
                      )}
                    </div>

                    {/* METADATA AREA */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                        {doc.sector.name}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {doc.title}
                      </h3>
                      
                      {doc.description && (
                        <p className="text-sm text-white/60 mb-5 line-clamp-3">
                          {doc.description}
                        </p>
                      )}

                      <div className="mt-auto pt-5 border-t border-white/10 space-y-3">
                        
                        {(doc.program || doc.activity || doc.product) && (
                          <div className="flex items-start gap-2.5">
                            <Tag size={14} className="text-white/40 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium text-white/80 line-clamp-2">
                              {doc.program?.title || doc.activity?.title || doc.product?.name}
                            </div>
                          </div>
                        )}
                        
                        {doc.date && (
                          <div className="flex items-center gap-2.5">
                            <Calendar size={14} className="text-white/40 shrink-0" />
                            <span className="text-sm text-white/60">
                              {format(new Date(doc.date), "dd MMMM yyyy", { locale: localeID })}
                            </span>
                          </div>
                        )}
                        
                        {doc.source && (
                          <div className="flex items-center gap-2.5">
                            <Info size={14} className="text-white/40 shrink-0" />
                            <span className="text-sm text-white/60">
                              {doc.source}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );

                return relationLink ? (
                  <Link key={doc.id} href={relationLink} className="block group">
                    {cardContent}
                  </Link>
                ) : (
                  <div key={doc.id} className="block group cursor-default">
                    {cardContent}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
