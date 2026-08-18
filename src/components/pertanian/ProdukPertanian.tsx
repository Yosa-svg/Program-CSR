"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Product } from "@prisma/client";

interface Props {
  products: Product[];
}

export default function ProdukPertanian({ products }: Props) {

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white"
            >
              Hasil Panen & Produk
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/70"
            >
              Komoditas berkualitas yang ditanam dengan penuh dedikasi oleh petani binaan.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/produk?sektor=pertanian" className="btn btn-outline px-6 py-2">
              Katalog Lengkap
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${product.imageUrl || "/images/placeholder.jpg"}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-background/20 z-0"></div>
                <ShoppingBag size={40} className="text-white/20 z-10 relative" />
              </div>
              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-white/70 text-sm mb-6 flex-1">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-accent">-</span>
                  <Link href={`/produk/${product.id}`} className="text-white hover:text-accent transition-colors">
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
