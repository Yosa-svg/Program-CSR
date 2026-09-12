"use client";

import { motion } from "framer-motion";
import { MapPin, Building2, ArrowRight, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="kontak" className="py-20 md:py-28 bg-white text-[#172121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7FAF9] border border-[#E2E8E6] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-5 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
              >
                INFORMASI & KOORDINASI
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[#172121]"
              >
                Terhubung dengan Kami
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-[#172121]/75 leading-relaxed mb-8 max-w-2xl font-normal"
              >
                Untuk informasi lebih lanjut mengenai inisiatif kemitraan, program pemberdayaan masyarakat, dan tata kelola CSR, silakan hubungi unit pengelola kami.
              </motion.p>

              <div className="space-y-4 text-sm text-[#172121]/80">
                <div className="flex items-start gap-3">
                  <Building2 size={19} className="text-[#0D726D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-[#172121] block">
                      PT ANTAM Tbk UBPN Maluku Utara
                    </span>
                    <span className="text-xs text-[#172121]/60">Unit Bisnis Pertambangan Nikel Maluku Utara</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={19} className="text-[#F6A236] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Buli, Kecamatan Maba, Kabupaten Halmahera Timur, Maluku Utara
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={19} className="text-[#0D726D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-xs text-[#172121]/60 font-medium">Telepon / WhatsApp Admin:</span>
                    <a
                      href="https://wa.me/6281347748187"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#172121] hover:text-[#0D726D] transition-colors inline-flex items-center gap-1.5"
                    >
                      +62 813-4774-8187
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={19} className="text-[#0D726D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-xs text-[#172121]/60 font-medium">Email Kontak Admin:</span>
                    <a
                      href="mailto:admin.csr-ubpnmalut@antam.com"
                      className="font-semibold text-[#172121] hover:text-[#0D726D] transition-colors break-all"
                    >
                      admin.csr-ubpnmalut@antam.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              <a
                href="https://wa.me/6281347748187"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0D726D] text-white text-sm font-bold hover:bg-[#0B5C58] transition-all shadow-md flex items-center justify-center gap-2 group text-center"
              >
                Hubungi via WhatsApp
                <ArrowRight size={16} className="text-[#F6A236] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="mailto:admin.csr-ubpnmalut@antam.com"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-[#E2E8E6] text-[#172121] text-sm font-semibold hover:border-[#0D726D]/50 hover:bg-[#F7FAF9] transition-all flex items-center justify-center text-center"
              >
                Kirim Email Admin
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
