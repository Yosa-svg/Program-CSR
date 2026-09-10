"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#0A3D3A]">
      {/* Hero Background Gradient (Teal #0D726D to Dark Teal #0A3D3A with subtle Gold #F6A236 ambient glow) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0D726D 0%, #0A3D3A 55%, #172121 100%)",
        }}
      />

      {/* Decorative ambient radial glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#F6A236]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/10 w-96 h-96 bg-[#0D726D]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle depth vignette for crisp text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Text, Badge, Headings, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md mb-6 sm:mb-8 text-xs sm:text-sm font-semibold tracking-wide text-white uppercase shadow-sm self-start"
            >
              <Sparkles size={14} className="text-[#F6A236]" aria-hidden="true" />
              <span>CSR ANTAM — PT ANTAM Tbk UBPN Maluku Utara</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight mb-6 leading-[1.18] text-white"
            >
              Mendorong Kemandirian Berkelanjutan, Memberdayakan Masyarakat Lingkar Tambang.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg text-white/90 mb-8 sm:mb-10 leading-relaxed font-normal max-w-2xl drop-shadow-sm"
            >
              Kontribusi nyata ANTAM dalam pembangunan ekonomi, sosial, dan kelestarian lingkungan hidup di Maluku Utara melalui pemberdayaan masyarakat yang terencana, terukur, inklusif, dan berkelanjutan.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="/program"
                className="px-7 py-3.5 rounded-xl bg-white text-[#0D726D] hover:bg-[#F7FAF9] hover:text-[#0B5C58] flex justify-center items-center gap-2 group text-base font-bold shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Jelajahi Program
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform text-[#F6A236]"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/tentang"
                className="px-7 py-3.5 rounded-xl text-base font-semibold text-center border border-white/40 hover:bg-white/15 text-white backdrop-blur-sm transition-all shadow-sm"
              >
                Komitmen & Tata Kelola
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Video Highlight CSR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 flex flex-col justify-center w-full"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-black/40 shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full flex items-center justify-center group">
              {!videoError ? (
                <video
                  src="/videos/csr-hero-highlight.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : null}

              {/* Poster / Fallback Display when video has not been loaded or fails */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0D726D]/90 via-[#0A3D3A]/95 to-[#172121]">
                  <div className="relative w-44 h-14 mb-4 bg-white/10 rounded-xl p-2 flex items-center justify-center">
                    <Image
                      src="/images/antam-logo.png"
                      alt="Logo ANTAM"
                      width={150}
                      height={45}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-white font-serif text-lg font-bold mb-1">
                    CSR ANTAM UBPN Maluku Utara
                  </h2>
                  <p className="text-white/75 text-xs max-w-xs leading-relaxed">
                    Dedikasi dan aksi berkelanjutan untuk masyarakat lingkar tambang di Halmahera Timur.
                  </p>
                </div>
              )}

              {/* Elegant overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white/90 bg-black/50 backdrop-blur-md border border-white/15">
                  <Play size={11} className="text-[#F6A236] fill-[#F6A236]" aria-hidden="true" />
                  Highlight CSR ANTAM
                </span>
                <span className="text-[11px] text-white/70 font-medium bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                  UBPN Malut
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
