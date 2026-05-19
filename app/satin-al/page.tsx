import Link from "next/link";
import { BOOK_TITLE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Satın Al",
  description: `${BOOK_TITLE} dijital kitabını satın alın. Okuma ve e-kitap indirme erişimi.`,
  path: "/satin-al",
});

export default async function SatinAlPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-serif text-4xl font-semibold text-stone-900">
        {BOOK_TITLE}
      </h1>
      <p className="mt-4 text-lg text-stone-700">
        Dijital kitap: web okuyucu, PDF, EPUB ve Kindle uyumlu dosyalar.
      </p>

      <div className="mt-10 rounded-lg border border-stone-200 bg-surface p-8">
        <p className="text-2xl font-semibold text-stone-900">Yakında</p>
        <p className="mt-2 text-stone-600">
          Ödeme altyapısı (Stripe veya iyzico) hazırlanıyor. Geliştirme
          ortamında okuyucu için{" "}
          <code className="rounded bg-stone-200 px-1 text-sm">
            READER_DEV_BYPASS=true
          </code>{" "}
          kullanılabilir.
        </p>
        <ul className="mt-6 list-inside list-disc space-y-2 text-stone-700">
          <li>Sayfa çevirmeli dijital okuma</li>
          <li>İçindekilerden atlama ve ayraç</li>
          <li>PDF, EPUB, Kindle indirme</li>
        </ul>
        <Link
          href={params.redirect ?? "/oku"}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-stone-800 px-5 text-sm font-medium text-stone-50 hover:bg-stone-700"
        >
          Okuyucuya git (geliştirme)
        </Link>
      </div>

      <p className="mt-8 text-sm text-stone-600">
        <Link href="/sss" className="underline">
          SSS
        </Link>
        {" · "}
        <a href="mailto:info@ucdortsonsuz.com" className="underline">
          info@ucdortsonsuz.com
        </a>
      </p>
    </div>
  );
}
