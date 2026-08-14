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
    ACTIVE: { text: "Berjalan", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    COMPLETED: { text: "Selesai", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    PLANNED: { text: "Rencana", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F0D] font-sans">

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-[#112316] to-[#0A0F0D]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold tracking-widest uppercase mb-6">
            Katalog Program
          </span>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
            Program CSR Kami
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Jelajahi seluruh inisiatif tanggung jawab sosial perusahaan yang telah dipublikasikan di berbagai sektor unggulan.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[72px] z-30 bg-[#0A0F0D]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <Filter size={16} className="text-white/40 flex-shrink-0" />
            <button
              onClick={() => setActiveSector("ALL")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                activeSector === "ALL"
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              Semua Sektor
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeSector === sector.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM GRID */}
      <section className="flex-1 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Counter */}
          <div className="mb-10">
            <p className="text-white/50 text-sm">
              Menampilkan <span className="text-white font-semibold">{filtered.length}</span> program
              {activeSector !== "ALL" && (
                <> dari sektor <span className="text-primary font-semibold">{sectors.find(s => s.id === activeSector)?.name}</span></>
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
                    className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[16/10] bg-[#112316] overflow-hidden">
                      {program.imageUrl && !program.imageUrl.includes("placeholder") ? (
                        <Image
                          src={program.imageUrl}
                          alt={program.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        {status.text}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Sector Badge */}
                      <span className="inline-block w-fit px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[11px] uppercase font-bold tracking-wider mb-3">
                        {program.sector.name}
                      </span>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-white/50 text-sm line-clamp-3 mb-6 flex-1">
                        {program.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <MapPin size={14} className="text-primary/70 flex-shrink-0" />
                          <span className="truncate">{program.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Users size={14} className="text-primary/70 flex-shrink-0" />
                          <span>{program.beneficiaries}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32">
              <Layers className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white/50 mb-2">Belum Ada Program</h3>
              <p className="text-white/30">
                {activeSector !== "ALL"
                  ? "Sektor ini belum memiliki program yang dipublikasikan."
                  : "Belum ada program CSR yang dipublikasikan saat ini."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-gradient-to-t from-[#112316]/50 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-playfair font-bold text-white mb-4">
            Tertarik dengan program kami?
          </h2>
          <p className="text-white/50 mb-8">
            Hubungi tim CSR kami untuk informasi lebih lanjut mengenai kolaborasi dan kemitraan.
          </p>
          <Link
            href="/tentang"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Pelajari Lebih Lanjut <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
