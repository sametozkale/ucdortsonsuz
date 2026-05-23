"use client";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? [];
}

type LandingNameVariant = "hero-follow" | "pre-footer";

interface LandingNameProps {
  text: string;
  ariaLabel: string;
  variant?: LandingNameVariant;
}

export function LandingName({
  text,
  ariaLabel,
  variant = "pre-footer",
}: LandingNameProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.88", "end 0.35"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  const tokens = useMemo(() => tokenize(text), [text]);
  const wordIndices = useMemo(() => {
    let index = -1;
    return tokens.map((token) => (/\S/.test(token) ? ++index : -1));
  }, [tokens]);
  const wordCount = useMemo(
    () => wordIndices.filter((i) => i >= 0).length,
    [wordIndices],
  );

  const fillProgress = reduceMotion ? 1 : progress;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "landing-name",
        variant === "hero-follow" && "landing-name--hero-follow",
        variant === "pre-footer" && "landing-name--pre-footer",
      )}
      aria-label={ariaLabel}
    >
      <div className="landing-name__sticky">
        <Container>
          <p className="landing-name__text">
            {tokens.map((token, i) => {
              const wordIndex = wordIndices[i];
              if (wordIndex < 0) {
                return <span key={i}>{token}</span>;
              }

              const start = wordIndex / wordCount;
              const end = (wordIndex + 1) / wordCount;
              const span = Math.max(end - start, 0.001);
              const fill = Math.min(
                1,
                Math.max(0, (fillProgress - start) / span),
              );

              return (
                <span
                  key={i}
                  className="landing-name__word"
                  style={{
                    color: `color-mix(in srgb, #252525 ${fill * 100}%, #c8c7c2)`,
                  }}
                >
                  {token}
                </span>
              );
            })}
          </p>
        </Container>
      </div>
    </section>
  );
}
