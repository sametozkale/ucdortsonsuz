import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AuthorPortrait } from "@/components/marketing/AuthorPortrait";
import {
  ABOUT_BODY,
  ABOUT_PRESS,
  AUTHOR_LINKEDIN_URL,
  AUTHOR_WEBSITE_URL,
} from "@/lib/author/about";
import { JsonLd } from "@/components/seo/JsonLd";
import { AUTHOR_NAME, AUTHOR_PHOTO_SRC, BOOK_TITLE } from "@/lib/constants";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Hakkımda",
  description: `${AUTHOR_NAME} — ${BOOK_TITLE} yazarı. Kısa biyografi ve basın notu.`,
  path: "/hakkimda",
});

export default function HakkimdaPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hakkımda", path: "/hakkimda" },
        ])}
      />
      <article className="site-section">
        <Container>
          <header className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <AuthorPortrait
              name={AUTHOR_NAME}
              src={AUTHOR_PHOTO_SRC}
              size="sm"
              className="shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-hero-title text-4xl font-semibold tracking-tight text-ink">
                {AUTHOR_NAME}
              </h1>
              <p className="mt-2 text-sm text-ink-tertiary">Yazar · {BOOK_TITLE}</p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <a
                  href={AUTHOR_WEBSITE_URL}
                  className="text-link !no-underline hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  samet.works
                </a>
                <a
                  href={AUTHOR_LINKEDIN_URL}
                  className="text-link !no-underline hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </header>

          <div className="mt-12 max-w-2xl space-y-4 font-serif text-ink-secondary leading-relaxed">
            {ABOUT_BODY.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-12 max-w-2xl" aria-labelledby="basin">
            <h2
              id="basin"
              className="font-hero-title text-2xl tracking-tight text-ink"
            >
              Basın notu
            </h2>
            <div className="mt-4 space-y-4 font-serif text-ink-secondary leading-relaxed">
              {ABOUT_PRESS.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-tertiary">
              <Link href="/kitap" className="text-link !no-underline hover:underline">
                Kitap hakkında
              </Link>
              {" · "}
              <Link href="/" className="text-link !no-underline hover:underline">
                Ana sayfa
              </Link>
            </p>
          </section>
        </Container>
      </article>
    </>
  );
}
