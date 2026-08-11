import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <Leaf className="text-green-600" size={24} />
          </div>
          <span className="font-playfair font-bold text-xl text-gray-900">
            CSR <span className="text-green-700">KEB</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
            Beranda
          </Link>
          <Link href="/tentang" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
            Tentang Kawasan
          </Link>
          <Link href="/bidang" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
            Bidang CSR
          </Link>
          <Link href="/program" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
            Program
          </Link>
          <Link href="/produk" className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
            Produk
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/admin/login" 
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
