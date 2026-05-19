import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { AUTHOR_NAME, BOOK_TITLE } from "@/lib/constants";

const navigation = [
  { href: "/kitap", label: "Kitap" },
  { href: "/ornekler", label: "Örnekler" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/sss", label: "SSS" },
  { href: "/satin-al", label: "Satın Al" },
];

const legal = [
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/kullanim", label: "Kullanım" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-3">Kitap</p>
            <Logo href="/" size="sm" markClassName="text-ink" />
            <p className="mt-3 text-sm text-ink-secondary">{BOOK_TITLE}</p>
            <p className="mt-1 text-sm text-ink-tertiary">{AUTHOR_NAME}</p>
          </div>

          <div>
            <p className="eyebrow mb-3">Gezinme</p>
            <ul className="space-y-2 text-sm text-ink-secondary">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-link !no-underline hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Yasal</p>
            <ul className="space-y-2 text-sm text-ink-secondary">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-link !no-underline hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Okuma</p>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link href="/oku" className="text-link !no-underline hover:underline">
                  Dijital okuyucu
                </Link>
              </li>
              <li>
                <Link href="/indir" className="text-link !no-underline hover:underline">
                  E-kitap indir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="disclaimer-bar mt-10">
          © {new Date().getFullYear()} {AUTHOR_NAME}. Tüm hakları saklıdır. Örnek
          metinler tanıtım amaçlıdır; tam kitap satın alma veya abonelik ile
          açılır.
        </p>
      </Container>
    </footer>
  );
}
