"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOOK_DOWNLOAD_FORMATS,
  getBookDownloadApiPath,
  getBookDownloadFilename,
} from "@/lib/book/downloads";
import { cn } from "@/lib/utils";

interface ReaderDownloadMenuProps {
  onOpenChange?: (open: boolean) => void;
}

export function ReaderDownloadMenu({ onOpenChange }: ReaderDownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const setOpenTracked = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setOpen((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        onOpenChange?.(value);
        return value;
      });
    },
    [onOpenChange],
  );

  const close = useCallback(() => setOpenTracked(false), [setOpenTracked]);

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
      className="relative"
      onMouseEnter={() => setOpenTracked(true)}
      onMouseLeave={() => setOpenTracked(false)}
    >
      <button
        type="button"
        aria-label="Kitabı indir"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpenTracked((value) => !value)}
        className={cn(
          "reader-corner-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
          open && "bg-surface-muted text-ink",
        )}
      >
        <Download className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="İndirme biçimleri"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="reader-toc-dropdown absolute left-0 top-full z-50 mt-3"
          >
            <nav aria-label="İndirme biçimleri" className="reader-toc-nav reader-toc-scroll">
              <ul className="reader-toc-list reader-toc-list--root">
                {BOOK_DOWNLOAD_FORMATS.map((format) => (
                  <li key={format.id}>
                    <a
                      href={getBookDownloadApiPath(format.id)}
                      download={getBookDownloadFilename(format)}
                      className="reader-toc-row"
                      onClick={close}
                    >
                      <span
                        className="flex h-[1.625rem] w-[1.625rem] items-center justify-center"
                        aria-hidden
                      >
                        <Image
                          src={format.logoSrc}
                          alt=""
                          width={26}
                          height={18}
                          className="h-4 w-auto max-w-[1.625rem] object-contain"
                        />
                      </span>
                      <span className="reader-toc-label">{format.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
