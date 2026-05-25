export const SITE_NAME = "Üç Dört Sonsuz";
export const AUTHOR_NAME = "Samet Özkale";
export const AUTHOR_CONTACT_EMAIL = "ozkalesamet@gmail.com";
export const BOOK_SLUG = "uc-dort-sonsuz";
export const BOOK_TITLE = "Üç Dört Sonsuz";
export const BOOK_DESCRIPTION =
  "Samet Özkale'nin 45 şiir ve 11 denemeden oluşan şiir kitabı. Dijital okuma, ücretsiz örnekler ve e-kitap indirme.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ucdortsonsuz.com";

/** Stripe / iyzico vb. — tanımlıysa tüm Satın al CTA’ları buraya gider */
export const BOOK_PURCHASE_URL =
  process.env.NEXT_PUBLIC_BOOK_PURCHASE_URL?.trim() || "";

/** Ödeme linki yokken geçici hedef */
export const BOOK_PURCHASE_FALLBACK_HREF = "/#bagis";
export const POEM_COUNT = 45;
export const ESSAY_COUNT = 11;
export const BOOKMARK_STORAGE_KEY = "ucdortsonsuz:bookmark";

/** Yazar portresi — `public/images/samet-ozkale.jpg` */
export const AUTHOR_PHOTO_SRC = "/images/samet-ozkale.jpg";

/** Kapak arka planı — Tiago Ferreira / Unsplash */
export const BOOK_COVER_BG_URL = "/images/book-cover-bg.jpg";
export const BOOK_COVER_BG_ALT =
  "Zeytin dalları, berrak mavi gökyüzüne karşı";

/** Ana sayfa hero arka plan videosu — `public/videos/hero.mp4` */
export const HERO_VIDEO_URL = "/videos/hero.mp4";
export const HERO_VIDEO_POSTER_URL = BOOK_COVER_BG_URL;
