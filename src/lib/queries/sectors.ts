import { prisma } from "@/lib/prisma";

export async function getSectorBySlug(slug: string) {
  return prisma.sector.findUnique({
    where: { slug }
  });
}

export async function getAllSectors() {
  return prisma.sector.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" }
  });
}
