"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { FlipPageLeaf } from "@/components/reader/FlipPageStrip";
import { BookPage } from "@/components/reader/BookPage";
import type { ReaderPage } from "@/lib/book/types";
import {
  computeFlipLighting,
  FLIP_DURATION_S,
  FLIP_EASE,
  type FlipDirection,
} from "@/lib/reader/flip-engine";

interface BookPageFlipProps {
  fromPage: ReaderPage;
  toPage: ReaderPage;
  direction: number;
  onComplete: () => void;
}

export function BookPageFlip({
  fromPage,
  toPage,
  direction,
  onComplete,
}: BookPageFlipProps) {
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  const isForward = direction > 0;
  const flipDirection: FlipDirection = isForward ? "forward" : "backward";

  const progress = useMotionValue(isForward ? 0 : 1);

  const lighting = useTransform(progress, (p) => computeFlipLighting(p));

  const foldScrim = useTransform(lighting, (l) => l.foldScrim);
  const spineShade = useTransform(lighting, (l) => l.spineShade);
  const groundShadow = useTransform(lighting, (l) => l.groundShadow);
  const foldLineX = useTransform(lighting, (l) => `${l.foldLineX}%`);

  const underBrightness = useTransform(progress, (p) => {
    const lift = Math.sin(p * Math.PI);
    return `brightness(${1 - lift * 0.06})`;
  });

  const spineEdgeOpacity = useTransform(progress, (p) =>
    Math.max(0, Math.cos(p * Math.PI)) * 0.7,
  );

  useEffect(() => {
    completedRef.current = false;

    if (reducedMotion) {
      onComplete();
      return;
    }

    const target = isForward ? 1 : 0;
    controlsRef.current = animate(progress, target, {
      duration: FLIP_DURATION_S,
      ease: FLIP_EASE,
      onComplete: () => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      },
    });

    return () => {
      controlsRef.current?.stop();
    };
  }, [fromPage, toPage, isForward, onComplete, progress, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="book-flip-static absolute inset-0 h-full w-full">
        <BookPage page={toPage} />
      </div>
    );
  }

  const underPage = isForward ? toPage : fromPage;
  const leafPage = isForward ? fromPage : toPage;

  return (
    <div
      className="book-flip-scene absolute inset-0 h-full w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Alt sayfa */}
      <motion.div
        className="book-flip-under absolute inset-0 z-0 overflow-hidden rounded-[var(--radius-lg)]"
        style={{ filter: underBrightness }}
      >
        <BookPage page={underPage} />
        <motion.div
          className="book-flip-spine pointer-events-none absolute inset-y-0 left-0 z-[1] w-[20%]"
          style={{ opacity: spineShade }}
          aria-hidden
        />
      </motion.div>

      {/* Hareketli katlama gölgesi */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[var(--radius-lg)]"
        style={{ opacity: foldScrim }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-y-0 w-[45%]"
          style={{
            left: foldLineX,
            background:
              "linear-gradient(90deg, rgba(17,17,17,0.35) 0%, rgba(17,17,17,0.08) 40%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Zemin gölgesi */}
      <motion.div
        className="pointer-events-none absolute -bottom-3 left-[8%] right-[8%] z-[1] h-6 rounded-full"
        style={{
          opacity: groundShadow,
          background: "rgba(17,17,17,0.2)",
          filter: "blur(12px)",
        }}
        aria-hidden
      />

      {/* Şeritli dönen yaprak */}
      <div className="flip-leaf-wrap absolute inset-0 z-[2] overflow-visible rounded-[var(--radius-lg)]">
        <FlipPageLeaf
          page={leafPage}
          progress={progress}
          direction={flipDirection}
        />
      </div>

      {/* Cilt kenarı parlaması */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[3] w-[2px] rounded-l-[var(--radius-lg)]"
        style={{
          opacity: spineEdgeOpacity,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(214,211,209,0.85) 50%, rgba(168,162,158,0.8) 100%)",
          boxShadow: "1px 0 8px rgba(17,17,17,0.12)",
        }}
        aria-hidden
      />
    </div>
  );
}
