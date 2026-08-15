import { getMetrics } from "@/actions/kinerjaActions";
import { getPrograms } from "@/actions/csrActions";
import KinerjaManager from "./KinerjaManager";
import { getActiveSectorId } from "@/lib/auth";

export const revalidate = 0;

export default async function KinerjaDashboard() {
  const activeSectorId = await getActiveSectorId();
  const metrics = await getMetrics();
  const programs = await getPrograms();

  const programsForForm = programs.map(p => ({
    id: p.id,
    title: p.title
  }));

  return (
    <KinerjaManager 
      metrics={metrics} 
      programs={programsForForm}
      activeSectorId={activeSectorId} 
    />
  );
}
