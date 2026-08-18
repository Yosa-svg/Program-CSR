"use client";

import { motion } from "framer-motion";

export default function HeroPertanian() {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-24 pb-20 overflow-hidden bg-[#0D726D]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-overlay"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1592982537447-6f296b02008e?q=80&w=2070')",
        }}
      ></div>
      
      {/* 135deg Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/25 via-transparent to-black/50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 bg-white/15 backdrop-blur-md mb-6 text-xs font-bold tracking-wider text-white uppercase shadow-sm"
        >
          SEKTOR CSR • AGRO EDU WISATA
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-sm"
        >
          Pertanian Terpadu
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal"
        >
          Menumbuhkan kemandirian pangan dan ekonomi lokal melalui praktik pertanian modern ramah lingkungan dan integrasi wisata edukatif.
        </motion.p>
      </div>
    </section>
  );
}
