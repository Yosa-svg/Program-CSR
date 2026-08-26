import { getDocumentations } from "@/actions/dokumentasiActions";
import { getPrograms } from "@/actions/csrActions";
import { getActivities } from "@/actions/kegiatanActions";
import { getProducts } from "@/actions/produkActions";
import DokumentasiManager from "./DokumentasiManager";
import { getActiveSectorId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function DokumentasiDashboard() {
  const activeSectorId = await getActiveSectorId();
  const [documentations, programs, activities, products, activeSector] = await Promise.all([
    getDocumentations(),
    getPrograms(),
    getActivities(),
    getProducts(),
    activeSectorId ? prisma.sector.findUnique({ where: { id: activeSectorId } }) : null,
  ]);

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map((p) => ({
    id: p.id,
    title: p.title,
  }));
  
  const activitiesForForm = activities.map((a) => ({
    id: a.id,
    title: a.title,
  }));
  
  const productsForForm = products.map((p) => ({
    id: p.id,
    title: p.name,
  }));

  return (
    <DokumentasiManager 
      documentations={documentations} 
      programs={programsForForm} 
      activities={activitiesForForm} 
      products={productsForForm} 
      activeSectorId={activeSectorId} 
      activeSectorName={activeSector?.name || null}
    />
  );
}
