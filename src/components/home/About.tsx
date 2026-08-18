"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-[#f4fbf6] text-[#112316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-gradient-to-r from-[#0F6E56]/10 to-[#185FA5]/10 backdrop-blur-sm mb-8 text-xs font-bold tracking-wider text-[#0F6E56] uppercase"
            >
              TENTANG KAMI
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[#112316]"
            >
              Satu kawasan,<br />
              <span className="text-[#112316]/60">banyak kemungkinan.</span>
            </motion.h2>
          </div>
          
          {/* Right Side */}
          <div className="md:pt-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-[#112316]/80 leading-relaxed mb-8"
            >
              Kawasan Ekonomi Berkelanjutan hadir untuk menyatukan potensi masyarakat,
              sumber daya, dan inovasi lokal.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href="#csr" 
                className="inline-flex items-center gap-2 font-bold text-[#0F6E56] hover:text-[#185FA5] transition-colors group"
              >
                Kenali pendekatan kami
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
