import { prisma } from "@/lib/prisma";

export async function getPublishedPrograms(sectorId: string) {
  return prisma.program.findMany({
    where: {
      sectorId,
      isPublished: true
    },
    include: { sector: true },
    orderBy: { title: "asc" },
    take: 50,
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
    orderBy: { title: "asc" },
    take: 100,
  });
}

export async function getPublishedProgramBySlug(slug: string) {
  return prisma.program.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      sector: true,
      activities: {
        where: { isPublished: true },
        orderBy: { date: "desc" },
      },
      products: {
        where: { isPublished: true },
        orderBy: { name: "asc" },
      },
      documentations: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });
}
