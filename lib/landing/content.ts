import type { BookItemPublic } from "@/lib/book/types";

export const FEATURED_SAMPLE_SLUG = "zeytin-agaci";

export const HERO_QUOTE =
  "Zeytin dallarının karmaşasıyım ben — yeşilin hakimiyeti, kahverenginin mağduriyeti.";

export const HERO_TAGLINE =
  "Sayı ile sonsuzluk arasında kurulan şiirsel bir diyalog — sayfa çevirerek, kendi ritminizde.";

export const CLOSING_CTA_COPY = {
  title: "Sözlerim artık sizindir!",
  text:
    "Bu kitabı yıllarca taşıdım; şimdi size bırakıyorum. Satın aldığınız anda tam metin dijital okuyucuda açılır — sayfa sayfa, acele etmeden. Gelirin tamamını TEMA ve Darüşşafaka'ya bağışlıyorum; uzun zamandır her iki vakfın bağışçısıyım, okurken payı onlarla da paylaşırsınız.",
  ctaBuy: "Satın al",
  ctaAbout: "Kitap hakkında",
} as const;

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
