"use client";

import {
  AUTHOR_CONTACT_EMAIL,
  AUTHOR_NAME,
  BOOK_TITLE,
} from "@/lib/constants";
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

interface BookThanksPageProps {
  spreadSide?: SpreadSide;
  className?: string;
}

export function BookThanksPage({
  spreadSide = "single",
  className,
}: BookThanksPageProps) {
  return (
    <article
      className={cn(
        "book-page book-page-front book-page--thanks flex h-full flex-col overflow-hidden bg-surface px-6 py-8 sm:px-8 sm:py-9",
        spreadChromeClass(spreadSide),
        className,
      )}
      aria-label="Teşekkürler"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <h2 className="reader-content-title text-2xl font-normal tracking-tight text-reader-title sm:text-[1.625rem]">
          Teşekkürler
        </h2>

        <p className="reader-thanks-author mt-6 font-sans text-[0.9375rem] font-medium tracking-[-0.02em] text-reader-title">
          {AUTHOR_NAME}
        </p>

        <a
          href={`mailto:${AUTHOR_CONTACT_EMAIL}`}
          className="reader-thanks-email mt-3 font-sans text-[0.8125rem] tracking-[-0.01em] text-reader-body underline decoration-border underline-offset-[3px] transition-colors hover:text-reader-title"
        >
          {AUTHOR_CONTACT_EMAIL}
        </a>

        <div className="reader-thanks-note mt-8 flex w-full min-w-0 flex-col items-center gap-2 px-1 font-sans text-[0.75rem] tracking-[-0.02em] text-reader-body sm:text-[0.8125rem]">
          <p className="whitespace-nowrap leading-snug">
            <span className="font-medium text-reader-title">{BOOK_TITLE}</span>
            ’u okuduğunuz için teşekkür ederim.
          </p>
          <p className="whitespace-nowrap leading-snug">
            Her zaman bana ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </article>
  );
}
