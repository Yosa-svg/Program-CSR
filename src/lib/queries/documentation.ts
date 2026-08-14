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
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      date: true,
      source: true,
      verificationStatus: true,
      sectorId: true,
      sector: {
        select: {
          id: true,
          name: true,
        }
      },
      program: {
        select: {
          id: true,
          title: true,
          slug: true,
        }
      },
      activity: {
        select: {
          id: true,
          title: true,
        }
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}
