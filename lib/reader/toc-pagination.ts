import type { BookItem, TocPageContent, TocPageEntry } from "@/lib/book/types";

/** Tam başlık + “Şiirler” başlığı sonrası grid */
const POEM_GRID_ROWS_FIRST_PAGE = 20;
const POEM_GRID_ROWS_CONTINUATION_PAGE = 20;
const SECTION_HEADING_ROW_COST = 1;
/** Şiirlerden sonra denemeler bölümü arası */
const SECTION_GAP_ROW_COST = 1;

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
    const pageIsFirst = isFirst;
    const page: TocPageContent = {
      showFullHeader: pageIsFirst,
      showPoemsHeading: false,
      poems: [],
      showEssaysHeading: false,
      essays: [],
    };

    isFirst = false;

    const poemsRemain = poemIdx < poems.length;
    const essaysRemain = essayIdx < essays.length;
    /** İlk yaprakta yalnızca şiirler; devam sayfasında kalan şiirler + denemeler */
    const deferEssays = pageIsFirst && poemsRemain && essaysRemain;

    let gridRowsLeft = 0;

    if (poemsRemain) {
      const needsPoemsHeading = poemIdx === 0;
      if (needsPoemsHeading) {
        page.showPoemsHeading = true;
      }
      gridRowsLeft = pageIsFirst
        ? POEM_GRID_ROWS_FIRST_PAGE -
          (needsPoemsHeading ? SECTION_HEADING_ROW_COST : 0)
        : POEM_GRID_ROWS_CONTINUATION_PAGE -
          (needsPoemsHeading ? SECTION_HEADING_ROW_COST : 0);

      if (!pageIsFirst && poemsRemain && essaysRemain) {
        const essayReserve =
          rowsForGridItems(essays.length - essayIdx) +
          SECTION_HEADING_ROW_COST +
          SECTION_GAP_ROW_COST;
        gridRowsLeft = Math.min(
          gridRowsLeft,
          Math.max(0, POEM_GRID_ROWS_CONTINUATION_PAGE - essayReserve),
        );
      }

      if (gridRowsLeft > 0) {
        const { slice, next } = takeGridSlice(poems, poemIdx, gridRowsLeft);
        page.poems = slice;
        poemIdx = next;
        gridRowsLeft -= rowsForGridItems(slice.length);
      }
    }

    const essayRowsLeft =
      page.poems.length > 0 ? gridRowsLeft : POEM_GRID_ROWS_CONTINUATION_PAGE;

    if (essaysRemain && essayRowsLeft > 0 && !deferEssays) {
      let rowsLeft = essayRowsLeft;
      if (essayIdx === 0) {
        page.showEssaysHeading = true;
        rowsLeft -= SECTION_HEADING_ROW_COST;
        if (page.poems.length > 0) {
          rowsLeft -= SECTION_GAP_ROW_COST;
        }
      }
      const { slice, next } = takeGridSlice(essays, essayIdx, rowsLeft);
      page.essays = slice;
      essayIdx = next;
    }

    const hasContent = page.poems.length > 0 || page.essays.length > 0;

    if (!hasContent) break;
    pages.push(page);

    if (poemIdx >= poems.length && essayIdx >= essays.length) break;
  }

  return pages.length
    ? pages
    : [
        {
          showFullHeader: true,
          showPoemsHeading: false,
          poems: [],
          showEssaysHeading: false,
          essays: [],
        },
      ];
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
