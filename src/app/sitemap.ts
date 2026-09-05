import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static public portal routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/bidang`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/program`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/produk`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dokumentasi`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kinerja`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tentang`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    // 2. Dynamic queries strictly isolated with isPublished: true
    const [sectors, programs, products] = await Promise.all([
      prisma.sector.findMany({
        select: { slug: true },
      }),
      prisma.program.findMany({
        where: { isPublished: true },
        select: { slug: true },
        take: 500,
      }),
      prisma.product.findMany({
        where: { isPublished: true },
        select: { slug: true },
        take: 500,
      }),
    ]);

    const sectorRoutes: MetadataRoute.Sitemap = sectors.map((s) => ({
      url: `${SITE_URL}/bidang/${s.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const programRoutes: MetadataRoute.Sitemap = programs.map((p) => ({
      url: `${SITE_URL}/program/${p.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((pr) => ({
      url: `${SITE_URL}/produk/${pr.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [
      ...staticRoutes,
      ...sectorRoutes,
      ...programRoutes,
      ...productRoutes,
    ];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries:", error);
    return staticRoutes;
  }
}
