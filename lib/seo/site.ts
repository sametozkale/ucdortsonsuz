import { BOOK_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";
export const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — kapak ve tanıtım görseli`;

export const DEFAULT_SITE_DESCRIPTION = BOOK_DESCRIPTION;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOpenGraphImages = [
  {
    url: DEFAULT_OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
] as const;
