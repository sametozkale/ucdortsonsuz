"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowcaseCarousel } from "@/components/landing/useShowcaseCarousel";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";
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
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${s.title} kesiti`}
            className={cn(
              "showcase-slider__dot",
              i === index && "showcase-slider__dot--active",
            )}
            onClick={() => setIndex(i)}
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
