import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/bidang",
          "/bidang/",
          "/program",
          "/program/",
          "/produk",
          "/produk/",
          "/dokumentasi",
          "/kinerja",
          "/tentang",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/administrator",
          "/administrator/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
