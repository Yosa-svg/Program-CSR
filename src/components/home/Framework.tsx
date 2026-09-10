"use client";

import { motion } from "framer-motion";
import { Globe, Scale, Trees, FileCheck } from "lucide-react";

const FRAMEWORKS = [
  {
    id: "iso26000",
    title: "ISO 26000",
    subtitle: "Panduan Tanggung Jawab Sosial",
    icon: <Globe size={22} aria-hidden="true" />,
    desc: "Rujukan prinsip pengintegrasian tanggung jawab sosial ke dalam operasional dan interaksi dengan masyarakat.",
  },
  {
    id: "sdgs",
    title: "SDGs",
    subtitle: "Tujuan Pembangunan Berkelanjutan",
    icon: <FileCheck size={22} aria-hidden="true" />,
    desc: "Penyelarasan program pemberdayaan dengan pilar pembangunan sosial, ekonomi, dan kelestarian lingkungan hidup.",
  },
  {
    id: "proper",
    title: "PROPER",
    subtitle: "Kinerja Pengelolaan Lingkungan",
    icon: <Trees size={22} aria-hidden="true" />,
    desc: "Pengelolaan lingkungan dan inisiatif pemberdayaan masyarakat di sekitar wilayah operasional pertambangan.",
  },
  {
    id: "regulasi",
    title: "Regulasi CSR & PPM",
    subtitle: "Ketentuan Perundang-undangan",
    icon: <Scale size={22} aria-hidden="true" />,
    desc: "Penyelenggaraan program sesuai kerangka regulasi tanggung jawab sosial dan pengembangan masyarakat.",
  },
];

export default function Framework() {
  return (
    <section id="kerangka-acuan" className="py-20 md:py-28 bg-[#F7FAF9] text-[#172121] border-t border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-5 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
          >
            STANDAR & RUJUKAN
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[#172121]"
          >
            Kerangka & Acuan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#172121]/75 leading-relaxed font-normal"
          >
            Penyelenggaraan program CSR ANTAM berlandaskan pada prinsip keberlanjutan dan acuan tata kelola yang bertanggung jawab.
          </motion.p>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FRAMEWORKS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-[#E2E8E6] rounded-2xl p-7 hover:border-[#0D726D]/40 hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="w-12 h-12 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0D726D] group-hover:text-white transition-colors">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl text-[#172121] mb-1">
                {item.title}
              </h3>

              <span className="text-xs font-semibold text-[#0D726D] mb-3">
                {item.subtitle}
              </span>

              <p className="text-xs sm:text-sm text-[#172121]/70 leading-relaxed font-normal flex-1">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
