"use client";

import { useState } from "react";
import { Filter, ArrowRight, Tag, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    AVAILABLE: { text: "Tersedia", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    OUT_OF_STOCK: { text: "Kosong", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F0D] font-sans">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-[#112316] to-[#0A0F0D]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold tracking-widest uppercase mb-6">
            Hasil Pemberdayaan
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Produk <span className="text-primary">Unggulan</span> CSR
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Temukan berbagai produk berkualitas yang dihasilkan oleh kelompok masyarakat binaan melalui program pemberdayaan ekonomi berkelanjutan.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="px-6 py-6 border-y border-white/5 bg-[#0A0F0D] sticky top-[72px] z-30 backdrop-blur-xl bg-opacity-80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/70">
            <Filter size={18} />
            <span className="font-medium text-sm">Filter Kategori:</span>
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
              Semua Produk
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

      {/* CATALOG GRID */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
              <Package size={48} className="mx-auto text-white/20 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Belum ada produk</h3>
              <p className="text-white/50">Tidak ada produk yang dipublikasikan pada kategori ini saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((prod) => (
                <Link href={`/produk/${prod.slug}`} key={prod.id} className="group flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)]">
                  {/* Image Placeholder */}
                  <div className="relative h-60 bg-black/40 overflow-hidden">
                    {/* Fallback pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Package size={64} className="text-white/10 group-hover:scale-110 group-hover:text-white/20 transition-all duration-700" />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                       <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${statusLabel[prod.status]?.color || 'bg-white/10 text-white border-white/20'}`}>
                         {statusLabel[prod.status]?.text || prod.status}
                       </span>
                    </div>
                    {/* Sector Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                       <span className="text-[10px] font-bold text-white uppercase tracking-wider">{prod.sector.name}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4 text-primary font-medium text-sm">
                       <Tag size={16} />
                       <span>{prod.category}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {prod.name}
                    </h3>
                    
                    <p className="text-white/60 line-clamp-3 mb-8 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/40 group-hover:text-white/70 transition-colors">Lihat Detail</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
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
