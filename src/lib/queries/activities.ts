import { prisma } from "@/lib/prisma";

export async function getPublishedActivities(sectorId: string) {
  return prisma.activity.findMany({
    where: { 
      sectorId,
      isPublished: true 
    },
    orderBy: { date: "desc" },
    take: 50,
  });
}

export async function getAllPublishedActivities() {
  return prisma.activity.findMany({
    where: { 
      isPublished: true 
    },
    include: {
      sector: true
    },
    orderBy: { date: "desc" },
    take: 100,
  });
}
