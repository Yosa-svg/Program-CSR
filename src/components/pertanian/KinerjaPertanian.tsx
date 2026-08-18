"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Sprout, HandCoins } from "lucide-react";

type MetricItem = {
  id: string;
  name: string;
  value: string | null;
  unit: string | null;
  period: string | null;
  description: string | null;
  target?: number | null;
  realization?: number | null;
};

interface Props {
  metrics: MetricItem[];
}

export default function KinerjaPertanian({ metrics }: Props) {
  const displayConfig = [
    { icon: <Users size={22} className="text-white" />, color: "bg-[#0D726D]" },
    { icon: <Sprout size={22} className="text-white" />, color: "bg-[#F6A236]" },
    { icon: <TrendingUp size={22} className="text-white" />, color: "bg-[#0D726D]" },
    { icon: <HandCoins size={22} className="text-white" />, color: "bg-[#F6A236]" }
  ];

  return (
    <section className="py-24 bg-[#F7FAF9] border-t border-[#E2E8E6] text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-6 text-xs font-bold tracking-wider text-[#0D726D] uppercase"
          >
            Kinerja Sektor
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[#172121]"
          >
            Dampak yang Terukur
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#172121]/70 font-normal"
          >
            Komitmen kami untuk terus memantau dan meningkatkan efektivitas program secara berkelanjutan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => {
            const config = displayConfig[i % displayConfig.length];
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="bg-white border border-[#E2E8E6] shadow-sm rounded-2xl p-6 relative overflow-hidden"
              >
                <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                  {config.icon}
                </div>
                <h4 className="text-3xl font-bold text-[#0D726D] mb-2">{metric.value} {metric.unit}</h4>
                <p className="font-bold text-[#172121] mb-1 text-sm">{metric.name}</p>
                <p className="text-xs text-[#172121]/60 font-normal">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
