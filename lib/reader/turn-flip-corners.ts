import type JQuery from "jquery";
import type { TurnDisplayMode } from "@/lib/reader/turn-layout";

type FlipPage = JQuery & {
  flip?: (method: string, opts?: unknown) => void;
  width?: () => number;
  height?: () => number;
};

function cornerSizeForPage($page: FlipPage, single: boolean) {
  const w = $page.width?.() ?? 0;
  const h = $page.height?.() ?? 0;
  if (w < 1 || h < 1) return single ? 108 : 96;
  return Math.min(120, Math.max(72, Math.floor(Math.min(w, h) * 0.22)));
}

/** turn.js köşe alanı ve gradyanlar; köşe setini turn.js parity mantığına bırakır. */
export function configureTurnFlipPages(
  $magazine: JQuery,
  display: TurnDisplayMode,
  enableGradients: boolean,
  coverTurnPage = 1,
) {
  const data = $magazine.data() as {
    pages?: Record<string, FlipPage>;
    display?: string;
  };

  if (!data?.pages) return;

  const mode = display ?? (data.display as TurnDisplayMode) ?? "single";
  const single = mode === "single";

  for (const key of Object.keys(data.pages)) {
    const pageNum = Number(key);
    const $flip = data.pages[key];
    if (!pageNum || !$flip?.flip) continue;

    const isCoverPage = single && pageNum === coverTurnPage;

    $flip.flip("options", {
      cornerSize: cornerSizeForPage($flip, single),
      frontGradient: enableGradients,
      backGradient: enableGradients && !isCoverPage,
    });

    $flip.flip("resize", true);
  }
}

export function configureSoftFlipCorners(
  $magazine: JQuery,
  display: TurnDisplayMode,
  enableGradients: boolean,
  coverTurnPage = 1,
) {
  configureTurnFlipPages($magazine, display, enableGradients, coverTurnPage);
}
