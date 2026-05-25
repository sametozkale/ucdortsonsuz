import {
  BOOK_PURCHASE_FALLBACK_HREF,
  BOOK_PURCHASE_URL,
} from "@/lib/constants";

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

/** Üst menü — Satın Al ayrı CTA */
export const HEADER_NAV: NavLink[] = [
  { href: "/kitap", label: "Kitap" },
  { href: "/hakkimda", label: "Hakkımda" },
];

export const PURCHASE_CTA: NavLink = {
  href: BOOK_PURCHASE_URL || BOOK_PURCHASE_FALLBACK_HREF,
  label: "Satın Al",
  external: Boolean(BOOK_PURCHASE_URL),
};

/** @deprecated PURCHASE_CTA kullan */
export const HEADER_CTA = PURCHASE_CTA;

export const FOOTER_EXPLORE_LINKS: NavLink[] = [
  ...HEADER_NAV,
  { href: "/#bagis", label: "Bağış" },
  PURCHASE_CTA,
];

export const FOOTER_READ_LINKS: NavLink[] = [
  { href: "/oku", label: "Dijital okuyucu" },
  { href: "/#indir", label: "E-kitap indir" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/kullanim", label: "Kullanım" },
];
