"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Sektor CSR", href: "/bidang" },
    { name: "Program", href: "/program" },
    { name: "Produk", href: "/produk" },
    { name: "Dokumentasi", href: "/dokumentasi" },
    { name: "Kinerja", href: "/kinerja" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8E6] py-3.5"
          : "bg-white/90 backdrop-blur-sm border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0D726D] rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest shadow-sm group-hover:bg-[#0B5C58] transition-colors relative overflow-hidden">
              <span>KEK</span>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#F6A236] rounded-bl-md"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-[#172121]">
                Kawasan Ekonomi
              </span>
              <span className="text-xs text-[#172121]/60 font-medium">
                Keberkelanjutan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0D726D] border-b-2 border-[#0D726D] pb-0.5"
                      : "text-[#172121]/80 hover:text-[#0D726D]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-[#0D726D] hover:text-[#0B5C58] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#0D726D]/5"
            >
              Masuk
            </Link>
            <Link
              href="/bidang"
              className="btn btn-primary rounded-full px-5 py-2 text-sm flex items-center gap-2 font-semibold shadow-sm"
            >
              Jelajahi <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#172121] hover:text-[#0D726D] transition-colors focus:outline-none p-1"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[#E2E8E6] shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0D726D]/10 text-[#0D726D]"
                        : "text-[#172121]/80 hover:bg-[#F7FAF9] hover:text-[#0D726D]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="px-3 pt-4 border-t border-[#E2E8E6] flex flex-col gap-2.5">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center font-semibold py-2 text-[#0D726D] text-sm"
                >
                  Masuk ke Portal Admin
                </Link>
                <Link
                  href="/bidang"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary rounded-full w-full flex justify-center items-center gap-2 font-semibold text-sm"
                >
                  Jelajahi Program <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
