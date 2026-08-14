import { getAllPublishedPrograms } from "@/lib/queries/programs";
import { getAllSectors } from "@/lib/queries/sectors";
import ProgramCatalog from "./ProgramCatalog";

export const metadata = {
  title: "Program CSR | Kawasan Ekonomi Berkelanjutan",
  description: "Jelajahi seluruh program Corporate Social Responsibility yang telah dipublikasikan di berbagai sektor.",
};

export const revalidate = 0;

export default async function ProgramPage() {
  const programs = await getAllPublishedPrograms();
  const sectors = await getAllSectors();

  return <ProgramCatalog programs={programs} sectors={sectors} />;
}
