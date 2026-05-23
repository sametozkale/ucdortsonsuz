import type { BookItemPublic } from "@/lib/book/types";

export const FEATURED_SAMPLE_SLUG = "zeytin-agaci";

export const HERO_QUOTE =
  "Zeytin dallarının karmaşasıyım ben — yeşilin hakimiyeti, kahverenginin mağduriyeti.";

export const HERO_TAGLINE =
  "Sayı ile sonsuzluk arasında kurulan şiirsel bir diyalog — sayfa çevirerek, kendi ritminizde.";

export function sampleItemHref(item: BookItemPublic): string {
  if (item.kind === "poem") return `/siir/${item.slug}`;
  if (item.kind === "essay") return `/deneme/${item.slug}`;
  return "/kitap";
}

export function sampleItemKindLabel(kind: BookItemPublic["kind"]): string {
  if (kind === "poem") return "Şiir";
  if (kind === "essay") return "Deneme";
  return "Metin";
}
