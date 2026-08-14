import { getPublishedProgramBySlug } from "@/lib/queries/programs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Users, Target, Activity, CheckCircle, Package, ArrowLeft, Lightbulb, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const program = await getPublishedProgramBySlug(resolvedParams.slug);

  if (!program) {
    notFound();
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "Berjalan", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    COMPLETED: { text: "Selesai", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    PLANNED: { text: "Rencana", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  };
  const status = statusLabel[program.status] || statusLabel.ACTIVE;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDF9] font-sans pt-24">
      {/* 1. HERO & HEADER */}
      <section className="relative bg-[#112316] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/program" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Kembali ke Katalog Program
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary-foreground border border-primary/30 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Sektor {program.sector.name}
                </span>
                <span className={`inline-block px-3 py-1 border rounded-full text-xs font-semibold ${status.color}`}>
                  Status: {status.text}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight mb-6">
                {program.title}
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                {program.description}
              </p>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {program.imageUrl && !program.imageUrl.includes("placeholder") ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={program.imageUrl} alt={program.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                   <Target className="w-16 h-16 text-white/20" />
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
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lokasi Pelaksanaan</p>
              <p className="text-sm font-semibold text-gray-900">{program.location || "Data belum tersedia"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Penerima Manfaat</p>
              <p className="text-sm font-semibold text-gray-900">{program.beneficiaries || "Data belum tersedia"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTENT GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Activities */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Activity className="text-primary w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-900">Kegiatan Terkait</h2>
              </div>
              
              {program.activities.length > 0 ? (
                <div className="space-y-4">
                  {program.activities.map(activity => (
                    <div key={activity.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                          {activity.date ? format(new Date(activity.date), "dd MMMM yyyy", { locale: id }) : "Segera"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      {activity.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={16} /> {activity.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
                  Belum ada kegiatan yang dipublikasikan untuk program ini.
                </div>
              )}
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Package className="text-primary w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-900">Produk Binaan</h2>
              </div>
              
              {program.products.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {program.products.map(product => (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                      <div className="aspect-[4/3] relative bg-gray-100">
                        {product.imageUrl && !product.imageUrl.includes("placeholder") ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-700">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
                  Belum ada produk binaan yang terdaftar untuk program ini.
                </div>
              )}
            </div>
            
            {/* Documentation */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-primary w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-900">Galeri Dokumentasi</h2>
              </div>
              
              {program.documentations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {program.documentations.map((doc, idx) => (
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
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
                  Belum ada dokumentasi untuk program ini.
                </div>
              )}
            </div>

          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-500" /> Rantai Dampak
              </h3>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-amber-200 relative pb-2">
                  <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-gray-900">Output</h4>
                  <p className="text-xs text-gray-500 mt-1">Data sedang dihimpun</p>
                </div>
                <div className="pl-4 border-l-2 border-emerald-200 relative pb-2">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-gray-900">Outcome</h4>
                  <p className="text-xs text-gray-500 mt-1">Data sedang dihimpun</p>
                </div>
                <div className="pl-4 border-l-2 border-transparent relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                  <h4 className="text-sm font-bold text-gray-900">Impact</h4>
                  <p className="text-xs text-gray-500 mt-1">Data sedang dihimpun</p>
                </div>
              </div>
            </div>

            <div className="bg-[#112316] text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-primary" /> Dukungan & Mitra
              </h3>
              <p className="text-white/70 text-sm mb-4">
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
