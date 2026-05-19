import type { BookItem, TocPageContent, TocPageEntry } from "@/lib/book/types";

/** İki sütunlu gridde bir sayfaya sığan yaklaşık satır sayısı (başlık hariç gövde) */
const GRID_ROWS_PER_PAGE = 16;
const FRONT_MATTER_ROW_COST = 2;
const SECTION_HEADING_ROW_COST = 2;

function entryFromItem(item: BookItem): TocPageEntry {
  return { title: item.title, itemId: item.id };
}

function rowsForGridItems(count: number): number {
  return Math.ceil(count / 2);
}

function takeGridSlice<T>(
  items: T[],
  start: number,
  maxRows: number,
): { slice: T[]; next: number } {
  if (start >= items.length || maxRows <= 0) {
    return { slice: [], next: start };
  }
  const maxItems = maxRows * 2;
  const slice = items.slice(start, start + maxItems);
  return { slice, next: start + slice.length };
}

export function buildTocPageSlices(items: BookItem[]): TocPageContent[] {
  const onsoz = items.find((i) => i.slug === "onsoz");
  const story = items.find((i) => i.slug === "kitabin-hikayesi");
  const frontMatter: TocPageEntry[] = [];
  if (onsoz) frontMatter.push(entryFromItem(onsoz));
  if (story) frontMatter.push(entryFromItem(story));

  const poems = items
    .filter((i) => i.kind === "poem")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(entryFromItem);

  const essays = items
    .filter((i) => i.kind === "essay")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(entryFromItem);

  const pages: TocPageContent[] = [];
  let poemIdx = 0;
  let essayIdx = 0;
  let isFirst = true;

  while (poemIdx < poems.length || essayIdx < essays.length || isFirst) {
    let rowsLeft = GRID_ROWS_PER_PAGE;
    const page: TocPageContent = {
      showFullHeader: isFirst,
      frontMatter: [],
      showPoemsHeading: false,
      poems: [],
      showEssaysHeading: false,
      essays: [],
    };

    if (isFirst && frontMatter.length > 0) {
      page.frontMatter = frontMatter;
      rowsLeft -= FRONT_MATTER_ROW_COST;
      isFirst = false;
    } else {
      isFirst = false;
    }

    if (poemIdx < poems.length && rowsLeft > 0) {
      if (poemIdx === 0) {
        page.showPoemsHeading = true;
        rowsLeft -= SECTION_HEADING_ROW_COST;
      }
      const { slice, next } = takeGridSlice(poems, poemIdx, rowsLeft);
      page.poems = slice;
      poemIdx = next;
      rowsLeft -= rowsForGridItems(slice.length);
    }

    if (essayIdx < essays.length && rowsLeft > 0) {
      if (essayIdx === 0) {
        page.showEssaysHeading = true;
        rowsLeft -= SECTION_HEADING_ROW_COST;
      }
      const { slice, next } = takeGridSlice(essays, essayIdx, rowsLeft);
      page.essays = slice;
      essayIdx = next;
    }

    const hasContent =
      page.frontMatter.length > 0 ||
      page.poems.length > 0 ||
      page.essays.length > 0;

    if (!hasContent) break;
    pages.push(page);

    if (poemIdx >= poems.length && essayIdx >= essays.length) break;
  }

  return pages.length ? pages : [{ showFullHeader: true, frontMatter: [], showPoemsHeading: false, poems: [], showEssaysHeading: false, essays: [] }];
}

export function paginateTocItem(
  item: BookItem,
  allItems: BookItem[],
): { content: string; tocSlice: TocPageContent }[] {
  return buildTocPageSlices(allItems).map((tocSlice) => ({
    content: "",
    tocSlice,
  }));
}
