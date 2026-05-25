import { AUTHOR_NAME, BOOK_TITLE } from "@/lib/constants";
import type { BookItem } from "@/lib/book/types";

export function creativeWorkMetaDescription(
  item: Pick<BookItem, "title" | "excerpt" | "kind" | "is_sample">,
): string {
  const kindLabel = item.kind === "poem" ? "şiir" : "deneme";
  const excerpt = item.excerpt?.trim();

  if (item.is_sample) {
    return excerpt
      ? `${item.title} — ${BOOK_TITLE} kitabından ücretsiz ${kindLabel} (tam metin). ${excerpt}`
      : `${item.title} — ${BOOK_TITLE} kitabından ücretsiz ${kindLabel}, tam metin olarak okuyun. ${AUTHOR_NAME}.`;
  }

  return excerpt
    ? `${item.title} — ${BOOK_TITLE} kitabından bir ${kindLabel}. ${excerpt} Tam metin satın alma sonrası dijital okuyucuda.`
    : `${item.title} — ${AUTHOR_NAME}'nin ${BOOK_TITLE} adlı kitabından bir ${kindLabel}. Özet ve satın alma bilgisi.`;
}
