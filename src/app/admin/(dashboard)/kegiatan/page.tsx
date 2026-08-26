import { getActivities } from "@/actions/kegiatanActions";
import { getPrograms } from "@/actions/csrActions";
import KegiatanManager from "./KegiatanManager";
import { getActiveSectorId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function KegiatanDashboard() {
  const activeSectorId = await getActiveSectorId();
  const [activities, programs, activeSector] = await Promise.all([
    getActivities(),
    getPrograms(),
    activeSectorId ? prisma.sector.findUnique({ where: { id: activeSectorId } }) : null,
  ]);

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <KegiatanManager 
      activities={activities} 
      programs={programsForForm} 
      activeSectorId={activeSectorId} 
      activeSectorName={activeSector?.name || null}
    />
  );
}
