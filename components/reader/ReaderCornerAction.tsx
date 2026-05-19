"use client";

import { cn } from "@/lib/utils";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const cornerClass: Record<Corner, string> = {
  "top-left": "left-4 top-4 sm:left-6 sm:top-6",
  "top-right": "right-4 top-4 sm:right-6 sm:top-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
};

interface ReaderCornerActionProps {
  corner: Corner;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ReaderCornerAction({
  corner,
  label,
  children,
  onClick,
  className,
  disabled,
}: ReaderCornerActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "reader-corner-btn absolute z-[60] flex h-10 w-10 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
        cornerClass[corner],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ReaderCornerMeta({
  corner,
  children,
  className,
}: {
  corner: "bottom-left" | "bottom-right";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-40 max-w-[40vw] text-xs text-ink-tertiary sm:text-sm",
        corner === "bottom-left"
          ? "bottom-5 left-16 sm:bottom-7 sm:left-20"
          : "bottom-5 right-16 text-right sm:bottom-7 sm:right-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
