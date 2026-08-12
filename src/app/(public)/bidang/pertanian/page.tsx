import HeroPertanian from "@/components/pertanian/HeroPertanian";
import AboutPertanian from "@/components/pertanian/AboutPertanian";
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
  title: "Pertanian | Bidang CSR",
  description: "Menumbuhkan kemandirian pangan dan ekonomi lokal melalui praktik pertanian modern.",
};

export default async function PertanianPage() {
  const sector = await getSectorBySlug("pertanian");
  
  if (!sector) {
    return <div className="text-white text-center py-20">Sektor Pertanian tidak ditemukan.</div>;
  }

  const programs = await getPublishedPrograms(sector.id);
  const activities = await getPublishedActivities(sector.id);
  const products = await getPublishedProducts(sector.id);
  const documentations = await getPublishedDocumentation(sector.id);
  const metrics = await getPublishedMetrics(sector.id);

  return (
    <>
      <HeroPertanian />
      <AboutPertanian />
      
      {programs.length > 0 && <ProgramPertanian programs={programs} />}
      {activities.length > 0 && <KegiatanPertanian activities={activities} />}
      {products.length > 0 && <ProdukPertanian products={products} />}
      {documentations.length > 0 && <DokumentasiPertanian documentations={documentations} />}
      {metrics.length > 0 && <KinerjaPertanian metrics={metrics} />}
      
      <CtaPertanian />
    </>
  );
}
