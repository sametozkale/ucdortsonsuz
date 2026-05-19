import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/marketing/PageIntro";
import { Prose } from "@/components/marketing/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBook, getItemsPublic } from "@/lib/book/queries";
import { MOCK_ITEMS } from "@/lib/book/mock-data";
import {
  AUTHOR_NAME,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
} from "@/lib/constants";
import { bookJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Kitap",
  description: `${BOOK_TITLE}: ${POEM_COUNT} şiir, ${ESSAY_COUNT} deneme. Kitabın hikayesi, yapısı ve içindekiler.`,
  path: "/kitap",
});

export default async function KitapPage() {
  const book = await getBook();
  const items = await getItemsPublic(book.id);
  const story = MOCK_ITEMS.find((i) => i.slug === "kitabin-hikayesi");

  const poems = items.filter((i) => i.kind === "poem");
  const essays = items.filter((i) => i.kind === "essay");

  return (
    <>
      <JsonLd data={bookJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Kitap", path: "/kitap" },
        ])}
      />
      <article className="site-section">
        <Container className="max-w-3xl">
        <PageIntro
          eyebrow={AUTHOR_NAME}
          title={BOOK_TITLE}
          description={`${POEM_COUNT} şiir ve ${ESSAY_COUNT} deneme — yapı, hikaye ve içindekiler.`}
        />

        <section className="mt-12" aria-labelledby="yapi">
          <h2 id="yapi" className="font-display text-xl font-semibold text-ink">
            Kitap yapısı
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-ink-secondary">
            <li>Önsöz ve kitabın hikayesi</li>
            <li>{POEM_COUNT} şiir</li>
            <li>{ESSAY_COUNT} deneme</li>
          </ul>
        </section>

        {story?.body_md && (
          <section className="mt-10" aria-labelledby="hikaye">
            <h2 id="hikaye" className="font-display text-xl font-semibold text-ink">
              Kitabın hikayesi
            </h2>
            <div className="mt-4">
              <Prose>{story.body_md}</Prose>
            </div>
          </section>
        )}

        <section className="mt-12" aria-labelledby="icindekiler">
          <h2 id="icindekiler" className="font-display text-xl font-semibold text-ink">
            İçindekiler (özet)
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow">
                Şiirler
              </h3>
              <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto text-sm">
                {poems.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/siir/${p.slug}`}
                      className="text-link !no-underline hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">
                Denemeler
              </h3>
              <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto text-sm">
                {essays.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/deneme/${e.slug}`}
                      className="text-link !no-underline hover:underline"
                    >
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <p className="mt-12">
          <Link
            href="/satin-al"
            className="btn-primary"
          >
            Kitabı satın al
          </Link>
        </p>
        </Container>
      </article>
    </>
  );
}
