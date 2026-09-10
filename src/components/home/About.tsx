"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, HeartHandshake, Trees } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
            >
              <span>Tentang CSR ANTAM</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] text-[#172121] mb-8"
            >
              CSR ANTAM untuk Masyarakat dan Lingkungan
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#172121]/80 leading-relaxed mb-8 font-normal"
            >
              CSR ANTAM UBPN Maluku Utara diarahkan untuk menciptakan manfaat yang berkelanjutan bagi masyarakat dan lingkungan di sekitar wilayah operasional. Melalui pemberdayaan masyarakat, pengembangan potensi lokal, dan pengelolaan lingkungan, program CSR dirancang agar manfaat yang dihasilkan dapat tumbuh dan memberikan dampak dalam jangka panjang.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link 
                href="/tentang" 
                className="inline-flex items-center gap-2 font-bold text-[#0D726D] hover:text-[#0B5C58] transition-colors group text-base"
              >
                Selengkapnya Tentang CSR
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-[#F6A236]" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Clean, professional corporate visual card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden"
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0D726D]" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0D726D]/10 flex items-center justify-center text-[#0D726D]">
                  <ShieldCheck size={26} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#172121]">Komitmen Berkelanjutan</h3>
                  <p className="text-xs text-[#172121]/60">PT ANTAM Tbk UBPN Maluku Utara</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#E2E8E6]">
                <div className="flex items-start gap-3">
                  <HeartHandshake size={18} className="text-[#F6A236] shrink-0 mt-1" aria-hidden="true" />
                  <p className="text-sm text-[#172121]/75 leading-relaxed">
                    Kemitraan erat dengan komunitas lokal untuk menumbuhkan kemandirian ekonomi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Trees size={18} className="text-[#0D726D] shrink-0 mt-1" aria-hidden="true" />
                  <p className="text-sm text-[#172121]/75 leading-relaxed">
                    Penerapan prinsip kelestarian lingkungan dan keanekaragaman hayati secara konsisten.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8E6] flex items-center justify-between text-xs text-[#172121]/60">
                <span>Wilayah Operasional</span>
                <span className="font-semibold text-[#0D726D]">Halmahera Timur, Maluku Utara</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
