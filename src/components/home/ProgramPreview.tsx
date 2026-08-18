"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function ProgramPreview() {
  const programs = [
    {
      id: "agro-edu",
      title: "Agro Edu Wisata",
      desc: "Program edukasi dan wisata berbasis pertanian terpadu untuk masyarakat umum dan pelajar.",
      icon: <BookOpen size={24} className="text-white" />,
      category: "Pendidikan & Lingkungan",
    },
    {
      id: "petani-milenial",
      title: "Inkubator Petani Milenial",
      desc: "Pelatihan dan pendampingan generasi muda untuk menjadi wirausaha pertanian modern.",
      icon: <Users size={24} className="text-white" />,
      category: "Pemberdayaan",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#f4fbf6] to-white text-[#112316] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-gradient-to-r from-[#0F6E56]/10 to-[#185FA5]/10 mb-6 text-xs font-bold tracking-wider text-[#0F6E56] uppercase"
          >
            PROGRAM UNGGULAN
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Langkah nyata,<br/> dampak berkelanjutan.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl flex flex-col hover:border-[#0F6E56]/50 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#0F6E56] to-[#185FA5] rounded-xl flex items-center justify-center mb-6 text-white shadow-md shadow-[#0F6E56]/20">
                {prog.icon}
              </div>
              <p className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider mb-2">{prog.category}</p>
              <h3 className="text-2xl font-bold text-[#112316] mb-4">{prog.title}</h3>
              <p className="text-[#112316]/70 mb-8 flex-1">{prog.desc}</p>
              
              <Link 
                href={`/program`} 
                className="inline-flex items-center gap-2 font-bold text-[#0F6E56] hover:text-[#185FA5] transition-colors mt-auto group"
              >
                Pelajari Program <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
            className="btn border border-[#112316]/20 bg-transparent hover:bg-[#112316]/5 text-[#112316] transition-all px-8 py-3 text-base font-semibold"
          >
            Lihat Semua Program
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
