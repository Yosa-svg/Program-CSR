import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sectors = [
  { 
    id: '01', 
    title: 'Pertanian Terpadu', 
    desc: 'Agro Edu Wisata dan ketahanan pangan', 
    slug: 'pertanian', 
    icon: '🌾' 
  },
  { 
    id: '02', 
    title: 'Peternakan', 
    desc: 'Pembibitan dan integrasi pertanian', 
    slug: 'peternakan', 
    icon: '🐄' 
  },
  { 
    id: '03', 
    title: 'Pemberdayaan UMKM', 
    desc: 'Penguatan ekonomi dan kewirausahaan lokal', 
    slug: 'umkm', 
    icon: '🏪' 
  },
  { 
    id: '04', 
    title: 'Pengelolaan Limbah', 
    desc: 'Pengelolaan limbah berbasis ekonomi sirkular', 
    slug: 'pengelolaan-limbah', 
    icon: '♻️' 
  },
  { 
    id: '05', 
    title: 'Industri Kelapa', 
    desc: 'Pengolahan produk turunan kelapa', 
    slug: 'industri-kelapa', 
    icon: '🥥' 
  },
  { 
    id: '06', 
    title: 'Ekowisata & Lingkungan', 
    desc: 'Konservasi dan pariwisata berkelanjutan', 
    slug: 'ekowisata-lingkungan', 
    icon: '🏕️' 
  },
];

export default function BidangCSRPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6 uppercase tracking-tight">
            Bidang CSR
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl">
            Enam bidang fokus pengembangan untuk membangun Kawasan Ekonomi Berkelanjutan.
          </p>
        </div>
      </section>

      {/* FEATURED LIST SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-200">
            {sectors.map((sector) => (
              <Link 
                key={sector.id} 
                href={`/bidang/${sector.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 border-b border-gray-200 hover:bg-green-50/50 transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl"
              >
                <div className="flex items-start md:items-center gap-6 md:gap-16">
                  {/* ID NUMBER */}
                  <div className="text-2xl md:text-3xl font-medium text-gray-300 group-hover:text-primary transition-colors duration-500 w-12">
                    {sector.id}
                  </div>
                  
                  {/* TEXT CONTENT */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-500">
                      {sector.title}
                    </h2>
                    <p className="text-gray-500 text-lg group-hover:text-gray-700 transition-colors duration-500">
                      {sector.desc}
                    </p>
                  </div>
                </div>

                {/* ICON & ARROW */}
                <div className="flex items-center gap-8 mt-6 md:mt-0 self-end md:self-auto">
                  <div className="text-4xl md:text-5xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 transform origin-right filter grayscale group-hover:grayscale-0">
                    {sector.icon}
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 text-gray-400">
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
