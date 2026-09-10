import type { Metadata } from "next";

/**
 * Public canonical site URL.
 * Defaults to "https://csr-ubpnmalut.com" in production as the official domain,
 * or "http://localhost:3000" in development/test.
 * Can be overridden in any environment via NEXT_PUBLIC_SITE_URL.
 */
const isProduction = process.env.NODE_ENV === "production";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (isProduction ? "https://www.csr-ubpnmalut.com" : "http://localhost:3000");

export const SITE_NAME = "CSR ANTAM UBPN Maluku Utara";
export const DEFAULT_DESCRIPTION =
  "Portal resmi program Corporate Social Responsibility (CSR) PT ANTAM Tbk Unit Bisnis Pertambangan Nikel (UBPN) Maluku Utara. Mendorong kemandirian berkelanjutan dan memberdayakan masyarakat lingkar tambang.";

export interface CreateMetadataOptions {
  title: string;
  description?: string;
  canonical?: string;
  imageUrl?: string | null;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  imageUrl,
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const images = imageUrl && !imageUrl.includes("placeholder")
    ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
    : [{ url: "/images/asset-logo.webp", width: 1200, height: 630, alt: SITE_NAME }];

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical || SITE_URL,
      siteName: SITE_NAME,
      locale: "id_ID",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}
