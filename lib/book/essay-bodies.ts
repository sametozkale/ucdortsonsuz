import essays from "@/content/essays.json";

export const ESSAY_BODIES_BY_SLUG: Record<string, string> = essays;

export function getEssayBody(slug: string): string | undefined {
  return ESSAY_BODIES_BY_SLUG[slug];
}
