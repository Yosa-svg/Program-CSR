"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ProductPreview() {
  const products = [
    {
      id: "beras-organik",
      name: "Beras Organik Premium",
      desc: "Beras sehat bebas pestisida hasil panen petani binaan.",
      price: "Rp 85.000 / 5kg",
      image: "/images/products/beras.jpg",
    },
    {
      id: "kopi-robusta",
      name: "Kopi Robusta Lokal",
      desc: "Biji kopi pilihan yang dipanggang sempurna oleh UMKM lokal.",
      price: "Rp 45.000 / 250g",
      image: "/images/products/kopi.jpg",
    },
    {
      id: "kerajinan-bambu",
      name: "Kerajinan Anyaman Bambu",
      desc: "Produk ramah lingkungan karya pengrajin desa.",
      price: "Mulai Rp 20.000",
      image: "/images/products/anyaman.jpg",
    }
  ];

  return (
    <section className="py-24 bg-white text-[#112316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-gradient-to-r from-[#0F6E56]/10 to-[#185FA5]/10 mb-6 text-xs font-bold tracking-wider text-[#0F6E56] uppercase"
            >
              PRODUK LOKAL
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
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
            <Link href="/produk" className="btn btn-primary px-7 py-3 rounded-xl font-semibold shadow-lg shadow-teal-900/20">
              Katalog Produk
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="group bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:border-[#0F6E56]/50 hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${product.image}')` }}
                ></div>
                {/* Fallback pattern/gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent z-0"></div>
                <ShoppingBag size={48} className="text-[#112316]/10 z-10 relative" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#112316] mb-2">{product.name}</h3>
                <p className="text-[#112316]/70 mb-6 text-sm">{product.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-base text-[#0F6E56]">{product.price}</span>
                  <Link href={`/produk`} className="text-[#0F6E56] hover:text-[#185FA5] transition-colors">
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
