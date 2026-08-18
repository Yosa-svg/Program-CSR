"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-[#0A1612]">
      {/* Background Image with subtle overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity"
        style={{ 
          backgroundImage: "url('/images/hero/hero.jpg')",
        }}
      ></div>
      
      {/* Hero Background Gradient (Teal #0F6E56 to Blue #185FA5 Left-to-Right) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0F6E56] via-[#0F6E56]/90 to-[#185FA5]"></div>
      
      {/* Subtle depth vignette for high text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10">
        <div className="max-w-[680px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md mb-8 text-xs font-bold tracking-wider text-white uppercase shadow-sm"
          >
            Kawasan Ekonomi Berkelanjutan
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            <span className="text-white block drop-shadow-sm">Ekonomi tumbuh.</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 drop-shadow-sm">
              Alam tetap utuh.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-white/95 mb-10 leading-relaxed font-normal max-w-xl drop-shadow-sm"
          >
            Membangun kawasan ekonomi berkelanjutan melalui pemberdayaan masyarakat, pengelolaan sumber daya, dan inovasi lokal yang berdampak nyata.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link 
              href="/bidang"
              className="btn btn-primary px-8 py-3.5 rounded-xl flex justify-center items-center gap-2 group text-base font-semibold shadow-xl shadow-black/20 hover:scale-[1.02] transition-all"
            >
              Jelajahi Kawasan
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/program"
              className="btn btn-outline px-8 py-3.5 rounded-xl text-base font-semibold text-center border-white/40 hover:bg-white/15 text-white backdrop-blur-sm transition-all"
            >
              Lihat Program
            </Link>
          </motion.div>
          
          {/* Stats section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 md:mt-20 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 border-t border-white/20 pt-8"
          >
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-sm">1.840+</p>
              <p className="text-sm text-white/85 font-medium">Penerima Manfaat</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-sm">12</p>
              <p className="text-sm text-white/85 font-medium">Desa Terhubung</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-sm">4</p>
              <p className="text-sm text-white/85 font-medium">Sektor Aktif</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
