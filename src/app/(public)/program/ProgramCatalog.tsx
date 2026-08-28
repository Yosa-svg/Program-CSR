"use client";

import { useState } from "react";
import { Layers, MapPin, Users, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Program = {
  id: string;
  title: string;
  description: string;
  location: string;
  beneficiaries: string;
  status: string;
  imageUrl: string;
  isPublished: boolean;
  sectorId: string;
  slug: string;
  sector: {
    id: string;
    name: string;
    slug: string;
  };
};

type Sector = {
  id: string;
  name: string;
  slug: string;
};

export default function ProgramCatalog({
  programs,
  sectors,
}: {
  programs: Program[];
  sectors: Sector[];
}) {
  const [activeSector, setActiveSector] = useState<string>("ALL");

  const filtered =
    activeSector === "ALL"
      ? programs
      : programs.filter((p) => p.sectorId === activeSector);

  const statusLabel: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "Berjalan", color: "bg-[#0D726D]/15 text-[#0D726D] border-[#0D726D]/30" },
    COMPLETED: { text: "Selesai", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    PLANNED: { text: "Rencana", color: "bg-[#F6A236]/15 text-[#E59124] border-[#F6A236]/30" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#172121]">

      {/* HERO SECTION */}
      <section 
        className="relative pt-32 pb-20 px-6 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="relative max-w-7xl mx-auto z-10">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
            Katalog Program CSR
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Program Pemberdayaan Kami
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Jelajahi seluruh inisiatif tanggung jawab sosial perusahaan yang telah dipublikasikan di berbagai sektor.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8E6] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <Filter size={16} className="text-[#172121]/40 flex-shrink-0" />
            <button
              onClick={() => setActiveSector("ALL")}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                activeSector === "ALL"
                  ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                  : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#F7FAF9] hover:text-[#0D726D]"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeSector === sector.id
                    ? "bg-[#0D726D] text-white border-[#0D726D] shadow-sm"
                    : "bg-white text-[#172121]/70 border-[#E2E8E6] hover:bg-[#F7FAF9] hover:text-[#0D726D]"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM GRID */}
      <section className="flex-1 py-16 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto">
          
          {/* Counter */}
          <div className="mb-10">
            <p className="text-[#172121]/60 text-sm">
              Menampilkan <span className="text-[#172121] font-bold">{filtered.length}</span> program
              {activeSector !== "ALL" && (
                <> dari sektor <span className="text-[#0D726D] font-bold">{sectors.find(s => s.id === activeSector)?.name}</span></>
              )}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((program) => {
                const status = statusLabel[program.status] || statusLabel.ACTIVE;
                return (
                  <Link
                    href={`/program/${program.slug}`}
                    key={program.id}
                    className="group bg-white border border-[#E2E8E6] rounded-2xl overflow-hidden hover:border-[#0D726D]/50 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer shadow-sm relative"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D726D] group-hover:bg-[#F6A236] transition-colors z-20"></div>

                    {/* Card Image */}
                    <div className="relative aspect-[16/10] bg-[#F7FAF9] overflow-hidden border-b border-[#E2E8E6]">
                      {program.imageUrl && !program.imageUrl.includes("placeholder") ? (
                        <Image
                          src={program.imageUrl}
                          alt={program.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers className="w-12 h-12 text-[#0D726D]/20" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${status.color}`}>
                        {status.text}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Sector Badge */}
                      <span className="inline-block w-fit px-2.5 py-1 bg-[#F6A236]/15 text-[#E59124] border border-[#F6A236]/30 rounded-lg text-[11px] uppercase font-bold tracking-wider mb-3">
                        {program.sector.name}
                      </span>

                      <h3 className="text-xl font-bold text-[#172121] mb-2 group-hover:text-[#0D726D] transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-[#172121]/70 text-sm line-clamp-3 mb-6 flex-1 font-normal">
                        {program.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 pt-4 border-t border-[#E2E8E6]">
                        <div className="flex items-center gap-2 text-[#172121]/60 text-sm">
                          <MapPin size={14} className="text-[#0D726D] flex-shrink-0" />
                          <span className="truncate">{program.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#172121]/60 text-sm">
                          <Users size={14} className="text-[#0D726D] flex-shrink-0" />
                          <span>{program.beneficiaries}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-2xl border border-[#E2E8E6]">
              <Layers className="w-16 h-16 text-[#172121]/20 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-[#172121]/60 mb-2">Belum Ada Program</h3>
              <p className="text-[#172121]/40 text-sm">
                {activeSector !== "ALL"
                  ? "Sektor ini belum memiliki program yang dipublikasikan."
                  : "Belum ada program CSR yang dipublikasikan saat ini."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-white border-t border-[#E2E8E6]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-[#172121] mb-4">
            Tertarik dengan program kami?
          </h2>
          <p className="text-[#172121]/70 mb-8 font-normal">
            Hubungi tim CSR kami untuk informasi lebih lanjut mengenai kolaborasi dan kemitraan berkelanjutan.
          </p>
          <Link
            href="/tentang"
            className="btn btn-primary px-8 py-3.5 rounded-full font-bold shadow-md inline-flex items-center gap-2"
          >
            Pelajari Lebih Lanjut <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
