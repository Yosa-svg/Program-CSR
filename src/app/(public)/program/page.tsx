import type { Metadata } from "next";
import { getAllPublishedPrograms } from "@/lib/queries/programs";
import { getAllSectors } from "@/lib/queries/sectors";
import { createMetadata } from "@/lib/seo";
import ProgramCatalog from "./ProgramCatalog";

export const metadata: Metadata = createMetadata({
  title: "Program CSR",
  description:
    "Jelajahi seluruh program Corporate Social Responsibility (CSR) yang telah dipublikasikan di berbagai sektor keberlanjutan.",
  canonical: "/program",
});

export const revalidate = 0;

export default async function ProgramPage() {
  const programs = await getAllPublishedPrograms();
  const sectors = await getAllSectors();

  return <ProgramCatalog programs={programs} sectors={sectors} />;
}
