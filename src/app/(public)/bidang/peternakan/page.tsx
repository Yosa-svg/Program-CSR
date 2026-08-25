import { prisma } from "@/lib/prisma";
import { Beef, Wheat, Recycle, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Peternakan | Bidang CSR",
  description: "Meningkatkan kesejahteraan melalui pembibitan unggul dan pakan organik.",
};

export default async function PeternakanPage() {
  // Fetch Peternakan Data
  const sector = await prisma.sector.findUnique({
    where: { slug: "peternakan" },
    include: {
      programs: { where: { isPublished: true } },
      activities: { 
        where: { isPublished: true },
        take: 3, 
        orderBy: { date: "desc" } 
      },
      products: { where: { isPublished: true } },
      documentations: { 
        where: { isPublished: true },
        take: 4 
      },
      metrics: { where: { isPublished: true } },
    },
  });

  if (!sector) {
    return <div className="p-12 text-center">Data Peternakan belum tersedia.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[65vh] min-h-[480px] flex items-center justify-center bg-[#0D726D] overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 55%, #F6A236 100%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50 z-10" />
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-12">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white border border-white/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
            SEKTOR CSR • INKUBATOR BISNIS
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-sm leading-tight">
            Peternakan Berkelanjutan
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-normal max-w-2xl mx-auto drop-shadow-sm">
            Mengintegrasikan pembibitan unggul dengan formulasi pakan silase mandiri dan pengolahan limbah.
          </p>
        </div>
      </section>

      {/* 2. TENTANG PETERNAKAN */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] mb-6">
              Inkubasi Usaha Ternak & Kemandirian Pakan
            </h2>
            <div className="w-16 h-1 bg-[#F6A236] rounded-full mb-8"></div>
            <p className="text-lg text-[#172121]/80 mb-6 leading-relaxed font-normal">
              Peternakan dalam Kawasan Ekonomi Berkelanjutan tidak sekadar fokus pada penggemukan, melainkan <strong>kemandirian pembibitan</strong> dan <strong>kualitas pakan organik silase</strong>.
            </p>
            <p className="text-lg text-[#172121]/80 leading-relaxed font-normal">
              Dengan mengadopsi prinsip ekonomi sirkular, limbah dari sektor pertanian diolah menjadi pakan ternak berkualitas tinggi, dan sebaliknya kotoran ternak dikembalikan ke lahan pertanian sebagai pupuk kompos bernilai hara tinggi.
            </p>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F7FAF9] flex items-center justify-center shadow-md border border-[#E2E8E6]">
            <Beef className="w-32 h-32 text-[#0D726D]/30" />
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-5 py-2.5 rounded-xl font-bold text-sm text-[#172121] shadow-sm border border-[#E2E8E6]">
              Kandang Komunal Modern
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOKUS UTAMA */}
      <section className="py-24 px-6 bg-[#F7FAF9] border-t border-[#E2E8E6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#F6A236] uppercase tracking-wider block mb-2">Program Strategis</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121]">Fokus Pengembangan</h2>
          </div>

          {sector.programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {sector.programs.map((program, idx) => {
                const icons = [<Users key="1" className="w-7 h-7" />, <Wheat key="2" className="w-7 h-7" />, <Recycle key="3" className="w-7 h-7" />];
                const currentIcon = icons[idx % icons.length];
                return (
                  <div key={program.id} className="bg-white p-8 rounded-2xl border border-[#E2E8E6] shadow-sm hover:border-[#0D726D]/40 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#0D726D] text-white shadow-md group-hover:bg-[#0B5C58] transition-colors">
                      {currentIcon}
                    </div>
                    <h3 className="text-xl font-bold text-[#172121] mb-3">{program.title}</h3>
                    <p className="text-[#172121]/70 leading-relaxed text-sm font-normal">{program.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-[#172121]/50 py-10">Belum ada program yang dipublikasikan.</div>
          )}
        </div>
      </section>

      {/* 4. KEGIATAN TERBARU */}
      {sector.activities.length > 0 && (
        <section className="py-24 px-6 bg-white border-t border-[#E2E8E6]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#172121] mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#0D726D]"></span> Kegiatan Peternakan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.activities.map((activity) => (
                <div key={activity.id} className="bg-[#F7FAF9] rounded-2xl p-6 border border-[#E2E8E6] shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xs font-bold text-[#F6A236] mb-2 uppercase tracking-wider">
                    {activity.date ? new Date(activity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera'}
                  </div>
                  <h3 className="text-lg font-bold text-[#172121] mb-2">{activity.title}</h3>
                  <p className="text-[#172121]/70 text-sm line-clamp-2 font-normal">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PRODUK / HASIL */}
      {sector.products.length > 0 && (
        <section className="py-24 px-6 bg-[#F7FAF9] border-t border-[#E2E8E6]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#172121] mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#F6A236]"></span> Hasil & Produk Binaan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.products.map((product) => (
                <div key={product.id} className="group bg-white p-6 rounded-2xl border border-[#E2E8E6] shadow-sm hover:border-[#0D726D]/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="aspect-[4/3] bg-[#F7FAF9] rounded-xl mb-6 overflow-hidden flex items-center justify-center relative border border-[#E2E8E6]">
                    <Beef className="w-14 h-14 text-[#0D726D]/40 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-[#172121] mb-2 group-hover:text-[#0D726D] transition-colors">{product.name}</h3>
                  <p className="text-[#172121]/70 text-sm font-normal">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. DOKUMENTASI & KINERJA */}
      <section className="py-24 px-6 bg-white border-t border-[#E2E8E6]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Dokumentasi */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#172121] mb-8">Dokumentasi</h2>
            <div className="grid grid-cols-2 gap-4">
              {sector.documentations.map((doc, idx) => (
                <div key={doc.id} className={`bg-[#F7FAF9] rounded-2xl border border-[#E2E8E6] flex items-center justify-center p-4 ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                  <span className="text-[#0D726D] font-bold text-sm text-center">Foto: {doc.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kinerja & Dampak */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#172121] mb-8">Kinerja & Dampak</h2>
            <div className="space-y-4">
              {sector.metrics.map((metric) => (
                <div key={metric.id} className="bg-[#F7FAF9] p-6 rounded-2xl border border-[#E2E8E6] flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[#172121]/60 text-xs mb-1 font-semibold uppercase">{metric.name}</p>
                    <h4 className="text-3xl font-serif font-bold text-[#0D726D]">
                      {metric.value} <span className="text-sm font-sans font-normal text-[#172121]/60">{metric.unit}</span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-[#F6A236]/15 text-[#F6A236] border border-[#F6A236]/30 rounded-full text-xs font-bold">
                      {metric.period}
                    </span>
                    <p className="text-[#172121]/60 text-xs mt-2">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. DAMPAK DI LAPANGAN */}
      <section className="py-20 px-6 bg-[#172121] text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            Akuntabilitas Dampak
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Dampak Terukur di Lapangan
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-12 text-base font-normal">
            Pengukuran capaian program berbasis data aktual, verifikasi tim independen, serta dokumentasi kegiatan langsung di sektor peternakan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-white mb-1">45+</div>
              <div className="text-xs text-white/60 font-medium">Peternak Terbina</div>
            </div>
            <div className="p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-[#F6A236] mb-1">12</div>
              <div className="text-xs text-white/60 font-medium">Kegiatan Terlaksana</div>
            </div>
            <div className="p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-[#0D726D] mb-1">1.200</div>
              <div className="text-xs text-white/60 font-medium">Liter Susu / Bulan</div>
            </div>
            <div className="p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-white mb-1">100%</div>
              <div className="text-xs text-white/60 font-medium">Capaian Target</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
