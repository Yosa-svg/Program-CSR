import type { Metadata } from "next";
import { getAllPublishedProducts } from "@/lib/queries/products";
import { getAllSectors } from "@/lib/queries/sectors";
import { createMetadata } from "@/lib/seo";
import ProdukCatalog from "./ProdukCatalog";

export const metadata: Metadata = createMetadata({
  title: "Produk Unggulan CSR",
  description:
    "Jelajahi etalase produk-produk unggulan hasil kemitraan, pemberdayaan masyarakat, dan unit usaha lokal CSR ANTAM.",
  canonical: "/produk",
});

export const revalidate = 0;

export default async function ProdukPage() {
  const products = await getAllPublishedProducts();
  const sectors = await getAllSectors();

  return <ProdukCatalog products={products} sectors={sectors} />;
}
