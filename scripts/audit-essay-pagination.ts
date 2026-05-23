/**
 * Deneme sayfalarının satır bütçesini doğrular.
 * Çalıştır: npx tsx scripts/audit-essay-pagination.ts
 */
import { MOCK_BOOK, MOCK_ITEMS } from "../lib/book/mock-data";
import {
  buildReaderPages,
  essayTextLineCost,
} from "../lib/reader/pagination";

const FIRST_LINES = 16;
const CONT_LINES = 17;
const TAIL_MAX_LINES = 5;
const FRAGMENT_MAX_LINES = 3;

function isSectionMarker(content: string): boolean {
  const t = content.trim().replace(/^\*\*|\*\*$/g, "");
  return /^[IVXLCDM]{1,8}$/i.test(t);
}

const essays = MOCK_ITEMS.filter((i) => i.kind === "essay");
const failures: string[] = [];

for (const item of essays) {
  const itemPages = buildReaderPages(MOCK_ITEMS, MOCK_BOOK).filter(
    (p) => p.itemId === item.id,
  );

  for (const page of itemPages) {
    const lines = essayTextLineCost(page.content);
    const max = page.pageIndex === 0 ? FIRST_LINES : CONT_LINES;
    if (lines > max) {
      failures.push(
        `${item.slug} p${page.pageIndex + 1}: ${lines} lines (max ${max})`,
      );
    }
    if (isSectionMarker(page.content)) {
      failures.push(
        `${item.slug} p${page.pageIndex + 1}: yalnız bölüm başlığı`,
      );
    }
  }

  for (let i = 1; i < itemPages.length; i++) {
    const lines = essayTextLineCost(itemPages[i]!.content);
    if (lines > FRAGMENT_MAX_LINES) continue;
    const prev = itemPages[i - 1]!.content;
    const merged = `${prev}\n\n${itemPages[i]!.content}`;
    const budget = i - 1 === 0 ? FIRST_LINES : CONT_LINES;
    if (essayTextLineCost(merged) <= budget) {
      failures.push(
        `${item.slug} p${i + 1}: ${lines} satır önceki yaprakla birleşebilir`,
      );
    }
  }
}

if (failures.length) {
  console.error("Essay pagination audit FAILED:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`Essay pagination audit OK (${essays.length} essays).`);
