import { getPublishedProductBySlug } from "@/lib/queries/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, Tag, Box, Info, Image as ImageIcon, CheckCircle, FileText, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getPublishedProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    AVAILABLE: { text: "Tersedia", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    OUT_OF_STOCK: { text: "Kosong", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  };
  const status = statusLabel[product.status] || statusLabel.AVAILABLE;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDF9] font-sans pt-24">
      {/* 1. HERO & HEADER */}
      <section className="relative bg-[#112316] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/produk" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Kembali ke Katalog Produk
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-foreground border border-primary/30 rounded-full text-xs font-semibold tracking-wider uppercase">
                  <Tag size={12} />
                  {product.category}
                </span>
                <span className="inline-block px-3 py-1 bg-white/10 text-white/80 border border-white/20 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Sektor {product.sector.name}
                </span>
                <span className={`inline-block px-3 py-1 border rounded-full text-xs font-semibold ${status.color}`}>
                  Status: {status.text}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {product.imageUrl && !product.imageUrl.includes("placeholder") ? (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/5">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                   <Package className="w-20 h-20 text-white/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY METRICS BAR */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Box size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Kapasitas Produksi</p>
              <p className="text-sm font-semibold text-gray-900">
                {product.capacity ? `${product.capacity} ${product.unit || ''}` : "Data belum tersedia"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Jangkauan Pemasaran</p>
              <p className="text-sm font-semibold text-gray-900">{product.marketing || "Data belum tersedia"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Sertifikasi</p>
              <p className="text-sm font-semibold text-gray-900">{product.certification || "Belum ada"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTENT GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Documentation */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-primary w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-900">Galeri Produk</h2>
              </div>
              
              {product.documentations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.documentations.map((doc, idx) => (
                    <div key={doc.id} className={`relative bg-gray-100 rounded-xl overflow-hidden group ${idx === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}>
                      {doc.imageUrl && !doc.imageUrl.includes("placeholder") ? (
                        <Image src={doc.imageUrl} alt={doc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-medium truncate">{doc.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100 border-dashed">
                  Belum ada galeri dokumentasi untuk produk ini.
                </div>
              )}
            </div>

          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            
            {product.program && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-blue-500" /> Program Pembina
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Produk ini merupakan hasil binaan dari program CSR:
                </p>
                <Link href={`/program/${product.program.slug}`} className="block p-4 bg-blue-50/50 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors group">
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{product.program.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.program.description}</p>
                </Link>
              </div>
            )}

            {product.source && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText size={20} className="text-gray-400" /> Referensi Data
                </h3>
                <p className="text-sm text-gray-600">
                  Data produk ini merujuk pada:
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 font-medium">
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
