"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function ProgramPertanian() {
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

        {/* Featured Program Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/sectors/agro-edu.jpg')" }}></div>
            {/* Fallback pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-background/50"></div>
          </div>
          
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-accent mb-6 text-xs font-semibold uppercase tracking-wider w-fit">
              Program Unggulan
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">Agro Edu Wisata</h3>
            <p className="text-white/80 leading-relaxed mb-8">
              Kawasan terpadu yang memadukan kegiatan pariwisata ekologis dengan edukasi pertanian. 
              Di sini pengunjung tidak hanya menikmati keindahan alam, tapi juga belajar langsung 
              cara bertani organik dari para ahlinya.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-semibold text-sm">Lokasi</h4>
                  <p className="text-white/60 text-sm">Desa Suka Maju, Area Utara</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="text-accent shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-semibold text-sm">Penerima Manfaat</h4>
                  <p className="text-white/60 text-sm">120+ Kepala Keluarga</p>
                </div>
              </div>
            </div>
            
            <Link href="/program/agro-edu-wisata" className="btn btn-primary w-fit px-8 py-3 flex items-center gap-2 group">
              Detail Program <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
