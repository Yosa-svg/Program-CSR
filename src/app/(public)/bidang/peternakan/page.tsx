import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Beef, Wheat, Recycle, Users, Sprout } from "lucide-react";

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
    return <div>Data Peternakan belum tersedia.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDF9] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-[#112316]">
        <div className="absolute inset-0 z-0 opacity-40">
           {/* Placeholder background */}
           <div className="w-full h-full bg-[#0A150D]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-emerald-900/50 text-emerald-200 border border-emerald-800 rounded-full text-sm font-semibold tracking-widest uppercase mb-6">
            Bidang CSR
          </span>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
            Peternakan Berkelanjutan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Mengintegrasikan pembibitan unggul dengan pakan organik dan pengolahan limbah.
          </p>
        </div>
      </section>

      {/* 2. TENTANG PETERNAKAN */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-[#112316] mb-6">
              Kembali ke Alam,<br/>Membangun Masa Depan
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Peternakan dalam Kawasan Ekonomi Berkelanjutan tidak sekadar fokus pada penggemukan, melainkan <strong>kemandirian pembibitan</strong> dan <strong>kualitas pakan organik</strong>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dengan mengadopsi prinsip ekonomi sirkular, limbah dari sektor pertanian diolah menjadi pakan ternak berkualitas, dan sebaliknya kotoran ternak dikembalikan ke lahan pertanian sebagai pupuk kompos.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center shadow-2xl">
            <Beef className="w-32 h-32 text-emerald-400 opacity-50" />
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-lg font-medium text-sm text-[#112316]">
              Kandang Komunal Modern
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOKUS UTAMA (Pembibitan, Pakan Organik, Integrasi) */}
      <section className="py-24 px-6 bg-[#112316]">
        <div className="max-w-7xl mx-auto">
          {sector.programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {sector.programs.map((program, idx) => {
                const icons = [<Users key="1" className="w-8 h-8" />, <Wheat key="2" className="w-8 h-8" />, <Recycle key="3" className="w-8 h-8" />];
                const iconColors = ["bg-emerald-900/30 text-emerald-400", "bg-green-900/30 text-green-400", "bg-teal-900/30 text-teal-400"];
                const currentIcon = icons[idx % icons.length];
                const currentColor = iconColors[idx % iconColors.length];
                return (
                  <div key={program.id} className="bg-[#1A3321] p-10 rounded-2xl border border-[#264D31]">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-8 ${currentColor}`}>
                      {currentIcon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{program.title}</h3>
                    <p className="text-gray-400">{program.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">Belum ada program yang dipublikasikan.</div>
          )}
        </div>
      </section>

      {/* 4. KEGIATAN TERBARU */}
      {sector.activities.length > 0 && (
        <section className="py-24 px-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#112316]"></span> Kegiatan Peternakan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-primary mb-2">
                    {activity.date ? new Date(activity.date).toLocaleDateString('id-ID') : 'Segera'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PRODUK / HASIL */}
      {sector.products.length > 0 && (
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#112316]"></span> Hasil & Produk
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-emerald-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative">
                    <Beef className="w-16 h-16 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. DOKUMENTASI & KINERJA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Dokumentasi */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Dokumentasi</h2>
            <div className="grid grid-cols-2 gap-4">
              {sector.documentations.map((doc, idx) => (
                <div key={doc.id} className={`bg-emerald-50 rounded-xl flex items-center justify-center ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                  <span className="text-emerald-500 font-medium text-sm">Foto: {doc.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kinerja & Dampak */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Kinerja & Dampak</h2>
            <div className="space-y-6">
              {sector.metrics.map((metric) => (
                <div key={metric.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{metric.name}</p>
                    <h4 className="text-3xl font-playfair font-bold text-gray-900">
                      {metric.value} <span className="text-lg font-sans font-normal text-gray-500">{metric.unit}</span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {metric.period}
                    </span>
                    <p className="text-gray-400 text-xs mt-2">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. DAMPAK DI LAPANGAN */}
      <section className="py-24 px-6 bg-[#112316] text-white border-t border-emerald-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            Akuntabilitas Dampak
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Dampak Terukur di Lapangan
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-base font-light">
            Pengukuran capaian program berbasis data aktual, verifikasi tim independen, serta dokumentasi kegiatan langsung di sektor peternakan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-emerald-400 mb-1">45+</div>
              <div className="text-xs text-gray-300 font-medium">Peternak Terbina</div>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-teal-300 mb-1">12</div>
              <div className="text-xs text-gray-300 font-medium">Kegiatan Terlaksana</div>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-green-400 mb-1">1.200</div>
              <div className="text-xs text-gray-300 font-medium">Liter Susu / Bulan</div>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="text-3xl font-black text-amber-400 mb-1">100%</div>
              <div className="text-xs text-gray-300 font-medium">Capaian Target</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
