"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOOK_DOWNLOAD_FORMATS,
  getBookDownloadApiPath,
  getBookDownloadFilename,
} from "@/lib/book/downloads";
import { cn } from "@/lib/utils";

export function ReaderDownloadMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

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
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="Kitabı indir"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "reader-corner-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:h-11 sm:w-11",
          open && "bg-surface-muted text-ink",
        )}
      >
        <Download className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </button>

      <div
        role="menu"
        aria-label="İndirme biçimleri"
        className={cn(
          "reader-download-dropdown absolute left-0 top-full z-50 mt-2 min-w-[10.5rem] py-1 transition-[opacity,visibility,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        {BOOK_DOWNLOAD_FORMATS.map((format) => (
          <a
            key={format.id}
            role="menuitem"
            href={getBookDownloadApiPath(format.id)}
            download={getBookDownloadFilename(format)}
            className="reader-download-dropdown__item"
            onClick={close}
          >
            <span className="reader-download-dropdown__icon" aria-hidden>
              <Image
                src={format.logoSrc}
                alt=""
                width={36}
                height={20}
                className="h-5 w-auto max-w-[2.25rem] object-contain object-left"
              />
            </span>
            <span className="reader-download-dropdown__label">
              {format.shortLabel}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
