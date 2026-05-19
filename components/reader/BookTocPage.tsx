"use client";

import { ESSAY_COUNT, POEM_COUNT } from "@/lib/constants";
import type { ReaderPage, TocPageContent, TocPageEntry } from "@/lib/book/types";
import type { SpreadSide } from "@/lib/reader/turn-layout";
import { cn } from "@/lib/utils";

function spreadChromeClass(side: SpreadSide) {
  switch (side) {
    case "left":
      return "book-page--spread-left border border-r-0 border-border";
    case "right":
      return "book-page--spread-right border border-l-0 border-border";
    default:
      return "book-page--spread-single border-0 shadow-none ring-0";
  }
}

interface BookTocPageProps {
  page: ReaderPage;
  bookTitle: string;
  spreadSide?: SpreadSide;
  className?: string;
  onSelectItem?: (itemId: string) => void;
  disabled?: boolean;
}

function TocLink({
  entry,
  onSelect,
  disabled,
}: {
  entry: TocPageEntry;
  onSelect?: (itemId: string) => void;
  disabled?: boolean;
}) {
  return (
    <li className="reader-toc-page-grid-item">
      <button
        type="button"
        disabled={disabled || !onSelect}
        onClick={() => onSelect?.(entry.itemId)}
        className="reader-toc-page-link"
      >
        {entry.title}
      </button>
    </li>
  );
}

function TocTwoColumnList({
  items,
  onSelectItem,
  disabled,
}: {
  items: TocPageEntry[];
  onSelectItem?: (itemId: string) => void;
  disabled?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="reader-toc-page-grid" role="list">
      {items.map((entry) => (
        <TocLink
          key={entry.itemId}
          entry={entry}
          onSelect={onSelectItem}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}

function TocPageBody({
  slice,
  onSelectItem,
  disabled,
}: {
  slice: TocPageContent;
  onSelectItem?: (itemId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="reader-toc-page font-sans text-[0.8125rem] leading-snug tracking-[-0.02em] text-reader-body sm:text-[0.875rem]">
      {slice.frontMatter.length > 0 && (
        <ul className="reader-toc-page-front" role="list">
          {slice.frontMatter.map((entry) => (
            <li key={entry.itemId}>
              <button
                type="button"
                disabled={disabled || !onSelectItem}
                onClick={() => onSelectItem?.(entry.itemId)}
                className="reader-toc-page-link reader-toc-page-link--front"
              >
                {entry.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {slice.showPoemsHeading && (
        <section className="reader-toc-page-section" aria-labelledby="toc-poems">
          <h3 id="toc-poems" className="reader-toc-page-heading">
            Şiirler <span className="text-reader-body">({POEM_COUNT})</span>
          </h3>
          <TocTwoColumnList
            items={slice.poems}
            onSelectItem={onSelectItem}
            disabled={disabled}
          />
        </section>
      )}

      {!slice.showPoemsHeading && slice.poems.length > 0 && (
        <section className="reader-toc-page-section" aria-label="Şiirler devam">
          <TocTwoColumnList
            items={slice.poems}
            onSelectItem={onSelectItem}
            disabled={disabled}
          />
        </section>
      )}

      {slice.showEssaysHeading && (
        <section className="reader-toc-page-section" aria-labelledby="toc-essays">
          <h3 id="toc-essays" className="reader-toc-page-heading">
            Denemeler <span className="text-reader-body">({ESSAY_COUNT})</span>
          </h3>
          <TocTwoColumnList
            items={slice.essays}
            onSelectItem={onSelectItem}
            disabled={disabled}
          />
        </section>
      )}

      {!slice.showEssaysHeading && slice.essays.length > 0 && (
        <section className="reader-toc-page-section" aria-label="Denemeler devam">
          <TocTwoColumnList
            items={slice.essays}
            onSelectItem={onSelectItem}
            disabled={disabled}
          />
        </section>
      )}
    </div>
  );
}

export function BookTocPage({
  page,
  bookTitle,
  spreadSide = "single",
  className,
  onSelectItem,
  disabled = false,
}: BookTocPageProps) {
  const slice = page.tocSlice;
  const isContinuation = page.pageIndex > 0;

  if (!slice) {
    return null;
  }

  return (
    <article
      className={cn(
        "book-page book-page-front book-page--toc flex h-full flex-col overflow-hidden bg-surface px-6 py-8 sm:px-8 sm:py-9",
        spreadChromeClass(spreadSide),
        className,
      )}
      aria-label={
        isContinuation
          ? `${page.itemTitle}, sayfa ${page.pageIndex + 1}`
          : page.itemTitle
      }
    >
      {slice.showFullHeader ? (
        <header className="reader-divider-header mb-4 shrink-0 pb-3">
          <p className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-reader-body">
            {bookTitle}
          </p>
          <h2 className="reader-content-title mt-1.5 text-lg font-normal leading-snug text-reader-title sm:text-xl">
            {page.itemTitle}
          </h2>
        </header>
      ) : (
        <p className="reader-content-title mb-3 shrink-0 text-base text-reader-title">
          {page.itemTitle}
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TocPageBody
          slice={slice}
          onSelectItem={onSelectItem}
          disabled={disabled}
        />
      </div>
    </article>
  );
}
