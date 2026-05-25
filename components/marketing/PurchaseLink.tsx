import Link from "next/link";
import { BOOK_PURCHASE_FALLBACK_HREF, BOOK_PURCHASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PurchaseLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

/** Ödeme / checkout URL’si — `NEXT_PUBLIC_BOOK_PURCHASE_URL` */
export function PurchaseLink({
  className,
  children = "Satın al",
}: PurchaseLinkProps) {
  const href = BOOK_PURCHASE_URL ?? BOOK_PURCHASE_FALLBACK_HREF;
  const external = Boolean(BOOK_PURCHASE_URL);

  if (external) {
    return (
      <a
        href={href}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(className)}>
      {children}
    </Link>
  );
}
