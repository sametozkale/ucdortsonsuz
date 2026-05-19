import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  markClassName?: string;
  showLabel?: boolean;
}

export function Logo({
  href = "/",
  size = "md",
  className,
  markClassName,
  showLabel = false,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} className={cn("text-ink", markClassName)} />
      {showLabel && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          {SITE_NAME}
        </span>
      )}
      <span className="sr-only">{SITE_NAME}</span>
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center gap-2.5 rounded-[var(--radius-xs)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass} aria-label={`${SITE_NAME} — ana sayfa`}>
        {content}
      </Link>
    );
  }

  return <span className={wrapperClass}>{content}</span>;
}
