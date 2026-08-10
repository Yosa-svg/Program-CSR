"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/hero/hero.jpg')",
        }}
      ></div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-background/30 sm:bg-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10">
        <div className="max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8 text-xs font-semibold tracking-wider text-white/80 uppercase"
          >
            Kawasan Ekonomi Berkelanjutan
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            <span className="text-white block">Ekonomi tumbuh.</span>
            <span className="text-accent block mt-2">Alam tetap utuh.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-white/90 mb-10 leading-relaxed"
          >
            Membangun kawasan ekonomi berkelanjutan melalui pemberdayaan masyarakat, pengelolaan sumber daya, dan inovasi lokal yang berdampak nyata.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button className="btn btn-primary px-8 py-3 rounded-md flex justify-center items-center gap-2 group text-base">
              Jelajahi Kawasan
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn btn-outline px-8 py-3 rounded-md text-base text-center">
              Lihat Program
            </button>
          </motion.div>
          
          {/* Stats section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 border-t border-white/20 pt-8"
          >
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">1.840+</p>
              <p className="text-sm text-white/70">Penerima Manfaat</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">12</p>
              <p className="text-sm text-white/70">Desa Terhubung</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">6</p>
              <p className="text-sm text-white/70">Bidang Aktif</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
