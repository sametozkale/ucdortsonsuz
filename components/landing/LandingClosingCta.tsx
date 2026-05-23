import Link from "next/link";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { Container } from "@/components/layout/Container";
import { CLOSING_CTA_COPY } from "@/lib/landing/content";

export function LandingClosingCta() {
  return (
    <section className="landing-close site-section" aria-label="Satın alma">
      <Container>
        <LandingReveal>
          <div className="landing-close__panel">
            <h2 className="landing-close__title font-serif">
              {CLOSING_CTA_COPY.title}
            </h2>
            <p className="landing-close__text prose-width">
              {CLOSING_CTA_COPY.text}
            </p>
            <div className="landing-close__actions">
              <Link href="/satin-al" className="btn-primary">
                {CLOSING_CTA_COPY.ctaBuy}
              </Link>
              <Link href="/kitap" className="btn-ghost">
                {CLOSING_CTA_COPY.ctaAbout}
              </Link>
            </div>
          </div>
        </LandingReveal>
      </Container>
    </section>
  );
}
