"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

export type SliderDocumentation = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  date?: Date | null;
  sector?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function PhotoSlider({ 
  documentations = [] 
}: { 
  documentations?: SliderDocumentation[] 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Duplicate for seamless infinite marquee effect if items exist
  const marqueeItems = documentations.length > 0
    ? (documentations.length < 4
        ? [...documentations, ...documentations, ...documentations, ...documentations]
        : [...documentations, ...documentations])
    : [];

  return (
    <section className="relative py-14 md:py-20 bg-[#F7FAF9] border-b border-[#E2E8E6] overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0D726D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F6A236]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0D726D]/20 bg-[#0D726D]/10 mb-4 text-xs font-bold tracking-wider text-[#0D726D] uppercase shadow-sm"
            >
              <Camera size={13} className="text-[#F6A236]" />
              Dokumentasi & Aksi Lapangan
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#172121]"
            >
              Kehadiran nyata, dampak berkelanjutan.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-[#172121]/70 mt-3 max-w-2xl font-normal leading-relaxed"
            >
              Potret aktivitas kolaboratif pendampingan masyarakat, kemitraan ekonomi, dan konservasi lingkungan di kawasan binaan.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 shrink-0"
          >
            {/* Manual Navigation Controls */}
            {documentations.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-[#E2E8E6] bg-white hover:bg-[#F7FAF9] text-[#172121] hover:text-[#0D726D] hover:border-[#0D726D]/30 flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-[#E2E8E6] bg-white hover:bg-[#F7FAF9] text-[#172121] hover:text-[#0D726D] hover:border-[#0D726D]/30 flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <Link
              href="/dokumentasi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E2E8E6] text-xs font-bold text-[#0D726D] hover:bg-[#0D726D] hover:text-white hover:border-[#0D726D] shadow-sm transition-all"
            >
              Lihat Semua Galeri <ArrowRight size={14} className="text-[#F6A236] group-hover:text-white" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* PHOTO SLIDER TRACK */}
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right Edge Blur Gradient Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#F7FAF9] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#F7FAF9] to-transparent z-10 pointer-events-none" />

        {marqueeItems.length > 0 ? (
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-none scroll-smooth px-4 sm:px-6"
          >
            <div className={`flex gap-5 sm:gap-6 py-3 ${!isHovered ? "animate-marquee" : ""}`}>
              {marqueeItems.map((item, idx) => {
                const targetUrl = item.sector?.slug 
                  ? `/bidang/${item.sector.slug}` 
                  : "/dokumentasi";

                return (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={targetUrl}
                    className="relative group w-[260px] sm:w-[300px] md:w-[340px] h-[300px] sm:h-[340px] md:h-[380px] shrink-0 rounded-3xl overflow-hidden border border-[#CBD5D1] shadow-sm hover:shadow-xl hover:border-[#0D726D]/50 transition-all duration-300 cursor-pointer block bg-card"
                  >
                    {/* Real Image */}
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      sizes="(max-width: 768px) 260px, 340px"
                    />

                    {/* Dark gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Sector Badge at Top Left */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#0D726D]/90 text-white backdrop-blur-md shadow-md border border-white/10">
                        <Sparkles size={11} className="text-[#F6A236]" />
                        {item.sector?.name || "CSR ANTAM"}
                      </span>
                    </div>

                    {/* Content Info at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                      <h3 className="font-bold text-base sm:text-lg line-clamp-1 leading-snug drop-shadow-sm group-hover:text-[#F6A236] transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 text-center bg-card rounded-2xl border border-border mx-6">
            <p className="text-foreground/60 text-sm">
              Belum ada foto dokumentasi yang dipilih untuk slider beranda. Silakan pin foto di menu Admin Dokumentasi.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
