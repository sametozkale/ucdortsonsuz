"use client";

import Link from "next/link";
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
    </div>
  );
}
