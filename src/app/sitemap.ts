import type { MetadataRoute } from "next";
import { allCalculators } from "@/lib/calculators/registry";
import { categories } from "@/lib/calculators/categories";
import { BLOG_CATEGORIES } from "@/lib/blog/types";
import { getPublishedPosts } from "@/lib/blog/queries";

const siteUrl = "https://calculateus.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${siteUrl}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOG_CATEGORIES.map((c) => ({
      url: `${siteUrl}/blog/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  const calculatorRoutes: MetadataRoute.Sitemap = allCalculators.map((c) => ({
    url: `${siteUrl}/calculators/${c.slug}`,
    changeFrequency: "monthly",
    priority: c.popular ? 0.9 : 0.6,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts({ max: 500 });
    postRoutes = posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: new Date(p.updatedAt),
    }));
  } catch {
    // Firestore unreachable at build time — sitemap still works without post URLs
  }

  return [...staticRoutes, ...calculatorRoutes, ...postRoutes];
}
