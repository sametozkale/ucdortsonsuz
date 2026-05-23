"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";
import { cn } from "@/lib/utils";

interface ShowcaseSliderProps {
  slides: ShowcaseSlide[];
}

export function ShowcaseSlider({ slides }: ShowcaseSliderProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => go(index - 1), [go, index]);
  const goNext = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (count <= 1 || reduceMotion) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 9000);

    return () => window.clearInterval(timer);
  }, [count, reduceMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <div
      className="showcase-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Kitaptan örnek kesitler"
    >
      <div className="showcase-slider__card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            className="showcase-slider__panel"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="showcase-slider__quote font-serif">
              <p>{slide.quote}</p>
            </blockquote>
            <footer className="showcase-slider__meta">
              <div className="showcase-slider__cite">
                <span className="showcase-slider__kind">{slide.kindLabel}</span>
                <cite className="showcase-slider__title">{slide.title}</cite>
              </div>
              <Link href={slide.href} className="showcase-slider__read text-link">
                Metni oku →
              </Link>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="showcase-slider__controls">
          <button
            type="button"
            className="showcase-slider__arrow"
            onClick={goPrev}
            aria-label="Önceki kesit"
          >
            <ChevronLeft className="size-5" aria-hidden />
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
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
