import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EditorialCard } from "@/components/marketing/EditorialCard";
import { FilterPills } from "@/components/marketing/FilterPills";
import { getSampleItems } from "@/lib/book/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Örnekler",
  description:
    "Üç Dört Sonsuz kitabından ücretsiz şiir ve deneme örnekleri. Tarzı keşfedin.",
  path: "/ornekler",
});

export default async function OrneklerPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string }>;
}) {
  const { tur } = await searchParams;
  const samples = await getSampleItems();
  const filtered =
    tur === "siir"
      ? samples.filter((i) => i.kind === "poem")
      : tur === "deneme"
        ? samples.filter((i) => i.kind === "essay")
        : samples;

  return (
    <div className="site-section">
      <Container>
        <p className="eyebrow">Ücretsiz okuma</p>
        <h1 className="text-display mt-3 max-w-[20ch]">Örnek metinler</h1>
        <p className="prose-width mt-4 text-ink-secondary">
          Kitabın sesini tanımak için seçilmiş şiir ve denemeleri tam metin
          okuyabilirsiniz.
        </p>

        <div className="mt-8">
          <FilterPills
            items={[
              { href: "/ornekler", label: "Tümü", active: !tur },
              { href: "/ornekler?tur=siir", label: "Şiir", active: tur === "siir" },
              {
                href: "/ornekler?tur=deneme",
                label: "Deneme",
                active: tur === "deneme",
              },
            ]}
          />
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const href =
              item.kind === "poem"
                ? `/siir/${item.slug}`
                : `/deneme/${item.slug}`;
            return (
              <li key={item.id}>
                <EditorialCard
                  href={href}
                  tag={item.kind === "poem" ? "Şiir" : "Deneme"}
                  title={item.title}
                  description={item.excerpt}
                  meta="Tam metin"
                />
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="mt-10 text-sm text-ink-secondary">
            Bu filtrede örnek bulunamadı.{" "}
            <Link href="/ornekler" className="text-link">
              Tümünü gör
            </Link>
          </p>
        )}

        <p className="disclaimer-bar mt-12">
          Örnekler kitabın tamamını temsil etmez. Tüm içerik için{" "}
          <Link href="/satin-al" className="text-link">
            satın alma
          </Link>{" "}
          sayfasını ziyaret edin.
        </p>
      </Container>
    </div>
  );
}
