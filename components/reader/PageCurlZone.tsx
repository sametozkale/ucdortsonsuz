"use client";

import { cn } from "@/lib/utils";

interface PageCurlZoneProps {
  side: "left" | "right";
  disabled?: boolean;
  onActivate: () => void;
}

export function PageCurlZone({
  side,
  disabled,
  onActivate,
}: PageCurlZoneProps) {
  const isLeft = side === "left";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onActivate}
      aria-label={isLeft ? "Önceki sayfa" : "Sonraki sayfa"}
      className={cn(
        "page-curl-zone group absolute bottom-0 z-30 h-[34%] w-[34%] min-h-[80px] min-w-[80px] border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
        isLeft ? "left-0" : "right-0",
        disabled && "pointer-events-none opacity-25",
      )}
    >
      <span
        className={cn(
          "page-curl-fold pointer-events-none absolute bottom-0 block h-[88%] w-[88%]",
          isLeft ? "left-0 page-curl-fold--left" : "right-0 page-curl-fold--right",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-3 text-[10px] font-medium uppercase tracking-wider text-stone-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          isLeft ? "left-3" : "right-3",
        )}
      >
        {isLeft ? "Geri" : "İleri"}
      </span>
    </button>
  );
}
