export type NavLink = {
  href: string;
  label: string;
};

/** Üst menü — Satın Al ayrı CTA */
export const HEADER_NAV: NavLink[] = [
  { href: "/kitap", label: "Kitap" },
  { href: "/ornekler", label: "Örnekler" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/sss", label: "SSS" },
];

export const HEADER_CTA: NavLink = {
  href: "/satin-al",
  label: "Satın Al",
};

export const FOOTER_EXPLORE_LINKS: NavLink[] = [
  ...HEADER_NAV,
  { href: "/#bagis", label: "Bağış" },
  HEADER_CTA,
];

export const FOOTER_READ_LINKS: NavLink[] = [
  { href: "/oku", label: "Dijital okuyucu" },
  { href: "/indir", label: "E-kitap indir" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/kullanim", label: "Kullanım" },
];
