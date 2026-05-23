"use client";

import { Prose } from "@/components/marketing/Prose";
import type { ReaderPage } from "@/lib/book/types";
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

interface BookPageProps {
  page: ReaderPage;
  side?: "front" | "back";
  spreadSide?: SpreadSide;
  className?: string;
}

const ESSAY_SECTION_MARKER = /^[IVXLCDM]{1,8}$/i;

/** Sayfalama \n\n ile uyumlu paragraflar — tek blokta boşluk yanılsaması olmasın */
function EssayPageBody({ content }: { content: string }) {
  const parts = content
    .split(/\n\n+/)
    .map((p) => p.trim().replace(/^\*\*|\*\*$/g, ""))
    .filter(Boolean);
  if (parts.length <= 1) {
    return <p>{parts[0] ?? content}</p>;
  }
  return (
    <>
      {parts.map((part, index) =>
        ESSAY_SECTION_MARKER.test(part) ? (
          <p
            key={index}
            className="mb-2 font-normal text-reader-title tracking-[0.12em]"
          >
            {part}
          </p>
        ) : (
          <p key={index}>{part}</p>
        ),
      )}
    </>
  );
}

export function BookPage({
  page,
  side = "front",
  spreadSide = "single",
  className,
}: BookPageProps) {
  const isFirstPageOfItem = page.pageIndex === 0;
  const hideSectionEyebrow =
    page.itemSlug === "onsoz" || page.itemSlug === "kitabin-hikayesi";
  const isPoemOrEssay =
    page.itemKind === "poem" || page.itemKind === "essay";
  const sectionEyebrowClass =
    "font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-reader-body";

  if (side === "back") {
    return (
      <div
        className={cn(
          "book-page book-page-back relative flex h-full flex-col overflow-hidden bg-bg-alt",
          spreadChromeClass(spreadSide),
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bg via-transparent to-border/35"
          aria-hidden
        />
        <div className="flex flex-1 items-center justify-center px-12">
          <div className="reader-divider-line h-px w-full max-w-[8rem]" />
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "book-page book-page-front flex h-full flex-col overflow-hidden bg-surface px-6 py-8 sm:px-8 sm:py-9",
        spreadChromeClass(spreadSide),
        className,
      )}
      aria-label={`${page.itemTitle}, sayfa ${page.pageIndex + 1}`}
    >
      {isFirstPageOfItem ? (
        <header className="reader-divider-header mb-5 shrink-0 pb-4">
          {!hideSectionEyebrow && (
            <p className={sectionEyebrowClass}>{page.sectionTitle}</p>
          )}
          <h2
            className={cn(
              "reader-content-title text-lg font-normal leading-snug text-reader-title sm:text-xl",
              !hideSectionEyebrow && "mt-1.5",
            )}
          >
            {page.itemTitle}
          </h2>
        </header>
      ) : isPoemOrEssay ? (
        <p className={cn(sectionEyebrowClass, "mb-3 shrink-0")}>
          {page.itemTitle}
        </p>
      ) : (
        <p className="reader-content-title mb-3 shrink-0 text-base text-reader-title">
          {page.itemTitle}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "reader-content font-sans tracking-[-0.02em] text-reader-body",
            page.itemKind === "poem"
              ? "reader-content--poem text-[0.9375rem] sm:text-[0.975rem]"
              : "reader-content--essay text-[0.9375rem] leading-[1.72] sm:text-[0.975rem] sm:leading-[1.78]",
          )}
        >
          <Prose
            className={cn(
              "font-sans",
              page.itemKind === "poem"
                ? "prose-p:my-0 prose-p:text-reader-body prose-p:leading-[1.32] prose-p:tracking-[-0.02em]"
                : "prose-p:text-reader-body prose-p:leading-[1.72] prose-p:tracking-[-0.02em]",
              "prose-headings:font-normal prose-headings:text-reader-title",
              "prose-strong:text-reader-title prose-a:text-reader-title",
            )}
          >
            {page.itemKind === "essay" ? (
              <EssayPageBody content={page.content} />
            ) : (
              page.content
            )}
          </Prose>
        </div>
      </div>
    </article>
  );
}
