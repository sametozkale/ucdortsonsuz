import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FilterPillItem {
  href: string;
  label: string;
  active?: boolean;
}

export function FilterPills({ items }: { items: FilterPillItem[] }) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filtreler">
      {items.map((item) => (
        <Link
          key={item.href + item.label}
          href={item.href}
          className={cn(
            "filter-pill focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
            item.active && "filter-pill--active",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
