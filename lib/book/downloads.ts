import { BOOK_SLUG, BOOK_TITLE } from "@/lib/constants";

export type BookDownloadFormatId = "pdf" | "epub" | "kindle";

export type BookDownloadFormat = {
  id: BookDownloadFormatId;
  label: string;
  shortLabel: string;
  extension: string;
  mimeType: string;
  logoSrc: string;
  logoLabel: string;
};

export const BOOK_DOWNLOAD_FORMATS: BookDownloadFormat[] = [
  {
    id: "pdf",
    label: "PDF indir",
    shortLabel: "PDF",
    extension: ".pdf",
    mimeType: "application/pdf",
    logoSrc: "/images/brands/pdf.svg",
    logoLabel: "Adobe PDF",
  },
  {
    id: "epub",
    label: "EPUB indir",
    shortLabel: "EPUB",
    extension: ".epub",
    mimeType: "application/epub+zip",
    logoSrc: "/images/brands/epub.svg",
    logoLabel: "EPUB",
  },
  {
    id: "kindle",
    label: "Kindle indir",
    shortLabel: "Kindle",
    extension: ".mobi",
    mimeType: "application/x-mobipocket-ebook",
    logoSrc: "/images/brands/kindle.svg",
    logoLabel: "Amazon Kindle",
  },
];

const formatIds = new Set(
  BOOK_DOWNLOAD_FORMATS.map((f) => f.id),
);

export function isBookDownloadFormatId(
  value: string,
): value is BookDownloadFormatId {
  return formatIds.has(value as BookDownloadFormatId);
}

export function getBookDownloadFormat(id: BookDownloadFormatId) {
  return BOOK_DOWNLOAD_FORMATS.find((f) => f.id === id);
}

export function getBookDownloadApiPath(id: BookDownloadFormatId) {
  return `/api/download/${id}`;
}

export function getBookDownloadFilename(format: BookDownloadFormat) {
  return `${BOOK_SLUG}${format.extension}`;
}

export function getBookDownloadPublicPath(format: BookDownloadFormat) {
  return `/downloads/${getBookDownloadFilename(format)}`;
}
