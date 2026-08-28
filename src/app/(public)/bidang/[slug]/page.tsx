import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Layers, Sprout, Box, ImageIcon, BarChart3, MapPin, Users, Calendar } from "lucide-react";
import { getSectorBySlug } from "@/lib/queries/sectors";
import { getPublishedPrograms } from "@/lib/queries/programs";
import { getPublishedActivities } from "@/lib/queries/activities";
import { getPublishedProducts } from "@/lib/queries/products";
import { getPublishedDocumentation } from "@/lib/queries/documentation";
import { getPublishedMetrics } from "@/lib/queries/metrics";

export const dynamic = "force-dynamic";

const SECTOR_ICONS: Record<string, string> = {
  pertanian: "🌱",
  peternakan: "🐄",
  lingkungan: "♻️",
  "industri-kelapa": "🥥",
  umkm: "🏪",
  pendidikan: "🎓",
  kesehatan: "🏥",
  infrastruktur: "🏗️",
  energi: "⚡",
  pariwisata: "🏖️",
};

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);
  if (!sector) return { title: "Sektor Tidak Ditemukan" };
  return {
    title: `${sector.name} | Bidang CSR`,
    description: `Program, kegiatan, dan inisiatif keberlanjutan sektor ${sector.name} dalam Kawasan Ekonomi Berkelanjutan.`,
  };
}

