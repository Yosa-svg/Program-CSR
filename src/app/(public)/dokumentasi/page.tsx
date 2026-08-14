import { getAllPublishedDocumentation } from "@/lib/queries/documentation";
import { getAllSectors } from "@/lib/queries/sectors";
import DokumentasiCatalog from "./DokumentasiCatalog";

export const metadata = {
  title: "Galeri CSR | Kawasan Ekonomi Berkelanjutan",
  description: "Dokumentasi visual dari berbagai program dan kegiatan pemberdayaan masyarakat.",
};

export const revalidate = 0;

export default async function DokumentasiPage() {
  const documentations = await getAllPublishedDocumentation();
  const sectors = await getAllSectors();

  return <DokumentasiCatalog documentations={documentations} sectors={sectors} />;
}
