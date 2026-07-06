import type { MetadataRoute } from "next";

// Next.js serves this at /robots.txt automatically. It advertises the sitemap
// so search engines discover every page (and future blog posts) on their own.
const SITE_URL = "https://victoriababycare.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
