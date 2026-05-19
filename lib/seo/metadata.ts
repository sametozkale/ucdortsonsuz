import type { Metadata } from "next";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";

const defaultTitle = `${SITE_NAME} — ${AUTHOR_NAME}`;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME} — ${AUTHOR_NAME}`,
  },
  description:
    "Samet Özkale'nin 45 şiir ve 11 denemeden oluşan şiir kitabı Üç Dört Sonsuz. Ücretsiz örnekler, dijital okuma ve e-kitap.",
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
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description:
      "45 şiir ve 11 deneme. Dijital okuma deneyimi ve ücretsiz örnekler.",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    creator: "@sametozkale",
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
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "tr-TR": url },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      locale: "tr_TR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
