"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowcaseCarousel } from "@/components/landing/useShowcaseCarousel";
import {
  SHOWCASE_DOT_COUNT,
  showcaseDotIndex,
  showcaseSlideIndexForDot,
  type ShowcaseSlide,
} from "@/lib/landing/showcase-excerpts";
import { cn } from "@/lib/utils";

interface ShowcaseSliderControlsProps {
  slides: ShowcaseSlide[];
  carousel: ShowcaseCarousel;
  className?: string;
}

export function ShowcaseSliderControls({
  slides,
  carousel,
  className,
}: ShowcaseSliderControlsProps) {
  const { index, setIndex, count, goPrev, goNext } = carousel;
  const activeDot = showcaseDotIndex(index, count);

  if (count <= 1) return null;

  return (
    <div
      className={cn("showcase-slider__controls", className)}
      role="toolbar"
      aria-label="Kesit gezgini"
    >
      <button
        type="button"
        className="showcase-slider__arrow"
        onClick={goPrev}
        aria-label="Önceki kesit"
      >
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
      </button>

      <div
        className="showcase-slider__dots"
        role="tablist"
        aria-label="Kesitler"
      >
        {Array.from({ length: SHOWCASE_DOT_COUNT }, (_, dot) => (
          <button
            key={dot}
            type="button"
            role="tab"
            aria-selected={dot === activeDot}
            aria-label={`Kesit bölümü ${dot + 1} / ${SHOWCASE_DOT_COUNT}`}
            className={cn(
              "showcase-slider__dot",
              dot === activeDot && "showcase-slider__dot--active",
            )}
            onClick={() => setIndex(showcaseSlideIndexForDot(dot, count))}
          />
        ))}
      </div>

      <button
        type="button"
        className="showcase-slider__arrow"
        onClick={goNext}
        aria-label="Sonraki kesit"
      >
        <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
