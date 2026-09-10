import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172121] text-white pt-16 pb-10 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Col */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex flex-col gap-3 mb-6 group">
              <div className="bg-white rounded-xl px-4 py-2 shrink-0 inline-flex items-center justify-center shadow-sm w-fit group-hover:shadow-md transition-all">
                <Image
                  src="/images/antam-logo.png"
                  alt="Logo ANTAM"
                  width={130}
                  height={40}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-white group-hover:text-[#F6A236] transition-colors">
                  CSR ANTAM
                </span>
                <span className="text-xs text-white/80 font-medium">
                  PT ANTAM Tbk UBPN Maluku Utara
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-normal max-w-sm">
              Mendorong kemandirian berkelanjutan dan memberdayakan masyarakat lingkar tambang melalui tata kelola yang terencana, terukur, dan akuntabel.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-[#F6A236] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/program" className="hover:text-[#F6A236] transition-colors">
                  Program
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-[#F6A236] transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/dokumentasi" className="hover:text-[#F6A236] transition-colors">
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/kinerja" className="hover:text-[#F6A236] transition-colors">
                  Kinerja
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#F6A236] transition-colors">
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Corporate Office Col */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Wilayah Operasional
            </h4>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="text-[#F6A236] shrink-0 mt-0.5" aria-hidden="true" />
                <span>PT ANTAM Tbk UBPN Maluku Utara</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F6A236] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Buli, Halmahera Timur, Maluku Utara</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F6A236] hover:underline"
                >
                  Pelajari Selengkapnya Tentang Kami
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} CSR ANTAM — PT ANTAM Tbk UBPN Maluku Utara. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/tentang" className="hover:text-white transition-colors">
              Tata Kelola
            </Link>
            <Link href="/program" className="hover:text-white transition-colors">
              Program
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
