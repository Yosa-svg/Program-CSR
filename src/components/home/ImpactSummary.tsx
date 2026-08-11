"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function ImpactSummary() {
  return (
    <section 
      className="py-24 text-[#112316] relative overflow-hidden border-t border-gray-100"
      style={{
        background: `radial-gradient(circle at top right, rgba(69, 117, 79, 0.12), transparent 40%), linear-gradient(180deg, #ffffff 0%, #f4fbf6 50%, #ffffff 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase"
            >
              KINERJA & DAMPAK
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Perubahan yang terukur.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#112316]/80 leading-relaxed mb-8"
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
              <Link href="/kinerja" className="btn border border-[#112316]/20 bg-transparent hover:bg-[#112316]/5 text-[#112316] transition-all px-8 py-3 text-base">
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
                className="bg-white shadow-sm border border-gray-200 p-8 rounded-2xl"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity size={20} className="text-primary" />
                </div>
                <h4 className="text-4xl font-bold text-[#112316] mb-2">+45%</h4>
                <p className="text-[#112316]/70">Peningkatan Pendapatan Petani Binaan</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-primary border border-primary/50 shadow-md p-8 rounded-2xl"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Activity size={20} className="text-white" />
                </div>
                <h4 className="text-4xl font-bold text-white mb-2">3.200</h4>
                <p className="text-white/90">Pohon Ditanam Tahun Ini</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white shadow-sm border border-gray-200 p-8 rounded-2xl sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div>
                  <h4 className="text-2xl font-bold text-[#112316] mb-1">Status Keberlanjutan</h4>
                  <p className="text-[#112316]/70">Evaluasi Triwulan Q3 2026</p>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <span className="inline-flex items-center gap-1 text-primary font-bold text-xl bg-primary/10 px-4 py-2 rounded-lg">
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
