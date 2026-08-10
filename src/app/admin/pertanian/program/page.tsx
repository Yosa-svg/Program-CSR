import { getPrograms } from "@/actions/pertanianActions";
import ProgramManager from "./ProgramManager";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function ProgramDashboard() {
  const programs = await getPrograms();

  return <ProgramManager programs={programs} />;
}
