import type { MetadataRoute } from "next";
import { getBook, getItemsPublic } from "@/lib/book/queries";
import { SITE_URL } from "@/lib/constants";

const LEGAL_PATHS = ["/gizlilik", "/kullanim"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const book = await getBook();
  const items = (await getItemsPublic(book.id)).filter((i) => i.is_public_seo);

  const poems = items.filter((i) => i.kind === "poem");
  const essays = items.filter((i) => i.kind === "essay");

  const now = new Date();

  const hubPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/kitap`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hakkimda`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const legalPages: MetadataRoute.Sitemap = LEGAL_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const poemPages: MetadataRoute.Sitemap = poems.map((item) => ({
    url: `${SITE_URL}/siir/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.is_sample ? 0.75 : 0.65,
  }));

  const essayPages: MetadataRoute.Sitemap = essays.map((item) => ({
    url: `${SITE_URL}/deneme/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.is_sample ? 0.75 : 0.65,
  }));

  return [...hubPages, ...poemPages, ...essayPages, ...legalPages];
}
