import { prisma } from "@/lib/prisma";

export async function getPublishedProducts(sectorId: string) {
  return prisma.product.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { name: "asc" }
  });
}

export async function getAllPublishedProducts(sectorSlug?: string) {
  return prisma.product.findMany({
    where: { 
      isPublished: true,
      ...(sectorSlug ? {
        sector: {
          name: {
            equals: sectorSlug.replace(/-/g, ' '),
          }
        }
      } : {})
    },
    include: {
      sector: true
    },
    orderBy: { name: "asc" }
  });
}

export async function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isPublished: true,
      // Sector is published as well? For now just check if program is published (if it has one) or just product itself
    },
    include: {
      sector: true,
      program: true,
      documentations: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}
