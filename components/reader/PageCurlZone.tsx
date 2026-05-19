"use client";

import { cn } from "@/lib/utils";

export type PageCurlCorner =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface PageCurlZoneProps {
  corner: PageCurlCorner;
  disabled?: boolean;
  onActivate: () => void;
}

const cornerMeta: Record<
  PageCurlCorner,
  {
    position: string;
    foldClass: string;
    label: string;
    hintPosition: string;
  }
> = {
  "bottom-left": {
    position: "bottom-0 left-0",
    foldClass: "page-curl-fold--left",
    label: "Önceki sayfa",
    hintPosition: "bottom-3 left-3",
  },
  "bottom-right": {
    position: "bottom-0 right-0",
    foldClass: "page-curl-fold--right",
    label: "Sonraki sayfa",
    hintPosition: "bottom-3 right-3",
  },
  "top-left": {
    position: "top-0 left-0",
    foldClass: "page-curl-fold--top-left",
    label: "Önceki sayfa",
    hintPosition: "top-3 left-3",
  },
  "top-right": {
    position: "top-0 right-0",
    foldClass: "page-curl-fold--top-right",
    label: "Sonraki sayfa",
    hintPosition: "top-3 right-3",
  },
};

export function PageCurlZone({
  corner,
  disabled,
  onActivate,
}: PageCurlZoneProps) {
  const meta = cornerMeta[corner];
  const isLeft = corner.endsWith("left");

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onActivate();
      }}
      aria-label={meta.label}
      className={cn(
        "page-curl-zone group pointer-events-auto absolute z-[1] h-[32%] w-[32%] min-h-[72px] min-w-[72px] touch-manipulation border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
        meta.position,
        disabled && "pointer-events-none opacity-25",
      )}
    >
      <span
        className={cn(
          "page-curl-fold pointer-events-none absolute block h-[88%] w-[88%]",
          meta.foldClass,
          isLeft ? "left-0" : "right-0",
          corner.startsWith("top") ? "top-0" : "bottom-0",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "pointer-events-none absolute text-[10px] font-medium uppercase tracking-wider text-stone-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          meta.hintPosition,
        )}
      >
        {isLeft ? "Geri" : "İleri"}
      </span>
    </button>
  );
}
