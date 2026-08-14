import { getAllPublishedProducts } from "@/lib/queries/products";
import { getAllSectors } from "@/lib/queries/sectors";
import ProdukCatalog from "./ProdukCatalog";

export const metadata = {
  title: "Produk Unggulan CSR | Kawasan Ekonomi Berkelanjutan",
  description: "Jelajahi etalase produk-produk unggulan hasil pemberdayaan masyarakat.",
};

export const revalidate = 0;

export default async function ProdukPage() {
  const products = await getAllPublishedProducts();
  const sectors = await getAllSectors();

  return <ProdukCatalog products={products} sectors={sectors} />;
}
