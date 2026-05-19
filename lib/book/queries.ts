import { BOOK_SLUG } from "@/lib/constants";
import {
  MOCK_BOOK,
  MOCK_ITEMS,
  MOCK_SECTIONS,
} from "@/lib/book/mock-data";
import type {
  Book,
  BookItem,
  BookItemPublic,
  BookSection,
} from "@/lib/book/types";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

async function getSupabaseBook(): Promise<Book | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("slug", BOOK_SLUG)
    .single();

  if (error || !data) return null;
  return data as Book;
}

export async function getBook(): Promise<Book> {
  if (!hasSupabaseConfig()) return MOCK_BOOK;

  const book = await getSupabaseBook();
  return book ?? MOCK_BOOK;
}

export async function getSections(bookId: string): Promise<BookSection[]> {
  if (!hasSupabaseConfig()) {
    return MOCK_SECTIONS.filter((s) => s.book_id === bookId);
  }

  const supabase = await createClient();
  if (!supabase) return MOCK_SECTIONS;

  const { data } = await supabase
    .from("book_sections")
    .select("*")
    .eq("book_id", bookId)
    .order("sort_order");

  return (data as BookSection[]) ?? MOCK_SECTIONS;
}

export async function getItemsPublic(
  bookId: string,
): Promise<BookItemPublic[]> {
  if (!hasSupabaseConfig()) {
    return MOCK_ITEMS.filter((i) => i.book_id === bookId).map(
      toPublicItem,
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return MOCK_ITEMS.map(toPublicItem);
  }

  const { data } = await supabase
    .from("book_items_public")
    .select("*")
    .eq("book_id", bookId)
    .order("sort_order");

  if (!data?.length) {
    return MOCK_ITEMS.map(toPublicItem);
  }

  return data as BookItemPublic[];
}

export async function getItemsForReader(
  bookId: string,
): Promise<BookItem[]> {
  if (!hasSupabaseConfig()) {
    return MOCK_ITEMS.filter((i) => i.book_id === bookId);
  }

  const supabase = await createClient();
  if (!supabase) return MOCK_ITEMS;

  const { data } = await supabase
    .from("book_items")
    .select("*, book_sections(type, title, sort_order)")
    .eq("book_id", bookId)
    .order("sort_order");

  if (!data?.length) return MOCK_ITEMS;

  return data.map((row) => {
    const section = row.book_sections as BookSection | null;
    return {
      ...row,
      section: section ?? undefined,
    } as BookItem;
  });
}

export async function getItemBySlug(
  slug: string,
  kind?: "poem" | "essay",
): Promise<BookItem | null> {
  const book = await getBook();
  const items = await getItemsForReader(book.id);
  return (
    items.find(
      (i) =>
        i.slug === slug && (kind ? i.kind === kind : true),
    ) ?? null
  );
}

export async function getSampleItems(): Promise<BookItemPublic[]> {
  const book = await getBook();
  const items = await getItemsPublic(book.id);
  return items.filter((i) => i.is_sample);
}

export async function getPoemSlugs(): Promise<string[]> {
  const book = await getBook();
  const items = await getItemsPublic(book.id);
  return items.filter((i) => i.kind === "poem").map((i) => i.slug);
}

export async function getEssaySlugs(): Promise<string[]> {
  const book = await getBook();
  const items = await getItemsPublic(book.id);
  return items.filter((i) => i.kind === "essay").map((i) => i.slug);
}

function toPublicItem(item: BookItem): BookItemPublic {
  return {
    id: item.id,
    book_id: item.book_id,
    section_id: item.section_id,
    kind: item.kind,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    sort_order: item.sort_order,
    is_sample: item.is_sample,
    is_public_seo: item.is_public_seo,
    section_title: item.section?.title,
    section_type: item.section?.type,
  };
}
