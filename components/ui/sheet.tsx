"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

export function Sheet({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  children,
}: {
  children: React.ReactElement;
}) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;

  const child = React.Children.only(children) as React.ReactElement<
    React.HTMLAttributes<HTMLElement>
  >;
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e);
      ctx.setOpen(true);
    },
    "aria-haspopup": "dialog" as const,
  });
}

export function SheetContent({
  children,
  side = "right",
  title,
  className,
}: {
  children: React.ReactNode;
  side?: "left" | "right";
  title: string;
  className?: string;
}) {
  const ctx = React.useContext(SheetContext);
  if (!ctx?.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-stone-900/40"
        aria-hidden
        onClick={() => ctx.setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed top-0 z-50 flex h-full w-full max-w-sm flex-col bg-stone-50 shadow-xl",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <h2 className="font-hero-title text-lg font-semibold text-stone-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ctx.setOpen(false)}
            className="rounded-full p-2 text-stone-600 hover:bg-stone-200 focus-visible:ring-2 focus-visible:ring-stone-800"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
