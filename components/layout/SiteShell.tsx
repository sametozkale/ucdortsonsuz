"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = pathname === "/oku" || pathname?.startsWith("/oku/");
  const isHome = pathname === "/";

  if (isReader) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1500] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-inverse focus:shadow-[var(--shadow-focus)]"
      >
        İçeriğe atla
      </a>
      {!isHome && <Header />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
