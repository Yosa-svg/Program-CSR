"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sprout, Footprints, Recycle, Palmtree } from "lucide-react";
import Link from "next/link";

export default function Sectors() {
  const sectors = [
    {
      id: "pertanian",
      title: "PERTANIAN",
      subtitle: "Program: Agro Edu Wisata",
      desc: "Pertanian ramah lingkungan dan integrasi pariwisata edukatif.",
      icon: <Sprout size={18} />,
      href: "/bidang/pertanian",
      image: "/images/sectors/pertanian.jpg"
    },
    {
      id: "peternakan",
      title: "PETERNAKAN",
      subtitle: "Program: Inkubator Bisnis",
      desc: "Inkubasi usaha ternak komunal dan formulasi pakan silase.",
      icon: <Footprints size={18} />,
      href: "/bidang/peternakan",
      image: "/images/sectors/peternakan.jpg"
    },
    {
      id: "lingkungan",
      title: "LINGKUNGAN",
      subtitle: "Program: Daur Ulang & Pupuk Diversoil",
      desc: "Pengolahan limbah plastik serta komposting Pupuk Diversoil.",
      icon: <Recycle size={18} />,
      href: "/bidang/lingkungan",
      image: "/images/sectors/lingkungan.jpg"
    },
    {
      id: "industri-kelapa",
      title: "INDUSTRI KELAPA",
      subtitle: "Program: Industri Kelapa Terpadu",
      desc: "Hilirisasi kelapa: Coconet, Cocopeat, Cocopot, & Sapu Sabut Kelapa.",
      icon: <Palmtree size={18} />,
      href: "/bidang/industri-kelapa",
      image: "/images/sectors/kelapa-terpadu.jpg"
    }
  ];

  return (
    <section id="csr" className="py-24 bg-white text-[#112316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase"
            >
              SEKTOR CSR BERKELANJUTAN
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Ruang untuk tumbuh & berdampak.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#112316]/80 leading-relaxed"
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
              className="btn border border-[#112316]/20 bg-transparent hover:bg-[#112316]/5 text-[#112316] transition-all px-6 py-2 inline-flex items-center gap-2"
            >
              Lihat Semua Sektor <ArrowRight size={16} />
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
                className="group flex flex-col h-full bg-[#112316]/[0.02] border border-[#112316]/10 rounded-2xl p-6 hover:border-[#112316]/30 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    {sector.icon}
                  </div>
                  <ArrowRight size={18} className="text-[#112316]/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="font-bold text-xl text-[#112316] mb-1">
                  {sector.title}
                </h3>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  {sector.subtitle}
                </span>
                
                <p className="text-sm text-[#112316]/70 leading-relaxed mt-auto">
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
