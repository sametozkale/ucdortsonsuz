"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BookPage } from "@/components/reader/BookPage";
import type { ReaderPage } from "@/lib/book/types";

interface BookSpreadProps {
  page: ReaderPage;
  direction: number;
}

const pageTransition = {
  type: "spring" as const,
  stiffness: 72,
  damping: 22,
  mass: 0.85,
};

const fadeTransition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1] as const,
};

const pageVariants: Variants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 68 : -68,
    opacity: 0.94,
    zIndex: 1,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -68 : 68,
    opacity: 0.9,
    zIndex: 2,
  }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function BookSpread({ page, direction }: BookSpreadProps) {
  const reducedMotion = useReducedMotion();
  const flipOrigin = direction >= 0 ? "left center" : "right center";

  if (reducedMotion) {
    return (
      <motion.div
        key={`${page.itemId}-${page.pageIndex}`}
        variants={fadeVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={fadeTransition}
        className="book-spread-inner absolute inset-0 h-full w-full"
      >
        <BookPage page={page} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${page.itemId}-${page.pageIndex}`}
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="book-spread-inner absolute inset-0 h-full w-full"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: flipOrigin,
        backfaceVisibility: "hidden",
        willChange: "transform, opacity",
      }}
    >
      <BookPage page={page} />
    </motion.div>
  );
}
