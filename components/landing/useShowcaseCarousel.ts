"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";

export function useShowcaseCarousel(slides: ShowcaseSlide[]) {
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

  const slide = count > 0 ? slides[index] : undefined;

  return {
    index,
    setIndex,
    count,
    slide,
    goPrev,
    goNext,
    reduceMotion,
  };
}

export type ShowcaseCarousel = ReturnType<typeof useShowcaseCarousel>;
