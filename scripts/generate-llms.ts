/**
 * Build-time: public/llms-full.txt üretir (GEO genişletilmiş özet).
 * Çalıştırma: npx tsx scripts/generate-llms.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { MOCK_FAQ } from "../lib/book/mock-data";
import { MOCK_ITEMS } from "../lib/book/mock-data";
import {
  AUTHOR_NAME,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
  SITE_URL,
} from "../lib/constants";

const site = SITE_URL.replace(/\/$/, "");

const samples = MOCK_ITEMS.filter((i) => i.is_sample && i.is_public_seo);
const samplePoems = samples.filter((i) => i.kind === "poem").slice(0, 8);
const sampleEssays = samples.filter((i) => i.kind === "essay").slice(0, 4);

const lines: string[] = [
  `# ${BOOK_TITLE} — genişletilmiş özet`,
  "",
  `> ${AUTHOR_NAME} — ${POEM_COUNT} şiir, ${ESSAY_COUNT} deneme. Dijital kitap: ${site}`,
  "",
  "## Örnek şiirler (tam metin)",
  "",
  ...samplePoems.map(
    (i) =>
      `- [${i.title}](${site}/siir/${i.slug}): ${i.excerpt ?? "Örnek şiir."}`,
  ),
  "",
  "## Örnek denemeler (tam metin)",
  "",
  ...sampleEssays.map(
    (i) =>
      `- [${i.title}](${site}/deneme/${i.slug}): ${i.excerpt ?? "Örnek deneme."}`,
  ),
  "",
  "## Sık sorulan sorular",
  "",
  ...MOCK_FAQ.map((f) => `- **${f.question}** ${f.answer}`),
  "",
  "## Bağış",
  "",
  `Satış gelirinin tamamı TEMA ve Darüşşafaka vakıflarına bağışlanır. Detay: ${site}/#bagis`,
  "",
];

const outPath = join(process.cwd(), "public", "llms-full.txt");
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath}`);
