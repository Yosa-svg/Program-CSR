import type { Metadata } from "next";
import { getAllPublishedDocumentation } from "@/lib/queries/documentation";
import { getAllSectors } from "@/lib/queries/sectors";
import { createMetadata } from "@/lib/seo";
import DokumentasiCatalog from "./DokumentasiCatalog";

export const metadata: Metadata = createMetadata({
  title: "Galeri Dokumentasi CSR",
  description:
    "Dokumentasi visual foto dan arsip kegiatan dari berbagai inisiatif pemberdayaan masyarakat dan pelestarian lingkungan CSR ANTAM.",
  canonical: "/dokumentasi",
});

export const revalidate = 0;

export default async function DokumentasiPage() {
  const documentations = await getAllPublishedDocumentation();
  const sectors = await getAllSectors();

  return <DokumentasiCatalog documentations={documentations} sectors={sectors} />;
}
