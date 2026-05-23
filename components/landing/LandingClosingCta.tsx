import Link from "next/link";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { Container } from "@/components/layout/Container";

export function LandingClosingCta() {
  return (
    <section className="landing-close site-section" aria-label="Satın alma">
      <Container>
        <LandingReveal>
          <div className="landing-close__panel">
            <h2 className="landing-close__title font-serif">
              Kitabı bugün alın, bu akşam okuyun.
            </h2>
            <p className="landing-close__text prose-width">
              Tam metin dijital okuyucuda açılır. İsterseniz önce örnek şiirleri
              okuyup karar verin — satın alma tek sayfada tamamlanır.
            </p>
            <div className="landing-close__actions">
              <Link href="/satin-al" className="btn-primary">
                Satın al
              </Link>
              <Link href="/kitap" className="btn-ghost">
                Kitap hakkında
              </Link>
            </div>
          </div>
        </LandingReveal>
      </Container>
    </section>
  );
}
