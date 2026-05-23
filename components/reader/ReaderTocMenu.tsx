"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ListTree, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ReaderTOC } from "@/components/reader/ReaderTOC";
import { ESSAY_COUNT, POEM_COUNT } from "@/lib/constants";
import type { BookItem } from "@/lib/book/types";
import { cn } from "@/lib/utils";

interface ReaderTocMenuProps {
  items: BookItem[];
  currentItemId: string;
  isOnCover: boolean;
  sectionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (itemId: string) => void;
  onSelectCover: () => void;
}

export function ReaderTocMenu({
  items,
  currentItemId,
  isOnCover,
  sectionTitle,
  open,
  onOpenChange,
  onSelect,
  onSelectCover,
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

  const summary = useMemo(
    () => `${POEM_COUNT} şiir · ${ESSAY_COUNT} deneme`,
    [],
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
      <div className="flex max-w-[min(52vw,20rem)] items-center gap-3">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label="İçindekiler"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "reader-corner-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
            open && "bg-surface-muted text-ink",
          )}
        >
          <ListTree className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>

        {!open && (
          <span className="pointer-events-none min-w-0 truncate text-xs text-reader-body sm:text-sm">
            {sectionTitle}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="İçindekiler"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="reader-toc-dropdown absolute bottom-full left-0 z-50 mb-3"
          >
            <header className="reader-toc-dropdown-header">
              <button
                type="button"
                onClick={close}
                className="reader-toc-close flex h-7 w-7 items-center justify-center rounded-full text-reader-body transition-colors hover:bg-bg-alt hover:text-reader-title focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
                aria-label="Menüyü kapat"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <div className="min-w-0">
                <h2 className="font-sans text-sm font-medium text-reader-title">
                  İçindekiler
                </h2>
                <p className="mt-0.5 text-[11px] text-reader-body">{summary}</p>
              </div>
            </header>
            <div className="reader-toc-scroll">
              <ReaderTOC
                items={items}
                currentItemId={currentItemId}
                isOnCover={isOnCover}
                onSelect={handleSelect}
                onSelectCover={() => {
                  onSelectCover();
                  close();
                }}
                menuOpen={open}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
