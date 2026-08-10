import { getActivities } from "@/actions/kegiatanActions";
import { getPrograms } from "@/actions/pertanianActions";
import KegiatanManager from "./KegiatanManager";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function KegiatanDashboard() {
  const activities = await getActivities();
  const programs = await getPrograms();

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map(p => ({
    id: p.id,
    title: p.title
  }));

  return <KegiatanManager activities={activities} programs={programsForForm} />;
}
