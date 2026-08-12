import { prisma } from "@/lib/prisma";

export async function getPublishedPrograms(sectorId: string) {
  return prisma.program.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPublishedPrograms() {
  return prisma.program.findMany({
    where: { 
      isPublished: true 
    },
    include: {
      sector: true
    },
    orderBy: { createdAt: "desc" }
  });
}
