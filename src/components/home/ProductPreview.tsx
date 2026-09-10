"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ProductPreviewItem {
  id: string;
  name: string;
  description: string;
  slug: string;
  category?: string;
  imageUrl?: string | null;
  sector?: {
    name: string;
    slug: string;
  } | null;
}

interface ProductPreviewProps {
  products?: ProductPreviewItem[];
}

export default function ProductPreview({ products = [] }: ProductPreviewProps) {
  return (
    <section id="produk-karya" className="py-20 md:py-28 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-4 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
            >
              KREASI & PEMBERDAYAAN
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#172121]"
            >
              Produk & Karya Mitra Binaan
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#172121]/75 leading-relaxed mt-3 font-normal"
            >
              Ragam komoditas dan hasil kerajinan masyarakat dampingan CSR ANTAM UBPN Maluku Utara.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0"
          >
            <Link 
              href="/produk" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D726D] text-white text-sm font-bold hover:bg-[#0B5C58] transition-all shadow-md group"
            >
              Lihat Produk
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Product Cards Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const hasImage = product.imageUrl && !product.imageUrl.includes("placeholder");
              const categoryTag = product.category || product.sector?.name || "Mitra Binaan";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-white border border-[#E2E8E6] shadow-sm rounded-2xl overflow-hidden hover:border-[#0D726D]/40 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] bg-[#F7FAF9] relative overflow-hidden flex items-center justify-center border-b border-[#E2E8E6]">
                    {hasImage ? (
                      <Image
                        src={product.imageUrl!}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#0D726D]/30 p-6 text-center">
                        <ShoppingBag size={40} aria-hidden="true" />
                        <span className="text-xs mt-2 font-medium text-[#172121]/40">Karya Mitra Binaan</span>
                      </div>
                    )}

                    {/* Category / Sector Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#0D726D] shadow-sm backdrop-blur-md border border-[#E2E8E6]">
                        {categoryTag}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-[#172121] mb-2 group-hover:text-[#0D726D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-[#172121]/70 mb-6 text-sm font-normal leading-relaxed line-clamp-3 flex-1">
                      {product.description}
                    </p>

                    <div className="pt-4 border-t border-[#E2E8E6]/60 flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold text-[#5F6B6A]">
                        Karya Binaan CSR
                      </span>
                      <Link 
                        href={`/produk/${product.slug}`} 
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D726D] hover:text-[#0B5C58] transition-colors"
                      >
                        Detail Karya
                        <ArrowRight size={15} className="text-[#F6A236]" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 bg-[#0D726D]/10 text-[#0D726D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-lg text-[#172121] mb-1">
              Katalog Sedang Diperbarui
            </h3>
            <p className="text-sm text-[#172121]/65 mb-6">
              Produk dan karya mitra binaan sedang dalam proses katalogisasi publik.
            </p>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D726D] text-white text-xs font-bold hover:bg-[#0B5C58] transition-colors shadow-sm"
            >
              Lihat Halaman Produk <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
