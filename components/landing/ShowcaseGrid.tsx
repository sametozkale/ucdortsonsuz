"use client";

import { LandingReveal } from "@/components/landing/LandingReveal";
import { ShowcaseSlider } from "@/components/landing/ShowcaseSlider";
import { ShowcaseSliderControls } from "@/components/landing/ShowcaseSliderControls";
import { useShowcaseCarousel } from "@/components/landing/useShowcaseCarousel";
import { Container } from "@/components/layout/Container";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";

interface ShowcaseGridProps {
  slides: ShowcaseSlide[];
}

export function ShowcaseGrid({ slides }: ShowcaseGridProps) {
  const carousel = useShowcaseCarousel(slides);

  if (slides.length === 0) return null;

  return (
    <section
      id="kitaptan"
      className="landing-showcase site-section"
      aria-labelledby="landing-showcase-title"
    >
      <Container>
        <LandingReveal className="landing-showcase__head">
          <div className="landing-showcase__head-row">
            <div className="landing-showcase__head-copy">
              <p className="landing-eyebrow">Kitaptan</p>
              <h2 id="landing-showcase-title" className="landing-section-headline">
                Zihne dokunan kesitler
              </h2>
            </div>
            <ShowcaseSliderControls slides={slides} carousel={carousel} />
          </div>
        </LandingReveal>
        <LandingReveal delay={0.06}>
          <ShowcaseSlider slides={slides} carousel={carousel} />
        </LandingReveal>
      </Container>
    </section>
  );
}
