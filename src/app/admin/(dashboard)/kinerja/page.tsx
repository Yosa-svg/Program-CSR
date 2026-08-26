import { getMetrics } from "@/actions/kinerjaActions";
import { getPrograms } from "@/actions/csrActions";
import KinerjaManager from "./KinerjaManager";
import { getActiveSectorId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function KinerjaDashboard() {
  const activeSectorId = await getActiveSectorId();
  const [metrics, programs, activeSector] = await Promise.all([
    getMetrics(),
    getPrograms(),
    activeSectorId ? prisma.sector.findUnique({ where: { id: activeSectorId } }) : null,
  ]);

  const programsForForm = programs.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <KinerjaManager 
      metrics={metrics} 
      programs={programsForForm}
      activeSectorId={activeSectorId} 
      activeSectorName={activeSector?.name || null}
    />
  );
}
