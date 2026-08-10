import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center text-accent font-bold text-sm tracking-widest">
                KEB
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-white">
                  Kawasan Ekonomi
                </span>
                <span className="text-xs text-white/70">Berkelanjutan</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Menginspirasi dan membangun masyarakat yang mandiri melalui pengelolaan sumber daya yang berkelanjutan.
            </p>
            <div className="flex items-center gap-4 text-white/50 text-xs">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/tentang" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/bidang" className="hover:text-white transition-colors">Bidang CSR</Link></li>
              <li><Link href="/program" className="hover:text-white transition-colors">Program Unggulan</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Katalog Produk</Link></li>
              <li><Link href="/kinerja" className="hover:text-white transition-colors">Laporan Kinerja</Link></li>
            </ul>
          </div>

          {/* Sectors Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Sektor Utama</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/bidang/pertanian" className="hover:text-white transition-colors">Pertanian</Link></li>
              <li><Link href="/bidang/umkm" className="hover:text-white transition-colors">UMKM</Link></li>
              <li><Link href="/bidang/lingkungan" className="hover:text-white transition-colors">Lingkungan</Link></li>
              <li><Link href="/bidang/pendidikan" className="hover:text-white transition-colors">Pendidikan</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>Jl. Pembangunan Berkelanjutan No. 12, Jakarta</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span>+62 811 2233 4455</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>halo@keb-csr.id</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
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
