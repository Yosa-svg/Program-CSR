"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CtaPertanian() {
  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-8 text-white"
        >
          Eksplorasi Sektor Lainnya
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/bidang" className="btn btn-outline px-8 py-3 flex items-center gap-2 group w-full sm:w-auto justify-center">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Bidang
          </Link>
          <Link href="/bidang/umkm" className="btn btn-primary px-8 py-3 flex items-center gap-2 group w-full sm:w-auto justify-center">
            Selanjutnya: UMKM <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
