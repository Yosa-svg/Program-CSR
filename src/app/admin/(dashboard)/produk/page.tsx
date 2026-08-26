import { getProducts } from "@/actions/produkActions";
import { getPrograms } from "@/actions/csrActions";
import ProdukManager from "./ProdukManager";
import { getActiveSectorId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function ProdukDashboard() {
  const activeSectorId = await getActiveSectorId();
  const [products, programs, activeSector] = await Promise.all([
    getProducts(),
    getPrograms(),
    activeSectorId ? prisma.sector.findUnique({ where: { id: activeSectorId } }) : null,
  ]);

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <ProdukManager 
      products={products} 
      programs={programsForForm} 
      activeSectorId={activeSectorId} 
      activeSectorName={activeSector?.name || null}
    />
  );
}
