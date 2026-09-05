import type { Metadata } from "next";
import { getPublishedProgramBySlug } from "@/lib/queries/programs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Users, Target, Activity, CheckCircle, Package, ArrowLeft, Lightbulb, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createMetadata } from "@/lib/seo";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const program = await getPublishedProgramBySlug(resolvedParams.slug);

  if (!program || !program.isPublished) {
    return createMetadata({
      title: "Program Tidak Ditemukan",
      noIndex: true,
    });
  }

  const cleanDescription = program.description
    ? program.description.length > 160
      ? `${program.description.slice(0, 157)}...`
      : program.description
    : `Inisiatif program CSR ${program.title} pada sektor ${program.sector?.name || "Keberlanjutan"}.`;

  return createMetadata({
    title: `${program.title} | Program CSR`,
    description: cleanDescription,
    canonical: `/program/${program.slug}`,
    imageUrl: program.imageUrl,
  });
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const resolvedParams = await params;
  const program = await getPublishedProgramBySlug(resolvedParams.slug);

  if (!program || !program.isPublished) {
    notFound();
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "Berjalan", color: "bg-[#0D726D]/15 text-[#0D726D] border-[#0D726D]/30" },
    COMPLETED: { text: "Selesai", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    PLANNED: { text: "Rencana", color: "bg-[#F6A236]/15 text-[#E59124] border-[#F6A236]/30" },
  };
  const status = statusLabel[program.status] || statusLabel.ACTIVE;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans pt-24 text-[#172121]">
      {/* 1. HERO & HEADER */}
      <section 
        className="relative text-white py-16 px-6 shadow-md overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/program" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-sm font-semibold">
            <ArrowLeft size={16} /> Kembali ke Katalog Program
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-block px-3.5 py-1 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                  Sektor {program.sector.name}
                </span>
                <span className={`inline-block px-3.5 py-1 border rounded-full text-xs font-bold backdrop-blur-md bg-white/95 text-[#0D726D]`}>
                  Status: {status.text}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 drop-shadow-sm">
                {program.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-normal">
                {program.description}
              </p>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {program.imageUrl && !program.imageUrl.includes("placeholder") ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <Image src={program.imageUrl} alt={program.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
                   <Target className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY METRICS BAR */}
      <section className="bg-white border-b border-[#E2E8E6] sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D726D]/10 flex items-center justify-center text-[#0D726D]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-[#172121]/50 font-medium">Lokasi Pelaksanaan</p>
              <p className="text-sm font-bold text-[#172121]">{program.location || "Data belum tersedia"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6A236]/10 flex items-center justify-center text-[#F6A236]">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-[#172121]/50 font-medium">Penerima Manfaat</p>
              <p className="text-sm font-bold text-[#172121]">{program.beneficiaries || "Data belum tersedia"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTENT GRID */}
      <section className="py-16 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Activities */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Activity className="text-[#0D726D] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#172121]">Kegiatan Terkait</h2>
              </div>
              
              {program.activities.length > 0 ? (
                <div className="space-y-4">
                  {program.activities.map(activity => (
                    <div key={activity.id} className="bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-[#172121]">{activity.title}</h3>
                        <span className="text-xs font-bold text-[#0D726D] bg-[#0D726D]/10 px-3 py-1 rounded-full w-fit">
                          {activity.date ? format(new Date(activity.date), "dd MMMM yyyy", { locale: id }) : "Segera"}
                        </span>
                      </div>
                      <p className="text-[#172121]/70 mb-4 text-sm leading-relaxed">{activity.description}</p>
                      {activity.location && (
                        <div className="flex items-center gap-2 text-xs text-[#172121]/50">
                          <MapPin size={14} className="text-[#0D726D]" /> {activity.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-[#172121]/50 border border-[#E2E8E6]">
                  Belum ada kegiatan yang dipublikasikan untuk program ini.
                </div>
              )}
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Package className="text-[#F6A236] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#172121]">Produk Binaan</h2>
              </div>
              
              {program.products.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {program.products.map(product => (
                    <div key={product.id} className="bg-white border border-[#E2E8E6] rounded-2xl overflow-hidden shadow-sm group hover:border-[#0D726D]/40 transition-all">
                      <div className="aspect-[4/3] relative bg-[#F7FAF9] border-b border-[#E2E8E6]">
                        {product.imageUrl && !product.imageUrl.includes("placeholder") ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-[#172121]/20" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded text-xs font-semibold text-[#172121] border border-[#E2E8E6]">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-[#172121] mb-2">{product.name}</h3>
                        <p className="text-sm text-[#172121]/70 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-[#172121]/50 border border-[#E2E8E6]">
                  Belum ada produk binaan yang terdaftar untuk program ini.
                </div>
              )}
            </div>
            
            {/* Documentation */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-[#0D726D] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#172121]">Galeri Dokumentasi</h2>
              </div>
              
              {program.documentations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {program.documentations.map((doc, idx) => (
                    <div key={doc.id} className={`relative bg-white rounded-2xl overflow-hidden group border border-[#E2E8E6] ${idx === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}>
                      {doc.imageUrl && !doc.imageUrl.includes("placeholder") ? (
                        <Image src={doc.imageUrl} alt={doc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-[#172121]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-medium truncate">{doc.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-[#172121]/50 border border-[#E2E8E6]">
                  Belum ada dokumentasi untuk program ini.
                </div>
              )}
            </div>

          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            
            <div className="bg-white border border-[#E2E8E6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#172121] mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-[#F6A236]" /> Rantai Dampak
              </h3>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-amber-300 relative pb-2">
                  <div className="absolute w-3 h-3 bg-[#F6A236] rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-[#172121]">Output</h4>
                  <p className="text-xs text-[#172121]/50 mt-1">Data sedang dihimpun</p>
                </div>
                <div className="pl-4 border-l-2 border-[#0D726D]/30 relative pb-2">
                  <div className="absolute w-3 h-3 bg-[#0D726D] rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-[#172121]">Outcome</h4>
                  <p className="text-xs text-[#172121]/50 mt-1">Data sedang dihimpun</p>
                </div>
                <div className="pl-4 border-l-2 border-transparent relative">
                  <div className="absolute w-3 h-3 bg-[#172121] rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-[#172121]">Impact</h4>
                  <p className="text-xs text-[#172121]/50 mt-1">Data sedang dihimpun</p>
                </div>
              </div>
            </div>

            <div className="bg-[#172121] text-white rounded-2xl p-6 shadow-md border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-[#0D726D]" /> Dukungan & Mitra
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Program ini terlaksana atas dukungan berbagai pihak dan mitra strategis kami.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Pemerintah Daerah</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Koperasi Warga</span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
