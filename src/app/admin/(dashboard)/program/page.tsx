import { getPrograms } from "@/actions/csrActions";
import ProgramManager from "./ProgramManager";
import { getActiveSectorId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function ProgramDashboard() {
  const activeSectorId = await getActiveSectorId();
  const [programs, activeSector, sectors] = await Promise.all([
    getPrograms(),
    activeSectorId ? prisma.sector.findUnique({ where: { id: activeSectorId } }) : null,
    prisma.sector.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProgramManager 
      programs={programs} 
      activeSectorId={activeSectorId} 
      activeSectorName={activeSector?.name || null} 
      sectors={sectors}
    />
  );
}
