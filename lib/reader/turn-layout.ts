export type TurnDisplayMode = "single" | "double";

const MAX_PAGE_WIDTH = 480;
const MAX_VIEWPORT_HEIGHT_RATIO = 0.74;
/** İki sayfa yan yana için minimum alan (px) */
const MIN_SPREAD_WIDTH = 640;

export function resolveTurnDisplay(
  containerWidth: number,
): TurnDisplayMode {
  return containerWidth >= MIN_SPREAD_WIDTH ? "double" : "single";
}

export function measureTurnMagazine(
  containerWidth: number,
  display: TurnDisplayMode,
) {
  const maxTotalWidth =
    display === "double" ? MAX_PAGE_WIDTH * 2 : MAX_PAGE_WIDTH;
  const totalWidth = Math.min(containerWidth, maxTotalWidth);
  const pageWidth = Math.floor(totalWidth / (display === "double" ? 2 : 1));
  const width = display === "double" ? pageWidth * 2 : pageWidth;
  const height = Math.min(
    Math.round(pageWidth * (4 / 3)),
    Math.floor(window.innerHeight * MAX_VIEWPORT_HEIGHT_RATIO),
  );

  return { width, height, pageWidth, display };
}

/** turn.js view → 0-based sayfa indeksleri (ekranda görünenler) */
export function visiblePageIndicesFromView(view: number[]): number[] {
  return view.filter((p) => p > 0).map((p) => p - 1);
}

/** turn.js view dizisinden sol (birincil) sayfa indeksini döndürür (0-based) */
export function primaryPageIndexFromView(
  view: number[],
  fallbackPage: number,
): number {
  const indices = visiblePageIndicesFromView(view);
  if (indices.length > 0) return indices[0]!;
  return Math.max(0, fallbackPage - 1);
}

/** Görünür sayfalardan sonraki ilk sayfa (önizleme metni için) */
export function nextPageAfterVisible(
  pages: { itemTitle: string }[],
  visibleIndices: number[],
): string | null {
  if (!pages.length) return null;
  const lastVisible =
    visibleIndices.length > 0 ? Math.max(...visibleIndices) : 0;
  const nextIndex = lastVisible + 1;
  if (nextIndex >= pages.length) return null;
  return pages[nextIndex]!.itemTitle;
}

export type SpreadSide = "single" | "left" | "right";

/** turn.js çift sayfa: çift numara sol, tek numara sağ */
export function spreadSideForPage(
  page: { globalPageIndex: number; isCover?: boolean },
  display: TurnDisplayMode,
): SpreadSide {
  if (display === "single" || page.isCover) return "single";
  return (page.globalPageIndex + 1) % 2 === 0 ? "left" : "right";
}
