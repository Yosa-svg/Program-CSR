import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import PhotoSlider from "@/components/home/PhotoSlider";
import About from "@/components/home/About";
import Focus from "@/components/home/Focus";
import Planning from "@/components/home/Planning";
import ProgramPreview from "@/components/home/ProgramPreview";
import ProductPreview from "@/components/home/ProductPreview";
import ImpactSummary from "@/components/home/ImpactSummary";
import Governance from "@/components/home/Governance";
import Framework from "@/components/home/Framework";
import ContactSection from "@/components/home/ContactSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = createMetadata({
  title: "CSR ANTAM UBPN Maluku Utara",
  description:
    "Portal resmi program Corporate Social Responsibility (CSR) PT ANTAM Tbk UBPN Maluku Utara. Mendorong kemandirian berkelanjutan dan memberdayakan masyarakat lingkar tambang.",
  canonical: "/",
});

export default async function Home() {
  // Parallel database query for real published CMS data
  const [
    featuredDocs,
    fallbackDocs,
    programs,
    products,
    metrics,
  ] = await Promise.all([
    // 1. Featured published documentations for slider
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
    // 2. Fallback published documentations
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
    // 3. Up to 3 published programs from CMS
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
      take: 3,
    }),
    // 4. Up to 3 published products from CMS
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
    // 5. Published metrics from CMS
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
      take: 4,
    }),
  ]);

  const sliderDocumentations = featuredDocs.length > 0 ? featuredDocs : fallbackDocs;

  return (
    <>
      {/* 1. Hero Section (2 columns desktop: Left text, Right video highlight) */}
      <Hero />

      {/* 2. Photo Slider (Cerita dari Lapangan) */}
      <PhotoSlider documentations={sliderDocumentations} />

      {/* 3. About CSR (CSR ANTAM untuk Masyarakat dan Lingkungan) */}
      <About />

      {/* 4. Fokus CSR (4 pilar: Pendidikan, Lingkungan, Ekonomi & UMK, Sosial & Masyarakat) */}
      <Focus />

      {/* 5. Perencanaan CSR (Terencana, Terukur, Tepat Sasaran - 3 tahap) */}
      <Planning />

      {/* 6. Program CSR Unggulan (3 program terbit dari CMS) */}
      <ProgramPreview programs={programs} />

      {/* 7. Produk & Karya Mitra Binaan (3 produk terbit dari CMS tanpa info finansial/harga) */}
      <ProductPreview products={products} />

      {/* 8. Dampak & Kinerja CSR (Metrik riil CMS atau state Dalam Proses Evaluasi) */}
      <ImpactSummary metrics={metrics} />

      {/* 9. Tata Kelola CSR (4 pilar governance: Perencanaan, Pelaksanaan, Monitoring, Evaluasi) */}
      <Governance />

      {/* 10. Kerangka & Acuan (ISO 26000 sebagai panduan tanggung jawab sosial, SDGs, PROPER, Regulasi) */}
      <Framework />

      {/* 11. Terhubung dengan Kami (Informasi resmi kantor Buli Halmahera Timur & CTA /tentang) */}
      <ContactSection />
    </>
  );
}
