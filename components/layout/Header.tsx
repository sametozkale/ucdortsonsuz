import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { NavAnchor } from "@/components/layout/NavAnchor";
import { Container } from "@/components/layout/Container";
import { PURCHASE_CTA, HEADER_NAV } from "@/lib/site/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-bg/95 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo href="/" variant="title" />

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-3 md:flex"
        >
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              {item.label}
            </Link>
          ))}
          <NavAnchor
            {...PURCHASE_CTA}
            className="btn-primary !min-h-9 !px-4 !text-xs"
          />
        </nav>

        <nav
          aria-label="Mobil menü"
          className="flex items-center gap-2 md:hidden"
        >
          <NavAnchor
            {...PURCHASE_CTA}
            className="btn-primary !min-h-9 !px-3 !text-xs"
          />
        </nav>
      </Container>
    </header>
  );
}
