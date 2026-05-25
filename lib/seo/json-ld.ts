import {
  AUTHOR_LINKEDIN_URL,
  AUTHOR_WEBSITE_URL,
} from "@/lib/author/about";
import {
  AUTHOR_NAME,
  AUTHOR_PHOTO_SRC,
  BOOK_COVER_BG_URL,
  BOOK_DESCRIPTION,
  BOOK_PURCHASE_URL,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import type { BookItem, FaqItem } from "@/lib/book/types";
import { absoluteUrl } from "@/lib/seo/site";

function bookOffers() {
  if (!BOOK_PURCHASE_URL) return undefined;
  return {
    "@type": "Offer",
    url: BOOK_PURCHASE_URL,
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
  };
}

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
    bookFormat: "https://schema.org/EBook",
    url: `${SITE_URL}/kitap`,
    image: absoluteUrl(BOOK_COVER_BG_URL),
    numberOfPages: POEM_COUNT + ESSAY_COUNT,
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    ...(bookOffers() ? { offers: bookOffers() } : {}),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: `${SITE_URL}/hakkimda`,
    image: absoluteUrl(AUTHOR_PHOTO_SRC),
    description: `${AUTHOR_NAME}, ${BOOK_TITLE} yazarı. Şiir ve deneme kitabı; dijital okuma ve ücretsiz örnekler ucdortsonsuz.com'da.`,
    sameAs: [AUTHOR_WEBSITE_URL, AUTHOR_LINKEDIN_URL],
    knowsAbout: [
      "Türkçe şiir",
      "deneme",
      "dijital yayıncılık",
      "ürün tasarımı",
    ],
  };
}

export function creativeWorkJsonLd(item: BookItem, path: string) {
  const type = item.kind === "poem" ? "Poem" : "Article";
  const kindLabel = item.kind === "poem" ? "şiir" : "deneme";

  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: item.title,
    name: item.title,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}/hakkimda`,
    },
    description: item.excerpt,
    abstract: item.excerpt,
    inLanguage: "tr",
    url: `${SITE_URL}${path}`,
    ...(item.is_sample && item.body_md
      ? { text: item.body_md.slice(0, 5000) }
      : {}),
    isPartOf: {
      "@type": "Book",
      name: BOOK_TITLE,
      url: `${SITE_URL}/kitap`,
    },
    genre: kindLabel,
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
    description: BOOK_DESCRIPTION,
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}/hakkimda`,
    },
    about: {
      "@type": "Book",
      name: BOOK_TITLE,
      url: `${SITE_URL}/kitap`,
    },
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}/hakkimda`,
    },
  };
}
