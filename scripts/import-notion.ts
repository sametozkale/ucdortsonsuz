/**
 * Notion → Supabase içerik aktarımı
 *
 * Kullanım:
 * 1. Notion'dan Markdown export alın veya content/notion-export.json hazırlayın
 * 2. .env.local içinde SUPABASE_SERVICE_ROLE_KEY tanımlayın
 * 3. npx tsx scripts/import-notion.ts
 *
 * JSON formatı (content/notion-export.json):
 * {
 *   "sections": [
 *     { "type": "front_matter", "title": "Önsöz", "items": [
 *       { "kind": "page", "title": "Önsöz", "slug": "onsoz", "body_md": "...", "excerpt": "...", "is_sample": false }
 *     ]}
 *   ]
 * }
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const BOOK_ID = "00000000-0000-4000-8000-000000000001";
const BOOK_SLUG = "uc-dort-sonsuz";

interface ImportItem {
  kind: "poem" | "essay" | "page";
  title: string;
  slug: string;
  body_md: string;
  excerpt?: string;
  is_sample?: boolean;
  is_public_seo?: boolean;
  page_breaks?: number[];
}

interface ImportSection {
  type: "front_matter" | "toc" | "story" | "poems" | "essays";
  title: string;
  items: ImportItem[];
}

interface ImportFile {
  sections: ImportSection[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.",
    );
    process.exit(1);
  }

  const jsonPath = resolve(
    process.cwd(),
    process.env.NOTION_IMPORT_PATH ?? "content/notion-export.json",
  );

  if (!existsSync(jsonPath)) {
    console.error(`Dosya bulunamadı: ${jsonPath}`);
    console.error(
      "Örnek yapı için scripts/import-notion.ts başlığındaki JSON formatına bakın.",
    );
    process.exit(1);
  }

  const data: ImportFile = JSON.parse(readFileSync(jsonPath, "utf-8"));
  const supabase = createClient(url, serviceKey);

  let sectionOrder = 1;
  let itemOrder = 1;

  for (const section of data.sections) {
    const { data: sec, error: secErr } = await supabase
      .from("book_sections")
      .upsert(
        {
          book_id: BOOK_ID,
          type: section.type,
          title: section.title,
          sort_order: sectionOrder++,
        },
        { onConflict: "book_id,sort_order" },
      )
      .select("id")
      .single();

    if (secErr || !sec) {
      console.error("Section error:", secErr);
      continue;
    }

    for (const item of section.items) {
      const slug = item.slug || slugify(item.title);
      const { error: itemErr } = await supabase.from("book_items").upsert(
        {
          book_id: BOOK_ID,
          section_id: sec.id,
          kind: item.kind,
          title: item.title,
          slug,
          excerpt: item.excerpt ?? item.body_md.slice(0, 200),
          body_md: item.body_md,
          sort_order: itemOrder++,
          is_sample: item.is_sample ?? false,
          is_public_seo: item.is_public_seo ?? true,
          page_breaks: item.page_breaks ?? null,
        },
        { onConflict: "book_id,slug" },
      );

      if (itemErr) console.error(`Item ${slug}:`, itemErr);
      else console.log(`✓ ${item.title}`);
    }
  }

  console.log(`\nTamamlandı. Kitap: ${BOOK_SLUG}, ${itemOrder - 1} öğe.`);
}

main();
