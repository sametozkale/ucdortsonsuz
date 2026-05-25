import { Logo } from "@/components/brand/Logo";
import { NavAnchor } from "@/components/layout/NavAnchor";
import { Container } from "@/components/layout/Container";
import { AUTHOR_NAME, ESSAY_COUNT, POEM_COUNT } from "@/lib/constants";
import {
  FOOTER_EXPLORE_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_READ_LINKS,
  type NavLink,
} from "@/lib/site/navigation";

function FooterLinkList({ items }: { items: NavLink[] }) {
  return (
    <ul className="space-y-2 text-sm text-ink-secondary">
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <NavAnchor
            {...item}
            className="text-link !no-underline hover:underline"
          />
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-bg">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-start">
          <div>
            <Logo href="/" size="sm" variant="producter" markClassName="text-ink" />
            <p className="mt-3 text-sm text-ink-secondary">
              {POEM_COUNT} şiir · {ESSAY_COUNT} deneme
            </p>
            <p className="mt-1 text-sm text-ink-tertiary">{AUTHOR_NAME}</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-tertiary">
                Dijital okuma, ücretsiz örnekler ve e-kitap indirme. Satış gelirinin
                tamamı TEMA ve Darüşşafaka&apos;ya bağışlanır.
              </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:items-stretch">
            <nav aria-label="Gezinme">
              <p className="eyebrow mb-3">Gezinme</p>
              <FooterLinkList items={FOOTER_EXPLORE_LINKS} />
            </nav>

            <div className="flex min-h-full flex-col justify-between gap-10">
              <nav aria-label="Okuma">
                <p className="eyebrow mb-3">Okuma</p>
                <FooterLinkList items={FOOTER_READ_LINKS} />
              </nav>

              <nav aria-label="Yasal">
                <p className="eyebrow mb-3">Yasal</p>
                <FooterLinkList items={FOOTER_LEGAL_LINKS} />
              </nav>
            </div>
          </div>
        </div>

        <p className="disclaimer-bar mt-10">
          © {new Date().getFullYear()} {AUTHOR_NAME}. Tüm hakları saklıdır. Örnek
          metinler tanıtım amaçlıdır; tam kitap satın alma ile dijital okuyucuda ve
          indirme biçimlerinde açılır.
        </p>
      </Container>
    </footer>
  );
}
