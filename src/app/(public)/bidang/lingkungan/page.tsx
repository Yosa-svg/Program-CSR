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
    return <div className="text-white text-center py-20">Sektor Lingkungan tidak ditemukan.</div>;
  }

  const programs = await getPublishedPrograms(sector.id);
  const activities = await getPublishedActivities(sector.id);
  const products = await getPublishedProducts(sector.id);
  const documentations = await getPublishedDocumentation(sector.id);
  const metrics = await getPublishedMetrics(sector.id);

  return (
    <div className="bg-[#0A160D] text-white min-h-screen pt-20">
      <section className="py-20 px-6 border-b border-white/10 bg-gradient-to-b from-[#112316] to-[#0A160D]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest mb-6">
            ♻️ Sektor Lingkungan
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Pengolahan Sampah Plastik & <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Pupuk Diversoil
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70">
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
