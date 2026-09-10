"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trees, Store, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const FOCUS_AREAS = [
  {
    id: "pendidikan",
    title: "Pendidikan",
    icon: <GraduationCap size={24} aria-hidden="true" />,
    description:
      "Peningkatan mutu sumber daya manusia melalui dukungan fasilitas belajar, pelatihan kecakapan hidup, dan penguatan kapasitas generasi muda lingkar tambang.",
    href: "/program",
  },
  {
    id: "lingkungan",
    title: "Lingkungan",
    icon: <Trees size={24} aria-hidden="true" />,
    description:
      "Perlindungan ekosistem alam, konservasi keanekaragaman hayati, serta inisiatif pengelolaan lingkungan hidup yang berkelanjutan di kawasan sekitar operasional.",
    href: "/program",
  },
  {
    id: "ekonomi-umk",
    title: "Ekonomi & UMK",
    icon: <Store size={24} aria-hidden="true" />,
    description:
      "Pengembangan kewirausahaan lokal, penguatan kapasitas mitra binaan, serta hilirisasi produk dan komoditas unggulan masyarakat.",
    href: "/produk",
  },
  {
    id: "sosial-masyarakat",
    title: "Sosial & Masyarakat",
    icon: <Users size={24} aria-hidden="true" />,
    description:
      "Pemberdayaan kelembagaan warga, peningkatan kualitas hidup masyarakat, dan pemeliharaan harmoni sosial berbasis nilai-nilai kearifan lokal.",
    href: "/program",
  },
];

export default function Focus() {
  return (
    <section id="fokus-csr" className="py-20 md:py-28 bg-[#F7FAF9] text-[#172121] border-y border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-5 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
          >
            PILAR PEMBERDAYAAN
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[#172121]"
          >
            Fokus CSR
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#172121]/75 leading-relaxed font-normal"
          >
            Arah dan pilar strategis CSR ANTAM UBPN Maluku Utara untuk menciptakan kemandirian masyarakat dan kelestarian ekosistem.
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOCUS_AREAS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="group flex flex-col h-full bg-white border border-[#E2E8E6] rounded-2xl p-7 hover:border-[#0D726D]/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                {/* Top subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D] group-hover:bg-[#F6A236] transition-colors" />

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#0D726D] text-white rounded-xl shadow-md flex items-center justify-center group-hover:bg-[#0B5C58] transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-[#5F6B6A]/70 group-hover:text-[#F6A236] transition-colors">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-bold text-xl text-[#172121] mb-3 group-hover:text-[#0D726D] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#172121]/70 leading-relaxed font-normal flex-1">
                  {item.description}
                </p>

                <div className="mt-6 pt-4 border-t border-[#E2E8E6]/60 flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="text-xs font-bold text-[#0D726D] hover:text-[#0B5C58] inline-flex items-center gap-1.5 transition-colors"
                  >
                    Selengkapnya
                    <ArrowRight size={13} className="text-[#F6A236] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
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
