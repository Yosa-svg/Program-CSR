"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ProgramPreviewItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  sector?: {
    id?: string;
    name: string;
    slug?: string;
  } | null;
}

interface ProgramPreviewProps {
  programs?: ProgramPreviewItem[];
}

export default function ProgramPreview({ programs = [] }: ProgramPreviewProps) {
  return (
    <section id="program-unggulan" className="py-20 md:py-28 bg-[#F7FAF9] text-[#172121] border-t border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-4 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
            >
              PROGRAM CSR UNGGULAN
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#172121]"
            >
              Program CSR Unggulan
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#172121]/75 leading-relaxed mt-3 font-normal"
            >
              Inisiatif strategis CSR ANTAM UBPN Maluku Utara dalam mendorong kemandirian dan kesejahteraan masyarakat.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0"
          >
            <Link 
              href="/program" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E2E8E6] text-sm font-bold text-[#0D726D] hover:bg-[#0D726D] hover:text-white hover:border-[#0D726D] transition-all shadow-sm group"
            >
              Lihat Semua Program
              <ArrowRight size={16} className="text-[#F6A236] group-hover:text-white group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Program Cards Grid */}
        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, index) => {
              const hasImage = prog.imageUrl && !prog.imageUrl.includes("placeholder");

              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border border-[#E2E8E6] rounded-2xl overflow-hidden shadow-sm hover:border-[#0D726D]/40 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="aspect-[16/10] bg-[#0D726D]/5 relative overflow-hidden flex items-center justify-center border-b border-[#E2E8E6]">
                    {hasImage ? (
                      <Image
                        src={prog.imageUrl!}
                        alt={prog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#0D726D]/40 p-6 text-center">
                        <Layers size={36} aria-hidden="true" />
                        <span className="text-xs mt-2 font-medium text-[#172121]/50">Dokumentasi Program</span>
                      </div>
                    )}

                    {/* Sector Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#0D726D] shadow-sm backdrop-blur-md border border-[#E2E8E6]">
                        {prog.sector?.name || "Program CSR"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-[#172121] mb-3 group-hover:text-[#0D726D] transition-colors line-clamp-2">
                      {prog.title}
                    </h3>

                    <p className="text-sm text-[#172121]/70 leading-relaxed font-normal mb-6 line-clamp-3 flex-1">
                      {prog.description}
                    </p>

                    <div className="pt-4 border-t border-[#E2E8E6]/60 mt-auto">
                      <Link
                        href={`/program/${prog.slug}`}
                        className="inline-flex items-center gap-2 font-bold text-sm text-[#0D726D] hover:text-[#0B5C58] transition-colors group/link"
                      >
                        Pelajari Program
                        <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform text-[#F6A236]" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#E2E8E6] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 bg-[#0D726D]/10 text-[#0D726D] rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-lg text-[#172121] mb-1">
              Program Sedang Dipersiapkan
            </h3>
            <p className="text-sm text-[#172121]/65 mb-6">
              Saat ini program unggulan sedang dalam proses pemutakhiran publikasi data resmi.
            </p>
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D726D] text-white text-xs font-bold hover:bg-[#0B5C58] transition-colors shadow-sm"
            >
              Lihat Direktori Program <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
