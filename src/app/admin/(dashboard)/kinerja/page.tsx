import { getMetrics } from "@/actions/kinerjaActions";
import KinerjaManager from "./KinerjaManager";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
import { getActiveSectorId } from "@/lib/auth";

export const revalidate = 0;

export default async function KinerjaDashboard() {
  const activeSectorId = await getActiveSectorId();
  const metrics = await getMetrics();

  return <KinerjaManager metrics={metrics} activeSectorId={activeSectorId} />;
}
