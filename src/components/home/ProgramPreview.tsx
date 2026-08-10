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
      icon: <BookOpen size={24} className="text-accent" />,
      category: "Pendidikan & Lingkungan",
    },
    {
      id: "petani-milenial",
      title: "Inkubator Petani Milenial",
      desc: "Pelatihan dan pendampingan generasi muda untuk menjadi wirausaha pertanian modern.",
      icon: <Users size={24} className="text-accent" />,
      category: "Pemberdayaan",
    },
  ];

  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-6 text-xs font-semibold tracking-wider text-accent uppercase"
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
              className="bg-card border border-border p-8 rounded-2xl flex flex-col hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                {prog.icon}
              </div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{prog.category}</p>
              <h3 className="text-2xl font-bold text-white mb-4">{prog.title}</h3>
              <p className="text-white/70 mb-8 flex-1">{prog.desc}</p>
              
              <Link href={`/program/${prog.id}`} className="inline-flex items-center gap-2 font-medium text-white/90 hover:text-accent transition-colors mt-auto group">
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
          <Link href="/program" className="btn btn-outline px-8 py-3 text-base">
            Lihat Semua Program
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
