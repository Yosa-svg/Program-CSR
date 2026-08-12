import { prisma } from "@/lib/prisma";

export async function getPublishedDocumentation(sectorId: string) {
  return prisma.documentation.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPublishedDocumentation() {
  return prisma.documentation.findMany({
    where: { 
      isPublished: true 
    },
    include: {
      sector: true
    },
    orderBy: { createdAt: "desc" }
  });
}
