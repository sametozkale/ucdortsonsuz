import Link from "next/link";
import { DownloadBrandLogo } from "@/components/icons/brand/DownloadBrandLogo";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { Container } from "@/components/layout/Container";
import { BOOK_PURCHASE_URL } from "@/lib/constants";
import { LANDING_DOWNLOAD_OPTIONS } from "@/lib/landing/downloads";
import { cn } from "@/lib/utils";

function DownloadFormatLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const purchaseHref = BOOK_PURCHASE_URL || null;
  const targetHref = purchaseHref ?? href;
  const external = Boolean(purchaseHref);

  if (external) {
    return (
      <a
        href={targetHref}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={targetHref} className={cn(className)}>
      {children}
    </Link>
  );
}

export function LandingDownloadStrip() {
  return (
    <section
      id="indir"
      className="landing-download site-section"
      aria-labelledby="landing-download-title"
    >
      <Container>
        <LandingReveal>
          <p className="landing-eyebrow">E-kitap</p>
          <h2
            id="landing-download-title"
            className="landing-section-headline"
            aria-describedby="landing-download-desc"
          >
            Okuma deneyimi
          </h2>
          <p id="landing-download-desc" className="landing-download__intro">
            Üç Dört Sonsuz, ekranda okumak için özel bir düzenle hazırlandı — sakin
            tipografi, sayfa çevirme ve kendi ritminizde ilerleme. Tarayıcıda
            okuyun; dilerseniz aşağıdaki biçimlerde cihazınıza indirin.
          </p>
          <ul className="landing-download__list">
            {LANDING_DOWNLOAD_OPTIONS.map(
              ({ id, label, hint, href, logoSrc, logoLabel }) => (
                <li key={id} className="landing-download__item">
                  <DownloadFormatLink href={href} className="landing-download__card group">
                    <span className="landing-download__icon-wrap" aria-hidden>
                      <DownloadBrandLogo src={logoSrc} label={logoLabel} />
                    </span>
                    <span className="landing-download__copy">
                      <span className="landing-download__label">{label}</span>
                      <span className="landing-download__hint">{hint}</span>
                    </span>
                  </DownloadFormatLink>
                </li>
              ),
            )}
          </ul>
        </LandingReveal>
      </Container>
    </section>
  );
}
