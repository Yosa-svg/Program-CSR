import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://csr.antam.com";
export const SITE_NAME = "CSR ANTAM - Kawasan Ekonomi Berkelanjutan";
export const DEFAULT_DESCRIPTION =
  "Platform transparansi, dampak, dan publikasi program Corporate Social Responsibility (CSR) Kawasan Ekonomi Berkelanjutan ANTAM.";

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
    : [{ url: "/images/about/kawasan.jpg", width: 1200, height: 630, alt: SITE_NAME }];

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
