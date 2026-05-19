"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { BookPage } from "@/components/reader/BookPage";
import type { ReaderPage } from "@/lib/book/types";
import {
  computeStripRotateXDeg,
  computeStripRotationDeg,
  computeStripShade,
  computeStripTranslateZ,
  FLIP_STRIP_COUNT,
  type FlipDirection,
} from "@/lib/reader/flip-engine";

interface FlipPageStripProps {
  stripIndex: number;
  stripCount: number;
  page: ReaderPage;
  progress: MotionValue<number>;
  direction: FlipDirection;
}

export function FlipPageStrip({
  stripIndex,
  stripCount,
  page,
  progress,
  direction,
}: FlipPageStripProps) {
  const rotateY = useTransform(progress, (p) => {
    const deg = computeStripRotationDeg(stripIndex, stripCount, p, direction);
    return `${deg}deg`;
  });

  const rotateX = useTransform(progress, (p) => {
    const deg = computeStripRotateXDeg(stripIndex, stripCount, p);
    return `${deg}deg`;
  });

  const translateZ = useTransform(progress, (p) => {
    const z = computeStripTranslateZ(stripIndex, stripCount, p, direction);
    return `${z}px`;
  });

  const shade = useTransform(progress, (p) =>
    computeStripShade(stripIndex, stripCount, p, direction),
  );

  const edgeSheen = useTransform(progress, (p) => {
    const deg = computeStripRotationDeg(
      stripIndex,
      stripCount,
      p,
      direction,
    );
    return (
      Math.max(0, Math.cos((deg * Math.PI) / 180)) * 0.4
    );
  });

  const sliceStyle = {
    width: `${stripCount * 100}%`,
    marginLeft: `${-stripIndex * 100}%`,
  } as const;

  return (
    <motion.div
      className="flip-strip relative h-full shrink-0"
      style={{
        width: `${100 / stripCount}%`,
        rotateY,
        rotateX,
        z: translateZ,
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
        willChange: "transform",
      }}
    >
      {/* Ön yüz */}
      <div
        className="flip-strip-face flip-strip-face--front absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div className="flip-strip-slice h-full" style={sliceStyle}>
          <BookPage page={page} />
        </div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: shade,
            background:
              "linear-gradient(90deg, rgba(17,17,17,0.28) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            opacity: edgeSheen,
            background:
              "linear-gradient(92deg, rgba(255,255,255,0.5) 0%, transparent 28%)",
          }}
          aria-hidden
        />
      </div>

      {/* Arka yüz (kağıt) */}
      <div
        className="flip-strip-face flip-strip-face--back absolute inset-0 overflow-hidden"
        style={{
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div className="flip-strip-slice h-full" style={sliceStyle}>
          <BookPage page={page} side="back" />
        </div>
      </div>
    </motion.div>
  );
}

interface FlipPageLeafProps {
  page: ReaderPage;
  progress: MotionValue<number>;
  direction: FlipDirection;
}

export function FlipPageLeaf({ page, progress, direction }: FlipPageLeafProps) {
  const count = FLIP_STRIP_COUNT;

  return (
    <motion.div
      className="flip-leaf absolute inset-0 flex h-full w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {Array.from({ length: count }, (_, i) => (
        <FlipPageStrip
          key={i}
          stripIndex={i}
          stripCount={count}
          page={page}
          progress={progress}
          direction={direction}
        />
      ))}
    </motion.div>
  );
}
