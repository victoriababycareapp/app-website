import type { MetadataRoute } from "next";
import { getAllPosts } from "../lib/blog";

// Next.js serves this file at /sitemap.xml automatically. It regenerates at
// build time and (thanks to `revalidate`) at most hourly at runtime — so new
// blog articles appear here on their own, no manual editing.
const SITE_URL = "https://victoriababycare.com";

// Re-generate at most once an hour if the content source becomes remote.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-choices`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // One entry per published blog article, driven by src/lib/blog.ts.
  const posts = await getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
