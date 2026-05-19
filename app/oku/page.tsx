import { Container } from "@/components/layout/Container";
import { BookReader } from "@/components/reader/BookReader";
import { getBook, getItemsForReader } from "@/lib/book/queries";
import { hasBookEntitlement, isReaderDevBypass } from "@/lib/auth/entitlement";
import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Oku",
  description: "Üç Dört Sonsuz — dijital okuyucu",
  path: "/oku",
  noIndex: true,
});

export default async function OkuPage() {
  const book = await getBook();
  const entitled = await hasBookEntitlement(book.id);

  if (!entitled && !isReaderDevBypass()) {
    return (
      <div className="site-section">
        <Container className="py-12 text-center sm:py-16">
        <h1 className="font-serif text-2xl text-stone-900">Erişim gerekli</h1>
        <p className="mt-4 text-stone-600">
          Bu bölüm yalnızca kitabı satın alan okurlara açıktır.
        </p>
        <Link
          href="/satin-al?redirect=/oku"
          className="mt-6 inline-block font-medium text-stone-800 underline"
        >
          Satın al →
        </Link>
        </Container>
      </div>
    );
  }

  const items = await getItemsForReader(book.id);

  return <BookReader book={book} items={items} />;
}
