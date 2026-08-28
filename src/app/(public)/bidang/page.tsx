import Link from "next/link";
import { ArrowRight, PawPrint, Recycle, Factory, Store, GraduationCap, HeartPulse, HardHat, Zap, Palmtree, Leaf, Sprout, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SECTOR_ICONS: Record<string, LucideIcon> = {
  pertanian: Sprout,
  peternakan: PawPrint,
  lingkungan: Recycle,
  "industri-kelapa": Factory,
  umkm: Store,
  pendidikan: GraduationCap,
  kesehatan: HeartPulse,
  infrastruktur: HardHat,
  energi: Zap,
  pariwisata: Palmtree,
};

export const metadata = {
  title: "Sektor & Bidang CSR | Kawasan Ekonomi Keberkelanjutan",
  description: "Daftar seluruh sektor pemberdayaan masyarakat dan pelestarian lingkungan dalam program CSR.",
};

export default async function BidangCSRPage() {
  const sectors = await prisma.sector.findMany({
    include: {
      programs: {
        where: { isPublished: true },
        select: { title: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-card">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-6 bg-muted-bg border-b border-border">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Taksonomi Sektor CSR
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 uppercase tracking-tight">
            Sektor / Bidang CSR
          </h1>
          <p className="text-xl text-foreground/70 font-normal max-w-2xl">
            Sektor pemberdayaan masyarakat, kemitraan ekonomi, dan pelestarian lingkungan dalam Kawasan Ekonomi Berkelanjutan.
          </p>
        </div>
      </section>

      {/* FEATURED LIST SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-border">
            {sectors.map((sector, index) => {
              const numStr = String(index + 1).padStart(2, "0");
              const SectorIcon = SECTOR_ICONS[sector.slug] || Leaf;
              const desc = sector.programs.length > 0 
                ? `Program: ${sector.programs.map((p) => p.title).join(" • ")}`
                : "Inisiatif pemberdayaan masyarakat & pengembangan berkelanjutan.";

              return (
                <Link 
                  key={sector.id} 
                  href={`/bidang/${sector.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 border-b border-border hover:bg-muted-bg transition-colors duration-300 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl"
                >
                  <div className="flex items-start md:items-center gap-6 md:gap-16">
                    {/* ID NUMBER */}
                    <div className="text-2xl md:text-3xl font-bold text-foreground/30 group-hover:text-primary transition-colors duration-300 w-12">
                      {numStr}
                    </div>
                    
                    {/* TEXT CONTENT */}
                    <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {sector.name}
                      </h2>
                      <p className="text-foreground/65 text-lg group-hover:text-foreground transition-colors duration-300 font-normal">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* ICON & ARROW */}
                  <div className="flex items-center gap-8 mt-6 md:mt-0 self-end md:self-auto">
                    <div className="text-foreground/30 group-hover:text-primary opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 transform origin-right">
                      <SectorIcon size={44} strokeWidth={1.5} />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-transparent group-hover:text-white transition-all duration-300 text-foreground/40 shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
