"use client";

import { motion } from "framer-motion";
import { FileText, Briefcase, Eye, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const GOVERNANCE_PILLARS = [
  {
    id: "perencanaan",
    title: "Perencanaan",
    icon: <FileText size={22} aria-hidden="true" />,
    desc: "Penetapan sasaran dan perumusan inisiatif berbasis pemetaan kebutuhan riil masyarakat.",
  },
  {
    id: "pelaksanaan",
    title: "Pelaksanaan",
    icon: <Briefcase size={22} aria-hidden="true" />,
    desc: "Realisasi program secara tertib, transparan, dan melibatkan partisipasi aktif pemangku kepentingan.",
  },
  {
    id: "monitoring",
    title: "Monitoring",
    icon: <Eye size={22} aria-hidden="true" />,
    desc: "Pemantauan berkala di lapangan guna memastikan keselarasan jadwal dan kualitas pekerjaan.",
  },
  {
    id: "evaluasi",
    title: "Evaluasi",
    icon: <BarChart3 size={22} aria-hidden="true" />,
    desc: "Penilaian dampak dan efektivitas kegiatan sebagai landasan perbaikan berkelanjutan.",
  },
];

export default function Governance() {
  return (
    <section id="tata-kelola-csr" className="py-20 md:py-28 bg-white text-[#172121]">
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
            PRINSIP TATA KELOLA
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#172121]"
          >
            Tata Kelola CSR
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#172121]/80 leading-relaxed font-normal"
          >
            Pelaksanaan CSR diarahkan melalui proses yang terencana, terdokumentasi, dan dapat dievaluasi untuk mendukung manfaat yang berkelanjutan bagi masyarakat dan lingkungan.
          </motion.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {GOVERNANCE_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-2xl p-7 hover:border-[#0D726D]/40 hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="w-12 h-12 bg-white border border-[#E2E8E6] rounded-xl flex items-center justify-center text-[#0D726D] shadow-sm mb-5 group-hover:bg-[#0D726D] group-hover:text-white transition-colors">
                {pillar.icon}
              </div>

              <h3 className="font-bold text-lg text-[#172121] mb-2">
                {pillar.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#172121]/70 leading-relaxed font-normal flex-1">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white border border-[#0D726D] text-[#0D726D] text-sm font-bold hover:bg-[#0D726D] hover:text-white transition-all shadow-sm group"
          >
            Pelajari Tata Kelola
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#F6A236]" aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
