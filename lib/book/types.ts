export type BookSectionType =
  | "front_matter"
  | "toc"
  | "story"
  | "poems"
  | "essays";

export type BookItemKind = "poem" | "essay" | "page";

export interface Book {
  id: string;
  title: string;
  author_name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
}

export interface BookSection {
  id: string;
  book_id: string;
  type: BookSectionType;
  title: string;
  sort_order: number;
}

export interface BookItem {
  id: string;
  book_id: string;
  section_id: string;
  kind: BookItemKind;
  title: string;
  slug: string;
  excerpt: string | null;
  body_md: string | null;
  sort_order: number;
  is_sample: boolean;
  is_public_seo: boolean;
  page_breaks: number[] | null;
  section?: BookSection;
}

export interface BookItemPublic {
  id: string;
  book_id: string;
  section_id: string;
  kind: BookItemKind;
  title: string;
  slug: string;
  excerpt: string | null;
  sort_order: number;
  is_sample: boolean;
  is_public_seo: boolean;
  section_title?: string;
  section_type?: BookSectionType;
}

export interface TocPageEntry {
  title: string;
  itemId: string;
}

export interface TocPageContent {
  showFullHeader: boolean;
  frontMatter: TocPageEntry[];
  showPoemsHeading: boolean;
  poems: TocPageEntry[];
  showEssaysHeading: boolean;
  essays: TocPageEntry[];
}

export interface ReaderPage {
  itemId: string;
  itemTitle: string;
  itemKind: BookItemKind;
  itemSlug: string;
  sectionTitle: string;
  sectionType: BookSectionType;
  pageIndex: number;
  totalPagesInItem: number;
  globalPageIndex: number;
  content: string;
  /** Kitap kapağı sayfası (önsözden önce) */
  isCover?: boolean;
  /** İçindekiler sayfası dilimi (çok sayfalı TOC) */
  tocSlice?: TocPageContent;
}

export interface Bookmark {
  bookId: string;
  itemId: string;
  pageIndex: number;
  /** Okuyucudaki global sayfa sırası (pagination sonrası) */
  globalPageIndex?: number;
  updatedAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
