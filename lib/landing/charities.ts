export type CharityPartner = {
  id: string;
  name: string;
  url: string;
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
};

/** Bağış paneli — yazar sesi (landing karşılama tonuyla uyumlu) */
export const CHARITY_COPY = {
  eyebrow: "Satın alırken",
  title: "Paranın tamamı iki vakfa",
  intro:
    "Üç Dört Sonsuz'dan düşen her kuruşu ikiye böldüm: toprak için TEMA Vakfı, çocuk için Darüşşafaka. Kelimeler bende kaldı; gerisi doğrudan onlara gider — siz okurken payı onlarla paylaşırsınız.",
  ctaBuy: "Kitabı satın al",
  ctaRead: "Önce oku",
} as const;

export const CHARITY_PARTNERS: CharityPartner[] = [
  {
    id: "tema",
    name: "TEMA Vakfı",
    url: "https://www.tema.org.tr",
    logoSrc: "/images/charities/tema-vakfi.png",
    logoWidth: 132,
    logoHeight: 58,
    logoClassName: "landing-charity__logo-img--tema",
  },
  {
    id: "darussafaka",
    name: "Darüşşafaka",
    url: "https://www.darussafaka.org",
    logoSrc: "/images/charities/darussafaka-logo.png",
    logoWidth: 168,
    logoHeight: 73,
    logoClassName: "landing-charity__logo-img--darussafaka",
  },
];
