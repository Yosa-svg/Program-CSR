"use client";

import { motion } from "framer-motion";
import { Activity, Award, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export interface ImpactMetricItem {
  id: string;
  name: string;
  category: string;
  realization: number | null;
  unit: string | null;
  year?: number | null;
  sector?: {
    name: string;
  } | null;
}

interface ImpactSummaryProps {
  metrics?: ImpactMetricItem[];
}

export default function ImpactSummary({ metrics = [] }: ImpactSummaryProps) {
  const hasValidMetrics =
    metrics.length > 0 &&
    metrics.some((m) => m.realization !== null && m.realization !== undefined);

  return (
    <section id="kinerja-dampak" className="py-20 md:py-28 bg-[#F7FAF9] text-[#172121] border-t border-[#E2E8E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-5 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
            >
              AKUNTABILITAS & CAPAIAN
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[#172121]"
            >
              Dampak & Kinerja CSR
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#172121]/75 leading-relaxed mb-8 font-normal"
            >
              Pemantauan berkala terhadap program CSR ANTAM UBPN Maluku Utara untuk memastikan ketercapaian target dan manfaat jangka panjang bagi masyarakat.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link 
                href="/kinerja" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0D726D] text-white text-sm font-bold hover:bg-[#0B5C58] transition-all shadow-md group"
              >
                Lihat Kinerja CSR
                <ArrowRight size={16} className="text-[#F6A236] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Cards */}
          <div className="lg:col-span-7">
            {hasValidMetrics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {metrics.slice(0, 2).map((metric, idx) => {
                  const valStr =
                    metric.realization !== null
                      ? `${metric.realization.toLocaleString("id-ID")}${metric.unit ? " " + metric.unit : ""}`
                      : "-";

                  const isPrimary = idx === 0;

                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      className={`p-8 rounded-2xl border transition-all shadow-sm ${
                        isPrimary
                          ? "bg-white border-[#E2E8E6]"
                          : "bg-[#0D726D] border-[#0B5C58] text-white shadow-[#0D726D]/15"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                          isPrimary
                            ? "bg-[#0D726D]/10 text-[#0D726D]"
                            : "bg-white/15 text-[#F6A236] backdrop-blur-sm"
                        }`}
                      >
                        {isPrimary ? <Activity size={22} aria-hidden="true" /> : <Award size={22} aria-hidden="true" />}
                      </div>

                      <h3
                        className={`text-3xl sm:text-4xl font-bold mb-2 ${
                          isPrimary ? "text-[#0D726D]" : "text-white"
                        }`}
                      >
                        {valStr}
                      </h3>

                      <p
                        className={`text-sm font-medium leading-snug ${
                          isPrimary ? "text-[#172121]/75" : "text-white/90"
                        }`}
                      >
                        {metric.name}
                      </p>

                      {metric.sector?.name && (
                        <span
                          className={`inline-block text-[11px] font-semibold mt-3 px-2.5 py-0.5 rounded-full ${
                            isPrimary
                              ? "bg-[#0D726D]/10 text-[#0D726D]"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {metric.sector.name}
                        </span>
                      )}
                    </motion.div>
                  );
                })}

                {/* Status Evaluation Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-white border border-[#E2E8E6] p-7 rounded-2xl sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-lg text-[#172121] mb-1">
                      Status Pemantauan Program
                    </h3>
                    <p className="text-[#172121]/60 text-xs">
                      Evaluasi kinerja program CSR dilakukan secara bertahap dan terverifikasi.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#0D726D]/10 text-[#0D726D] shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#0D726D]" />
                    Terverifikasi CMS
                  </span>
                </motion.div>
              </div>
            ) : (
              /* State "Dalam Proses Evaluasi" */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white border border-[#E2E8E6] rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden"
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#F6A236]" />

                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6A236]/10 text-[#F6A236] flex items-center justify-center shrink-0">
                    <Clock size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F6A236]/15 text-[#D97706] mb-1">
                      Dalam Proses Evaluasi
                    </span>
                    <h3 className="font-bold text-xl text-[#172121]">
                      Pengukuran Dampak & Realisasi
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#172121]/75 leading-relaxed mb-6 font-normal">
                  Data dampak dan realisasi program saat ini sedang dalam tahapan verifikasi serta evaluasi berkala bersama pemangku kepentingan untuk memastikan keakuratan dan akuntabilitas data.
                </p>

                <div className="pt-4 border-t border-[#E2E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#172121]/60">
                  <span>Unit Pengelola: PT ANTAM Tbk UBPN Maluku Utara</span>
                  <Link
                    href="/kinerja"
                    className="text-[#0D726D] font-bold hover:text-[#0B5C58] inline-flex items-center gap-1 transition-colors"
                  >
                    Informasi Kinerja <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
