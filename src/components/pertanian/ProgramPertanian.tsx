"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { Program } from "@prisma/client";

interface Props {
  programs: Program[];
}

export default function ProgramPertanian({ programs }: Props) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white"
          >
            Program Utama
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70"
          >
            Inisiatif strategis yang kami jalankan bersama komunitas.
          </motion.p>
        </div>

        {programs.map((program, index) => (
          <motion.div 
            key={program.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row mb-8 last:mb-0"
          >
            <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${program.imageUrl || "/images/sectors/agro-edu.jpg"}')` }}></div>
              {/* Fallback pattern */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-background/50"></div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-accent mb-6 text-xs font-semibold uppercase tracking-wider w-fit">
                Program Unggulan
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">{program.title}</h3>
              <p className="text-white/80 leading-relaxed mb-8">
                {program.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3">
                  <MapPin className="text-accent shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Lokasi</h4>
                    <p className="text-white/60 text-sm">{program.location || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-accent shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Penerima Manfaat</h4>
                    <p className="text-white/60 text-sm">{program.beneficiaries || "-"}</p>
                  </div>
                </div>
              </div>
              
              <Link href={`/program/${program.id}`} className="btn btn-primary w-fit px-8 py-3 flex items-center gap-2 group">
                Detail Program <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
