import { getProducts } from "@/actions/produkActions";
import { getPrograms } from "@/actions/pertanianActions";
import ProdukManager from "./ProdukManager";

// Ini akan memaksa re-render setiap kali data berubah (jangan di-cache)
export const revalidate = 0;

export default async function ProdukDashboard() {
  const products = await getProducts();
  const programs = await getPrograms();

  // Memetakan ke tipe dasar yang dibutuhkan form
  const programsForForm = programs.map(p => ({
    id: p.id,
    title: p.title
  }));

  return <ProdukManager products={products} programs={programsForForm} />;
}
