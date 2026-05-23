import { LandingReveal } from "@/components/landing/LandingReveal";
import { ShowcaseSlider } from "@/components/landing/ShowcaseSlider";
import { Container } from "@/components/layout/Container";
import type { ShowcaseSlide } from "@/lib/landing/showcase-excerpts";

interface ShowcaseGridProps {
  slides: ShowcaseSlide[];
}

export function ShowcaseGrid({ slides }: ShowcaseGridProps) {
  if (slides.length === 0) return null;

  return (
    <section
      id="kitaptan"
      className="landing-showcase site-section"
      aria-labelledby="landing-showcase-title"
    >
      <Container>
        <LandingReveal className="landing-showcase__head">
          <p className="landing-eyebrow">Kitaptan</p>
          <h2 id="landing-showcase-title" className="landing-section-headline">
            Zihne dokunan kesitler
          </h2>
        </LandingReveal>
        <LandingReveal delay={0.06}>
          <ShowcaseSlider slides={slides} />
        </LandingReveal>
      </Container>
    </section>
  );
}
