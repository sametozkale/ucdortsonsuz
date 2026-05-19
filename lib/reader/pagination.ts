import type {
  Book,
  BookItem,
  ReaderPage,
  TocPageContent,
} from "@/lib/book/types";
import { paginateTocItem } from "@/lib/reader/toc-pagination";

interface PaginatedSlice {
  content: string;
  tocSlice?: TocPageContent;
}

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

function paginateWithBreaks(body: string, breaks: number[]): string[] {
  const sorted = [...breaks].sort((a, b) => a - b);
  const pages: string[] = [];
  let start = 0;

  for (const end of sorted) {
    const slice = body.slice(start, end).trim();
    if (slice) pages.push(slice);
    start = end;
  }

  const tail = body.slice(start).trim();
  if (tail) pages.push(tail);

  return pages.length ? pages : [body.trim() || ""];
}

function paginateItemBody(item: BookItem, allItems: BookItem[]): PaginatedSlice[] {
  if (item.slug === "icindekiler") {
    return paginateTocItem(item, allItems);
  }

  const body = item.body_md ?? "";
  if (!body.trim()) return [{ content: "" }];

  let chunks: string[];
  if (item.page_breaks?.length) {
    const valid = item.page_breaks.filter(
      (n) => Number.isFinite(n) && n > 0 && n < body.length,
    );
    chunks = valid.length ? paginateWithBreaks(body, valid) : [body.trim()];
  } else {
    const paragraphs = splitIntoParagraphs(body);
    chunks = paginateParagraphs(paragraphs, CHARS_PER_PAGE);
  }

  return chunks.map((content) => ({ content }));
}

export function buildReaderPages(
  items: BookItem[],
  book?: Pick<Book, "title" | "author_name" | "cover_image_url">,
): ReaderPage[] {
  const pages: ReaderPage[] = [];
  let globalIndex = 0;

  if (book) {
    pages.push({
      itemId: "book-cover",
      itemTitle: book.title,
      itemKind: "page",
      itemSlug: "kapak",
      sectionTitle: "Kapak",
      sectionType: "front_matter",
      pageIndex: 0,
      totalPagesInItem: 1,
      globalPageIndex: globalIndex++,
      content: book.author_name,
      isCover: true,
    });
  }

  for (const item of items) {
    const contentPages = paginateItemBody(item, items);
    const sectionTitle = item.section?.title ?? "";
    const sectionType = item.section?.type ?? "front_matter";

    contentPages.forEach(({ content, tocSlice }, pageIndex) => {
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
        tocSlice,
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
