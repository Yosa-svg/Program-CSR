"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sprout, Footprints, Recycle, Palmtree } from "lucide-react";
import Link from "next/link";

export default function Sectors() {
  const sectors = [
    {
      id: "pertanian",
      title: "PERTANIAN",
      subtitle: "Agro Edu Wisata",
      desc: "Pertanian ramah lingkungan dan integrasi pariwisata edukatif.",
      icon: <Sprout size={20} />,
      href: "/bidang/pertanian",
      accent: "teal",
    },
    {
      id: "peternakan",
      title: "PETERNAKAN",
      subtitle: "Inkubator Bisnis",
      desc: "Inkubasi usaha ternak komunal dan formulasi pakan silase mandiri.",
      icon: <Footprints size={20} />,
      href: "/bidang/peternakan",
      accent: "orange-teal",
    },
    {
      id: "lingkungan",
      title: "LINGKUNGAN",
      subtitle: "Daur Ulang & Pupuk Diversoil",
      desc: "Pengolahan limbah anorganik serta komposting Pupuk Diversoil.",
      icon: <Recycle size={20} />,
      href: "/bidang/lingkungan",
      accent: "teal",
    },
    {
      id: "industri-kelapa",
      title: "INDUSTRI KELAPA",
      subtitle: "Industri Kelapa Terpadu",
      desc: "Hilirisasi sabut kelapa: Coconet, Cocopeat, Cocopot, & Sapu.",
      icon: <Palmtree size={20} />,
      href: "/bidang/industri-kelapa",
      accent: "orange",
    }
  ];

  return (
    <section id="csr" className="py-24 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
            >
              SEKTOR CSR BERKELANJUTAN
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#172121]"
            >
              Ruang untuk tumbuh & berdampak.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#172121]/75 leading-relaxed font-normal"
            >
              Empat sektor utama pemberdayaan masyarakat dan pelestarian lingkungan dalam Kawasan Ekonomi Berkelanjutan.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              href="/bidang"
              className="btn btn-outline-dark px-6 py-2.5 inline-flex items-center gap-2 font-semibold text-sm shadow-sm"
            >
              Lihat Semua Sektor <ArrowRight size={16} className="text-[#F6A236]" />
            </Link>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={sector.href}
                className="group flex flex-col h-full bg-white border border-[#E2E8E6] rounded-2xl p-6 hover:border-[#0D726D]/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Top subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D] group-hover:bg-[#F6A236] transition-colors"></div>

                <div className="flex items-center justify-between mb-5 mt-1">
                  <div className="p-3 bg-[#0D726D] text-white rounded-xl shadow-md group-hover:bg-[#0B5C58] transition-colors">
                    {sector.icon}
                  </div>
                  <ArrowRight size={18} className="text-[#172121]/30 group-hover:text-[#F6A236] group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="font-bold text-xl text-[#172121] mb-1">
                  {sector.title}
                </h3>
                <span className="text-xs font-bold text-[#F6A236] uppercase tracking-wider mb-3">
                  Program: {sector.subtitle}
                </span>
                
                <p className="text-sm text-[#172121]/70 leading-relaxed mt-auto font-normal">
                  {sector.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
