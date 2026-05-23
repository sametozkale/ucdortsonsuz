"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { BookCoverPage } from "@/components/reader/BookCoverPage";
import { BookPage } from "@/components/reader/BookPage";
import { BookThanksPage } from "@/components/reader/BookThanksPage";
import { BookTocPage } from "@/components/reader/BookTocPage";
import type { ReaderPage } from "@/lib/book/types";
import { debounce } from "@/lib/reader/debounce";
import { loadTurnJs } from "@/lib/reader/load-turn-js";
import {
  configureTurnFlipPages,
  primeStoryPageFlip,
} from "@/lib/reader/turn-flip-corners";
import {
  styleTurnTemporalPaper,
  tagTurnFoldLayer,
} from "@/lib/reader/turn-temporal-paper";
import {
  measureTurnMagazine,
  resolveTurnDisplay,
  spreadSideForPage,
  visiblePageIndicesFromView,
  type TurnDisplayMode,
} from "@/lib/reader/turn-layout";
import type JQuery from "jquery";
import { cn } from "@/lib/utils";

export interface TurnJsMagazineHandle {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  isAnimating: () => boolean;
}

interface TurnJsMagazineProps {
  pages: ReaderPage[];
  pageIndex: number;
  bookTitle: string;
  coverImageUrl?: string | null;
  onPageChange: (index: number) => void;
  onVisibleIndicesChange?: (indices: number[]) => void;
  onAnimatingChange?: (animating: boolean) => void;
  onTocSelectItem?: (itemId: string) => void;
  interactionDisabled?: boolean;
}

function getContainerWidth(container: HTMLElement | null) {
  if (container?.clientWidth) return container.clientWidth;
  return typeof window !== "undefined" ? window.innerWidth : 320;
}

const TURN_DURATION_MS = 920;
const TURN_DURATION_COVER_MS = 1150;
const TURN_ELEVATION = 52;
const LAYOUT_TRANSITION_MS = 620;

export const TurnJsMagazine = forwardRef<
  TurnJsMagazineHandle,
  TurnJsMagazineProps
