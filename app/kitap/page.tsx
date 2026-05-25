import Link from "next/link";
import { PurchaseLink } from "@/components/marketing/PurchaseLink";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/marketing/PageIntro";
import { Prose } from "@/components/marketing/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBook, getItemsPublic } from "@/lib/book/queries";
import { MOCK_FAQ, MOCK_ITEMS } from "@/lib/book/mock-data";
import {
  AUTHOR_NAME,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
} from "@/lib/constants";
import { bookJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Kitap",
  description: `${BOOK_TITLE}: ${POEM_COUNT} şiir, ${ESSAY_COUNT} deneme. Kitabın hikayesi ve içindekiler.`,
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
      <JsonLd data={faqJsonLd(MOCK_FAQ)} />
      <article className="site-section">
        <Container>
        <PageIntro
          eyebrow={AUTHOR_NAME}
          title={BOOK_TITLE}
          description={`${POEM_COUNT} şiir ve ${ESSAY_COUNT} deneme — hikaye ve içindekiler.`}
        />

        {story?.body_md && (
          <section className="mt-10" aria-labelledby="hikaye">
            <h2 id="hikaye" className="font-hero-title text-xl font-semibold text-ink">
              Kitabın hikayesi
            </h2>
            <div className="mt-4">
              <Prose>{story.body_md}</Prose>
            </div>
          </section>
        )}

        <section className="mt-12" aria-labelledby="icindekiler">
          <h2 id="icindekiler" className="font-hero-title text-xl font-semibold text-ink">
            İçindekiler
          </h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Kitaptaki tüm şiir ve denemeler ({poems.length} şiir, {essays.length}{" "}
            deneme).
          </p>
          <div className="mt-6 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow">
                Şiirler ({poems.length})
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
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
                Denemeler ({essays.length})
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
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
          <PurchaseLink className="btn-primary">Kitabı satın al</PurchaseLink>
        </p>
        </Container>
      </article>
    </>
  );
}
