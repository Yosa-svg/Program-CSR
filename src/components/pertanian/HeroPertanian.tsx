"use client";

import { motion } from "framer-motion";

export default function HeroPertanian() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1592982537447-6f296b02008e?q=80&w=2070')",
        }}
      ></div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/60 to-background/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6 text-xs font-semibold tracking-wider text-accent uppercase"
        >
          SEKTOR CSR
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white"
        >
          Pertanian
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
        >
          Menumbuhkan kemandirian pangan dan ekonomi lokal melalui praktik pertanian modern dan berkelanjutan.
        </motion.p>
      </div>
    </section>
  );
}
