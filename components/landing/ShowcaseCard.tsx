import Image from "next/image";
import Link from "next/link";
import type { BookItemPublic } from "@/lib/book/types";
import {
  sampleItemHref,
  sampleItemKindLabel,
} from "@/lib/landing/content";
import { showcaseVisualClass } from "@/lib/landing/visuals";
import { BOOK_COVER_BG_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  item: BookItemPublic;
  index: number;
  useCoverImage?: boolean;
}

export function ShowcaseCard({
  item,
  index,
  useCoverImage = index === 0,
}: ShowcaseCardProps) {
  const href = sampleItemHref(item);
  const visualClass = showcaseVisualClass(index);

  return (
    <li className="min-w-0">
      <Link href={href} className="showcase-card group">
        <div className={cn("showcase-card__media", visualClass)}>
          {useCoverImage ? (
            <Image
              src={BOOK_COVER_BG_URL}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-90 transition-opacity duration-[var(--duration-base)] group-hover:opacity-100"
            />
          ) : null}
          <div className="showcase-card__media-overlay" aria-hidden />
          <span className="showcase-card__tag">{sampleItemKindLabel(item.kind)}</span>
        </div>
        <div className="showcase-card__body">
          <h3 className="showcase-card__title">{item.title}</h3>
          {item.excerpt ? (
            <p className="showcase-card__excerpt">{item.excerpt}</p>
          ) : null}
          <span className="showcase-card__cta">Oku →</span>
        </div>
      </Link>
    </li>
  );
}
