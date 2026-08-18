import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8E6] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#0D726D] rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest shadow-sm group-hover:bg-[#0B5C58] transition-colors relative overflow-hidden">
            <span>KEB</span>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#F6A236] rounded-bl-md"></div>
          </div>
          <span className="font-serif font-bold text-xl text-[#172121]">
            CSR <span className="text-[#0D726D]">KEB</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-[#172121]/80 hover:text-[#0D726D] transition-colors">
            Beranda
          </Link>
          <Link href="/tentang" className="text-sm font-semibold text-[#172121]/80 hover:text-[#0D726D] transition-colors">
            Tentang Kawasan
          </Link>
          <Link href="/bidang" className="text-sm font-semibold text-[#172121]/80 hover:text-[#0D726D] transition-colors">
            Bidang CSR
          </Link>
          <Link href="/program" className="text-sm font-semibold text-[#172121]/80 hover:text-[#0D726D] transition-colors">
            Program
          </Link>
          <Link href="/produk" className="text-sm font-semibold text-[#172121]/80 hover:text-[#0D726D] transition-colors">
            Produk
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/admin/login" 
            className="btn btn-primary text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-colors"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
