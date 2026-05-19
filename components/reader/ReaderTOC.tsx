"use client";

import type { BookItem } from "@/lib/book/types";
import { cn } from "@/lib/utils";

interface ReaderTOCProps {
  items: BookItem[];
  currentItemId: string;
  onSelect: (itemId: string) => void;
}

const sectionLabels: Record<string, string> = {
  front_matter: "Ön bölüm",
  story: "Kitabın hikayesi",
  toc: "İçindekiler",
  poems: "Şiirler",
  essays: "Denemeler",
};

export function ReaderTOC({
  items,
  currentItemId,
  onSelect,
}: ReaderTOCProps) {
  const grouped = items.reduce<Record<string, BookItem[]>>((acc, item) => {
    const key = item.section?.type ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const order = ["front_matter", "story", "toc", "poems", "essays"];

  return (
    <nav aria-label="İçindekiler" className="space-y-4">
      {order.map((sectionType) => {
        const sectionItems = grouped[sectionType];
        if (!sectionItems?.length) return null;
        return (
          <div key={sectionType}>
            <h3 className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              {sectionLabels[sectionType] ?? sectionType}
            </h3>
            <ul className="space-y-1">
              {sectionItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400",
                      item.id === currentItemId
                        ? "bg-stone-100 font-medium text-stone-900"
                        : "text-stone-600 hover:bg-stone-50",
                    )}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
