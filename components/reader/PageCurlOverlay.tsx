"use client";

import {
  PageCurlZone,
  type PageCurlCorner,
} from "@/components/reader/PageCurlZone";

interface PageCurlOverlayProps {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}

const corners: PageCurlCorner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

export function PageCurlOverlay({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  disabled = false,
}: PageCurlOverlayProps) {
  return (
    <div
      className="page-curl-overlay pointer-events-none absolute inset-0 z-[650]"
      aria-hidden={disabled}
    >
      {corners.map((corner) => {
        const isPrev = corner.endsWith("left");
        return (
          <PageCurlZone
            key={corner}
            corner={corner}
            disabled={disabled || (isPrev ? !canGoPrev : !canGoNext)}
            onActivate={isPrev ? onPrev : onNext}
          />
        );
      })}
    </div>
  );
}
