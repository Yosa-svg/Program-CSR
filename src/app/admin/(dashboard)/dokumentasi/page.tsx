import { getDocumentations } from "@/actions/dokumentasiActions";
import { getPrograms } from "@/actions/csrActions";
import { getActivities } from "@/actions/kegiatanActions";
import { getProducts } from "@/actions/produkActions";
import DokumentasiManager from "./DokumentasiManager";
import { getActiveSectorId } from "@/lib/auth";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function DokumentasiDashboard() {
  const activeSectorId = await getActiveSectorId();
  const documentations = await getDocumentations();
  const programs = await getPrograms();
  const activities = await getActivities();
  const products = await getProducts();

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map(p => ({
    id: p.id,
    title: p.title
  }));
  
  const activitiesForForm = activities.map(a => ({
    id: a.id,
    title: a.title
  }));
  
  const productsForForm = products.map(p => ({
    id: p.id,
    title: p.name
  }));

  return (
    <DokumentasiManager 
      documentations={documentations} 
      programs={programsForForm} 
      activities={activitiesForForm}
      products={productsForForm}
      activeSectorId={activeSectorId}
    />
  );
}
