import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sectors = [
  { 
    id: '01', 
    title: 'Pertanian', 
    desc: 'Program: Agro Edu Wisata — Pertanian ramah lingkungan dan edukasi wisata', 
    slug: 'pertanian', 
    icon: '🌱' 
  },
  { 
    id: '02', 
    title: 'Peternakan', 
    desc: 'Program: Inkubator Bisnis — Pembibitan, pakan silase, & produk olahan ternak', 
    slug: 'peternakan', 
    icon: '🐄' 
  },
  { 
    id: '03', 
    title: 'Lingkungan', 
    desc: 'Program: Pengolahan Sampah Plastik & Pupuk Diversoil — Daur ulang & komposting', 
    slug: 'lingkungan', 
    icon: '♻️' 
  },
  { 
    id: '04', 
    title: 'Industri Kelapa', 
    desc: 'Program: Industri Kelapa Terpadu — Output: Coconet, Cocopeat, Cocopot, & Sapu Sabut Kelapa', 
    slug: 'industri-kelapa', 
    icon: '🥥' 
  },
];

export default function BidangCSRPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-6 bg-[#F7FAF9] border-b border-[#E2E8E6]">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 bg-[#0D726D]/10 text-[#0D726D] border border-[#0D726D]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Taksonomi Sektor CSR
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#172121] mb-6 uppercase tracking-tight">
            Sektor / Bidang CSR
          </h1>
          <p className="text-xl text-[#172121]/70 font-normal max-w-2xl">
            Empat sektor utama pemberdayaan masyarakat dan pelestarian lingkungan dalam Kawasan Ekonomi Berkelanjutan.
          </p>
        </div>
      </section>

      {/* FEATURED LIST SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-[#E2E8E6]">
            {sectors.map((sector) => (
              <Link 
                key={sector.id} 
                href={`/bidang/${sector.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 border-b border-[#E2E8E6] hover:bg-[#F7FAF9] transition-colors duration-300 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl"
              >
                <div className="flex items-start md:items-center gap-6 md:gap-16">
                  {/* ID NUMBER */}
                  <div className="text-2xl md:text-3xl font-bold text-[#172121]/30 group-hover:text-[#0D726D] transition-colors duration-300 w-12">
                    {sector.id}
                  </div>
                  
                  {/* TEXT CONTENT */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#172121] mb-3 group-hover:text-[#0D726D] transition-colors duration-300">
                      {sector.title}
                    </h2>
                    <p className="text-[#172121]/65 text-lg group-hover:text-[#172121] transition-colors duration-300 font-normal">
                      {sector.desc}
                    </p>
                  </div>
                </div>

                {/* ICON & ARROW */}
                <div className="flex items-center gap-8 mt-6 md:mt-0 self-end md:self-auto">
                  <div className="text-4xl md:text-5xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 transform origin-right">
                    {sector.icon}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-[#E2E8E6] flex items-center justify-center group-hover:bg-[#0D726D] group-hover:border-transparent group-hover:text-white transition-all duration-300 text-[#172121]/40 shadow-sm">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
