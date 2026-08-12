import { prisma } from "@/lib/prisma";

export async function getSectorBySlug(slug: string) {
  return prisma.sector.findUnique({
    where: { slug }
  });
}
