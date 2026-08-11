import Link from "next/link";
import { Leaf, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Leaf className="text-green-500" size={24} />
            </div>
            <span className="font-playfair font-bold text-xl text-white">
              CSR <span className="text-green-500">KEB</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Membangun masa depan yang lebih baik melalui sinergi ekonomi, pelestarian lingkungan, dan kesejahteraan masyarakat lokal.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Navigasi</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-green-400 transition-colors">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-green-400 transition-colors">Tentang Kawasan</Link></li>
            <li><Link href="/bidang" className="hover:text-green-400 transition-colors">Bidang CSR</Link></li>
            <li><Link href="/program" className="hover:text-green-400 transition-colors">Program Lintas Sektor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Sektor Utama</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/bidang/pertanian" className="hover:text-green-400 transition-colors">Pertanian Terpadu</Link></li>
            <li><Link href="/bidang/umkm" className="hover:text-green-400 transition-colors">Pemberdayaan UMKM</Link></li>
            <li><Link href="/bidang/lingkungan" className="hover:text-green-400 transition-colors">Konservasi Lingkungan</Link></li>
            <li><Link href="/bidang/pariwisata" className="hover:text-green-400 transition-colors">Ekowisata</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Kontak Kami</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span>Gedung Manajemen Kawasan Ekonomi Berkelanjutan, Lt. 2</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-green-500 shrink-0" size={18} />
              <span>halo@csrkawasan.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-green-500 shrink-0" size={18} />
              <span>(021) 555-0192</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} CSR Kawasan Ekonomi Berkelanjutan. Hak cipta dilindungi.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-white transition-colors">Syarat Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}
