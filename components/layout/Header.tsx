import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { HEADER_CTA, HEADER_NAV } from "@/lib/site/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-bg/95 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo href="/" size="md" markClassName="text-ink" />

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-8 md:flex"
        >
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-secondary transition-opacity hover:text-ink hover:opacity-90 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href={HEADER_CTA.href} className="btn-primary !min-h-9 !px-4 !text-xs">
            {HEADER_CTA.label}
          </Link>
        </nav>

        <nav
          aria-label="Mobil menü"
          className="flex items-center gap-2 md:hidden"
        >
          <Link href="/ornekler" className="btn-primary !min-h-9 !px-3 !text-xs">
            Örnekler
          </Link>
        </nav>
      </Container>
    </header>
  );
}
