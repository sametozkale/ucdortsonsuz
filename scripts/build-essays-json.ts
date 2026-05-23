/**
 * content/essays/*.md → content/essays.json
 * Çalıştır: npx tsx scripts/build-essays-json.ts
 */
import fs from "node:fs";
import path from "node:path";
import { ESSAY_TITLES } from "../lib/book/catalog";
import { slugifyTurkish } from "../lib/utils";

const ESSAYS_DIR = path.join(process.cwd(), "content/essays");
const OUT_FILE = path.join(process.cwd(), "content/essays.json");

const bodies: Record<string, string> = {};

for (const title of ESSAY_TITLES) {
  const slug = slugifyTurkish(title);
  const filePath = path.join(ESSAYS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Eksik deneme dosyası: ${filePath}`);
  }
  bodies[slug] = fs.readFileSync(filePath, "utf8").trim();
}

fs.writeFileSync(OUT_FILE, `${JSON.stringify(bodies, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(bodies).length} essays to ${OUT_FILE}`);
