import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";

const nav = [
  { href: "/kitap", label: "Kitap" },
  { href: "/ornekler", label: "Örnekler" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/sss", label: "SSS" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-bg/95 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo href="/" size="md" markClassName="text-ink" />

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-8 md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-secondary transition-opacity hover:text-ink hover:opacity-90 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/satin-al" className="btn-primary !min-h-9 !px-4 !text-xs">
            Satın Al
          </Link>
          <Link href="/oku" className="btn-ghost !min-h-9 !px-4 !text-xs">
            Oku
          </Link>
        </nav>

        <nav
          aria-label="Mobil menü"
          className="flex items-center gap-2 md:hidden"
        >
          <Link href="/oku" className="btn-ghost !min-h-9 !px-3 !text-xs">
            Oku
          </Link>
          <Link href="/ornekler" className="btn-primary !min-h-9 !px-3 !text-xs">
            Örnekler
          </Link>
        </nav>
      </Container>
    </header>
  );
}
