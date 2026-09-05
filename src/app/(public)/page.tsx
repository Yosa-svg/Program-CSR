import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import PhotoSlider from "@/components/home/PhotoSlider";
import About from "@/components/home/About";
import Sectors from "@/components/home/Sectors";
import ProgramPreview from "@/components/home/ProgramPreview";
import ProductPreview from "@/components/home/ProductPreview";
import ImpactSummary from "@/components/home/ImpactSummary";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = createMetadata({
  title: "Beranda",
  description:
    "Portal resmi program Corporate Social Responsibility (CSR) ANTAM. Menyelaraskan kemajuan ekonomi masyarakat lokal dengan kelestarian alam secara terpadu.",
  canonical: "/",
});

export default async function Home() {
  // Query paralel untuk seluruh kebutuhan data Beranda secara efisien
  const [
    featuredDocs,
    fallbackDocs,
    sectorCount,
    sectors,
    programs,
    products,
    metrics,
  ] = await Promise.all([
    // 1. Dokumentasi featured & published
    prisma.documentation.findMany({
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
    }),
    // 2. Fallback dokumentasi published
    prisma.documentation.findMany({
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
    }),
    // 3. Jumlah sektor aktif untuk Hero
    prisma.sector.count(),
    // 4. Sektor dengan inisiatif program terbit untuk Sectors
    prisma.sector.findMany({
      orderBy: { name: "asc" },
      include: {
        programs: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
          },
          take: 1,
        },
      },
    }),
    // 5. Dua program terbit untuk ProgramPreview
    prisma.program.findMany({
      where: { isPublished: true },
      include: {
        sector: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { title: "asc" },
      take: 2,
    }),
    // 6. Tiga produk terbit untuk ProductPreview
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        sector: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: 3,
    }),
    // 7. Dua metrik dampak terbit terbaru untuk ImpactSummary
    prisma.metric.findMany({
      where: { isPublished: true },
      include: {
        sector: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      take: 2,
    }),
  ]);

  const sliderDocumentations = featuredDocs.length > 0 ? featuredDocs : fallbackDocs;

  return (
    <>
      <Hero sectorsCount={sectorCount} />
      <PhotoSlider documentations={sliderDocumentations} />
      <About />
      <Sectors sectors={sectors} />
      <ProgramPreview programs={programs} />
      <ProductPreview products={products} />
      <ImpactSummary metrics={metrics} />
    </>
  );
}
