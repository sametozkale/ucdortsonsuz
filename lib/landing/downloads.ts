export type LandingDownloadOption = {
  id: string;
  label: string;
  hint: string;
  href: string;
  logoSrc: string;
  logoLabel: string;
};

export const LANDING_DOWNLOAD_OPTIONS: LandingDownloadOption[] = [
  {
    id: "pdf",
    label: "PDF indir",
    hint: "Baskıya yakın sayfa düzeni",
    href: "/indir",
    logoSrc: "/images/brands/pdf.svg",
    logoLabel: "Adobe PDF",
  },
  {
    id: "epub",
    label: "EPUB indir",
    hint: "E-okuyucu ve okuma uygulamaları",
    href: "/indir",
    logoSrc: "/images/brands/epub.svg",
    logoLabel: "EPUB",
  },
  {
    id: "kindle",
    label: "Kindle indir",
    hint: "MOBI uyumlu dosya",
    href: "/indir",
    logoSrc: "/images/brands/kindle.svg",
    logoLabel: "Amazon Kindle",
  },
];
