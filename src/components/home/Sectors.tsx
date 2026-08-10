"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sprout, Store, Droplets, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function Sectors() {
  // Hanya fokus pada Pertanian sebagai acuan utama, dengan mock sektor lain agar layout terlihat utuh
  const sectors = [
    {
      id: "pertanian",
      title: "PERTANIAN",
      desc: "Pertanian yang tumbuh bersama masyarakat.",
      icon: <Sprout size={18} />,
      href: "/bidang/pertanian",
      image: "/images/sectors/pertanian.jpg"
    },
    {
      id: "umkm",
      title: "UMKM",
      desc: "Mendorong ekonomi lokal yang berdaya saing.",
      icon: <Store size={18} />,
      href: "/bidang/umkm",
      image: "/images/sectors/umkm.jpg"
    },
    {
      id: "lingkungan",
      title: "LINGKUNGAN",
      desc: "Menjaga kelestarian alam dan sumber daya.",
      icon: <Droplets size={18} />,
      href: "/bidang/lingkungan",
      image: "/images/sectors/lingkungan.jpg"
    },
    {
      id: "inovasi",
      title: "INOVASI",
      desc: "Menciptakan solusi baru untuk masa depan.",
      icon: <Lightbulb size={18} />,
      href: "/bidang/inovasi",
      image: "/images/sectors/inovasi.jpg"
    }
  ];

  return (
    <section id="csr" className="py-24 bg-card text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-background/50 mb-6 text-xs font-semibold tracking-wider text-accent uppercase"
            >
              BIDANG KAMI
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Ruang untuk tumbuh.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-foreground/80 leading-relaxed"
            >
              Setiap sektor memiliki potensi untuk menciptakan manfaat bagi masyarakat, 
              lingkungan, dan ekonomi kawasan.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className="btn btn-outline px-6 py-2">
              Lihat Semua Bidang
            </button>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${sector.image}')` }}
                ></div>
                {/* Fallback gradient if no image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-accent font-semibold text-xs tracking-wider mb-4 uppercase">
                  {sector.icon}
                  <span>{sector.title}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex-1 group-hover:text-accent transition-colors">
                  {sector.desc}
                </h3>
                
                <Link 
                  href={sector.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-white transition-colors mt-auto"
                >
                  Jelajahi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
