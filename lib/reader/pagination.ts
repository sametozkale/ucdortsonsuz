import type { BookItem, ReaderPage } from "@/lib/book/types";

/** Tek kitap sayfasına sığacak yaklaşık karakter (sabit sayfa yüksekliği için) */
const CHARS_PER_PAGE = 380;

function splitIntoParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function paginateParagraphs(paragraphs: string[], charsPerPage: number): string[] {
  const pages: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const block = current ? `${current}\n\n${para}` : para;
    if (block.length <= charsPerPage) {
      current = block;
      continue;
    }

    if (current) {
      pages.push(current);
      current = "";
    }

    if (para.length <= charsPerPage) {
      current = para;
      continue;
    }

    const lines = para.split("\n");
    let chunk = "";
    for (const line of lines) {
      const next = chunk ? `${chunk}\n${line}` : line;
      if (next.length <= charsPerPage) {
        chunk = next;
      } else {
        if (chunk) pages.push(chunk);
        chunk = line;
      }
    }
    if (chunk) current = chunk;
  }

  if (current) pages.push(current);
  return pages.length ? pages : [""];
}

export function buildReaderPages(items: BookItem[]): ReaderPage[] {
  const pages: ReaderPage[] = [];
  let globalIndex = 0;

  for (const item of items) {
    const body = item.body_md ?? "";
    const paragraphs = splitIntoParagraphs(body);
    const contentPages = paginateParagraphs(paragraphs, CHARS_PER_PAGE);
    const sectionTitle = item.section?.title ?? "";
    const sectionType = item.section?.type ?? "front_matter";

    contentPages.forEach((content, pageIndex) => {
      pages.push({
        itemId: item.id,
        itemTitle: item.title,
        itemKind: item.kind,
        itemSlug: item.slug,
        sectionTitle,
        sectionType,
        pageIndex,
        totalPagesInItem: contentPages.length,
        globalPageIndex: globalIndex++,
        content,
      });
    });
  }

  return pages;
}

export function findPageIndexByItemId(
  pages: ReaderPage[],
  itemId: string,
  pageIndex = 0,
): number {
  const idx = pages.findIndex(
    (p) => p.itemId === itemId && p.pageIndex === pageIndex,
  );
  return idx >= 0 ? idx : 0;
}
