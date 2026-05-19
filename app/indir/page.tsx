import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getBook } from "@/lib/book/queries";
import { hasBookEntitlement, isReaderDevBypass } from "@/lib/auth/entitlement";
import { BOOK_TITLE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "İndir",
  description: `${BOOK_TITLE} e-kitap indirme — PDF, EPUB, Kindle`,
  path: "/indir",
  noIndex: true,
});

const formats = [
  { id: "pdf", label: "PDF", ext: ".pdf" },
  { id: "epub", label: "EPUB", ext: ".epub" },
  { id: "kindle", label: "Kindle (MOBI)", ext: ".mobi" },
];

export default async function IndirPage() {
  const book = await getBook();
  const entitled =
    (await hasBookEntitlement(book.id)) || isReaderDevBypass();

  if (!entitled) {
    return (
      <div className="site-section">
        <Container className="py-12 text-center sm:py-16">
          <h1 className="font-serif text-2xl text-stone-900">Erişim gerekli</h1>
          <p className="mt-4 text-stone-600">
            İndirme bağlantıları satın alma sonrası açılır.
          </p>
          <Link href="/satin-al" className="mt-6 inline-block underline">
            Satın al →
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="site-section">
      <Container>
      <h1 className="font-serif text-3xl font-semibold text-stone-900">
        E-kitap indir
      </h1>
      <p className="mt-4 text-stone-600">
        Dosyalar Supabase Storage üzerinden sunulacak (Faz 2). Aşağıdaki
        bağlantılar yapılandırma sonrası aktif olur.
      </p>
      <ul className="mt-8 space-y-4">
        {formats.map((f) => (
          <li
            key={f.id}
            className="flex items-center justify-between rounded-lg border border-stone-200 bg-surface px-5 py-4"
          >
            <span className="font-medium text-stone-900">{f.label}</span>
            <span className="text-sm text-stone-500">Yakında</span>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/oku" className="text-stone-800 underline">
          ← Okuyucuya dön
        </Link>
      </p>
      </Container>
    </div>
  );
}
