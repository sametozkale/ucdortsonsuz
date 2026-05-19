import { BOOKMARK_STORAGE_KEY } from "@/lib/constants";
import type { Bookmark } from "@/lib/book/types";
import type { ReaderPage } from "@/lib/book/types";
import { findPageIndexByItemId } from "@/lib/reader/pagination";

export function getBookmarkKey(bookId: string): string {
  return `${BOOKMARK_STORAGE_KEY}:${bookId}`;
}

export function getReaderSessionKey(bookId: string): string {
  return `${BOOKMARK_STORAGE_KEY}:reader-session:${bookId}`;
}

/** Bu sekmede okuyucu daha önce açıldıysa false; ilk açılışta true döner ve oturumu işaretler. */
export function markReaderSessionStarted(bookId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = getReaderSessionKey(bookId);
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, "1");
  return true;
}

export function loadBookmark(bookId: string): Bookmark | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getBookmarkKey(bookId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Bookmark;
    if (!parsed?.itemId || typeof parsed.pageIndex !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveBookmark(bookmark: Bookmark): void {
  if (typeof window === "undefined") {
    throw new Error("Tarayıcı depolaması kullanılamıyor");
  }
  try {
    localStorage.setItem(
      getBookmarkKey(bookmark.bookId),
      JSON.stringify(bookmark),
    );
  } catch {
    throw new Error("Ayraç kaydedilemedi — depolama dolu veya engelli olabilir");
  }
}

export function clearBookmark(bookId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getBookmarkKey(bookId));
}

export function resolveBookmarkPageIndex(
  pages: ReaderPage[],
  bookmark: Bookmark,
): number {
  if (typeof bookmark.globalPageIndex === "number") {
    const at = pages[bookmark.globalPageIndex];
    if (
      at &&
      at.itemId === bookmark.itemId &&
      at.pageIndex === bookmark.pageIndex
    ) {
      return bookmark.globalPageIndex;
    }
  }
  return findPageIndexByItemId(
    pages,
    bookmark.itemId,
    bookmark.pageIndex,
  );
}
