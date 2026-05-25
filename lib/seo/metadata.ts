import type { Metadata } from "next";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  DEFAULT_SITE_DESCRIPTION,
  defaultOpenGraphImages,
} from "@/lib/seo/site";

const defaultTitle = `${SITE_NAME} — ${AUTHOR_NAME}`;

const sharedOpenGraph = {
  siteName: SITE_NAME,
  locale: "tr_TR" as const,
  images: [...defaultOpenGraphImages],
};

const sharedTwitter = {
  card: "summary_large_image" as const,
  creator: "@sametozkale",
  images: [defaultOpenGraphImages[0].url],
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME} — ${AUTHOR_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [
    "Üç Dört Sonsuz",
    "Samet Özkale",
    "şiir kitabı",
    "Türkçe şiir",
    "deneme",
    "e-kitap",
  ],
  authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}/hakkimda` }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: { "tr-TR": SITE_URL },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: defaultTitle,
    description:
      "45 şiir ve 11 deneme. Dijital okuma deneyimi ve ücretsiz örnekler.",
    ...sharedOpenGraph,
  },
  twitter: {
    ...sharedTwitter,
    title: defaultTitle,
    description:
      "45 şiir ve 11 deneme. Dijital okuma deneyimi ve ücretsiz örnekler.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  openGraphType = "article",
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "tr-TR": url },
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      type: openGraphType,
      ...sharedOpenGraph,
    },
    twitter: {
      ...sharedTwitter,
      title: ogTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : undefined,
  };
}
