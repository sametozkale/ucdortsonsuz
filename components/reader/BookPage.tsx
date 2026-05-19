"use client";

import { Prose } from "@/components/marketing/Prose";
import type { ReaderPage } from "@/lib/book/types";
import { cn } from "@/lib/utils";

interface BookPageProps {
  page: ReaderPage;
  side?: "front" | "back";
  className?: string;
}

export function BookPage({ page, side = "front", className }: BookPageProps) {
  const isFirstPageOfItem = page.pageIndex === 0;
  const pageLabel =
    page.totalPagesInItem > 1
      ? `${page.pageIndex + 1} / ${page.totalPagesInItem}`
      : null;

  if (side === "back") {
    return (
      <div
        className={cn(
          "book-page book-page-back relative flex h-full flex-col overflow-hidden bg-[#ebe8e2]",
          className,
        )}
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,113,108,0.05) 2px, rgba(120,113,108,0.05) 3px)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f7f5f0] via-transparent to-[#d6d0c6]"
          aria-hidden
        />
        <div className="flex flex-1 items-center justify-center px-12">
          <div className="h-px w-full max-w-[8rem] bg-stone-400/50" />
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "book-page book-page-front flex h-full flex-col overflow-hidden bg-white px-8 py-10 sm:px-10 sm:py-12",
        className,
      )}
      aria-label={`${page.itemTitle}, sayfa ${page.pageIndex + 1}`}
    >
      {isFirstPageOfItem && (
        <header className="mb-6 shrink-0 border-b border-stone-200/80 pb-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500">
            {page.sectionTitle}
          </p>
          <h2 className="mt-1 font-serif text-xl font-semibold leading-snug text-stone-900 sm:text-2xl">
            {page.itemTitle}
          </h2>
        </header>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="reader-content font-serif text-[1.05rem] leading-[1.9] text-stone-900 sm:text-lg">
          <Prose>{page.content}</Prose>
        </div>
      </div>

      <footer className="mt-6 shrink-0 flex items-end justify-between border-t border-stone-200/60 pt-3 text-[11px] text-stone-500">
        <span className="truncate pr-4">
          {!isFirstPageOfItem ? page.itemTitle : ""}
        </span>
        <span className="tabular-nums">
          {pageLabel ?? String(page.globalPageIndex + 1)}
        </span>
      </footer>
    </article>
  );
}
