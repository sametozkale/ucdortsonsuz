import { LandingName } from "@/components/landing/LandingName";
import { LandingAuthor } from "@/components/landing/LandingAuthor";
import { LandingClosingCta } from "@/components/landing/LandingClosingCta";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingDownloadStrip } from "@/components/landing/LandingDownloadStrip";
import { LandingCharityPurchase } from "@/components/landing/LandingCharityPurchase";
import { ShowcaseGrid } from "@/components/landing/ShowcaseGrid";
import {
  LANDING_NAME_PARAGRAPH,
  LANDING_WELCOME_PARAGRAPH,
} from "@/lib/landing/landing-name";
import { JsonLd } from "@/components/seo/JsonLd";
import { MOCK_AUTHOR_BOOK_QUOTE } from "@/lib/book/mock-data";
import { buildShowcaseSlides } from "@/lib/landing/showcase-excerpts";
import { getSampleItems } from "@/lib/book/queries";
import {
  AUTHOR_NAME,
  ESSAY_COUNT,
  POEM_COUNT,
  SITE_NAME,
} from "@/lib/constants";
import { bookJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: `${AUTHOR_NAME}'nin ${POEM_COUNT} şiir ve ${ESSAY_COUNT} denemeden oluşan şiir kitabı. Ücretsiz örnekler ve dijital okuma.`,
  path: "/",
});

export default async function HomePage() {
  const samples = await getSampleItems();
  const showcaseSlides = buildShowcaseSlides(samples);

  return (
    <>
      <JsonLd data={bookJsonLd()} />
      <LandingHero />
      <LandingName
        text={LANDING_WELCOME_PARAGRAPH}
        ariaLabel="Okura karşılama"
        variant="hero-follow"
      />
      <LandingAuthor quote={MOCK_AUTHOR_BOOK_QUOTE} />
      <ShowcaseGrid slides={showcaseSlides} />
      <LandingCharityPurchase />
      <LandingDownloadStrip />
      <LandingName
        text={LANDING_NAME_PARAGRAPH}
        ariaLabel="Kitaptan alıntı"
        variant="pre-footer"
      />
      <LandingClosingCta />
    </>
  );
}
