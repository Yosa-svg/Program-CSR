"use client";

import { useState } from "react";
import { Filter, ArrowRight, Tag, Package } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  imageUrl: string;
  isPublished: boolean;
  sectorId: string;
  slug: string;
  sector: {
    id: string;
    name: string;
    slug: string;
  };
};

type Sector = {
  id: string;
  name: string;
  slug: string;
};

export default function ProdukCatalog({
  products,
  sectors,
}: {
  products: Product[];
  sectors: Sector[];
}) {
  const [activeSector, setActiveSector] = useState<string>("ALL");

  const filtered =
    activeSector === "ALL"
      ? products
      : products.filter((p) => p.sectorId === activeSector);

  const statusLabel: Record<string, { text: string; color: string }> = {
    AVAILABLE: { text: "Tersedia", color: "bg-[#0D726D]/15 text-[#0D726D] border-[#0D726D]/30" },
    OUT_OF_STOCK: { text: "Kosong", color: "bg-red-500/15 text-red-500 border-red-500/30" },
  };

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
            Hasil Pemberdayaan CSR
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Produk Unggulan Binaan
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm">
            Temukan berbagai produk berkualitas yang dihasilkan oleh kelompok masyarakat binaan melalui program pemberdayaan ekonomi berkelanjutan.
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
              Semua Produk
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

      {/* CATALOG GRID */}
      <section className="py-20 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-[#E2E8E6]">
              <Package size={48} className="mx-auto text-[#172121]/20 mb-6" />
              <h3 className="text-2xl font-bold text-[#172121] mb-2">Belum ada produk</h3>
              <p className="text-[#172121]/50 text-sm">Tidak ada produk yang dipublikasikan pada kategori ini saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((prod) => (
                <Link href={`/produk/${prod.slug}`} key={prod.id} className="group flex flex-col bg-white border border-[#E2E8E6] rounded-3xl overflow-hidden hover:border-[#0D726D]/50 hover:shadow-xl transition-all duration-300 relative shadow-sm">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D] group-hover:bg-[#F6A236] transition-colors z-20"></div>

                  {/* Image Placeholder */}
                  <div className="relative h-60 bg-[#F7FAF9] overflow-hidden border-b border-[#E2E8E6]">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Package size={64} className="text-[#0D726D]/20 group-hover:scale-110 transition-all duration-500" />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${statusLabel[prod.status]?.color || 'bg-white/90 text-gray-700 border-gray-200'}`}>
                         {statusLabel[prod.status]?.text || prod.status}
                       </span>
                    </div>
                    {/* Sector Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#E2E8E6] px-3 py-1 rounded-full shadow-sm">
                       <span className="text-[10px] font-bold text-[#172121] uppercase tracking-wider">{prod.sector.name}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 text-[#F6A236] font-bold text-xs uppercase tracking-wider">
                       <Tag size={14} />
                       <span>{prod.category}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#172121] mb-3 group-hover:text-[#0D726D] transition-colors">
                      {prod.name}
                    </h3>
                    
                    <p className="text-[#172121]/70 line-clamp-3 mb-8 leading-relaxed font-normal text-sm">
                      {prod.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-[#E2E8E6] flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0D726D]">Lihat Detail Produk</span>
                      <div className="w-10 h-10 rounded-full bg-[#0D726D]/10 flex items-center justify-center text-[#0D726D] group-hover:bg-[#0D726D] group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
