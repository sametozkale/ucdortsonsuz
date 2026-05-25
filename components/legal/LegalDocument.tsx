import { Prose } from "@/components/marketing/Prose";
import { Container } from "@/components/layout/Container";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/content";
import { cn } from "@/lib/utils";

const legalProseClass = cn(
  "legal-prose",
  "prose-p:my-0 prose-p:mb-5 prose-p:leading-[1.72] prose-p:text-ink-secondary",
  "prose-headings:font-hero-title prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ink",
  "prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl prose-h2:leading-snug",
  "prose-h2:first:mt-0",
  "prose-ul:my-0 prose-ul:mb-6 prose-ul:pl-5",
  "prose-li:my-0 prose-li:mb-3 prose-li:leading-[1.65] prose-li:text-ink-secondary",
  "prose-li:last:mb-0",
  "prose-a:text-ink",
);

export function LegalDocument({
  title,
  markdown,
}: {
  title: string;
  markdown: string;
}) {
  return (
    <article className="site-section legal-document">
      <Container className="legal-document__container">
        <header className="legal-document__header max-w-2xl">
          <h1 className="font-hero-title text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-ink-tertiary">
            Son güncelleme: {LEGAL_LAST_UPDATED}
          </p>
        </header>
        <div className="legal-document__body max-w-2xl">
          <Prose className={legalProseClass}>{markdown}</Prose>
        </div>
      </Container>
    </article>
  );
}
