import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172121] text-gray-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D726D] text-white rounded-xl flex items-center justify-center font-bold text-sm tracking-widest shadow-md relative overflow-hidden">
              <span>KEB</span>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#F6A236] rounded-bl-md"></div>
            </div>
            <span className="font-serif font-bold text-xl text-white">
              CSR <span className="text-[#0D726D]">KEB</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Membangun masa depan yang lebih baik melalui sinergi ekonomi, pelestarian lingkungan, dan kesejahteraan masyarakat lokal.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navigasi</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-[#F6A236] transition-colors">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-[#F6A236] transition-colors">Tentang Kawasan</Link></li>
            <li><Link href="/bidang" className="hover:text-[#F6A236] transition-colors">Bidang CSR</Link></li>
            <li><Link href="/program" className="hover:text-[#F6A236] transition-colors">Program Lintas Sektor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Sektor Utama</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/bidang/pertanian" className="hover:text-[#F6A236] transition-colors">Pertanian Terpadu</Link></li>
            <li><Link href="/bidang/peternakan" className="hover:text-[#F6A236] transition-colors">Peternakan</Link></li>
            <li><Link href="/bidang/lingkungan" className="hover:text-[#F6A236] transition-colors">Konservasi Lingkungan</Link></li>
            <li><Link href="/bidang/industri-kelapa" className="hover:text-[#F6A236] transition-colors">Industri Kelapa</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Kontak Kami</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="text-[#F6A236] shrink-0 mt-0.5" size={18} />
              <span>Gedung Manajemen Kawasan Ekonomi Berkelanjutan, Lt. 2</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-[#F6A236] shrink-0" size={18} />
              <span>halo@csrkawasan.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-[#F6A236] shrink-0" size={18} />
              <span>(021) 555-0192</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} CSR Kawasan Ekonomi Berkelanjutan. Hak cipta dilindungi.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-white transition-colors">Syarat Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}
