import type { MetadataRoute } from "next";
import { getEssaySlugs, getPoemSlugs } from "@/lib/book/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/kitap",
    "/hakkimda",
    "/gizlilik",
    "/kullanim",
  ];

  const [poemSlugs, essaySlugs] = await Promise.all([
    getPoemSlugs(),
    getEssaySlugs(),
  ]);

  const now = new Date();

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...poemSlugs.map((slug) => ({
      url: `${SITE_URL}/siir/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...essaySlugs.map((slug) => ({
      url: `${SITE_URL}/deneme/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
