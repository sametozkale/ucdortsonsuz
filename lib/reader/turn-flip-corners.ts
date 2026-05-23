import type JQuery from "jquery";
import type { ReaderPage } from "@/lib/book/types";
import { tagTurnFoldLayer } from "@/lib/reader/turn-temporal-paper";
import type { TurnDisplayMode } from "@/lib/reader/turn-layout";

type FlipPage = JQuery & {
  flip?: (method: string, opts?: unknown) => void;
  width?: () => number;
  height?: () => number;
};

type TurnFlipCorners = "all" | "forward" | "backward";

const STORY_SLUG = "kitabin-hikayesi";

function cornerSizeForPage($page: FlipPage, single: boolean) {
  const w = $page.width?.() ?? 0;
  const h = $page.height?.() ?? 0;
  if (w < 1 || h < 1) return single ? 108 : 96;
  return Math.min(120, Math.max(72, Math.floor(Math.min(w, h) * 0.22)));
}

/**
 * Çift sayfa: yalnızca dış kenar köşeleri.
 * turn.js — çift numara sol yaprak (tl/bl), tek numara sağ yaprak (tr/br).
 * Orta/cilt tarafında kıvrım yok.
 */
export function turnFlipCornersForPage(
  pageNum: number,
  display: TurnDisplayMode,
  coverTurnPage = 1,
): TurnFlipCorners {
  if (display === "single") return "all";
  if (pageNum === coverTurnPage) return "all";
  if (pageNum % 2 === 1) return "forward";
  return "backward";
}

type FlipOptionsInput = {
  corners: TurnFlipCorners;
  cornerSize: number;
  frontGradient: boolean;
  backGradient: boolean;
  next?: number;
};

function buildFlipOptions(
  $flip: FlipPage,
  pageNum: number,
  mode: TurnDisplayMode,
  single: boolean,
  coverTurnPage: number,
  enableGradients: boolean,
  readerPage: ReaderPage | undefined,
  totalTurnPages: number,
): FlipOptionsInput {
  const isCoverPage = single && pageNum === coverTurnPage;
  const options: FlipOptionsInput = {
    corners: turnFlipCornersForPage(pageNum, mode, coverTurnPage),
    cornerSize: cornerSizeForPage($flip, single),
    frontGradient: enableGradients,
    backGradient: enableGradients && !isCoverPage,
  };

  if (readerPage?.itemSlug === STORY_SLUG && mode === "double") {
    options.next = Math.min(totalTurnPages, pageNum + 1);
  }

  return options;
}

/**
 * Kitabın Hikayesi ilk görünümde: flip henüz yoksa veya next yanlışsa kıvrım çalışmaz.
 * Yalnızca bu sayfa için, görünür spread içindeyken çalıştırılır.
 */
export function primeStoryPageFlip(
  $magazine: JQuery,
  display: TurnDisplayMode,
  enableGradients: boolean,
  coverTurnPage: number,
  readerPages: ReaderPage[],
) {
  const storyIndex = readerPages.findIndex((p) => p.itemSlug === STORY_SLUG);
  if (storyIndex < 0) return;

  const turnPage = storyIndex + 1;
  const view = ($magazine.turn("view") as number[]) ?? [];
  if (!view.includes(turnPage)) return;

  const tryPrime = () => {
    const turnData = $magazine.data() as { pages?: Record<string, FlipPage> };
    const $flip = turnData.pages?.[turnPage];
    if (!$flip?.flip) return false;

    $flip.flip(
      "options",
      buildFlipOptions(
        $flip,
        turnPage,
        display,
        display === "single",
        coverTurnPage,
        enableGradients,
        readerPages[storyIndex],
        readerPages.length,
      ),
    );
    $flip.flip("resize", true);
    tagTurnFoldLayer($magazine);
    return true;
  };

  const run = () => {
    ($magazine as JQuery & { turn: (method: string) => unknown }).turn("update");
    return tryPrime();
  };

  if (run()) return;

  requestAnimationFrame(() => {
    if (run()) return;
    requestAnimationFrame(run);
  });
}

/** turn.js köşe alanı, aktif köşeler ve gradyanlar. */
export function configureTurnFlipPages(
  $magazine: JQuery,
  display: TurnDisplayMode,
  enableGradients: boolean,
  coverTurnPage = 1,
  readerPages?: ReaderPage[],
) {
  const data = $magazine.data() as {
    pages?: Record<string, FlipPage>;
    display?: string;
  };

  if (!data?.pages) return;

  const mode = display ?? (data.display as TurnDisplayMode) ?? "single";
  const single = mode === "single";
  const totalTurnPages =
    readerPages?.length ?? Object.keys(data.pages).length;

  for (const key of Object.keys(data.pages)) {
    const pageNum = Number(key);
    const $flip = data.pages[key];
    if (!pageNum || !$flip?.flip) continue;

    const readerPage = readerPages?.[pageNum - 1];

    if (readerPages) {
      $flip.flip(
        "options",
        buildFlipOptions(
          $flip,
          pageNum,
          mode,
          single,
          coverTurnPage,
          enableGradients,
          readerPage,
          totalTurnPages,
        ),
      );
    } else {
      $flip.flip("options", {
        corners: turnFlipCornersForPage(pageNum, mode, coverTurnPage),
        cornerSize: cornerSizeForPage($flip, single),
        frontGradient: enableGradients,
        backGradient: enableGradients && !(single && pageNum === coverTurnPage),
      });
    }

    $flip.flip("resize", true);
  }

  tagTurnFoldLayer($magazine);

  if (readerPages?.length && mode === "double") {
    primeStoryPageFlip(
      $magazine,
      mode,
      enableGradients,
      coverTurnPage,
      readerPages,
    );
  }
}

export function configureSoftFlipCorners(
  $magazine: JQuery,
  display: TurnDisplayMode,
  enableGradients: boolean,
  coverTurnPage = 1,
  readerPages?: ReaderPage[],
) {
  configureTurnFlipPages(
    $magazine,
    display,
    enableGradients,
    coverTurnPage,
    readerPages,
  );
}
