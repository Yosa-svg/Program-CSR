import type { Metadata } from "next";
import { getPublishedProductBySlug } from "@/lib/queries/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package, Box, Info, Image as ImageIcon, CheckCircle, FileText, Globe, Tag } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getPublishedProductBySlug(resolvedParams.slug);

  if (!product || !product.isPublished) {
    return createMetadata({
      title: "Produk Tidak Ditemukan",
      noIndex: true,
    });
  }

  const cleanDescription = product.description
    ? product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description
    : `Katalog produk unggulan mitra binaan CSR ${product.name} pada sektor ${product.sector?.name || "Lokal"}.`;

  return createMetadata({
    title: `${product.name} | Produk Unggulan CSR`,
    description: cleanDescription,
    canonical: `/produk/${product.slug}`,
    imageUrl: product.imageUrl,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getPublishedProductBySlug(resolvedParams.slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    AVAILABLE: { text: "Tersedia", color: "bg-[#0D726D]/15 text-[#0D726D] border-[#0D726D]/30" },
    OUT_OF_STOCK: { text: "Kosong", color: "bg-red-500/15 text-red-500 border-red-500/30" },
  };
  const status = statusLabel[product.status] || statusLabel.AVAILABLE;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans pt-24 text-[#172121]">
      {/* 1. HERO & HEADER */}
      <section 
        className="relative text-white py-16 px-6 shadow-md overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/produk" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-sm font-semibold">
            <ArrowLeft size={16} /> Kembali ke Katalog Produk
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                  <Tag size={12} />
                  {product.category}
                </span>
                <span className="inline-block px-3.5 py-1 bg-white/10 text-white/90 border border-white/20 rounded-full text-xs font-bold tracking-wider uppercase">
                  Sektor {product.sector.name}
                </span>
                <span className="inline-block px-3.5 py-1 border rounded-full text-xs font-bold backdrop-blur-md bg-white/95 text-[#0D726D]">
                  Status: {status.text}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 drop-shadow-sm">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {product.imageUrl && !product.imageUrl.includes("placeholder") ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/20">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative aspect-square rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
                   <Package className="w-20 h-20 text-white/30" />
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
              <Box size={20} />
            </div>
            <div>
              <p className="text-xs text-[#172121]/50 font-medium">Kapasitas Produksi</p>
              <p className="text-sm font-bold text-[#172121]">
                {product.capacity ? `${product.capacity} ${product.unit || ''}` : "Data belum tersedia"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6A236]/10 flex items-center justify-center text-[#F6A236]">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs text-[#172121]/50 font-medium">Jangkauan Pemasaran</p>
              <p className="text-sm font-bold text-[#172121]">{product.marketing || "Data belum tersedia"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F6A236]">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-[#172121]/50 font-medium">Sertifikasi</p>
              <p className="text-sm font-bold text-[#172121]">{product.certification || "Belum ada"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTENT GRID */}
      <section className="py-16 px-6 bg-[#F7FAF9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Documentation */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-[#0D726D] w-6 h-6" />
                <h2 className="text-2xl font-bold text-[#172121]">Galeri Produk</h2>
              </div>
              
              {product.documentations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.documentations.map((doc, idx) => (
                    <div key={doc.id} className={`relative bg-white border border-[#E2E8E6] rounded-2xl overflow-hidden group ${idx === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}>
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
                  Belum ada galeri dokumentasi untuk produk ini.
                </div>
              )}
            </div>

          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            
            {product.program && product.program.isPublished && (
              <div className="bg-white border border-[#E2E8E6] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#172121] mb-4 flex items-center gap-2">
                  <Info size={20} className="text-[#0D726D]" /> Program Pembina
                </h3>
                <p className="text-[#172121]/70 text-sm mb-4">
                  Produk ini merupakan hasil binaan dari program CSR:
                </p>
                <Link href={`/program/${product.program.slug}`} className="block p-4 bg-[#F7FAF9] hover:bg-[#EAEFEA] rounded-xl border border-[#0D726D]/20 transition-colors group">
                  <h4 className="font-bold text-[#172121] group-hover:text-[#0D726D] transition-colors">{product.program.title}</h4>
                  <p className="text-xs text-[#172121]/60 mt-1 line-clamp-2">{product.program.description}</p>
                </Link>
              </div>
            )}

            {product.source && (
              <div className="bg-white border border-[#E2E8E6] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#172121] mb-2 flex items-center gap-2">
                  <FileText size={20} className="text-[#172121]/40" /> Referensi Data
                </h3>
                <p className="text-sm text-[#172121]/70 font-normal">
                  Data produk ini merujuk pada:
                </p>
                <div className="mt-3 p-3 bg-[#F7FAF9] rounded-lg border border-[#E2E8E6] text-sm text-[#172121] font-medium">
                  {product.source}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
