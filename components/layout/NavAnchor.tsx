import Link from "next/link";
import type { NavLink } from "@/lib/site/navigation";
import { cn } from "@/lib/utils";

export function NavAnchor({
  href,
  label,
  external,
  className,
}: NavLink & { className?: string }) {
  const isExternal = external ?? href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(className)}>
      {label}
    </Link>
  );
}
