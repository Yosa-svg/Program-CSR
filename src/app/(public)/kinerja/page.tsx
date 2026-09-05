import type { Metadata } from "next";
import { getAllPublishedMetrics } from "@/lib/queries/metrics";
import { getAllSectors } from "@/lib/queries/sectors";
import { createMetadata } from "@/lib/seo";
import KinerjaCatalog from "./KinerjaCatalog";

export const metadata: Metadata = createMetadata({
  title: "Kinerja & Dampak CSR",
  description:
    "Transparansi pengukuran target, realisasi, capaian persentase, serta pilar dampak Output, Outcome, dan Impact program CSR ANTAM.",
  canonical: "/kinerja",
});

export const revalidate = 0;

export default async function KinerjaPublicPage() {
  const metrics = await getAllPublishedMetrics();
  const sectors = await getAllSectors();

  return <KinerjaCatalog metrics={metrics} sectors={sectors} />;
}
