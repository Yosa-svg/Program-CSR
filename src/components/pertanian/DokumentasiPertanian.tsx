"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function DokumentasiPertanian() {
  const photos = [
    "/images/sectors/pertanian-doc-1.jpg",
    "/images/sectors/pertanian-doc-2.jpg",
    "/images/sectors/pertanian-doc-3.jpg",
    "/images/sectors/pertanian-doc-4.jpg",
    "/images/sectors/pertanian-doc-5.jpg",
    "/images/sectors/pertanian-doc-6.jpg",
  ];

  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl font-bold tracking-tight mb-4 text-white"
          >
            Dokumentasi Lapangan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70"
          >
            Potret kegiatan dan semangat para petani di lapangan.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="aspect-square bg-muted rounded-xl overflow-hidden relative group"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${src}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera size={32} className="text-white/80" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
