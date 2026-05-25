import { MOCK_ITEMS } from "@/lib/book/mock-data";
import { getPoemBody } from "@/lib/book/poem-bodies";
import type { BookItemKind, BookItemPublic } from "@/lib/book/types";
import { sampleItemHref, sampleItemKindLabel } from "@/lib/landing/content";

export type ShowcaseSlide = {
  id: string;
  title: string;
  slug: string;
  kind: BookItemKind;
  kindLabel: string;
  href: string;
  quote: string;
  /** Şiirlerde satır satır gösterim */
  quoteLines?: string[];
};

/** Vitrin sırası — tüm öne çıkan kesitler */
export const SHOWCASE_SLIDE_ORDER = [
  "kitabin-hikayesi",
  "zeytin-agaci",
  "harman",
  "kahverengi",
  "el-alem",
  "bir-kusak-geliyor",
  "sessiz-camia",
  "birden-bine",
] as const;

/** Kontrol çubuğunda görünen çizgi sayısı (kesit sayısından bağımsız) */
export const SHOWCASE_DOT_COUNT = 3;

export function showcaseDotIndex(slideIndex: number, slideCount: number): number {
  if (slideCount <= 1) return 0;
  if (slideCount <= SHOWCASE_DOT_COUNT) return slideIndex;
  return Math.min(
    SHOWCASE_DOT_COUNT - 1,
    Math.floor((slideIndex / slideCount) * SHOWCASE_DOT_COUNT),
  );
}

export function showcaseSlideIndexForDot(
  dotIndex: number,
  slideCount: number,
): number {
  if (slideCount <= SHOWCASE_DOT_COUNT) {
    return Math.min(dotIndex, slideCount - 1);
  }
  return Math.min(
    slideCount - 1,
    Math.floor((dotIndex / SHOWCASE_DOT_COUNT) * slideCount),
  );
}

/** Vitrin slider’ında öne çıkan, editoryal seçilmiş kesitler */
const CURATED_QUOTES: Partial<Record<string, string>> = {
  "kitabin-hikayesi":
    "Yıllar süren notlar, gece yarısı yazılmış cümleler ve hiç gönderilmemiş mektuplar — hepsi bu kitapta bir araya geldi. Şiirler duygunun dilini, denemeler ise düşüncenin izini süer.",
  "zeytin-agaci":
    "Zeytin dallarının karmaşasıyım ben — yeşilin hakimiyeti, kahverenginin mağduriyeti. Sen, gönlünü benden esirgemeyen toprağım.",
  harman:
    "Taptaze ekmek kıvamında umutlar, sonsuzluğa kanat açmış minik kuş — ilerliyor ufkun paralelinde. Zaman durmak bilmez.",
  kahverengi:
    "Oysa yeşilin huzuru öyle kadimdir ki yeni bir keşfe tenezzül etmez. Bugün koşmak gerek maviden yeşile, yeşilden maviye.",
  "birden-bine":
    "Yazmak, hatırlamanın başka bir biçimidir. Okur burada şiirden farklı bir ritim bulur — düşüncenin açık yüzü.",
  "el-alem":
    "Bunca kalabalıklar içinde herkes kendi yalnızlığına esir. Anlayacağınız karmaşık ama aslında basit kesir — rüzgar olun ve her daim durmadan esin.",
  "bir-kusak-geliyor":
    "Bir kuşak geliyor, yarısı aç yarısı tok; yarısı az yarısı çok — sevinci az acısı bol, onurlu kedere kemer vurdu.",
  "sessiz-camia":
    "Ben karın kalkmadığı dağlar, atmosferin dünyaya duası. Ben şafak türküsü, sefalet çilesi — dillerde ölümün yası.",
};

function stripMarkdown(md: string): string {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .trim();
}

function quoteFromBody(body: string, maxLength = 260): string {
  const plain = stripMarkdown(body);
  const lines = plain
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return plain.slice(0, maxLength);

  const chunks: string[] = [];
  let length = 0;

  for (const line of lines) {
    const next = chunks.length === 0 ? line : `${chunks[chunks.length - 1]} ${line}`;
    if (next.length > maxLength && chunks.length > 0) break;
    if (chunks.length === 0) chunks.push(line);
    else chunks[0] = next;
    length = chunks[0].length;
    if (length >= maxLength * 0.65) break;
  }

  const quote = chunks[0] ?? plain;
  if (quote.length <= maxLength) return quote;
  const cut = quote.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}…`;
}

function bodyForItem(slug: string, kind: BookItemKind): string | null {
  const mock = MOCK_ITEMS.find((i) => i.slug === slug && i.kind === kind);
  if (mock?.body_md) return mock.body_md;
  if (kind === "poem") return getPoemBody(slug) ?? null;
  return null;
}

const POEM_SHOWCASE_MAX_LINES = 5;

function poemShowcaseLines(slug: string, body: string | null): string[] {
  const plain = body ? stripMarkdown(body) : "";
  const fromBody = plain
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (fromBody.length > 0) {
    const lines = fromBody.slice(0, POEM_SHOWCASE_MAX_LINES);
    return lines.length > 1 ? lines.slice(0, -1) : lines;
  }

  const curated = CURATED_QUOTES[slug];
  return curated ? [curated] : [];
}

function slideFromItem(item: BookItemPublic): ShowcaseSlide {
  const body = bodyForItem(item.slug, item.kind);

  if (item.kind === "poem") {
    const quoteLines = poemShowcaseLines(item.slug, body);
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      kind: item.kind,
      kindLabel: sampleItemKindLabel(item.kind),
      href: sampleItemHref(item),
      quote: quoteLines.join("\n"),
      quoteLines,
    };
  }

  const quote =
    CURATED_QUOTES[item.slug] ??
    (body ? quoteFromBody(body) : item.excerpt ?? item.title);

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    kind: item.kind,
    kindLabel: sampleItemKindLabel(item.kind),
    href: sampleItemHref(item),
    quote,
  };
}

export function buildShowcaseSlides(items: BookItemPublic[]): ShowcaseSlide[] {
  const bySlug = new Map(
    items
      .filter((item) => item.kind !== "page" || item.slug === "kitabin-hikayesi")
      .map((item) => [item.slug, slideFromItem(item)] as const),
  );

  const ordered = SHOWCASE_SLIDE_ORDER.map((slug) => bySlug.get(slug)).filter(
    (slide): slide is ShowcaseSlide => slide != null,
  );

  if (ordered.length > 0) return ordered;

  return [...bySlug.values()];
}
