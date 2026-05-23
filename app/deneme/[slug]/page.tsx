import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SampleContentFooter } from "@/components/layout/SampleContentFooter";
import { Prose } from "@/components/marketing/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { getItemBySlug, getEssaySlugs } from "@/lib/book/queries";
import { AUTHOR_NAME, BOOK_TITLE } from "@/lib/constants";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getEssaySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getItemBySlug(slug, "essay");
  if (!item) return {};
  return pageMetadata({
    title: item.title,
    description:
      item.excerpt ??
      `${item.title} — ${BOOK_TITLE} kitabından bir deneme, ${AUTHOR_NAME}.`,
    path: `/deneme/${slug}`,
  });
}

export default async function DenemePage({ params }: Props) {
  const { slug } = await params;
  const item = await getItemBySlug(slug, "essay");
  if (!item || item.kind !== "essay") notFound();

  const path = `/deneme/${slug}`;
  const showFullText = item.is_sample;

  return (
    <>
      <JsonLd data={creativeWorkJsonLd(item, path)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Kitap", path: "/kitap" },
          { name: item.title, path },
        ])}
      />
      <article className="site-section">
        <Container>
        <header>
          <p className="text-sm text-stone-500">
            <Link href="/kitap" className="hover:underline">
              {BOOK_TITLE}
            </Link>
            {" · "}
            <Link href="/hakkimda" className="hover:underline">
              {AUTHOR_NAME}
            </Link>
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-stone-900">
            {item.title}
          </h1>
        </header>

        <section className="mt-8 rounded-lg bg-stone-100 p-6" aria-label="Özet">
          <h2 className="sr-only">Metin özeti</h2>
          <p className="leading-relaxed text-stone-800">{item.excerpt}</p>
          <p className="mt-4 text-sm text-stone-600">
            Bu deneme, {AUTHOR_NAME}&apos;nin {BOOK_TITLE} adlı kitabının bir
            bölümüdür.
          </p>
        </section>

        {showFullText && item.body_md ? (
          <section className="mt-10" aria-label="Tam metin">
            <h2 className="font-serif text-xl text-stone-900">Tam metin</h2>
            <div className="mt-4">
              <Prose>{item.body_md}</Prose>
            </div>
          </section>
        ) : (
          <p className="mt-10">
            <Link
              href="/satin-al"
              className="font-medium text-stone-800 underline"
            >
              Kitabın tamamını okumak için satın alın →
            </Link>
          </p>
        )}

        <SampleContentFooter />
        </Container>
      </article>
    </>
  );
}
