import {
  AUTHOR_LINKEDIN_URL,
  AUTHOR_WEBSITE_URL,
} from "@/lib/author/about";
import {
  AUTHOR_NAME,
  AUTHOR_PHOTO_SRC,
  BOOK_DESCRIPTION,
  BOOK_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import type { BookItem, FaqItem } from "@/lib/book/types";

export function bookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: BOOK_TITLE,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}/hakkimda`,
    },
    description: BOOK_DESCRIPTION,
    inLanguage: "tr",
    url: `${SITE_URL}/kitap`,
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: `${SITE_URL}/hakkimda`,
    image: `${SITE_URL}${AUTHOR_PHOTO_SRC}`,
    jobTitle: "AI Product & Design Manager",
    description: `${AUTHOR_NAME}, ${BOOK_TITLE} yazarı; AI product & design manager ve girişimci.`,
    sameAs: [AUTHOR_WEBSITE_URL, AUTHOR_LINKEDIN_URL],
    knowsAbout: [
      "Türkçe şiir",
      "deneme",
      "ürün tasarımı",
      "yapay zeka",
      "SaaS",
    ],
  };
}

export function creativeWorkJsonLd(item: BookItem, path: string) {
  const type = item.kind === "poem" ? "Poem" : "Article";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: item.title,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    description: item.excerpt,
    inLanguage: "tr",
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "Book",
      name: BOOK_TITLE,
      url: `${SITE_URL}/kitap`,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr-TR",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
  };
}
