import Image from "next/image";
import { Users, Sprout, Target, BarChart3, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TentangPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[480px] flex items-center justify-center bg-[#0D726D] overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 55%, #F6A236 100%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45 z-10" />
        <Image
          src="/images/about/kawasan.jpg"
          alt="Kawasan Ekonomi Berkelanjutan"
          fill
          className="object-cover mix-blend-overlay opacity-20 z-0"
          priority
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/15 text-white text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md border border-white/30 shadow-sm">
            Mengenal Kami
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Tentang Kawasan Ekonomi Berkelanjutan
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Menyelaraskan kemajuan ekonomi masyarakat lokal dengan kelestarian alam demi masa depan yang lebih baik.
          </p>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] mb-6">
              Latar Belakang
            </h2>
            <div className="w-20 h-1.5 bg-[#0D726D] rounded-full mb-8" />
            <p className="text-lg text-[#172121]/80 leading-relaxed mb-6 font-normal">
              Kawasan Ekonomi Berkelanjutan merupakan perwujudan nyata dari komitmen CSR perusahaan untuk tidak sekadar memberikan bantuan, tetapi membangun kemandirian. Program ini dirancang untuk menjawab tantangan kesenjangan ekonomi sekaligus menjaga keseimbangan ekologis di wilayah operasi kami.
            </p>
            <p className="text-lg text-[#172121]/80 leading-relaxed font-normal">
              Kami percaya bahwa pemanfaatan potensi lokal yang tepat—jika diiringi dengan pembinaan dan integrasi teknologi—mampu menciptakan siklus ekonomi sirkular yang bermanfaat bagi seluruh lapisan masyarakat tanpa mengorbankan kelestarian alam untuk generasi mendatang.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl border border-[#E2E8E6] bg-[#F7FAF9] flex flex-col items-center justify-center text-gray-400">
            <Sparkles size={48} className="mb-4 text-[#F6A236]" />
            <p className="font-bold text-[#172121]">Kawasan Ekonomi Berkelanjutan</p>
            <p className="text-sm text-[#172121]/60">Pemberdayaan Masyarakat & Pelestarian Alam</p>
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="py-24 bg-[#F7FAF9] px-6 border-t border-[#E2E8E6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] mb-6">
              Kerangka Kerja Kami
            </h2>
            <p className="text-[#172121]/75 text-lg font-normal">
              Pengembangan kawasan ini tidak berdiri sendiri, melainkan didasarkan pada empat pilar utama yang saling terhubung erat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8E6] hover:shadow-xl transition-shadow group relative overflow-hidden">
              <div className="w-14 h-14 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0D726D] group-hover:text-white transition-all">
                <Target size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">Tujuan</h3>
              <p className="text-[#172121]/70 leading-relaxed text-sm font-normal">
                Meningkatkan taraf hidup masyarakat lokal sekaligus merestorasi kualitas lingkungan melalui integrasi program CSR yang terukur dan berkelanjutan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8E6] hover:shadow-xl transition-shadow group relative overflow-hidden">
              <div className="w-14 h-14 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0D726D] group-hover:text-white transition-all">
                <Users size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">Pendekatan</h3>
              <p className="text-[#172121]/70 leading-relaxed text-sm font-normal">
                Mengedepankan partisipasi aktif masyarakat (*community-led*) dengan dukungan pendampingan intensif dari para ahli dan pemangku kepentingan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8E6] hover:shadow-xl transition-shadow group relative overflow-hidden">
              <div className="w-14 h-14 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0D726D] group-hover:text-white transition-all">
                <Sprout size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">Fokus Pengembangan</h3>
              <p className="text-[#172121]/70 leading-relaxed text-sm font-normal">
                Mencakup 4 sektor utama, mulai dari pertanian terpadu hingga pengelolaan limbah, yang saling mensuplai kebutuhan antar sektor (*circular economy*).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8E6] hover:shadow-xl transition-shadow group relative overflow-hidden">
              <div className="w-14 h-14 bg-[#0D726D]/10 text-[#0D726D] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0D726D] group-hover:text-white transition-all">
                <TrendingUp size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#172121] mb-3">Dampak Diharapkan</h3>
              <p className="text-[#172121]/70 leading-relaxed text-sm font-normal">
                Terciptanya ekosistem desa mandiri yang mampu bertahan dari goncangan ekonomi, serta perbaikan kualitas lingkungan secara nyata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS / IMPACT PREVIEW */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto bg-[#0D726D] rounded-3xl p-12 lg:p-20 relative overflow-hidden shadow-xl text-white">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <BarChart3 size={400} />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Menuju Perubahan Nyata
              </h2>
              <p className="text-white/85 text-lg leading-relaxed mb-8 font-normal">
                Data dan capaian kami tidak sekadar angka, namun merepresentasikan kehidupan yang menjadi lebih baik dan alam yang perlahan pulih.
              </p>
              <Link href="/kinerja" className="px-8 py-3.5 rounded-full bg-white text-[#0D726D] hover:bg-[#F7FAF9] font-bold transition-all shadow-md inline-block">
                Lihat Laporan Kinerja
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="text-4xl font-black text-white mb-2">1.840+</div>
                <div className="text-white/80 text-sm font-medium">Penerima Manfaat</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="text-4xl font-black text-white mb-2">12</div>
                <div className="text-white/80 text-sm font-medium">Desa Terhubung</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="text-4xl font-black text-white mb-2">3.200</div>
                <div className="text-white/80 text-sm font-medium">Pohon Ditanam</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="text-4xl font-black text-white mb-2">4</div>
                <div className="text-white/80 text-sm font-medium">Sektor Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
