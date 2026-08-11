import Image from "next/image";
import { Leaf, Users, Sprout, Target, BarChart3, TrendingUp } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
        {/* Placeholder image (will be replaced by actual photo later) */}
        <div className="absolute inset-0 bg-primary/90 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a170d] to-transparent opacity-80 z-10" />
          <Image
            src="/images/about/kawasan.jpg"
            alt="Kawasan Ekonomi Berkelanjutan"
            fill
            className="object-cover mix-blend-overlay opacity-30"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm border border-white/20">
            Mengenal Kami
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
            Tentang Kawasan Ekonomi Berkelanjutan
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Menyelaraskan kemajuan ekonomi masyarakat lokal dengan kelestarian alam demi masa depan yang lebih baik.
          </p>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Latar Belakang
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-8" />
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Kawasan Ekonomi Berkelanjutan merupakan perwujudan nyata dari komitmen CSR perusahaan untuk tidak sekadar memberikan bantuan, tetapi membangun kemandirian. Program ini dirancang untuk menjawab tantangan kesenjangan ekonomi sekaligus menjaga keseimbangan ekologis di wilayah operasi kami.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kami percaya bahwa pemanfaatan potensi lokal yang tepat—jika diiringi dengan pembinaan dan integrasi teknologi—mampu menciptakan siklus ekonomi sirkular yang bermanfaat bagi seluruh lapisan masyarakat tanpa mengorbankan kelestarian alam untuk generasi mendatang.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
             <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <Leaf size={48} className="mb-4 opacity-50" />
                <p className="font-medium">FOTO KAWASAN / PLACEHOLDER</p>
                <p className="text-sm">/images/about/latar-belakang.jpg</p>
             </div>
             {/* When image is available, uncomment below */}
             {/* <Image 
               src="/images/about/latar-belakang.jpg" 
               alt="Kegiatan masyarakat di kawasan" 
               fill 
               className="object-cover"
             /> */}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Kerangka Kerja Kami
            </h2>
            <p className="text-gray-600 text-lg">
              Pengembangan kawasan ini tidak berdiri sendiri, melainkan didasarkan pada empat pilar utama yang saling terhubung erat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tujuan</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Meningkatkan taraf hidup masyarakat lokal sekaligus merestorasi kualitas lingkungan melalui integrasi program CSR yang terukur dan berkelanjutan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pendekatan</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Mengedepankan partisipasi aktif masyarakat (*community-led*) dengan dukungan pendampingan intensif dari para ahli dan pemangku kepentingan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <Sprout size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fokus Pengembangan</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Mencakup 6 sektor utama, mulai dari pertanian terpadu hingga pengelolaan limbah, yang saling mensuplai kebutuhan antar sektor (*circular economy*).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dampak Diharapkan</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Terciptanya ekosistem desa mandiri yang mampu bertahan dari goncangan ekonomi, serta berkurangnya jejak karbon secara signifikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS / IMPACT PREVIEW */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-[#112316] rounded-3xl p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <BarChart3 size={400} />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
                Menuju Perubahan Nyata
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Data dan capaian kami tidak sekadar angka, namun merepresentasikan kehidupan yang menjadi lebih baik dan alam yang perlahan pulih.
              </p>
              <a href="/kinerja" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Lihat Laporan Kinerja
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Placeholders for actual data metrics */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">[Data]</div>
                <div className="text-white/80 text-sm">Penerima Manfaat</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">[Data]</div>
                <div className="text-white/80 text-sm">Kelompok Usaha</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">[Data]</div>
                <div className="text-white/80 text-sm">Ha Lahan Hijau</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">[Data]</div>
                <div className="text-white/80 text-sm">Program Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
