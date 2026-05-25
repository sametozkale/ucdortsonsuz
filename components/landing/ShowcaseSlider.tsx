"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ShowcaseCarousel } from "@/components/landing/useShowcaseCarousel";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";

interface ShowcaseSliderProps {
  slides: ShowcaseSlide[];
  carousel: ShowcaseCarousel;
}

export function ShowcaseSlider({ slides, carousel }: ShowcaseSliderProps) {
  const { slide, reduceMotion, count } = carousel;

  if (count === 0 || !slide) return null;

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
            <blockquote
              className={
                slide.kind === "poem" && slide.quoteLines?.length
                  ? "showcase-slider__quote showcase-slider__quote--poem"
                  : "showcase-slider__quote"
              }
            >
              {slide.kind === "poem" && slide.quoteLines?.length ? (
                slide.quoteLines.map((line, lineIndex) => (
                  <p key={`${slide.id}-${lineIndex}`} className="showcase-slider__verse">
                    {line}
                  </p>
                ))
              ) : (
                <p>{slide.quote}</p>
              )}
            </blockquote>
            <footer className="showcase-slider__meta">
              <span className="showcase-slider__kind">{slide.kindLabel}</span>
              <cite className="showcase-slider__title">{slide.title}</cite>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
