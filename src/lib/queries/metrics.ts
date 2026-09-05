import { prisma } from "@/lib/prisma";

export async function getAllPublishedMetrics(sectorId?: string) {
  try {
    return await prisma.metric.findMany({
      where: {
        isPublished: true,
        ...(sectorId ? { sectorId } : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        unit: true,
        target: true,
        realization: true,
        value: true,
        year: true,
        period: true,
        source: true,
        verificationStatus: true,
        programId: true,
        program: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        sectorId: true,
        sector: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { year: "desc" },
        { createdAt: "desc" },
      ],
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch published metrics:", error);
    return [];
  }
}

export const getPublishedMetrics = getAllPublishedMetrics;
