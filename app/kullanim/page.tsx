import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Kullanım Koşulları",
  description: "ucdortsonsuz.com kullanım koşulları.",
  path: "/kullanim",
});

export default function KullanimPage() {
  return (
    <article className="site-section">
      <Container>
      <h1 className="font-hero-title text-3xl font-semibold text-stone-900">
        Kullanım Koşulları
      </h1>
      <p className="mt-6 leading-relaxed text-stone-700">
        Sitedeki tüm metinler Samet Özkale&apos;ye aittir. İzinsiz çoğaltma,
        dağıtım veya ticari kullanım yasaktır. Dijital erişim kişisel
        kullanım içindir.
      </p>
      <p className="mt-4 leading-relaxed text-stone-700">
        Satın alınan içerikler hesap sahibine özeldir; paylaşım hakkı
        devredilmez.
      </p>
      </Container>
    </article>
  );
}
