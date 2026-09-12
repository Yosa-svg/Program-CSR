import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy compliant with Next.js 16.3 / React 19 / Turbopack
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' for hydration and scripts; in dev, 'unsafe-eval' is needed for react fast refresh
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind and CSS-in-JS style injections (e.g. Framer Motion, Recharts) require 'unsafe-inline'
  "style-src 'self' 'unsafe-inline'",
  // Image sources: self, inline data, blob, Vercel Blob storage, and YouTube thumbnails
  "img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://i.ytimg.com https://img.youtube.com",
  // Fonts are self-hosted by Next.js font optimization
  "font-src 'self'",
  // Connections for API routes, Server Actions, and Vercel Blob
  "connect-src 'self' https://*.public.blob.vercel-storage.com",
  // Media sources for HTML5 video / audio (Vercel Blob storage)
  "media-src 'self' blob: data: https://*.public.blob.vercel-storage.com",
  // Allow YouTube embeds in iframes (frame-src falls back to default-src 'self' if omitted, which blocks external embeds)
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  // Prevent plugins (Flash, Java applets)
  "object-src 'none'",
  // Restrict <base> tag manipulation
  "base-uri 'self'",
  // Restrict form submission targets
  "form-action 'self'",
  // Clickjacking prevention: disallow embedding in iframes
  "frame-ancestors 'none'",
  // In production, force HTTPS upgrades for all subresources
  ...(isProd ? ["upgrade-insecure-requests"] : []),
];

const contentSecurityPolicyHeaderValue = cspDirectives.join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicyHeaderValue,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

