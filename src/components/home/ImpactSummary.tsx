"use client";

import { motion } from "framer-motion";
import { Activity, Award } from "lucide-react";
import Link from "next/link";

export default function ImpactSummary() {
  return (
    <section className="py-24 bg-[#F7FAF9] text-[#172121] relative overflow-hidden border-t border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
            >
              KINERJA & DAMPAK
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#172121]"
            >
              Perubahan yang terukur.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#172121]/75 leading-relaxed mb-8 font-normal"
            >
              Kami memantau secara berkala setiap program untuk memastikan 
              bahwa intervensi yang diberikan benar-benar menciptakan 
              kemandirian dan perbaikan kualitas hidup.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href="/kinerja" 
                className="btn btn-outline-dark px-8 py-3 text-sm font-semibold shadow-sm"
              >
                Lihat Laporan Kinerja
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white shadow-sm border border-[#E2E8E6] p-8 rounded-2xl"
              >
                <div className="w-10 h-10 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-4">
                  <Activity size={20} />
                </div>
                <h4 className="text-4xl font-bold text-[#0D726D] mb-2">+45%</h4>
                <p className="text-[#172121]/70 font-medium text-sm">Peningkatan Pendapatan Mitra Binaan</p>
              </motion.div>

              {/* Highlight Card with Teal ANTAM & Orange Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#0D726D] border border-[#0B5C58] shadow-lg shadow-[#0D726D]/20 p-8 rounded-2xl text-white relative overflow-hidden"
              >
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-[#F6A236]">
                  <Award size={20} />
                </div>
                <h4 className="text-4xl font-bold text-white mb-2">3.200</h4>
                <p className="text-white/90 font-medium text-sm">Pohon Ditanam & Terawat</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white shadow-sm border border-[#E2E8E6] p-8 rounded-2xl sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div>
                  <h4 className="text-2xl font-bold text-[#172121] mb-1">Status Keberlanjutan</h4>
                  <p className="text-[#172121]/60 text-sm">Evaluasi Berkala Triwulan Q3 2026</p>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <span className="inline-flex items-center gap-1.5 text-white font-bold text-sm bg-[#0D726D] px-5 py-2 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#F6A236]"></span>
                    Sangat Baik
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
