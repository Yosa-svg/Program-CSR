"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Sprout, HandCoins } from "lucide-react";

export default function KinerjaPertanian() {
  const stats = [
    {
      title: "Petani Binaan",
      value: "450+",
      desc: "Kepala keluarga di 5 desa",
      icon: <Users size={24} className="text-white" />,
      color: "bg-blue-500"
    },
    {
      title: "Luas Lahan",
      value: "120 Ha",
      desc: "Dikelola secara organik",
      icon: <Sprout size={24} className="text-white" />,
      color: "bg-emerald-500"
    },
    {
      title: "Peningkatan Hasil",
      value: "35%",
      desc: "Dibandingkan tahun sebelumnya",
      icon: <TrendingUp size={24} className="text-white" />,
      color: "bg-orange-500"
    },
    {
      title: "Omzet Bulanan",
      value: "Rp 250Jt",
      desc: "Rata-rata penjualan produk",
      icon: <HandCoins size={24} className="text-white" />,
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-6 text-xs font-semibold tracking-wider text-accent uppercase"
          >
            Kinerja Sektor
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white"
          >
            Dampak yang Terukur
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70"
          >
            Komitmen kami untuk terus memantau dan meningkatkan efektivitas program.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-bl-full opacity-10`}></div>
              
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <h4 className="text-4xl font-bold text-white mb-2">{stat.value}</h4>
              <p className="font-semibold text-white/90 mb-1">{stat.title}</p>
              <p className="text-sm text-white/50">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
