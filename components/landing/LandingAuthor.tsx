import Link from "next/link";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { AuthorPortrait } from "@/components/marketing/AuthorPortrait";
import { Container } from "@/components/layout/Container";
import {
  AUTHOR_NAME,
  AUTHOR_PHOTO_SRC,
  BOOK_TITLE,
} from "@/lib/constants";

interface LandingAuthorProps {
  quote: string;
}

export function LandingAuthor({ quote }: LandingAuthorProps) {
  return (
    <section
      className="landing-author site-section"
      aria-labelledby="landing-author-title"
    >
      <Container>
        <LandingReveal className="landing-author__grid">
          <AuthorPortrait
            name={AUTHOR_NAME}
            src={AUTHOR_PHOTO_SRC}
            className="landing-author__portrait"
          />
          <div className="landing-author__copy min-w-0">
            <p className="landing-eyebrow">Yazar</p>
            <h2 id="landing-author-title" className="landing-section-headline">
              {AUTHOR_NAME}
            </h2>
            <blockquote className="landing-author__quote">
              {quote}
            </blockquote>
            <footer className="landing-author__cite">
              <Link href="/hakkimda" className="text-link">
                Biyografi
              </Link>
              <span className="landing-author__cite-sep" aria-hidden>
                ·
              </span>
              <span className="landing-author__book">{BOOK_TITLE}</span>
            </footer>
          </div>
        </LandingReveal>
      </Container>
    </section>
  );
}
