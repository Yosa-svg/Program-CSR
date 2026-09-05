"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export interface ProgramPreviewItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  sector?: {
    id?: string;
    name: string;
    slug: string;
  } | null;
}

interface ProgramPreviewProps {
  programs?: ProgramPreviewItem[];
}

export default function ProgramPreview({ programs = [] }: ProgramPreviewProps) {
  const displayPrograms = programs.length > 0
    ? programs.map((p, i) => ({
        id: p.id,
        title: p.title,
        desc: p.description,
        slug: p.slug,
        category: p.sector?.name ? `Sektor ${p.sector.name}` : "Program Unggulan",
        icon: i % 2 === 0 ? <BookOpen size={22} className="text-white" /> : <Users size={22} className="text-white" />,
        href: p.slug ? `/program/${p.slug}` : "/program",
      }))
    : [
        {
          id: "agro-edu",
          title: "Agro Edu Wisata",
          desc: "Program edukasi dan wisata berbasis pertanian terpadu untuk masyarakat umum dan pelajar.",
          slug: "agro-edu-wisata",
          icon: <BookOpen size={22} className="text-white" />,
          category: "Pendidikan & Lingkungan",
          href: "/program",
        },
        {
          id: "petani-milenial",
          title: "Inkubator Petani & Peternak",
          desc: "Pelatihan dan pendampingan generasi muda untuk menjadi wirausaha agribisnis dan peternakan modern.",
          slug: "inkubator-bisnis-peternakan-sapi-komunal",
          icon: <Users size={22} className="text-white" />,
          category: "Pemberdayaan",
          href: "/program",
        },
      ];

  return (
    <section className="py-24 bg-[#F7FAF9] text-[#172121] border-t border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
          >
            PROGRAM CSR
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#172121]"
          >
            Langkah nyata,<br/> dampak berkelanjutan.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayPrograms.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="bg-white border border-[#E2E8E6] shadow-sm p-8 rounded-2xl flex flex-col hover:border-[#0D726D]/40 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F6A236]"></div>

              <div className="w-12 h-12 bg-[#0D726D] rounded-xl flex items-center justify-center mb-6 text-white shadow-md shadow-[#0D726D]/20 group-hover:bg-[#0B5C58] transition-colors">
                {prog.icon}
              </div>
              <p className="text-xs font-bold text-[#F6A236] uppercase tracking-wider mb-2">{prog.category}</p>
              <h3 className="text-2xl font-bold text-[#172121] mb-4">{prog.title}</h3>
              <p className="text-[#172121]/70 mb-8 flex-1 leading-relaxed font-normal">{prog.desc}</p>

              <Link
                href={prog.href}
                className="inline-flex items-center gap-2 font-bold text-[#0D726D] hover:text-[#0B5C58] transition-colors mt-auto group"
              >
                Pelajari Program <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#F6A236]" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/program"
            className="btn btn-outline-dark px-8 py-3 text-sm font-semibold shadow-sm"
          >
            Lihat Semua Program
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
