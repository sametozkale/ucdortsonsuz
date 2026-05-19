import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { MOCK_FAQ } from "@/lib/book/mock-data";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Sık Sorulan Sorular",
  description:
    "Üç Dört Sonsuz kitabı hakkında sık sorulan sorular: satın alma, okuma, indirme.",
  path: "/sss",
});

export default function SssPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(MOCK_FAQ)} />
      <div className="site-section">
        <Container>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">
          Sık sorulan sorular
        </h1>
        <dl className="mt-10 space-y-8">
          {MOCK_FAQ.map((faq) => (
            <div key={faq.question}>
              <dt className="font-serif text-lg font-medium text-stone-900">
                {faq.question}
              </dt>
              <dd className="mt-2 leading-relaxed text-stone-700">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
        </Container>
      </div>
    </>
  );
}
