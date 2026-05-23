"use client";

import Image from "next/image";
import { BOOK_COVER_BG_ALT, BOOK_COVER_BG_URL } from "@/lib/constants";
import type { ReaderPage } from "@/lib/book/types";
import type { SpreadSide } from "@/lib/reader/turn-layout";
import { cn } from "@/lib/utils";

interface BookCoverPageProps {
  page: ReaderPage;
  spreadSide?: SpreadSide;
  coverImageUrl?: string | null;
  side?: "front" | "back";
  className?: string;
}

function spreadChromeClass(side: SpreadSide) {
  switch (side) {
    case "left":
      return "book-page--spread-left border border-r-0 border-border";
    case "right":
      return "book-page--spread-right border border-l-0 border-border";
    default:
      return "book-page--spread-single border border-border";
  }
}

export function BookCoverPage({
  page,
  spreadSide = "single",
  coverImageUrl,
  side = "front",
  className,
}: BookCoverPageProps) {
  const authorName = page.content;
  const backgroundSrc = coverImageUrl ?? BOOK_COVER_BG_URL;

  if (side === "back") {
    return (
      <div
        className={cn(
          "book-page book-page-cover-back relative flex h-full flex-col overflow-hidden bg-surface",
          spreadChromeClass(spreadSide),
          className,
        )}
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,113,108,0.04) 2px, rgba(120,113,108,0.04) 3px)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface via-surface to-bg-alt/40"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <article
      className={cn(
        "book-page book-page-cover relative flex h-full flex-col overflow-hidden bg-transparent",
        spreadChromeClass(spreadSide),
        className,
      )}
      aria-label={`${page.itemTitle} kapak`}
    >
      <div className="book-cover-bg pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <Image
          src={backgroundSrc}
          alt={BOOK_COVER_BG_ALT}
          fill
          className="book-cover-bg-image object-cover object-center"
          sizes="(max-width: 960px) 100vw, 480px"
          priority
        />
      </div>

      <div className="book-cover-inner relative z-10 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[inherit] px-8 py-10 text-center sm:px-10 sm:py-12">
        <h1 className="reader-content-title whitespace-nowrap text-[1.375rem] font-normal leading-tight text-white sm:text-2xl">
          {page.itemTitle}
        </h1>

        {authorName ? (
          <p className="mt-3 font-sans text-sm tracking-wide text-white">
            {authorName}
          </p>
        ) : null}

        <div className="reader-divider-line mt-8 h-px w-12" aria-hidden />
      </div>
    </article>
  );
}
