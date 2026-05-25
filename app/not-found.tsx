import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Sayfa bulunamadı",
  description: "Aradığınız sayfa bulunamadı.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <article className="site-section">
      <Container className="py-16 text-center">
        <h1 className="font-hero-title text-3xl font-semibold text-ink">
          Sayfa bulunamadı
        </h1>
        <p className="mt-4 text-ink-secondary">
          Bu adreste bir sayfa yok. Ana sayfadan veya kitap bölümünden devam
          edebilirsiniz.
        </p>
        <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/" className="text-link !no-underline hover:underline">
            {SITE_NAME} — ana sayfa
          </Link>
          <Link
            href="/kitap"
            className="text-link !no-underline hover:underline"
          >
            Kitap
          </Link>
        </p>
      </Container>
    </article>
  );
}
