"use client";

import { motion } from "framer-motion";
import { Leaf, Sprout, Sun } from "lucide-react";

export default function AboutPertanian() {
  const pillars = [
    {
      title: "Praktik Organik",
      desc: "Mengurangi penggunaan bahan kimia sintetis demi menjaga kualitas tanah dan kesehatan lingkungan.",
      icon: <Leaf size={24} className="text-accent" />
    },
    {
      title: "Pemberdayaan Petani",
      desc: "Pelatihan teknik pertanian modern dan manajemen bisnis untuk meningkatkan nilai tukar petani.",
      icon: <Sprout size={24} className="text-accent" />
    },
    {
      title: "Ketahanan Pangan",
      desc: "Optimalisasi lahan untuk diversifikasi tanaman pangan guna memastikan ketersediaan pangan lokal.",
      icon: <Sun size={24} className="text-accent" />
    }
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-6 text-white"
            >
              Fokus Kami di Sektor Pertanian
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-white/80 leading-relaxed mb-8"
            >
              Sektor pertanian adalah urat nadi perekonomian kawasan. Melalui intervensi CSR, 
              kami berupaya memutus rantai kemiskinan dengan cara memberikan akses kepada inovasi, 
              teknologi, dan pasar yang lebih luas bagi para petani lokal.
            </motion.p>
          </div>

          <div className="space-y-6">
            {pillars.map((pillar, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className="bg-background/50 border border-border p-6 rounded-2xl flex gap-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 shrink-0 bg-primary/20 rounded-xl flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-white/70">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
