"use client";

import { motion } from "framer-motion";
import { Compass, Users, ClipboardCheck, ArrowRight } from "lucide-react";

const STAGES = [
  {
    step: "Tahap 01",
    title: "Pemetaan Sosial",
    icon: <Compass size={24} aria-hidden="true" />,
    description:
      "Identifikasi kondisi, potensi, dan kebutuhan masyarakat di sekitar wilayah operasional sebagai basis perumusan program yang tepat sasaran.",
  },
  {
    step: "Tahap 02",
    title: "Partisipasi Masyarakat",
    icon: <Users size={24} aria-hidden="true" />,
    description:
      "Pelibatan pemangku kepentingan dan masyarakat secara kolaboratif untuk memperkuat kemitraan serta rasa kepemilikan bersama terhadap program.",
  },
  {
    step: "Tahap 03",
    title: "Perencanaan & Evaluasi",
    icon: <ClipboardCheck size={24} aria-hidden="true" />,
    description:
      "Penyusunan rencana kerja yang terstruktur disertai pemantauan berkala dan evaluasi terarah demi keberlanjutan manfaat bagi masyarakat.",
  },
];

export default function Planning() {
  return (
    <section id="perencanaan-csr" className="py-20 md:py-28 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-5 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
          >
            PENDEKATAN PROGRAM
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[#172121]"
          >
            Terencana, Terukur, Tepat Sasaran
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#172121]/75 leading-relaxed font-normal"
          >
            Siklus perencanaan terpadu yang mendasari setiap langkah inisiatif CSR ANTAM UBPN Maluku Utara.
          </motion.p>
        </div>

        {/* 3 Step Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STAGES.map((stage, index) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative flex flex-col h-full bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-8 hover:border-[#0D726D]/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D726D]/10 text-[#0D726D] uppercase tracking-wider">
                  {stage.step}
                </span>
                <div className="w-11 h-11 bg-white border border-[#E2E8E6] text-[#0D726D] rounded-xl flex items-center justify-center shadow-sm">
                  {stage.icon}
                </div>
              </div>

              <h3 className="font-bold text-xl text-[#172121] mb-3">
                {stage.title}
              </h3>

              <p className="text-sm text-[#172121]/70 leading-relaxed font-normal flex-1">
                {stage.description}
              </p>

              {/* Progress connector indicator */}
              {index < STAGES.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[#0D726D]/40">
                  <ArrowRight size={20} aria-hidden="true" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
