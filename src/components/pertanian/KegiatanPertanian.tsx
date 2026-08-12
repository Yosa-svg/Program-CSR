"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2 } from "lucide-react";

import { Activity } from "@prisma/client";

interface Props {
  activities: Activity[];
}

export default function KegiatanPertanian({ activities }: Props) {

  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl font-bold tracking-tight mb-4 text-white"
            >
              Agenda Kegiatan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/70 mb-6"
            >
              Konsistensi adalah kunci. Kami mendampingi petani secara rutin dari fase tanam hingga pascapanen.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-6">
              {activities.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  className="bg-background border border-border p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-2 text-accent bg-accent/10 px-4 py-2 rounded-lg shrink-0">
                    <CalendarDays size={16} />
                    <span className="text-sm font-semibold">{item.date ? new Date(item.date).toLocaleDateString('id-ID') : 'Segera'}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
