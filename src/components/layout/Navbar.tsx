"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Bidang CSR", href: "/bidang" },
    { name: "Program", href: "/program" },
    { name: "Produk", href: "/produk" },
    { name: "Dokumentasi", href: "/dokumentasi" },
    { name: "Kinerja", href: "/kinerja" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-white/5 py-4" : "bg-background/40 py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-white/90 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/login" className="text-base font-medium text-white/90 hover:text-white transition-colors">
              Masuk
            </Link>
            <button className="btn btn-primary rounded-full px-6 flex items-center gap-2">
              Jelajahi <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-accent transition-colors focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-3 pt-4 flex flex-col gap-3">
                <Link href="/login" className="text-center font-medium py-2">
                  Masuk
                </Link>
                <button className="btn btn-primary rounded-full w-full flex justify-center items-center gap-2">
                  Jelajahi <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
