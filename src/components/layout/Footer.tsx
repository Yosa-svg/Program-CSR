import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172121] text-white pt-20 pb-10 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-[#0D726D] rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest shadow-md relative overflow-hidden">
                <span>KEB</span>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#F6A236] rounded-bl-md"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-white">
                  Kawasan Ekonomi
                </span>
                <span className="text-xs text-white/60 font-medium">Berkelanjutan</span>
              </div>
            </Link>
            <p className="text-white/65 text-sm leading-relaxed mb-6 font-normal">
              Menginspirasi dan membangun masyarakat yang mandiri melalui pengelolaan sumber daya yang berkelanjutan.
            </p>
            <div className="flex items-center gap-4 text-white/50 text-xs">
              <a href="#" className="hover:text-[#F6A236] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#F6A236] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[#F6A236] transition-colors">Twitter</a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-3.5 text-sm text-white/65">
              <li><Link href="/tentang" className="hover:text-[#F6A236] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/bidang" className="hover:text-[#F6A236] transition-colors">Sektor CSR</Link></li>
              <li><Link href="/program" className="hover:text-[#F6A236] transition-colors">Program CSR</Link></li>
              <li><Link href="/produk" className="hover:text-[#F6A236] transition-colors">Katalog Produk</Link></li>
              <li><Link href="/kinerja" className="hover:text-[#F6A236] transition-colors">Laporan Kinerja</Link></li>
            </ul>
          </div>

          {/* Sectors Col */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Sektor Utama</h4>
            <ul className="space-y-3.5 text-sm text-white/65">
              <li><Link href="/bidang/pertanian" className="hover:text-[#F6A236] transition-colors">Pertanian</Link></li>
              <li><Link href="/bidang/peternakan" className="hover:text-[#F6A236] transition-colors">Peternakan</Link></li>
              <li><Link href="/bidang/lingkungan" className="hover:text-[#F6A236] transition-colors">Lingkungan</Link></li>
              <li><Link href="/bidang/industri-kelapa" className="hover:text-[#F6A236] transition-colors">Industri Kelapa</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-4 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F6A236] shrink-0 mt-0.5" />
                <span>Jl. Pembangunan Berkelanjutan No. 12, Jakarta</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F6A236] shrink-0" />
                <span>+62 811 2233 4455</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F6A236] shrink-0" />
                <span>halo@keb-csr.id</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} Kawasan Ekonomi Berkelanjutan. Hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
