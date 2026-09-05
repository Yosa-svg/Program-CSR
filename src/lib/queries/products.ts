import { prisma } from "@/lib/prisma";

export async function getPublishedProducts(sectorId: string) {
  return prisma.product.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { name: "asc" },
    take: 50,
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
    orderBy: { name: "asc" },
    take: 100,
  });
}

export async function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      sector: true,
      program: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          isPublished: true,
        },
      },
      documentations: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }
    }
  });
}
