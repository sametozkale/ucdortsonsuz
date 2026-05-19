"use client";

import { Check } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import type { BookItem } from "@/lib/book/types";
import { cn } from "@/lib/utils";

interface ReaderTOCProps {
  items: BookItem[];
  currentItemId: string;
  isOnCover: boolean;
  onSelect: (itemId: string) => void;
  onSelectCover: () => void;
  menuOpen?: boolean;
}

const SECTION_ORDER = ["front_matter", "story", "poems", "essays"] as const;

const sectionLabels: Record<string, string> = {
  front_matter: "Ön bölüm",
  story: "Kitabın hikayesi",
  poems: "Şiirler",
  essays: "Denemeler",
};

function isTocMetaItem(item: BookItem): boolean {
  return (
    item.section?.type === "toc" ||
    item.slug === "icindekiler" ||
    item.title === "İçindekiler"
  );
}

export function ReaderTOC({
  items,
  currentItemId,
  isOnCover,
  onSelect,
  onSelectCover,
  menuOpen = false,
}: ReaderTOCProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  const readableItems = useMemo(
    () => items.filter((item) => !isTocMetaItem(item)),
    [items],
  );

  const sections = useMemo(() => {
    const grouped = readableItems.reduce<Record<string, BookItem[]>>((acc, item) => {
      const key = item.section?.type ?? "other";
      if (key === "toc") return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return SECTION_ORDER.map((type) => ({
      type,
      label: sectionLabels[type] ?? type,
      items: grouped[type] ?? [],
    })).filter((s) => s.items.length > 0);
  }, [readableItems]);

  useEffect(() => {
    if (!menuOpen) return;
    const id = requestAnimationFrame(() => {
      activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [currentItemId, isOnCover, menuOpen]);

  function renderTocRow(
    label: string,
    isActive: boolean,
    onClick: () => void,
    options?: { buttonRef?: RefObject<HTMLButtonElement | null> },
  ) {
    return (
      <button
        ref={options?.buttonRef}
        type="button"
        onClick={onClick}
        aria-current={isActive ? "location" : undefined}
        className={cn(
          "reader-toc-row reader-toc-row--simple",
          isActive && "reader-toc-row--active",
        )}
      >
        <span className="reader-toc-label">{label}</span>
        {isActive && (
          <Check className="reader-toc-check" strokeWidth={2} aria-hidden />
        )}
      </button>
    );
  }

  return (
    <nav aria-label="Kitap bölümleri" className="reader-toc-nav">
      <ul className="reader-toc-list reader-toc-list--root">
        <li>
          {renderTocRow("Kapak", isOnCover, onSelectCover, {
            buttonRef: isOnCover ? activeRef : undefined,
          })}
        </li>
      </ul>

      {sections.map((section, sectionIndex) => {
        const isSingleLink = section.items.length === 1;

        if (isSingleLink) {
          const item = section.items[0]!;
          const isActive = item.id === currentItemId;
          return (
            <ul
              key={section.type}
              className={cn(
                "reader-toc-list",
                sectionIndex >= 0 && "reader-toc-list--section",
              )}
            >
              <li>
                {renderTocRow(item.title, isActive, () => onSelect(item.id), {
                  buttonRef: isActive ? activeRef : undefined,
                })}
              </li>
            </ul>
          );
        }

        return (
          <section
            key={section.type}
            className={cn(
              "reader-toc-section",
              sectionIndex >= 0 && "reader-toc-section--spaced",
            )}
          >
            <h3 className="reader-toc-group-label reader-toc-group-label--static">
              {section.label}
            </h3>

            <ul className="reader-toc-list reader-toc-list--names">
              {section.items.map((item) => {
                const isActive = item.id === currentItemId;

                return (
                  <li key={item.id}>
                    {renderTocRow(item.title, isActive, () => onSelect(item.id), {
                      buttonRef: isActive ? activeRef : undefined,
                    })}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
