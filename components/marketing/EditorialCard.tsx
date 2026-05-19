import Link from "next/link";
import { cn } from "@/lib/utils";

interface EditorialCardProps {
  href: string;
  tag: string;
  title: string;
  description?: string | null;
  meta?: string;
  className?: string;
}

export function EditorialCard({
  href,
  tag,
  title,
  description,
  meta,
  className,
}: EditorialCardProps) {
  return (
    <Link href={href} className={cn("editorial-card group focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none", className)}>
      <div className="editorial-card__media">
        <div className="editorial-card__media-inner font-display text-center" aria-hidden>
          <span className="text-[2.5rem] font-semibold leading-none tracking-tight text-ink/20">
            {title.charAt(0)}
          </span>
        </div>
      </div>
      <div className="editorial-card__meta">
        <p className="editorial-card__tag">{tag}</p>
        <h3 className="editorial-card__title">{title}</h3>
        {description && <p className="editorial-card__desc">{description}</p>}
        {meta && (
          <p className="mt-3 text-sm font-semibold text-ink">{meta}</p>
        )}
      </div>
    </Link>
  );
}