>(function TurnJsMagazine(
  {
    pages,
    pageIndex,
    bookTitle,
    coverImageUrl,
    onPageChange,
    onVisibleIndicesChange,
    onAnimatingChange,
    onTocSelectItem,
    interactionDisabled = false,
  },
  ref,
) {
  const isCoverActive = pages[pageIndex]?.isCover === true;
  const magazineRef = useRef<HTMLDivElement>(null);
  const bookShellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const jqueryRef = useRef<JQueryStatic | null>(null);
  const readyRef = useRef(false);
  const pageIndexRef = useRef(pageIndex);
  const onPageChangeRef = useRef(onPageChange);
  const onVisibleIndicesChangeRef = useRef(onVisibleIndicesChange);
  const onAnimatingChangeRef = useRef(onAnimatingChange);
  const displayRef = useRef<TurnDisplayMode>("single");
  const layoutHandledForPageRef = useRef<number | null>(null);
  const pendingGoToIndexRef = useRef<number | null>(null);
  const applyingLayoutRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [displayMode, setDisplayMode] = useState<TurnDisplayMode>("single");
  const [centeringLayout, setCenteringLayout] = useState(false);
  const [spineStyle, setSpineStyle] = useState<CSSProperties>({
    display: "none",
  });
  const [bookShellSize, setBookShellSize] = useState({ width: 0, height: 0 });

  const syncBookShellSize = useCallback(() => {
    const magazine = magazineRef.current;
    if (!magazine) return;
    const width = Math.round(magazine.offsetWidth);
    const height = Math.round(magazine.offsetHeight);
    if (width < 1 || height < 1) return;
    setBookShellSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const updateSpineLayout = useCallback(() => {
    const magazine = magazineRef.current;
    const container = containerRef.current;
    if (
      !magazine ||
      !container ||
      displayRef.current !== "double" ||
      pages[pageIndexRef.current]?.isCover
    ) {
      setSpineStyle({ display: "none" });
      return;
    }

    const mag = magazine.getBoundingClientRect();
    const box = container.getBoundingClientRect();

    setSpineStyle({
      display: "block",
      top: mag.top - box.top,
      left: mag.left - box.left + mag.width / 2,
      height: mag.height,
      transform: "translateX(-50%)",
    });
  }, [pages]);

  const updateSpineLayoutRef = useRef(updateSpineLayout);
  updateSpineLayoutRef.current = updateSpineLayout;

  const pagesKey = useMemo(
    () =>
      pages
        .map((p) => `${p.itemId}:${p.pageIndex}:${p.globalPageIndex}`)
        .join("|"),
    [pages],
  );

  pageIndexRef.current = pageIndex;
  pendingGoToIndexRef.current = null;
  onPageChangeRef.current = onPageChange;
  onVisibleIndicesChangeRef.current = onVisibleIndicesChange;
  onAnimatingChangeRef.current = onAnimatingChange;

  const publishView = useCallback((view: number[], fallbackPage: number) => {
    const indices = visiblePageIndicesFromView(view);
    onVisibleIndicesChangeRef.current?.(
      indices.length > 0 ? indices : [Math.max(0, fallbackPage - 1)],
    );
  }, []);

  const publishViewRef = useRef(publishView);
  publishViewRef.current = publishView;

  const getMagazine = useCallback((): JQuery | null => {
    if (!magazineRef.current || !jqueryRef.current) return null;
    return jqueryRef.current(magazineRef.current);
  }, []);

  const setTurnDuration = useCallback(($magazine: JQuery, ms: number) => {
    const duration = reducedMotionRef.current ? 0 : ms;
    const data = $magazine.data() as {
      opts?: { duration?: number };
      pages?: Record<string, JQuery>;
    };

    if (data?.opts) {
      data.opts.duration = duration;
    }

    if (data?.pages) {
      for (const page of Object.keys(data.pages)) {
        const flipPage = data.pages[page] as JQuery & {
          flip?: (method: "options", opts: { duration: number }) => void;
        };
        flipPage.flip?.("options", { duration });
      }
    }
  }, []);

  const applyLayout = useCallback(
    (
      $magazine: JQuery,
      options?: { keepPage?: number; smoothDisplayChange?: boolean },
    ) => {
      if (applyingLayoutRef.current) return;

      const containerWidth = getContainerWidth(containerRef.current);
      const coverNow = pages[pageIndexRef.current]?.isCover === true;
      const mode = coverNow
        ? "single"
        : resolveTurnDisplay(containerWidth);
      const { width, height } = measureTurnMagazine(containerWidth, mode);
      const displayChanged = displayRef.current !== mode;
      const magazineEl = magazineRef.current;
      const currentTurnPage = $magazine.turn("page") as number;
      const targetTurnPage = options?.keepPage ?? currentTurnPage;
      const sizeUnchanged =
        Math.round($magazine.width() ?? 0) === width &&
        Math.round($magazine.height() ?? 0) === height;

      if (
        !displayChanged &&
        sizeUnchanged &&
        currentTurnPage === targetTurnPage &&
        !options?.smoothDisplayChange
      ) {
        configureTurnFlipPages(
          $magazine,
          mode,
          !reducedMotionRef.current,
          pages[0]?.isCover ? 1 : 0,
          pages,
        );
        styleTurnTemporalPaper($magazine);
        requestAnimationFrame(() => {
          updateSpineLayout();
          syncBookShellSize();
        });
        return;
      }

      applyingLayoutRef.current = true;

      if (options?.smoothDisplayChange && displayChanged) {
        setCenteringLayout(true);
        magazineEl?.classList.add("turn-js-magazine--layout-transition");
      }

      displayRef.current = mode;
      setDisplayMode(mode);

      if ($magazine.turn("display") !== mode) {
        $magazine.turn("display", mode);
      }

      if (!sizeUnchanged) {
        $magazine.turn("size", width, height);
      }

      if (
        options?.keepPage !== undefined &&
        currentTurnPage !== options.keepPage
      ) {
        $magazine.turn("page", options.keepPage);
      }

      configureTurnFlipPages(
        $magazine,
        mode,
        !reducedMotionRef.current,
        pages[0]?.isCover ? 1 : 0,
        pages,
      );
      styleTurnTemporalPaper($magazine);

      const releaseLayoutGuard = () => {
        applyingLayoutRef.current = false;
      };

      const finishLayout = () => {
        magazineEl?.classList.remove("turn-js-magazine--layout-transition");
        setCenteringLayout(false);
        releaseLayoutGuard();
        updateSpineLayout();
        syncBookShellSize();
        if (mode === "double" && magazineEl) {
          magazineEl.style.marginLeft = "auto";
          magazineEl.style.marginRight = "auto";
        }
      };

      if (options?.smoothDisplayChange && displayChanged && magazineEl) {
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          magazineEl.removeEventListener("transitionend", onTransitionEnd);
          finishLayout();
          requestAnimationFrame(() => syncBookShellSize());
        };
        const onTransitionEnd = (event: TransitionEvent) => {
          if (event.target !== magazineEl) return;
          if (event.propertyName === "width" || event.propertyName === "height") {
            done();
          }
        };
        magazineEl.addEventListener("transitionend", onTransitionEnd);
        window.setTimeout(done, LAYOUT_TRANSITION_MS + 80);
      } else {
        releaseLayoutGuard();
        requestAnimationFrame(() => {
          updateSpineLayout();
          syncBookShellSize();
        });
      }
    },
    [pages, updateSpineLayout, syncBookShellSize],
  );

  const applyLayoutRef = useRef(applyLayout);
  applyLayoutRef.current = applyLayout;

  const setTurnDurationRef = useRef(setTurnDuration);
  setTurnDurationRef.current = setTurnDuration;

  useImperativeHandle(
    ref,
    () => ({
      next: () => {
        const $magazine = getMagazine();
        if (!$magazine || !readyRef.current) return;
        if (pages[pageIndexRef.current]?.isCover) {
          setTurnDuration($magazine, TURN_DURATION_COVER_MS);
        } else {
          setTurnDuration($magazine, TURN_DURATION_MS);
        }
        $magazine.turn("next");
      },
      previous: () => {
        const $magazine = getMagazine();
        if (!$magazine || !readyRef.current) return;
        const targetIndex = pageIndexRef.current - 1;
        if (pages[targetIndex]?.isCover) {
          setTurnDuration($magazine, TURN_DURATION_COVER_MS);
        } else {
          setTurnDuration($magazine, TURN_DURATION_MS);
        }
        $magazine.turn("previous");
      },
      goTo: (index: number) => {
        const $magazine = getMagazine();
        if (!$magazine || !readyRef.current) return;
        if (index < 0 || index >= pages.length) return;

        pendingGoToIndexRef.current = index;

        if (pages[pageIndexRef.current]?.isCover && index > 0) {
          setTurnDuration($magazine, TURN_DURATION_COVER_MS);
        } else if (pages[index]?.isCover) {
          setTurnDuration($magazine, TURN_DURATION_COVER_MS);
        } else {
          setTurnDuration($magazine, TURN_DURATION_MS);
        }
        const target = index + 1;
        const current = $magazine.turn("page");
        if (current !== target) {
          $magazine.turn("page", target);
          return;
        }

        pendingGoToIndexRef.current = null;
        onAnimatingChangeRef.current?.(false);
        const view = ($magazine.turn("view") as number[]) ?? [target];
        publishViewRef.current(view, target);
        const prevIndex = pageIndexRef.current;
        if (index !== prevIndex) {
          pageIndexRef.current = index;
          onPageChangeRef.current(index);
          layoutHandledForPageRef.current = index;
        }
      },
      isAnimating: () => {
        const $magazine = getMagazine();
        if (!$magazine || !readyRef.current) return false;
        return Boolean($magazine.turn("animating"));
      },
    }),
    [getMagazine, pages, setTurnDuration],
  );

  useEffect(() => {
    let cancelled = false;
    let $magazine: JQuery | null = null;

    async function init() {
      try {
        const $ = await loadTurnJs();
        if (cancelled || !magazineRef.current) return;

      jqueryRef.current = $;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      reducedMotionRef.current = reducedMotion;

      const containerWidth = getContainerWidth(containerRef.current);
      const coverNow = pages[pageIndexRef.current]?.isCover === true;
      const mode = coverNow
        ? "single"
        : resolveTurnDisplay(containerWidth);
      const { width, height } = measureTurnMagazine(containerWidth, mode);
      displayRef.current = mode;
      setDisplayMode(mode);

      $magazine = $(magazineRef.current);
      $magazine.turn({
        width,
        height,
        display: mode,
        autoCenter: true,
        acceleration: !reducedMotion,
        gradients: !reducedMotion,
        duration: reducedMotion ? 0 : TURN_DURATION_MS,
        elevation: TURN_ELEVATION,
        page: pageIndexRef.current + 1,
        when: {
          turning: () => {
            onAnimatingChangeRef.current?.(true);
          },
          turned: (_event, page, view) => {
            onAnimatingChangeRef.current?.(false);
            const viewArr = view as number[];
            publishViewRef.current(viewArr, page as number);
            const prevIndex = pageIndexRef.current;
            const pending = pendingGoToIndexRef.current;
            const nextIndex =
              pending !== null
                ? pending
                : Math.max(
                    0,
                    Math.min(pages.length - 1, (page as number) - 1),
                  );
            pendingGoToIndexRef.current = null;

            const leavingCover =
              pages[prevIndex]?.isCover === true && nextIndex > 0;
            const enteringCover = pages[nextIndex]?.isCover === true;

            if (nextIndex >= 0 && nextIndex < pages.length) {
              pageIndexRef.current = nextIndex;
              if (nextIndex !== prevIndex) {
                onPageChangeRef.current(nextIndex);
                layoutHandledForPageRef.current = nextIndex;
              }
            }

            const $mag = jqueryRef.current?.(magazineRef.current!);
            if ($mag?.length) {
              setTurnDurationRef.current($mag, TURN_DURATION_MS);
              configureTurnFlipPages(
                $mag,
                displayRef.current,
                !reducedMotionRef.current,
                pages[0]?.isCover ? 1 : 0,
                pages,
              );
              styleTurnTemporalPaper($mag);
              if (leavingCover || enteringCover) {
                applyLayoutRef.current($mag, {
                  keepPage: page as number,
                  smoothDisplayChange: true,
                });
              } else {
                requestAnimationFrame(() => updateSpineLayoutRef.current());
              }
            } else {
              requestAnimationFrame(() => updateSpineLayoutRef.current());
            }
          },
        },
      });

      readyRef.current = true;
      configureTurnFlipPages(
        $magazine,
        mode,
        !reducedMotion,
        pages[0]?.isCover ? 1 : 0,
        pages,
      );
      styleTurnTemporalPaper($magazine);
      const initialView = $magazine.turn("view") as number[] | undefined;
      publishViewRef.current(
        initialView ?? [pageIndexRef.current + 1],
        pageIndexRef.current + 1,
      );
      requestAnimationFrame(() => {
        updateSpineLayoutRef.current();
        syncBookShellSize();
      });
      } catch (error) {
        if (!cancelled) {
          console.error("[reader] turn.js başlatılamadı", error);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      readyRef.current = false;
      const magazineEl = magazineRef.current;
      if ($magazine) {
        $magazine.off("turning turned");
        $magazine.removeData();
        if (magazineEl) {
          magazineEl.innerHTML = "";
        }
      }
    };
  }, [pages.length, pagesKey, syncBookShellSize]);

  useEffect(() => {
    const magazine = magazineRef.current;
    if (!magazine) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => syncBookShellSize());
    });
    ro.observe(magazine);
    syncBookShellSize();

    return () => ro.disconnect();
  }, [pagesKey, syncBookShellSize]);

  useEffect(() => {
    if (!readyRef.current) return;
    requestAnimationFrame(() => updateSpineLayout());
  }, [displayMode, pageIndex, updateSpineLayout]);

  useEffect(() => {
    if (!readyRef.current || displayMode !== "double") return;
    const $magazine = getMagazine();
    if (!$magazine?.length) return;

    const storyTurnPage =
      pages.findIndex((p) => p.itemSlug === "kitabin-hikayesi") + 1;
    if (storyTurnPage < 1) return;

    const view = ($magazine.turn("view") as number[]) ?? [];
    if (!view.includes(storyTurnPage)) return;

    primeStoryPageFlip(
      $magazine,
      displayMode,
      !reducedMotionRef.current,
      pages[0]?.isCover ? 1 : 0,
      pages,
    );
  }, [displayMode, pageIndex, pages, getMagazine]);

  useEffect(() => {
    document.body.classList.toggle("reader-cover-active", isCoverActive);
    if (isCoverActive) {
      const $mag = getMagazine();
      if ($mag?.length) {
        tagTurnFoldLayer($mag);
        styleTurnTemporalPaper($mag);
      }
    }
    return () => document.body.classList.remove("reader-cover-active");
  }, [isCoverActive, getMagazine]);

  useEffect(() => {
    if (!readyRef.current || displayMode !== "double") return;
    const magazine = magazineRef.current;
    if (!magazine) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => updateSpineLayoutRef.current());
    });
    ro.observe(magazine);
    return () => ro.disconnect();
  }, [displayMode, pagesKey]);

  useEffect(() => {
    if (!readyRef.current) return;
    const $magazine = getMagazine();
    if (!$magazine) return;

    const target = pageIndex + 1;
    const current = $magazine.turn("page");
    if (current !== target) {
      $magazine.turn("page", target);
    }

    if (layoutHandledForPageRef.current === pageIndex) {
      layoutHandledForPageRef.current = null;
    } else {
      const smoothDisplayChange =
        (pageIndex > 0 &&
          pages[pageIndex]?.isCover !== true &&
          displayRef.current === "single") ||
        (pageIndex === 0 && displayRef.current === "double");
      applyLayout($magazine, {
        keepPage: target,
        smoothDisplayChange,
      });
    }

    const view = $magazine.turn("view") as number[] | undefined;
    publishViewRef.current(view ?? [target], target);
  }, [pageIndex, getMagazine, applyLayout, pages]);

  useEffect(() => {
    const onResize = debounce(() => {
      if (!readyRef.current) return;
      const $magazine = getMagazine();
      if (!$magazine) return;
      const currentPage = $magazine.turn("page");
      applyLayout($magazine, { keepPage: currentPage });
    }, 120);

    const ro =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(onResize)
        : null;

    ro?.observe(containerRef.current!);
    window.addEventListener("resize", onResize);

    return () => {
      onResize.cancel();
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [applyLayout, getMagazine]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "turn-js-container relative w-full",
        centeringLayout && "turn-js-container--centering",
        displayMode === "double" && !isCoverActive && "turn-js-container--spread",
        isCoverActive && "turn-js-container--cover-active",
      )}
    >
      <div
        className={cn(
          "book-container relative mx-auto w-fit max-w-full",
          displayMode === "double" && !isCoverActive && "book-container--spread",
        )}
      >
        <div
          ref={bookShellRef}
          className="turn-js-book-shell relative"
          style={
            bookShellSize.width > 0
              ? { width: bookShellSize.width, height: bookShellSize.height }
              : undefined
          }
        >
          <div ref={magazineRef} className="turn-js-magazine">
            {pages.map((page) => (
              <div
                key={`${page.itemId}-${page.pageIndex}-${page.globalPageIndex}`}
                className="turn-js-page-slot h-full w-full"
              >
                {page.isCover ? (
                  <BookCoverPage
                    page={page}
                    coverImageUrl={coverImageUrl}
                    spreadSide={spreadSideForPage(page, displayMode)}
                    className="h-full"
                  />
                ) : page.itemSlug === "icindekiler" ? (
                  <BookTocPage
                    page={page}
                    bookTitle={bookTitle}
                    spreadSide={spreadSideForPage(page, displayMode)}
                    className="h-full"
                    onSelectItem={onTocSelectItem}
                    disabled={interactionDisabled}
                  />
                ) : page.itemSlug === "tesekkurler" ? (
                  <BookThanksPage
                    spreadSide={spreadSideForPage(page, displayMode)}
                    className="h-full"
                  />
                ) : (
                  <BookPage
                    page={page}
                    spreadSide={spreadSideForPage(page, displayMode)}
                    className="h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {displayMode === "double" && !isCoverActive && !centeringLayout && (
        <div
          className="reader-book-spine reader-book-spine--visible"
          style={spineStyle}
          aria-hidden
        />
      )}
    </div>
  );
});
