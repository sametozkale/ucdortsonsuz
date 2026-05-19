"use client";

import {
  Bookmark as BookmarkIcon,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ReaderPageIndicator } from "@/components/reader/ReaderPageIndicator";
import { ReaderTocMenu } from "@/components/reader/ReaderTocMenu";
import {
  TurnJsMagazine,
  type TurnJsMagazineHandle,
} from "@/components/reader/TurnJsMagazine";
import type { Book, BookItem, Bookmark } from "@/lib/book/types";
import {
  clearBookmark,
  loadBookmark,
  markReaderSessionStarted,
  resolveBookmarkPageIndex,
  saveBookmark,
} from "@/lib/reader/bookmark";
import {
  buildReaderPages,
  findPageIndexByItemId,
} from "@/lib/reader/pagination";
import { nextPageAfterVisible } from "@/lib/reader/turn-layout";

interface BookReaderProps {
  book: Book;
  items: BookItem[];
}

export function BookReader({ book, items }: BookReaderProps) {
  const pages = useMemo(() => buildReaderPages(items, book), [items, book]);
  const pagesKey = useMemo(
    () =>
      pages
        .map((p) => `${p.itemId}:${p.pageIndex}:${p.globalPageIndex}`)
        .join("|"),
    [pages],
  );
  const [index, setIndex] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [bookmarkNotice, setBookmarkNotice] = useState<string | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const resumePromptCheckedRef = useRef(false);
  const turnRef = useRef<TurnJsMagazineHandle>(null);

  const currentPage = pages[index];

  const nextContentTitle = useMemo(
    () => nextPageAfterVisible(pages, visibleIndices),
    [pages, visibleIndices],
  );

  const bookmarkPageIndex = useMemo(() => {
    if (!bookmark) return null;
    return resolveBookmarkPageIndex(pages, bookmark);
  }, [bookmark, pages]);

  const isBookmarkedHere =
    bookmarkPageIndex !== null && bookmarkPageIndex === index;

  useEffect(() => {
    if (resumePromptCheckedRef.current) return;
    resumePromptCheckedRef.current = true;

    const saved = loadBookmark(book.id);
    setBookmark(saved);

    const isNewReaderSession = markReaderSessionStarted(book.id);
    if (!isNewReaderSession || !saved) return;

    const savedPageIndex = resolveBookmarkPageIndex(pages, saved);
    if (savedPageIndex !== null && savedPageIndex > 0) {
      setShowResumeBanner(true);
    }
  }, [book.id, pages]);

  useEffect(() => {
    if (!bookmarkNotice) return;
    const t = window.setTimeout(() => setBookmarkNotice(null), 2600);
    return () => window.clearTimeout(t);
  }, [bookmarkNotice]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= pages.length) return;
      turnRef.current?.goTo(nextIndex);
    },
    [pages.length],
  );

  const goNext = useCallback(() => {
    if (index >= pages.length - 1 || isAnimating) return;
    turnRef.current?.next();
  }, [index, isAnimating, pages.length]);

  const goPrev = useCallback(() => {
    if (index <= 0 || isAnimating) return;
    turnRef.current?.previous();
  }, [index, isAnimating]);

  const goToItem = useCallback(
    (itemId: string) => {
      goTo(findPageIndexByItemId(pages, itemId, 0));
      setTocOpen(false);
    },
    [goTo, pages],
  );

  const setBookmarkHere = useCallback(() => {
    if (!currentPage || isAnimating) return;
    const next: Bookmark = {
      bookId: book.id,
      itemId: currentPage.itemId,
      pageIndex: currentPage.pageIndex,
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
  }, [book.id, currentPage, index, isAnimating]);

  const removeBookmark = useCallback(() => {
    clearBookmark(book.id);
    setBookmark(null);
    setBookmarkNotice(null);
  }, [book.id]);

  const resumeBookmark = useCallback(() => {
    if (bookmarkPageIndex === null) return;
    setShowResumeBanner(false);
    goTo(bookmarkPageIndex);
  }, [bookmarkPageIndex, goTo]);

  const dismissResumeBanner = useCallback(() => {
    setShowResumeBanner(false);
  }, []);

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

  if (!currentPage) {
    return (
      <p className="p-8 text-center text-stone-500">Okunacak içerik bulunamadı.</p>
    );
  }

  return (
    <div className="reader-canvas relative min-h-dvh w-full">
      <header className="reader-top-bar absolute inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6">
        <div className="relative flex h-10 items-center sm:h-11">
          <Link
            href="/"
            aria-label="Ana sayfaya dön"
            className="reader-corner-btn relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11"
          >
            <Home className="h-5 w-5" strokeWidth={1.5} />
          </Link>

          <h1 className="reader-header-title pointer-events-none absolute inset-x-12 top-0 bottom-0 flex items-center justify-center truncate text-center font-sans text-xs font-medium leading-none text-reader-title sm:inset-x-14 sm:text-sm">
            {book.title}
          </h1>

          <button
            type="button"
            aria-label={isBookmarkedHere ? "Ayraç kaldır" : "Ayraç koy"}
            onClick={isBookmarkedHere ? removeBookmark : setBookmarkHere}
            disabled={isAnimating}
            className={cn(
              "reader-corner-btn relative z-10 ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
              isBookmarkedHere && "text-ink hover:bg-surface-muted",
            )}
          >
            <BookmarkIcon
              className={cn(
                "h-5 w-5",
                isBookmarkedHere && "fill-current text-ink",
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </header>

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
        isOnCover={currentPage.isCover === true}
        sectionTitle={currentPage.sectionTitle}
        open={tocOpen}
        onOpenChange={setTocOpen}
        onSelect={goToItem}
        onSelectCover={() => goTo(0)}
      />

      <div className="absolute bottom-4 right-4 z-50 flex max-w-[min(52vw,20rem)] flex-row-reverse items-center gap-3 text-right sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={goNext}
          disabled={isAnimating || index >= pages.length - 1}
          aria-label={
            nextContentTitle
              ? `Sonraki: ${nextContentTitle}`
              : "Sonraki sayfa yok"
          }
          className={cn(
            "reader-corner-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
            (index >= pages.length - 1 || isAnimating) && "opacity-40",
          )}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
        {nextContentTitle && (
          <span className="pointer-events-none min-w-0 truncate text-xs text-reader-body sm:text-sm">
            {nextContentTitle}
          </span>
        )}
      </div>

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
            onClick={dismissResumeBanner}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
      )}

      <div className="book-stage flex min-h-dvh w-full items-center justify-center px-6 py-16 sm:px-12 sm:py-20">
        <TurnJsMagazine
          key={pagesKey}
          ref={turnRef}
          pages={pages}
          pageIndex={index}
          bookTitle={book.title}
          coverImageUrl={book.cover_image_url}
          onPageChange={setIndex}
          onVisibleIndicesChange={setVisibleIndices}
          onAnimatingChange={setIsAnimating}
          onTocSelectItem={goToItem}
          interactionDisabled={isAnimating}
        />
      </div>

      <ReaderPageIndicator
        current={index + 1}
        total={pages.length}
        onPrev={goPrev}
        onNext={goNext}
        canGoPrev={index > 0}
        canGoNext={index < pages.length - 1}
        disabled={isAnimating}
      />
    </div>
  );
}
