"use client";

import { useState } from "react";
import { Filter, Calendar, Info, Tag, LayoutGrid, CheckCircle } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#172121]">
      {/* HERO SECTION */}
      <section 
        className="relative pt-32 pb-20 px-6 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="relative max-w-7xl mx-auto z-10">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
            Bukti Aksi Nyata CSR
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Galeri Dokumentasi & Dampak
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm">
            Kumpulan dokumentasi pelaksanaan, kegiatan, dan hasil program Tanggung Jawab Sosial Lingkungan (TJSL) di berbagai sektor secara transparan dan akuntabel.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="px-6 py-4 border-b border-[#E2E8E6] bg-white sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#172121]/60">
            <Filter size={18} />
            <span className="font-semibold text-sm">Filter Sektor:</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => setActiveSector("ALL")}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                activeSector === "ALL"
                  ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                  : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#F7FAF9] hover:text-[#0D726D]"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeSector === sector.id
                    ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                    : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#F7FAF9] hover:text-[#0D726D]"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-20 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-[#E2E8E6]">
              <LayoutGrid size={48} className="mx-auto text-[#172121]/20 mb-6" />
              <h3 className="text-2xl font-bold text-[#172121] mb-2">Belum ada dokumentasi</h3>
              <p className="text-[#172121]/50 text-sm">Galeri belum memiliki foto kegiatan untuk kategori ini.</p>
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
                  <div className="group flex flex-col bg-white border border-[#E2E8E6] rounded-2xl overflow-hidden hover:border-[#0D726D]/50 hover:shadow-xl transition-all duration-300 h-full shadow-sm relative">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D] group-hover:bg-[#F6A236] transition-colors z-20"></div>

                    {/* PHOTO AREA */}
                    <div className="relative h-64 bg-[#F7FAF9] overflow-hidden w-full border-b border-[#E2E8E6]">
                      {doc.imageUrl && !doc.imageUrl.includes("placeholder") ? (
                        <Image 
                          src={doc.imageUrl} 
                          alt={doc.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LayoutGrid size={48} className="text-[#0D726D]/20 group-hover:scale-110 transition-all duration-500" />
                        </div>
                      )}
                      
                      {doc.verificationStatus === "Terverifikasi" && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-[#0D726D] text-white rounded-full text-[10px] font-bold tracking-wider shadow-md backdrop-blur-sm">
                          <CheckCircle size={12} className="text-[#F6A236]" />
                          TERVERIFIKASI
                        </div>
                      )}
                    </div>

                    {/* METADATA AREA */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#F6A236] mb-2">
                        {doc.sector.name}
                      </div>
                      
                      <h3 className="text-xl font-bold text-[#172121] mb-2 group-hover:text-[#0D726D] transition-colors line-clamp-2">
                        {doc.title}
                      </h3>
                      
                      {doc.description && (
                        <p className="text-sm text-[#172121]/70 mb-5 line-clamp-3 font-normal">
                          {doc.description}
                        </p>
                      )}

                      <div className="mt-auto pt-5 border-t border-[#E2E8E6] space-y-2.5">
                        
                        {(doc.program || doc.activity || doc.product) && (
                          <div className="flex items-start gap-2">
                            <Tag size={14} className="text-[#0D726D] shrink-0 mt-0.5" />
                            <div className="text-xs font-semibold text-[#172121]/80 line-clamp-2">
                              {doc.program?.title || doc.activity?.title || doc.product?.name}
                            </div>
                          </div>
                        )}
                        
                        {doc.date && (
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#172121]/40 shrink-0" />
                            <span className="text-xs text-[#172121]/60">
                              {format(new Date(doc.date), "dd MMMM yyyy", { locale: localeID })}
                            </span>
                          </div>
                        )}
                        
                        {doc.source && (
                          <div className="flex items-center gap-2">
                            <Info size={14} className="text-[#172121]/40 shrink-0" />
                            <span className="text-xs text-[#172121]/60">
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
