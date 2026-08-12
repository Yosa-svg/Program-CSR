import { prisma } from "@/lib/prisma";

export async function getPublishedMetrics(sectorId: string) {
  return prisma.metric.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllPublishedMetrics() {
  return prisma.metric.findMany({
    where: { 
      isPublished: true 
    },
    include: {
      sector: true
    },
    orderBy: { createdAt: "desc" }
  });
}
