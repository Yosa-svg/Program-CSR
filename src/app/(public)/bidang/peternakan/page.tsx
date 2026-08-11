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
      programs: true,
      activities: { take: 3, orderBy: { date: "desc" } },
      products: true,
      documentations: { take: 4 },
      metrics: true,
    },
  });

  if (!sector) {
    return <div>Data Peternakan belum tersedia.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDF9] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-[#2B1B12]">
        <div className="absolute inset-0 z-0 opacity-40">
           {/* Placeholder background */}
           <div className="w-full h-full bg-[#1A110B]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-orange-900/50 text-orange-200 border border-orange-800 rounded-full text-sm font-semibold tracking-widest uppercase mb-6">
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
            <h2 className="text-4xl font-playfair font-bold text-[#2B1B12] mb-6">
              Kembali ke Alam,<br/>Membangun Masa Depan
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Peternakan dalam Kawasan Ekonomi Berkelanjutan tidak sekadar fokus pada penggemukan, melainkan <strong>kemandirian pembibitan</strong> dan <strong>kualitas pakan organik</strong>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dengan mengadopsi prinsip ekonomi sirkular, limbah dari sektor pertanian diolah menjadi pakan ternak berkualitas, dan sebaliknya kotoran ternak dikembalikan ke lahan pertanian sebagai pupuk kompos.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E8E4DB] flex items-center justify-center shadow-2xl">
            <Beef className="w-32 h-32 text-[#C1A88B] opacity-50" />
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-lg font-medium text-sm text-[#2B1B12]">
              Kandang Komunal Modern
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOKUS UTAMA (Pembibitan, Pakan Organik, Integrasi) */}
      <section className="py-24 px-6 bg-[#2B1B12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pembibitan */}
            <div className="bg-[#362318] p-10 rounded-2xl border border-[#4A3223]">
              <div className="w-16 h-16 bg-orange-900/30 text-orange-400 rounded-xl flex items-center justify-center mb-8">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Program Pembibitan</h3>
              <p className="text-gray-400">
                Penyediaan bibit sapi dan kambing unggul bagi peternak lokal untuk memastikan keberlanjutan garis keturunan ternak berkualitas.
              </p>
            </div>
            
            {/* Pakan Organik */}
            <div className="bg-[#362318] p-10 rounded-2xl border border-[#4A3223]">
              <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-xl flex items-center justify-center mb-8">
                <Wheat className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pakan Organik</h3>
              <p className="text-gray-400">
                Pengembangan silase dari rumput gajah dan tebon jagung tanpa tambahan bahan kimia sintetis.
              </p>
            </div>

            {/* Integrasi */}
            <div className="bg-[#362318] p-10 rounded-2xl border border-[#4A3223]">
              <div className="w-16 h-16 bg-yellow-900/30 text-yellow-400 rounded-xl flex items-center justify-center mb-8">
                <Recycle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Integrasi Lintas Sektor</h3>
              <p className="text-gray-400">
                Kotoran ternak diproses di instalasi biogas dan reaktor kompos untuk dikembalikan menyuburkan tanah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEGIATAN TERBARU */}
      {sector.activities.length > 0 && (
        <section className="py-24 px-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#2B1B12]"></span> Kegiatan Peternakan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-orange-600 mb-2">
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
              <span className="w-8 h-1 bg-[#2B1B12]"></span> Hasil & Produk
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sector.products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-[#E8E4DB] rounded-2xl mb-6 overflow-hidden flex items-center justify-center relative">
                    <Beef className="w-16 h-16 text-[#C1A88B] group-hover:scale-110 transition-transform duration-500" />
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
                <div key={doc.id} className={`bg-[#E8E4DB] rounded-xl flex items-center justify-center ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                  <span className="text-[#C1A88B] font-medium text-sm">Foto: {doc.title}</span>
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

      {/* 7. TESTIMONI / QUOTE */}
      <section className="py-32 px-6 bg-[#2B1B12] text-center">
        <div className="max-w-4xl mx-auto">
          <Sprout className="w-12 h-12 text-[#C1A88B] mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-playfair font-medium text-white mb-8 leading-tight">
            "Berkat pendampingan bibit dan nutrisi silase yang tepat, produktivitas ternak warga meningkat secara signifikan dan lebih tahan penyakit."
          </h2>
          <p className="text-[#C1A88B] font-semibold tracking-wide uppercase text-sm">
            — Kelompok Peternak Makmur
          </p>
        </div>
      </section>

    </div>
  );
}
