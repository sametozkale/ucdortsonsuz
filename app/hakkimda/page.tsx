import { Prose } from "@/components/marketing/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  MOCK_AUTHOR_BIO,
  MOCK_PRESS_RELEASE,
} from "@/lib/book/mock-data";
import { AUTHOR_NAME, BOOK_TITLE } from "@/lib/constants";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Hakkımda",
  description: `${AUTHOR_NAME} — ${BOOK_TITLE} kitabının yazarı. Biyografi ve basın notu.`,
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
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div
            className="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-stone-200 text-stone-500"
            role="img"
            aria-label={`${AUTHOR_NAME} fotoğrafı`}
          >
            Fotoğraf
          </div>
          <div>
            <h1 className="font-serif text-4xl font-semibold text-stone-900">
              {AUTHOR_NAME}
            </h1>
            <p className="mt-2 text-stone-600">Yazar · {BOOK_TITLE}</p>
          </div>
        </header>

        <section className="mt-12" aria-labelledby="biyografi">
          <h2 id="biyografi" className="font-serif text-2xl text-stone-900">
            Biyografi
          </h2>
          <div className="mt-4">
            <Prose>{MOCK_AUTHOR_BIO}</Prose>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="basin">
          <h2 id="basin" className="font-serif text-2xl text-stone-900">
            Basın notu
          </h2>
          <div className="mt-4">
            <Prose>{MOCK_PRESS_RELEASE}</Prose>
          </div>
        </section>
      </article>
    </>
  );
}
