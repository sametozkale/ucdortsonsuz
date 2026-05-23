"use client";

import { BookCoverPage } from "@/components/reader/BookCoverPage";
import { BookPage } from "@/components/reader/BookPage";
import { BookThanksPage } from "@/components/reader/BookThanksPage";
import type { ReaderPage } from "@/lib/book/types";
import type { SpreadSide } from "@/lib/reader/turn-layout";

interface ReaderPageContentProps {
  page: ReaderPage;
  coverImageUrl?: string | null;
  side?: "front" | "back";
  spreadSide?: SpreadSide;
  className?: string;
}

export function ReaderPageContent({
  page,
  coverImageUrl,
  side = "front",
  spreadSide = "single",
  className,
}: ReaderPageContentProps) {
  if (page.isCover) {
    return (
      <BookCoverPage
        page={page}
        coverImageUrl={coverImageUrl}
        side={side}
        spreadSide={spreadSide}
        className={className}
      />
    );
  }

  if (page.itemSlug === "tesekkurler" && side === "front") {
    return (
      <BookThanksPage spreadSide={spreadSide} className={className} />
    );
  }

  return (
    <BookPage
      page={page}
      side={side}
      spreadSide={spreadSide}
      className={className}
    />
  );
}
