"use client";

import {
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookPage } from "@/components/reader/BookPage";
import { BookPageFlip } from "@/components/reader/BookPageFlip";
import { PageCurlZone } from "@/components/reader/PageCurlZone";
import {
  ReaderCornerAction,
  ReaderCornerMeta,
} from "@/components/reader/ReaderCornerAction";
import { ReaderTocMenu } from "@/components/reader/ReaderTocMenu";
import { LogoMark } from "@/components/brand/LogoMark";
import type { Book, BookItem, Bookmark } from "@/lib/book/types";
import {
  clearBookmark,
  loadBookmark,
  resolveBookmarkPageIndex,
  saveBookmark,
} from "@/lib/reader/bookmark";
import {
  buildReaderPages,
  findPageIndexByItemId,
} from "@/lib/reader/pagination";

interface BookReaderProps {
  book: Book;
  items: BookItem[];
}

export function BookReader({ book, items }: BookReaderProps) {
  const pages = useMemo(() => buildReaderPages(items), [items]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<{ from: number; to: number } | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [bookmarkNotice, setBookmarkNotice] = useState<string | null>(null);

  const displayIndex = flip?.to ?? index;
  const currentPage = pages[displayIndex];
  const settledPage = pages[index];
  const isFlipping = flip !== null;

  const bookmarkPageIndex = useMemo(() => {
    if (!bookmark) return null;
    return resolveBookmarkPageIndex(pages, bookmark);
  }, [bookmark, pages]);

  const isBookmarkedHere =
    bookmarkPageIndex !== null && bookmarkPageIndex === index;

  const showResumeBanner =
    bookmarkPageIndex !== null && bookmarkPageIndex !== index;

  useEffect(() => {
    setBookmark(loadBookmark(book.id));
  }, [book.id]);

  useEffect(() => {
    if (!bookmarkNotice) return;
    const t = window.setTimeout(() => setBookmarkNotice(null), 2600);
    return () => window.clearTimeout(t);
  }, [bookmarkNotice]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= pages.length || flip) return;
      if (nextIndex === index) return;
      setFlip({ from: index, to: nextIndex });
    },
    [flip, index, pages.length],
  );

  const onFlipComplete = useCallback(() => {
    setFlip((active) => {
      if (active) setIndex(active.to);
      return null;
    });
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const goToItem = useCallback(
    (itemId: string) => {
      goTo(findPageIndexByItemId(pages, itemId, 0));
      setTocOpen(false);
    },
    [goTo, pages],
  );

  const setBookmarkHere = useCallback(() => {
    if (!settledPage || isFlipping) return;
    const next: Bookmark = {
      bookId: book.id,
      itemId: settledPage.itemId,
      pageIndex: settledPage.pageIndex,
      globalPageIndex: index,
      updatedAt: new Date().toISOString(),
    };
    try {
      saveBookmark(next);
      setBookmark(next);
      setBookmarkNotice("Ayraç kaydedildi");
    } catch {
      setBookmarkNotice("Ayraç kaydedilemedi");
    }
  }, [book.id, index, isFlipping, settledPage]);

  const resumeBookmark = useCallback(() => {
    if (bookmarkPageIndex === null) return;
    goTo(bookmarkPageIndex);
  }, [bookmarkPageIndex, goTo]);

  const removeBookmark = useCallback(() => {
    clearBookmark(book.id);
    setBookmark(null);
    setBookmarkNotice(null);
  }, [book.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart: EventListener = (ev) => {
      touchStartX = (ev as TouchEvent).touches[0]?.clientX ?? 0;
    };
    const onTouchEnd: EventListener = (ev) => {
      const diff =
        touchStartX - ((ev as TouchEvent).changedTouches[0]?.clientX ?? 0);
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    const el = document.querySelector(".book-stage");
    el?.addEventListener("touchstart", onTouchStart, { passive: true });
    el?.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el?.removeEventListener("touchstart", onTouchStart);
      el?.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  if (!currentPage) {
    return (
      <p className="p-8 text-center text-stone-500">Okunacak içerik bulunamadı.</p>
    );
  }

  return (
    <div className="reader-canvas relative min-h-dvh w-full">
      <Link
        href="/"
        aria-label="Ana sayfaya dön"
        className="reader-corner-btn absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:left-6 sm:top-6 sm:h-11 sm:w-11"
      >
        <Home className="h-5 w-5" strokeWidth={1.5} />
      </Link>

      <ReaderCornerAction
        corner="top-right"
        label={isBookmarkedHere ? "Ayraç kaldır" : "Ayraç koy"}
        onClick={isBookmarkedHere ? removeBookmark : setBookmarkHere}
        disabled={isFlipping}
        className={
          isBookmarkedHere
            ? "text-ink hover:bg-surface-muted"
            : undefined
        }
      >
        {isBookmarkedHere ? (
          <BookmarkCheck className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <BookmarkIcon className="h-5 w-5" strokeWidth={1.5} />
        )}
      </ReaderCornerAction>

      {bookmarkNotice && (
        <div
          role="status"
          className="absolute right-4 top-[4.25rem] z-[60] max-w-[min(16rem,calc(100vw-2rem))] rounded-full border border-border bg-surface px-4 py-2 text-center text-sm text-ink shadow-[var(--shadow-sm)] sm:right-6"
        >
          {bookmarkNotice}
        </div>
      )}

      <ReaderTocMenu
        items={items}
        currentItemId={currentPage.itemId}
        open={tocOpen}
        onOpenChange={setTocOpen}
        onSelect={goToItem}
      />

      <ReaderCornerAction
        corner="bottom-right"
        label="Sonraki sayfa"
        onClick={goNext}
        className={
          index >= pages.length - 1 || isFlipping ? "opacity-40" : undefined
        }
        disabled={isFlipping}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </ReaderCornerAction>

      <ReaderCornerMeta corner="bottom-left">
        <LogoMark size="sm" className="text-stone-500" />
        <span className="mt-1.5 block text-stone-400">
          {currentPage.sectionTitle}
        </span>
      </ReaderCornerMeta>

      <ReaderCornerMeta corner="bottom-right">
        <span className="tabular-nums text-stone-600">
          {displayIndex + 1} / {pages.length}
        </span>
        <span className="mt-0.5 block truncate text-stone-400">
          {currentPage.itemTitle}
        </span>
      </ReaderCornerMeta>

      {showResumeBanner && bookmark && (
        <div className="absolute left-1/2 top-16 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-bg/95 px-4 py-2 text-sm text-ink-secondary shadow-[var(--shadow-sm)] backdrop-blur-sm">
          <button
            type="button"
            onClick={resumeBookmark}
            className="font-medium hover:underline"
          >
            Kaldığınız yerden devam
          </button>
          <button
            type="button"
            onClick={removeBookmark}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Ayraçı kaldır"
          >
            ×
          </button>
        </div>
      )}

      <div className="book-stage flex min-h-dvh items-center justify-center px-16 py-20 sm:px-24">
        <div
          className="book-container relative w-full max-w-md sm:max-w-lg"
          style={{ perspective: 3200, perspectiveOrigin: "50% 40%" }}
        >
          <div
            className={`book-pages relative rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-md)] ring-1 ring-border ${isFlipping ? "overflow-visible" : "overflow-hidden"}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {flip ? (
              <BookPageFlip
                key={`${flip.from}-${flip.to}`}
                fromPage={pages[flip.from]!}
                toPage={pages[flip.to]!}
                direction={flip.to > flip.from ? 1 : -1}
                onComplete={onFlipComplete}
              />
            ) : (
              <div className="book-flip-static absolute inset-0 h-full w-full">
                <BookPage page={currentPage} />
              </div>
            )}

            <PageCurlZone
              side="left"
              disabled={index === 0 || isFlipping}
              onActivate={goPrev}
            />
            <PageCurlZone
              side="right"
              disabled={index >= pages.length - 1 || isFlipping}
              onActivate={goNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
