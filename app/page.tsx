import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EditorialCard } from "@/components/marketing/EditorialCard";
import { FilterPills } from "@/components/marketing/FilterPills";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSampleItems } from "@/lib/book/queries";
import {
  AUTHOR_NAME,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
  SITE_NAME,
} from "@/lib/constants";
import { bookJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: `${AUTHOR_NAME}'nin ${POEM_COUNT} şiir ve ${ESSAY_COUNT} denemeden oluşan şiir kitabı. Ücretsiz örnekler ve dijital okuma.`,
  path: "/",
});

export default async function HomePage() {
  const samples = await getSampleItems();
  const poems = samples.filter((i) => i.kind === "poem");
  const essays = samples.filter((i) => i.kind === "essay");
  const gridItems = samples.slice(0, 8);

  return (
    <>
      <JsonLd data={bookJsonLd()} />

      {/* Hero — Curated-style editorial */}
      <section className="site-section site-section--hero border-b border-border">
        <Container>
          <p className="eyebrow">Şiir kitabı · {AUTHOR_NAME}</p>
          <h1 className="text-display mt-4">{BOOK_TITLE}</h1>
          <p className="prose-width mt-6 text-lg text-ink-secondary">
            {POEM_COUNT} şiir ve {ESSAY_COUNT} deneme — sayılar ile sonsuzluk
            arasında. Dijital okuyucuda çevir, ücretsiz örnekleri keşfet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/satin-al" className="btn-primary">
              Kitabı satın al
            </Link>
            <Link href="/ornekler" className="btn-ghost">
              Ücretsiz örnek oku
            </Link>
          </div>

          <div className="mt-14 max-w-md border-t border-border pt-10">
            <p className="text-sm font-medium text-ink">E-posta listesi</p>
            <p className="mt-1 text-sm text-ink-secondary">
              Yeni şiirler ve kitap haberleri — haftalık değil, nadiren.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Grid + filters */}
      <section className="site-section">
        <Container>
          <div className="sticky top-16 z-[100] -mx-[var(--gutter)] border-b border-border bg-bg-alt/95 px-[var(--gutter)] py-4 backdrop-blur-md supports-[backdrop-filter]:bg-bg-alt/90 sm:top-[4.5rem]">
            <FilterPills
              items={[
                { href: "/ornekler", label: "Tümü", active: true },
                { href: "/ornekler?tur=siir", label: `Şiir (${poems.length})` },
                { href: "/ornekler?tur=deneme", label: `Deneme (${essays.length})` },
                { href: "/kitap", label: "Kitap" },
              ]}
            />
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {gridItems.map((item) => {
              const href =
                item.kind === "poem"
                  ? `/siir/${item.slug}`
                  : item.kind === "essay"
                    ? `/deneme/${item.slug}`
                    : "/kitap";
              return (
                <li key={item.id}>
                  <EditorialCard
                    href={href}
                    tag={item.kind === "poem" ? "Şiir" : "Deneme"}
                    title={item.title}
                    description={item.excerpt}
                    meta="Ücretsiz örnek"
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex justify-center">
            <Link href="/ornekler" className="btn-ghost">
              Tüm örnekleri gör
            </Link>
          </div>

          <p className="disclaimer-bar mt-12">
            Örnek metinler tanıtım amaçlıdır. Tam kitap dijital okuyucu ve e-kitap
            erişimi satın alma sonrası açılır. Fiyatlar ve erişim koşulları
            değişebilir.
          </p>
        </Container>
      </section>
    </>
  );
}
