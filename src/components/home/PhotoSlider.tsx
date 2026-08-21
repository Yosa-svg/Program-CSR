"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, ArrowRight, MapPin } from "lucide-react";

interface SlideItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  sectorSlug: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "1",
    title: "Budidaya & Edukasi Pertanian Ramah Lingkungan",
    category: "Agro Edu Wisata",
    location: "Desa Suka Maju",
    image: "/images/slider/csr_pertanian_1.jpg",
    sectorSlug: "pertanian",
  },
  {
    id: "2",
    title: "Konservasi Pesisir & Penanaman Mangrove",
    category: "Lingkungan",
    location: "Kawasan Reklamasi",
    image: "/images/slider/csr_mangrove.jpg",
    sectorSlug: "lingkungan",
  },
  {
    id: "3",
    title: "Inkubasi Usaha Peternakan Komunal",
    category: "Peternakan",
    location: "Kandang Komunal",
    image: "/images/slider/csr_peternakan_1.jpg",
    sectorSlug: "peternakan",
  },
  {
    id: "4",
    title: "Survei Lapangan & Pemetaan Kawasan",
    category: "Perencanaan",
    location: "Kawasan Ekonomi Terpadu",
    image: "/images/slider/csr_survey.jpg",
    sectorSlug: "bidang",
  },
  {
    id: "5",
    title: "Panen Raya Bersama Kelompok Tani Binaan",
    category: "Pertanian",
    location: "Lahan Tani Berkelanjutan",
    image: "/images/slider/csr_pertanian_2.jpg",
    sectorSlug: "pertanian",
  },
  {
    id: "6",
    title: "Forum Dialog & Diskusi Bersama Tokoh Warga",
    category: "Pemberdayaan",
    location: "Balai Komunitas",
    image: "/images/slider/csr_discussion.jpg",
    sectorSlug: "bidang",
  },
  {
    id: "7",
    title: "Pengolahan Limbah Sirkular & Fasilitas Hijau",
    category: "Lingkungan",
    location: "Pusat Daur Ulang",
    image: "/images/slider/csr_plant.jpg",
    sectorSlug: "lingkungan",
  },
  {
    id: "8",
    title: "Pemberdayaan Pengrajin & Keterampilan UMKM",
    category: "Industri Kelapa",
    location: "Sentra Olahan Kelapa",
    image: "/images/slider/csr_empowerment.jpg",
    sectorSlug: "industri-kelapa",
  },
];

export default function PhotoSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Duplicate for seamless infinite marquee effect
  const marqueeItems = [...SLIDES, ...SLIDES];

  return (
    <section className="relative py-16 md:py-24 bg-[#F7FAF9] border-b border-[#E2E8E6] overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0D726D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F6A236]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
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

            <Link
              href="/dokumentasi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E2E8E6] text-xs font-bold text-[#0D726D] hover:bg-[#0D726D] hover:text-white hover:border-[#0D726D] shadow-sm transition-all"
            >
              Lihat Semua Galeri <ArrowRight size={14} className="text-[#F6A236] group-hover:text-white" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CONTINUOUS PHOTO TRACK (with pause-on-hover & interactive swipe) */}
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right Edge Blur Gradient Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#F7FAF9] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#F7FAF9] to-transparent z-10 pointer-events-none" />

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none scroll-smooth px-4 sm:px-6"
        >
          <div className={`flex gap-5 sm:gap-6 py-2 ${!isHovered ? "animate-marquee" : ""}`}>
            {marqueeItems.map((slide, idx) => {
              const targetUrl = slide.sectorSlug === "bidang" ? "/bidang" : `/bidang/${slide.sectorSlug}`;
              return (
                <Link
                  key={`${slide.id}-${idx}`}
                  href={targetUrl}
                  className="relative group w-[280px] sm:w-[320px] md:w-[350px] h-[340px] sm:h-[380px] md:h-[400px] shrink-0 rounded-3xl overflow-hidden bg-white border border-[#E2E8E6] shadow-sm hover:shadow-2xl hover:border-[#0D726D]/50 transition-all duration-500 cursor-pointer block"
                >
                  {/* Photo Image */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 280px, 350px"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/95 text-[#0D726D] shadow-md backdrop-blur-md border border-white/60">
                      {slide.category}
                    </span>
                  </div>

                  {/* Top Right Orange Dot Indicator */}
                  <div className="absolute top-4 right-4 z-20 w-2.5 h-2.5 rounded-full bg-[#F6A236] ring-4 ring-white/60 shadow-sm" />

                  {/* Dark Gradient Overlay for Caption Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300 z-10" />

                  {/* Caption & Location Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col justify-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-2">
                      <MapPin size={13} className="text-[#F6A236] shrink-0" />
                      <span>{slide.location}</span>
                    </div>

                    <h3 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-sm group-hover:text-white transition-colors">
                      {slide.title}
                    </h3>

                    <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/75 group-hover:text-white">
                      <span className="text-[#F6A236]">Aksi Lapangan</span>
                      <span className="inline-flex items-center gap-1 text-white/90 group-hover:translate-x-1 transition-transform">
                        Detail <ArrowRight size={13} className="text-[#F6A236]" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
