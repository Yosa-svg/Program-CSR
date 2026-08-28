import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers, Sprout, Box, ImageIcon, BarChart3 } from "lucide-react";
import { getSectorBySlug } from "@/lib/queries/sectors";
import { getPublishedPrograms } from "@/lib/queries/programs";
import { getPublishedActivities } from "@/lib/queries/activities";
import { getPublishedProducts } from "@/lib/queries/products";
import { getPublishedDocumentation } from "@/lib/queries/documentation";
import { getPublishedMetrics } from "@/lib/queries/metrics";

export const dynamic = "force-dynamic";

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

  return (
    <div className="flex flex-col min-h-screen bg-card">
      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 bg-muted-bg border-b border-border">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link 
            href="/bidang" 
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline uppercase tracking-wider mb-2"
          >
            <ArrowLeft size={14} /> Kembali ke Semua Sektor
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                Sektor Binaan CSR
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground uppercase tracking-tight">
                {sector.name}
              </h1>
              <p className="text-lg text-foreground/70 font-normal max-w-2xl mt-3">
                Inisiatif pemberdayaan masyarakat, kemitraan ekonomi, dan pelestarian lingkungan pada sektor {sector.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. DAFTAR PROGRAM */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <Layers className="text-primary" size={28} />
              Program CSR
            </h2>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((prog) => (
                <div key={prog.id} className="bg-muted-bg p-6 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md inline-block">
                      {prog.location || "Kawasan Binaan"}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">{prog.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-3">{prog.description}</p>
                  </div>
                  <div className="pt-5 mt-5 border-t border-border/70 flex items-center justify-between text-xs font-semibold text-foreground/60">
                    <span>👥 {prog.beneficiaries || "Masyarakat Binaan"}</span>
                    <Link href={`/program/${prog.slug}`} className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                      Detail <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted-bg/50 p-8 rounded-2xl text-center text-foreground/50 border border-dashed border-border text-sm">
              Belum ada program yang dipublikasikan pada sektor ini.
            </div>
          )}
        </div>
      </section>

      {/* 2. KEGIATAN & PRODUK DUA KOLOM */}
      <section className="py-16 px-6 border-b border-border bg-muted-bg/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Kegiatan */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Sprout className="text-secondary" size={26} />
              Kegiatan & Aksi Lapangan
            </h2>

            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="bg-card p-5 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between text-xs text-foreground/50 mb-2">
                      <span>📍 {act.location || "Lokasi Binaan"}</span>
                      <span>{act.date ? new Date(act.date).toLocaleDateString("id-ID") : "Terjadwal"}</span>
                    </div>
                    <h4 className="font-bold text-foreground text-base mb-1">{act.title}</h4>
                    <p className="text-sm text-foreground/70 line-clamp-2">{act.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card p-6 rounded-xl text-center text-foreground/50 border border-dashed border-border text-sm">
                Belum ada kegiatan yang dipublikasikan.
              </div>
            )}
          </div>

          {/* Produk Binaan */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Box className="text-primary" size={26} />
              Produk & Komoditas Binaan
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded inline-block mb-2">
                        {prod.category || "Komoditas"}
                      </span>
                      <h4 className="font-bold text-foreground text-base mb-1">{prod.name}</h4>
                      <p className="text-xs text-foreground/70 line-clamp-2">{prod.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/70 text-xs text-foreground/60 flex items-center justify-between">
                      <span>{prod.capacity ? `Kapasitas: ${prod.capacity}` : "Tersedia"}</span>
                      <Link href={`/produk/${prod.slug}`} className="text-primary font-bold hover:underline">
                        Lihat
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card p-6 rounded-xl text-center text-foreground/50 border border-dashed border-border text-sm">
                Belum ada produk binaan yang dipublikasikan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. DOKUMENTASI FOTO */}
      {documentations.length > 0 && (
        <section className="py-16 px-6 border-b border-border">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <ImageIcon className="text-secondary" size={28} />
              Dokumentasi Lapangan
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {documentations.map((doc) => (
                <div key={doc.id} className="group relative rounded-2xl overflow-hidden bg-muted-bg border border-border aspect-square shadow-sm">
                  {doc.imageUrl ? (
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                      Foto Dokumentasi
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
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

      {/* 4. METRIK KINERJA */}
      {metrics.length > 0 && (
        <section className="py-16 px-6 border-b border-border bg-muted-bg/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="text-primary" size={28} />
              Capaian & Metrik Dampak
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <div key={m.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                  <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider block mb-1">
                    {m.name}
                  </span>
                  <div className="text-2xl md:text-3xl font-black text-primary">
                    {m.realization !== null && m.realization !== undefined ? m.realization : m.value || "-"} {m.unit || ""}
                  </div>
                  {m.target && (
                    <span className="text-xs text-foreground/60 mt-1 block">
                      Target: {m.target} {m.unit || ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FOOTER */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-serif font-bold text-foreground">
            Ingin bermitra atau mengetahui lebih lanjut tentang program {sector.name}?
          </h3>
          <p className="text-foreground/70 text-sm">
            Jelajahi seluruh inisiatif terintegrasi dalam Kawasan Ekonomi Keberkelanjutan.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/program" className="btn btn-primary">
              Lihat Seluruh Program <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/bidang" className="btn btn-outline-dark">
              Daftar Sektor Lainnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
