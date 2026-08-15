import { getAllPublishedMetrics } from "@/lib/queries/metrics";
import { getAllSectors } from "@/lib/queries/sectors";
import KinerjaCatalog from "./KinerjaCatalog";

export const metadata = {
  title: "Kinerja & Dampak CSR | Akuntabilitas Program Berkelanjutan",
  description: "Pengukuran target, realisasi, capaian %, serta pilar dampak Output, Outcome, dan Impact program CSR.",
};

export const revalidate = 0;

export default async function KinerjaPublicPage() {
  const metrics = await getAllPublishedMetrics();
  const sectors = await getAllSectors();

  return <KinerjaCatalog metrics={metrics} sectors={sectors} />;
}
