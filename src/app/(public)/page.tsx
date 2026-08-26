import Hero from "@/components/home/Hero";
import PhotoSlider from "@/components/home/PhotoSlider";
import About from "@/components/home/About";
import Sectors from "@/components/home/Sectors";
import ProgramPreview from "@/components/home/ProgramPreview";
import ProductPreview from "@/components/home/ProductPreview";
import ImpactSummary from "@/components/home/ImpactSummary";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function Home() {
  // Ambil dokumentasi yang di-pin ke slider beranda (featured) dan dipublikasikan
  const featuredDocumentations = await prisma.documentation.findMany({
    where: {
      isPublished: true,
      isFeatured: true,
    },
    include: {
      sector: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 12,
  });

  // Jika belum ada yang di-featured, gunakan fallback foto published terbaru
  const sliderDocumentations = featuredDocumentations.length > 0
    ? featuredDocumentations
    : await prisma.documentation.findMany({
        where: {
          isPublished: true,
        },
        include: {
          sector: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 8,
      });

  return (
    <>
      <Hero />
      <PhotoSlider documentations={sliderDocumentations} />
      <About />
      <Sectors />
      <ProgramPreview />
      <ProductPreview />
      <ImpactSummary />
    </>
  );
}
