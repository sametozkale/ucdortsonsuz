/**
 * Şiir sayfalarının mısra bütçesini doğrular. Çalıştır: npx tsx scripts/audit-poem-pagination.ts
 */
import { MOCK_BOOK, MOCK_ITEMS } from "../lib/book/mock-data";
import { buildReaderPages, poemContentLineCost } from "../lib/reader/pagination";

const FIRST_MAX = 16;
const CONT_MAX = 20;
const FIRST_SLUG_MAX: Record<string, number> = {
  "bizim-kuslar-mezarliklarda-durmazlar": 14,
};
const CONT_SLUG_MAX: Record<string, number> = {
  "yine-gunduz": 18,
  "kara-para": 20,
};

function maxForPage(
  slug: string,
  pageIndex: number,
  totalPagesInItem: number,
): number {
  if (totalPagesInItem === 1 && pageIndex === 0) {
    return (FIRST_SLUG_MAX[slug] ?? FIRST_MAX) + 1;
  }
  if (pageIndex === 0) return FIRST_SLUG_MAX[slug] ?? FIRST_MAX;
  return CONT_SLUG_MAX[slug] ?? CONT_MAX;
}

const poems = MOCK_ITEMS.filter((i) => i.kind === "poem");
const failures: string[] = [];

for (const item of poems) {
  const pages = buildReaderPages(MOCK_ITEMS, MOCK_BOOK).filter(
    (p) => p.itemId === item.id,
  );
  for (const page of pages) {
    const count = poemContentLineCost(page.content);
    const max = maxForPage(item.slug, page.pageIndex, page.totalPagesInItem);
    if (count > max) {
      failures.push(
        `${item.slug} p${page.pageIndex + 1}: ${count} lines (max ${max})`,
      );
    }
  }
}

if (failures.length) {
  console.error("Poem pagination audit FAILED:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`Poem pagination audit OK (${poems.length} poems).`);
