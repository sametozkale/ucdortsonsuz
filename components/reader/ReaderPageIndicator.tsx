"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderPageIndicatorProps {
  current: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ReaderPageIndicator({
  current,
  total,
  onPrev,
  onNext,
  canGoPrev = true,
  canGoNext = true,
  disabled = false,
  className,
}: ReaderPageIndicatorProps) {
  const prevDisabled = disabled || !canGoPrev;
  const nextDisabled = disabled || !canGoNext;

  return (
    <div
      className={cn(
        "reader-page-indicator fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 sm:bottom-8 sm:gap-2.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Önceki sayfa"
        className={cn(
          "reader-corner-btn flex h-9 w-9 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-10 sm:w-10",
          prevDisabled && "pointer-events-none opacity-35",
        )}
      >
        <ChevronLeft className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={1.5} />
      </button>

      <div
        className="min-w-[4.5rem] tabular-nums text-center text-[11px] tracking-wide text-ink-tertiary sm:min-w-[5rem] sm:text-xs"
        aria-live="polite"
        aria-label={`Sayfa ${current}, toplam ${total}`}
      >
        <span className="text-ink-secondary">{current}</span>
        <span className="mx-1 text-reader-body" aria-hidden>
          /
        </span>
        <span className="text-ink-secondary">{total}</span>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Sonraki sayfa"
        className={cn(
          "reader-corner-btn flex h-9 w-9 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-10 sm:w-10",
          nextDisabled && "pointer-events-none opacity-35",
        )}
      >
        <ChevronRight className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={1.5} />
      </button>
    </div>
  );
}