export default async function DynamicSectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  const [programs, activities, products, documentations, metrics] = await Promise.all([
    getPublishedPrograms(sector.id),
    getPublishedActivities(sector.id),
    getPublishedProducts(sector.id),
    getPublishedDocumentation(sector.id),
    getPublishedMetrics(sector.id),
  ]);

  const sectorIcon = SECTOR_ICONS[sector.slug] || "🌿";

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#172121]">
      {/* 1. HERO SECTION DENGAN GRADASI RESMI ANTAM */}
      <section 
        className="relative pt-32 pb-20 px-6 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-left mb-6">
            <Link 
              href="/bidang" 
              className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors shadow-sm"
            >
              <ArrowLeft size={14} /> Kembali ke Semua Sektor
            </Link>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-sm">
            <span>{sectorIcon}</span>
            <span>Sektor Binaan CSR</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-sm uppercase tracking-tight">
            {sector.name}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Inisiatif pemberdayaan masyarakat, kemitraan ekonomi, dan pelestarian lingkungan pada sektor {sector.name}.
          </p>
        </div>
      </section>

      {/* 2. DAFTAR PROGRAM CSR */}
      <section className="py-20 px-6 border-b border-[#E2E8E6] bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D726D] bg-[#0D726D]/10 px-3 py-1 rounded-md inline-block mb-2">
                Inisiatif Utama
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] flex items-center gap-3">
                <Layers className="text-[#0D726D]" size={32} />
                Program CSR
              </h2>
            </div>
            <p className="text-sm text-[#172121]/70 max-w-md">
              Program terencana jangka panjang yang berfokus pada kemandirian dan pertumbuhan berkelanjutan.
            </p>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((prog) => (
                <div 
                  key={prog.id} 
                  className="bg-white rounded-2xl border border-[#E2E8E6] overflow-hidden flex flex-col justify-between hover:border-[#0D726D]/50 hover:shadow-lg transition-all duration-300 group shadow-sm"
                >
                  <div>
                    {/* Gambar Thumbnail Program */}
                    <div className="relative aspect-video w-full bg-[#EBF2F0] overflow-hidden">
                      {prog.imageUrl ? (
                        <Image
                          src={prog.imageUrl}
                          alt={prog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0D726D]/10 to-[#F6A236]/10 text-4xl">
                          {sectorIcon}
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#0D726D] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {prog.status === "ACTIVE" ? "AKTIF" : prog.status}
                      </div>
                    </div>

                    {/* Info Konten */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D726D]">
                        <MapPin size={13} />
                        <span>{prog.location || "Kawasan Binaan"}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#172121] group-hover:text-[#0D726D] transition-colors leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-sm text-[#172121]/70 line-clamp-3 leading-relaxed">
                        {prog.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-[#E2E8E6] flex items-center justify-between text-xs font-semibold text-[#172121]/70">
                      <span className="flex items-center gap-1">
                        <Users size={13} className="text-[#0D726D]" />
                        {prog.beneficiaries || "Masyarakat"}
                      </span>
                      <Link 
                        href={`/program/${prog.slug}`} 
                        className="text-[#0D726D] font-bold hover:text-[#F6A236] inline-flex items-center gap-1 transition-colors"
                      >
                        Detail Program <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center text-[#172121]/60 border border-dashed border-[#CBD5E1] shadow-sm max-w-xl mx-auto">
              <Layers size={36} className="mx-auto mb-3 text-[#172121]/30" />
              <h4 className="font-bold text-[#172121] text-base mb-1">Belum Ada Program</h4>
              <p className="text-sm">Inisiatif program CSR untuk sektor {sector.name} sedang dalam proses kurasi dan penerbitan.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. KEGIATAN & PRODUK DUA KOLOM */}
      {(activities.length > 0 || products.length > 0) && (
        <section className="py-20 px-6 border-b border-[#E2E8E6] bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Kolom Kegiatan */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6A236] bg-[#F6A236]/10 px-3 py-1 rounded-md inline-block mb-2">
                  Aksi & Implementasi
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#172121] flex items-center gap-3">
                  <Sprout className="text-[#0D726D]" size={28} />
                  Kegiatan Lapangan
                </h2>
              </div>

              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div 
                      key={act.id} 
                      className="bg-[#F7FAF9] p-5 rounded-2xl border border-[#E2E8E6] hover:border-[#0D726D]/30 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-[#172121]/60 mb-2 font-medium">
                        <span className="flex items-center gap-1 text-[#0D726D]">
                          <MapPin size={12} /> {act.location || "Lokasi Binaan"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {act.date ? new Date(act.date).toLocaleDateString("id-ID") : "Terjadwal"}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#172121] text-base mb-1.5 leading-snug">{act.title}</h4>
                      <p className="text-sm text-[#172121]/70 line-clamp-2 leading-relaxed">{act.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F7FAF9] p-8 rounded-2xl text-center text-[#172121]/50 border border-dashed border-[#CBD5E1] text-sm">
                  Belum ada kegiatan yang dipublikasikan.
                </div>
              )}
            </div>

            {/* Kolom Produk */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D726D] bg-[#0D726D]/10 px-3 py-1 rounded-md inline-block mb-2">
                  Hasil Pemberdayaan
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#172121] flex items-center gap-3">
                  <Box className="text-[#F6A236]" size={28} />
                  Produk & Komoditas Binaan
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="bg-[#F7FAF9] p-5 rounded-2xl border border-[#E2E8E6] hover:border-[#0D726D]/30 transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-[#0D726D] uppercase bg-[#0D726D]/10 px-2 py-0.5 rounded inline-block mb-2">
                          {prod.category || "Komoditas"}
                        </span>
                        <h4 className="font-bold text-[#172121] text-base mb-1.5 leading-snug">{prod.name}</h4>
                        <p className="text-xs text-[#172121]/70 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E2E8E6] text-xs text-[#172121]/60 flex items-center justify-between font-semibold">
                        <span>{prod.capacity ? `Kapasitas: ${prod.capacity}` : "Tersedia"}</span>
                        <Link href={`/produk/${prod.slug}`} className="text-[#0D726D] font-bold hover:text-[#F6A236] transition-colors">
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F7FAF9] p-8 rounded-2xl text-center text-[#172121]/50 border border-dashed border-[#CBD5E1] text-sm">
                  Belum ada produk binaan yang dipublikasikan.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. DOKUMENTASI FOTO */}
      {documentations.length > 0 && (
        <section className="py-20 px-6 border-b border-[#E2E8E6] bg-[#F7FAF9]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D726D] bg-[#0D726D]/10 px-3 py-1 rounded-md inline-block mb-2">
                  Galeri Visual
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] flex items-center gap-3">
                  <ImageIcon className="text-[#0D726D]" size={32} />
                  Dokumentasi Lapangan
                </h2>
              </div>
              <p className="text-sm text-[#172121]/70 max-w-md">
                Rekaman visual interaksi nyata bersama mitra masyarakat dan kelompok binaan di lapangan.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {documentations.map((doc) => (
                <div 
                  key={doc.id} 
                  className="group relative rounded-2xl overflow-hidden bg-white border border-[#E2E8E6] aspect-square shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {doc.imageUrl ? (
                    <Image 
                      src={doc.imageUrl} 
                      alt={doc.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#172121]/30 text-xs">
                      Foto Dokumentasi
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-bold leading-snug">{doc.title}</span>
                    {doc.date && (
                      <span className="text-[10px] text-white/70 mt-1">
                        {new Date(doc.date).toLocaleDateString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. METRIK KINERJA */}
      {metrics.length > 0 && (
        <section className="py-20 px-6 border-b border-[#E2E8E6] bg-white">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6A236] bg-[#F6A236]/10 px-3 py-1 rounded-md inline-block mb-2">
                  Dampak Terukur
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] flex items-center gap-3">
                  <BarChart3 className="text-[#0D726D]" size={32} />
                  Capaian & Metrik Kinerja
                </h2>
              </div>
              <p className="text-sm text-[#172121]/70 max-w-md">
                Akuntabilitas data pencapaian dan dampak positif yang berhasil direalisasikan pada sektor ini.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {metrics.map((m) => (
                <div key={m.id} className="bg-[#F7FAF9] p-6 rounded-2xl border border-[#E2E8E6] shadow-sm">
                  <span className="text-xs font-bold text-[#172121]/60 uppercase tracking-wider block mb-2">
                    {m.name}
                  </span>
                  <div className="text-2xl md:text-3xl font-black text-[#0D726D]">
                    {m.realization !== null && m.realization !== undefined ? m.realization : m.value || "-"} {m.unit || ""}
                  </div>
                  {m.target && (
                    <span className="text-xs text-[#172121]/60 mt-1.5 block font-medium">
                      Target: {m.target} {m.unit || ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA FOOTER */}
      <section className="py-20 px-6 text-center bg-[#F7FAF9]">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-3xl">{sectorIcon}</span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#172121]">
            Ingin mengetahui lebih lanjut tentang program {sector.name}?
          </h3>
          <p className="text-[#172121]/70 text-base max-w-xl mx-auto">
            Jelajahi seluruh inisiatif terintegrasi dalam Kawasan Ekonomi Berkelanjutan.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/program" 
              className="px-6 py-3 bg-[#0D726D] text-white font-bold text-sm rounded-full shadow-sm hover:bg-[#0B5C58] transition-colors inline-flex items-center gap-2"
            >
              Lihat Seluruh Program <ArrowRight size={16} />
            </Link>
            <Link 
              href="/bidang" 
              className="px-6 py-3 bg-white text-[#172121] border border-[#CBD5E1] font-bold text-sm rounded-full hover:bg-slate-50 transition-colors"
            >
              Daftar Sektor Lainnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
