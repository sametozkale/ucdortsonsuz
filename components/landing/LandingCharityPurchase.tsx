"use client";

import Image from "next/image";
import Link from "next/link";
import { PurchaseLink } from "@/components/marketing/PurchaseLink";
import { useState } from "react";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { Container } from "@/components/layout/Container";
import { CHARITY_COPY, CHARITY_PARTNERS } from "@/lib/landing/charities";
import { cn } from "@/lib/utils";

function CharityLogo({
  name,
  url,
  logoSrc,
  logoWidth = 140,
  logoHeight = 56,
  logoClassName,
}: {
  name: string;
  url: string;
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showImage = logoSrc && !logoFailed;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="landing-charity__logo-link"
      aria-label={`${name} (yeni sekmede açılır)`}
    >
      {showImage ? (
        <Image
          src={logoSrc}
          alt={`${name} logosu`}
          width={logoWidth}
          height={logoHeight}
          className={cn("landing-charity__logo-img", logoClassName)}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="landing-charity__logo-fallback">{name}</span>
      )}
    </a>
  );
}

export function LandingCharityPurchase() {
  return (
    <section
      id="bagis"
      className="landing-charity site-section"
      aria-labelledby="landing-charity-title"
    >
      <Container>
        <LandingReveal>
          <div className="landing-charity__panel">
            <p className="landing-eyebrow">{CHARITY_COPY.eyebrow}</p>
            <h2 id="landing-charity-title" className="landing-section-headline">
              {CHARITY_COPY.title}
            </h2>
            <p className="landing-charity__intro">{CHARITY_COPY.intro}</p>

            <div className="landing-charity__logos" role="list">
              {CHARITY_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className={cn(
                    "landing-charity__logo-slot",
                    partner.id === "tema" && "landing-charity__logo-slot--tema",
                    partner.id === "darussafaka" &&
                      "landing-charity__logo-slot--darussafaka",
                  )}
                  role="listitem"
                >
                  <CharityLogo
                    name={partner.name}
                    url={partner.url}
                    logoSrc={partner.logoSrc}
                    logoWidth={partner.logoWidth}
                    logoHeight={partner.logoHeight}
                    logoClassName={partner.logoClassName}
                  />
                </div>
              ))}
            </div>

            <div className="landing-charity__actions">
              <PurchaseLink className="btn-primary">
                {CHARITY_COPY.ctaBuy}
              </PurchaseLink>
            </div>
          </div>
        </LandingReveal>
      </Container>
    </section>
  );
}
