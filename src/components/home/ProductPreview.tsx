"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export interface ProductPreviewItem {
  id: string;
  name: string;
  description: string;
  slug: string;
  category?: string;
  capacity?: string | null;
  unit?: string | null;
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
  const displayProducts = products.length > 0
    ? products.map((prod) => ({
        id: prod.id,
        name: prod.name,
        desc: prod.description,
        slug: prod.slug,
        price: prod.capacity
          ? `${prod.capacity} ${prod.unit || ""}`.trim()
          : (prod.category || "Produk Binaan"),
        image: prod.imageUrl && !prod.imageUrl.includes("placeholder") ? prod.imageUrl : "",
        href: `/produk/${prod.slug}`,
      }))
    : [
        {
          id: "beras-organik",
          name: "Beras Organik Premium",
          desc: "Beras sehat bebas pestisida hasil panen petani binaan Agro Edu Wisata.",
          price: "Rp 85.000 / 5kg",
          image: "/images/products/beras.jpg",
          href: "/produk",
        },
        {
          id: "pupuk-diversoil",
          name: "Pupuk Diversoil Kompos",
          desc: "Pupuk organik kaya hara hasil komposting sirkular limbah kawasan.",
          price: "Rp 35.000 / 10kg",
          image: "/images/products/kopi.jpg",
          href: "/produk",
        },
        {
          id: "coconet-kelapa",
          name: "Coconet & Sabut Kelapa",
          desc: "Produk ramah lingkungan karya pengrajin industri kelapa terpadu.",
          price: "Mulai Rp 25.000",
          image: "/images/products/anyaman.jpg",
          href: "/produk",
        },
      ];

  return (
    <section className="py-24 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
            >
              PRODUK LOKAL
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-[#172121]"
            >
              Dari kawasan<br/> untuk semua.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/produk" className="btn btn-primary px-7 py-3 rounded-full font-bold shadow-md">
              Katalog Produk
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="group bg-white border border-[#E2E8E6] shadow-sm rounded-2xl overflow-hidden hover:border-[#0D726D]/50 hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] bg-[#F7FAF9] relative overflow-hidden flex items-center justify-center border-b border-[#E2E8E6]">
                {product.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  ></div>
                ) : null}
                <ShoppingBag size={44} className="text-[#0D726D]/20 z-10 relative" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#172121] mb-2">{product.name}</h3>
                <p className="text-[#172121]/70 mb-6 text-sm font-normal leading-relaxed">{product.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E2E8E6]/60">
                  <span className="font-bold text-base text-[#0D726D]">{product.price}</span>
                  <Link href={product.href} className="text-[#F6A236] hover:text-[#E59124] transition-colors p-1">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
