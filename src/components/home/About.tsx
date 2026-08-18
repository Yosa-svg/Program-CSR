"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-8 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
            >
              TENTANG KAMI
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[#172121]"
            >
              Satu kawasan,<br />
              <span className="text-[#172121]/50">banyak kemungkinan.</span>
            </motion.h2>
          </div>
          
          {/* Right Side */}
          <div className="md:pt-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-[#172121]/80 leading-relaxed mb-8 font-normal"
            >
              Kawasan Ekonomi Berkelanjutan hadir untuk menyatukan potensi masyarakat,
              sumber daya, dan inovasi lokal yang berorientasi pada kemandirian jangka panjang.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href="/tentang" 
                className="inline-flex items-center gap-2 font-bold text-[#0D726D] hover:text-[#0B5C58] transition-colors group text-base"
              >
                Kenali pendekatan kami
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-[#F6A236]" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
