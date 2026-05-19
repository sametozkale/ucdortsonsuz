"use client";

import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { ReaderTOC } from "@/components/reader/ReaderTOC";
import type { BookItem } from "@/lib/book/types";
import { cn } from "@/lib/utils";

interface ReaderTocMenuProps {
  items: BookItem[];
  currentItemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (itemId: string) => void;
}

export function ReaderTocMenu({
  items,
  currentItemId,
  open,
  onOpenChange,
  onSelect,
}: ReaderTocMenuProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleSelect = useCallback(
    (itemId: string) => {
      onSelect(itemId);
      close();
    },
    [onSelect, close],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, close]);

  return (
    <div
      ref={wrapRef}
      className="absolute bottom-4 left-4 z-50 sm:bottom-6 sm:left-6"
    >
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label="İçindekiler"
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "reader-corner-btn flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-200/50 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] sm:h-11 sm:w-11",
          open && "bg-stone-200/60 text-stone-700",
        )}
      >
        <List className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="İçindekiler"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 z-50 mb-3 w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-2xl border border-stone-200/90 bg-white/98 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <h2 className="font-serif text-sm font-semibold text-stone-900">
                İçindekiler
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                aria-label="Menüyü kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[min(52vh,380px)] overflow-y-auto overscroll-contain px-3 py-3">
              <ReaderTOC
                items={items}
                currentItemId={currentItemId}
                onSelect={handleSelect}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
