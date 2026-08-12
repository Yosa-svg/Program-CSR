import { prisma } from "@/lib/prisma";

export async function getPublishedProducts(sectorId: string) {
  return prisma.product.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPublishedProducts() {
  return prisma.product.findMany({
    where: { 
      isPublished: true 
    },
    include: {
      sector: true
    },
    orderBy: { createdAt: "desc" }
  });
}
