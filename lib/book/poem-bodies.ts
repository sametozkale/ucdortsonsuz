import poems from "@/content/poems.json";

export const POEM_BODIES_BY_SLUG: Record<string, string> = poems;

export function getPoemBody(slug: string): string | undefined {
  return POEM_BODIES_BY_SLUG[slug];
}
