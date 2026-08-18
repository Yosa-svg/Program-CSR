import ProgramPertanian from "@/components/pertanian/ProgramPertanian";
import KegiatanPertanian from "@/components/pertanian/KegiatanPertanian";
import ProdukPertanian from "@/components/pertanian/ProdukPertanian";
import DokumentasiPertanian from "@/components/pertanian/DokumentasiPertanian";
import KinerjaPertanian from "@/components/pertanian/KinerjaPertanian";
import CtaPertanian from "@/components/pertanian/CtaPertanian";

import { getSectorBySlug } from "@/lib/queries/sectors";
import { getPublishedPrograms } from "@/lib/queries/programs";
import { getPublishedActivities } from "@/lib/queries/activities";
import { getPublishedProducts } from "@/lib/queries/products";
import { getPublishedDocumentation } from "@/lib/queries/documentation";
import { getPublishedMetrics } from "@/lib/queries/metrics";

export const metadata = {
  title: "Lingkungan | Sektor CSR",
  description: "Pengolahan Sampah Plastik & Pupuk Diversoil untuk pelestarian ekosistem dan ekonomi sirkular.",
};

export default async function LingkunganPage() {
  const sector = await getSectorBySlug("lingkungan");
  
  if (!sector) {
    return <div className="text-center py-20">Sektor Lingkungan tidak ditemukan.</div>;
  }

  const programs = await getPublishedPrograms(sector.id);
  const activities = await getPublishedActivities(sector.id);
  const products = await getPublishedProducts(sector.id);
  const documentations = await getPublishedDocumentation(sector.id);
  const metrics = await getPublishedMetrics(sector.id);

  return (
    <div className="bg-white min-h-screen pt-20 text-[#172121]">
      <section 
        className="py-24 px-6 border-b border-[#E2E8E6] text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D726D 0%, #158F88 60%, #F6A236 100%)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white border border-white/30 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
            ♻️ Sektor Lingkungan • Teal Dominant
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Pengolahan Sampah Plastik & <br />
            Pupuk Diversoil
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 font-normal leading-relaxed drop-shadow-sm">
            Mengintegrasikan pengelolaan limbah anorganik daur ulang dengan komposting bio-organik Pupuk Diversoil demi keberlanjutan tanah dan ekosistem.
          </p>
        </div>
      </section>

      {programs.length > 0 && <ProgramPertanian programs={programs} />}
      {activities.length > 0 && <KegiatanPertanian activities={activities} />}
      {products.length > 0 && <ProdukPertanian products={products} />}
      {documentations.length > 0 && <DokumentasiPertanian documentations={documentations} />}
      {metrics.length > 0 && <KinerjaPertanian metrics={metrics} />}
      
      <CtaPertanian />
    </div>
  );
}
