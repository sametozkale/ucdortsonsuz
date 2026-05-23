import type {
  Book,
  BookItem,
  ReaderPage,
  TocPageContent,
} from "@/lib/book/types";
import { paginateTocItem } from "@/lib/reader/toc-pagination";

interface PaginatedSlice {
  content: string;
  tocSlice?: TocPageContent;
}

/**
 * Okuyucu şiir — flex-1 gövde (~460px), pre-line, leading 1.32 (~21px/mısra).
 * Bütçe gerçek mısra + kıtalar arası boşluk (\n\n) ile ölçülür.
 */
const POEM_LINES_FIRST_PAGE = 16;
const POEM_LINES_FIRST_PAGE_COMPACT_HEADER = 17;
const POEM_LINES_CONTINUATION_PAGE = 20;
/** İlk yaprakta daha sıkı bütçe gereken şiirler */
const POEM_LINES_FIRST_PAGE_BY_SLUG: Record<string, number> = {
  "bizim-kuslar-mezarliklarda-durmazlar": 14,
};
/** Devam yapraklarında daha sıkı bütçe */
const POEM_LINES_CONTINUATION_PAGE_BY_SLUG: Record<string, number> = {
  "yine-gunduz": 18,
  /** 3 kıta × 4 mısra + 2 aralık */
  "kara-para": 20,
};
/** Kıtalar \n\n ile ayrılmış — sayfalama kıta bütçesiyle (mısra sayısı) */
const POEM_STANZA_PAGINATION_SLUGS = new Set<string>(["kara-para"]);
/** Aynı yaprakta üst üste en fazla kaç kıta (uzun mısra sarmaları için) */
const POEM_STANZA_MAX_PER_PAGE_BY_SLUG: Record<
  string,
  { first: number; continuation: number }
> = {
  "kara-para": { first: 2, continuation: 3 },
};
/** Kıtalar arası dikey boşluk ≈ bir mısra */
const STANZA_GAP_LINE_COST = 1;
const PROSE_CHARS_FIRST_PAGE = 400;
const PROSE_CHARS_CONTINUATION_PAGE = 500;
/**
 * Deneme — flex-1 gövde (~415×460px). Render: 0.975rem × leading 1.78 ≈ 28px/satır.
 * 17 satır ≈ 472px → taşma; güvenli üst sınır 16 satır (≈448px).
 */
const ESSAY_FONT_SIZE_PX = 15.6;
const ESSAY_LINE_HEIGHT_RATIO = 1.78;
const ESSAY_LINE_HEIGHT_PX = Math.ceil(
  ESSAY_FONT_SIZE_PX * ESSAY_LINE_HEIGHT_RATIO,
);
const ESSAY_BODY_HEIGHT_PX = 456;
const ESSAY_CHARS_PER_LINE = 48;
const ESSAY_LINES_FIRST_PAGE = Math.floor(
  ESSAY_BODY_HEIGHT_PX / ESSAY_LINE_HEIGHT_PX,
);
/** Devam yapraklarında başlık şeridi daha kısa → ~1 satır ek alan */
const ESSAY_LINES_CONTINUATION_PAGE = ESSAY_LINES_FIRST_PAGE + 1;
/** Paragraflar arası boşluk ≈ 1 satır (prose p margin) */
const ESSAY_PARAGRAPH_GAP_LINES = 1;
/** Kuyruk / kırık yaprak birleştirme eşiği (satır) */
const ESSAY_TAIL_MERGE_MAX_LINES = 5;
const ESSAY_FRAGMENT_MERGE_MAX_LINES = 3;
/** Tek satır bu kadar uzunsa satır bütçesi yerine karakter ile bölünür */
const MAX_POEM_LINE_CHARS = 120;

function splitIntoParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function paginateLongLine(line: string, charsPerPage: number): string[] {
  const pages: string[] = [];
  let chunk = "";
  for (const word of line.split(/(\s+)/)) {
    const next = chunk + word;
    if (next.length <= charsPerPage) {
      chunk = next;
      continue;
    }
    if (chunk.trim()) pages.push(chunk.trim());
    chunk = word.trimStart();
  }
  if (chunk.trim()) pages.push(chunk.trim());
  return pages.length ? pages : [line];
}

function poemLinesForFirstPage(item: BookItem): number {
  const slugBudget = POEM_LINES_FIRST_PAGE_BY_SLUG[item.slug];
  if (slugBudget !== undefined) return slugBudget;
  if (item.slug === "onsoz" || item.slug === "kitabin-hikayesi") {
    return POEM_LINES_FIRST_PAGE_COMPACT_HEADER;
  }
  return POEM_LINES_FIRST_PAGE;
}

function poemLinesForContinuationPage(item: BookItem): number {
  return (
    POEM_LINES_CONTINUATION_PAGE_BY_SLUG[item.slug] ??
    POEM_LINES_CONTINUATION_PAGE
  );
}

function stanzaLineCount(stanza: string): number {
  return stanza.split(/\n/).map((l) => l.trim()).filter(Boolean).length;
}

/** Şiir yaprak içeriğinin görsel mısra maliyeti (pre-line + kıta aralığı) */
export function poemContentLineCost(content: string): number {
  const blocks = splitIntoParagraphs(content);
  if (!blocks.length) return 0;

  let lines = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (i > 0) lines += STANZA_GAP_LINE_COST;
    lines += stanzaLineCount(blocks[i]!);
  }
  return lines;
}

function stanzaMaxPerPage(
  item: BookItem,
  isFirstPage: boolean,
): number | undefined {
  const limits = POEM_STANZA_MAX_PER_PAGE_BY_SLUG[item.slug];
  if (!limits) return undefined;
  return isFirstPage ? limits.first : limits.continuation;
}

/** Kıta kıta: her \n\n bloğu bir kıta; bütçe mısra + kıtalar arası boşluk */
function paginatePoemStanzas(stanzas: string[], item: BookItem): string[] {
  if (!stanzas.length) return [""];

  const pages: string[] = [];
  let current: string[] = [];
  let usedLines = 0;
  let lineBudget = poemLinesForFirstPage(item);
  let isFirstPage = true;

  const flush = () => {
    if (!current.length) return;
    pages.push(current.join("\n\n"));
    current = [];
    usedLines = 0;
    lineBudget = poemLinesForContinuationPage(item);
    isFirstPage = false;
  };

  for (const stanza of stanzas) {
    const linesInStanza = stanzaLineCount(stanza);
    if (linesInStanza === 0) continue;

    if (linesInStanza > lineBudget) {
      flush();
      pages.push(stanza.trim());
      lineBudget = poemLinesForContinuationPage(item);
      isFirstPage = false;
      continue;
    }

    const gapCost = current.length > 0 ? STANZA_GAP_LINE_COST : 0;
    const stanzaCost = linesInStanza + gapCost;
    const stanzaCap = stanzaMaxPerPage(item, isFirstPage);
    const wouldOverflow =
      current.length > 0 &&
      (usedLines + stanzaCost > lineBudget ||
        (stanzaCap !== undefined && current.length >= stanzaCap));

    if (wouldOverflow) {
      flush();
    }

    const gap = current.length > 0 ? STANZA_GAP_LINE_COST : 0;
    current.push(stanza.trim());
    usedLines += linesInStanza + gap;
  }

  flush();

  if (
    pages.length >= 2 &&
    POEM_STANZA_MAX_PER_PAGE_BY_SLUG[item.slug]?.continuation === 3
  ) {
    const lastBlocks = splitIntoParagraphs(pages[pages.length - 1]!);
    if (lastBlocks.length === 1) {
      const prevBlocks = splitIntoParagraphs(pages[pages.length - 2]!);
      const merged = [...prevBlocks, ...lastBlocks];
      const mergedLines = merged.reduce(
        (sum, block) => sum + stanzaLineCount(block),
        0,
      );
      const mergedGaps = Math.max(0, merged.length - 1) * STANZA_GAP_LINE_COST;
      const contBudget = poemLinesForContinuationPage(item);
      if (mergedLines + mergedGaps <= contBudget && merged.length <= 3) {
        pages.splice(
          pages.length - 2,
          2,
          merged.map((b) => b.trim()).join("\n\n"),
        );
      }
    }
  }

  return pages.length ? pages : [""];
}

/** Şiir gövdesi: \n\n kıta; her kıtadaki \n mısra sayılır */
function paginatePoemLines(stanzas: string[], item: BookItem): string[] {
  if (!stanzas.length) return [""];

  const pages: string[] = [];
  let current: string[] = [];
  let usedLines = 0;
  let lineBudget = poemLinesForFirstPage(item);

  const flush = () => {
    if (!current.length) return;
    pages.push(current.join("\n\n"));
    current = [];
    usedLines = 0;
    lineBudget = poemLinesForContinuationPage(item);
  };

  for (const stanza of stanzas) {
    const linesInStanza = stanzaLineCount(stanza);
    if (linesInStanza === 0) continue;

    if (linesInStanza > lineBudget) {
      flush();
      const rows = stanza.split(/\n/).map((l) => l.trim()).filter(Boolean);
      let chunk: string[] = [];
      let chunkUsed = 0;
      for (const row of rows) {
        if (chunk.length > 0 && chunkUsed + 1 > lineBudget) {
          pages.push(chunk.join("\n"));
          chunk = [];
          chunkUsed = 0;
          lineBudget = poemLinesForContinuationPage(item);
        }
        chunk.push(row);
        chunkUsed++;
      }
      if (chunk.length) {
        current = [chunk.join("\n")];
        usedLines = chunkUsed;
      }
      continue;
    }

    if (linesInStanza === 1 && stanza.length > MAX_POEM_LINE_CHARS) {
      flush();
      const chunks = paginateLongLine(stanza, PROSE_CHARS_CONTINUATION_PAGE);
      for (let i = 0; i < chunks.length; i++) {
        if (i < chunks.length - 1) {
          pages.push(chunks[i]!);
          lineBudget = poemLinesForContinuationPage(item);
        } else if (chunks[i]) {
          current = [chunks[i]!];
          usedLines = stanzaLineCount(chunks[i]!);
        }
      }
      continue;
    }

    const gapCost = current.length > 0 ? STANZA_GAP_LINE_COST : 0;
    if (current.length > 0 && usedLines + gapCost + linesInStanza > lineBudget) {
      flush();
    }

    const gap = current.length > 0 ? STANZA_GAP_LINE_COST : 0;
    current.push(stanza.trim());
    usedLines += linesInStanza + gap;
  }

  flush();

  const firstBudget = poemLinesForFirstPage(item);
  const fullBody = stanzas.join("\n\n");
  if (pages.length === 2) {
    const tailCost = poemContentLineCost(pages[1]!);
    const totalCost = poemContentLineCost(fullBody);
    if (tailCost === 1 && totalCost === firstBudget + 1) {
      return [fullBody];
    }
    if (tailCost <= 2 && totalCost <= firstBudget) {
      return [fullBody];
    }
  }

  return pages.length ? pages : [""];
}

function paginateParagraphs(
  paragraphs: string[],
  firstPageChars: number,
  continuationChars: number,
): string[] {
  const pages: string[] = [];
  let current = "";
  let charsPerPage = firstPageChars;

  const pushPage = () => {
    if (!current) return;
    pages.push(current);
    current = "";
    charsPerPage = continuationChars;
  };

  for (const para of paragraphs) {
    const block = current ? `${current}\n\n${para}` : para;
    if (block.length <= charsPerPage) {
      current = block;
      continue;
    }

    pushPage();

    if (para.length <= charsPerPage) {
      current = para;
      continue;
    }

    const lines = para.split("\n");
    let chunk = "";
    for (const line of lines) {
      const next = chunk ? `${chunk}\n${line}` : line;
      if (next.length <= charsPerPage) {
        chunk = next;
      } else {
        pushPage();
        if (chunk) {
          pages.push(chunk);
          chunk = "";
          charsPerPage = continuationChars;
        }
        if (line.length <= charsPerPage) {
          chunk = line;
        } else {
          for (const part of paginateLongLine(line, charsPerPage)) {
            pages.push(part);
            charsPerPage = continuationChars;
          }
        }
      }
    }
    if (chunk) current = chunk;
  }

  pushPage();
  return pages.length ? pages : [""];
}

function isEssaySectionMarker(para: string): boolean {
  const t = para.trim().replace(/^\*\*|\*\*$/g, "");
  return /^[IVXLCDM]{1,8}$/i.test(t);
}

/** Bölüm başlığını (**I** vb.) yalnız bırakma — sonraki paragrafla tek blok */
function bundleEssaySectionParagraphs(paragraphs: string[]): string[] {
  const bundled: string[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]!;
    if (isEssaySectionMarker(para) && i + 1 < paragraphs.length) {
      bundled.push(`${para}\n\n${paragraphs[++i]!}`);
    } else {
      bundled.push(para);
    }
  }
  return bundled;
}

function essayLinesForPage(pageIndex: number): number {
  return pageIndex === 0
    ? ESSAY_LINES_FIRST_PAGE
    : ESSAY_LINES_CONTINUATION_PAGE;
}

/** Görsel sarılı satır sayısı (pagination ≈ render) */
export function essayTextLineCost(text: string): number {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  if (!blocks.length) return 0;

  let lines = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (i > 0) lines += ESSAY_PARAGRAPH_GAP_LINES;
    const flat = blocks[i]!.replace(/\n/g, " ").trim();
    lines += Math.max(1, Math.ceil(flat.length / ESSAY_CHARS_PER_LINE));
  }
  return lines;
}

function essayFitsOnPage(text: string, pageIndex: number): boolean {
  return essayTextLineCost(text) <= essayLinesForPage(pageIndex);
}

/** Aynı paragrafın devamı: boşluk; gerçek paragraf sınırı: \n\n */
function joinEssayPageChunks(prev: string, next: string): string {
  const a = prev.trimEnd();
  const b = next.trimStart();
  if (!a) return b;
  if (!b) return a;
  if (a.includes("\n\n") || next.includes("\n\n")) {
    return `${a}\n\n${b}`;
  }
  return `${a} ${b}`;
}

function splitEssaySentences(text: string): string[] {
  return (
    text.match(/[^.!?…\n]+[.!?…]+(?:\s+|$)|[^\n]+/g)?.map((s) => s.trim()) ??
    [text]
  ).filter(Boolean);
}

function appendEssayUnit(
  current: string,
  unit: string,
  paragraphGap: boolean,
): string {
  if (!current) return unit;
  return paragraphGap ? `${current}\n\n${unit}` : `${current} ${unit}`;
}

function splitEssayOverflowUnit(unit: string, lineBudget: number): string[] {
  if (essayTextLineCost(unit) <= lineBudget) return [unit];
  const maxChars = lineBudget * ESSAY_CHARS_PER_LINE;
  return paginateLongLine(unit.replace(/\n/g, " "), maxChars);
}

function paginateEssayParagraphsCore(paragraphs: string[]): string[] {
  const pages: string[] = [];
  let current = "";
  let pageIndex = 0;

  const lineBudget = () => essayLinesForPage(pageIndex);

  const flush = () => {
    if (!current) return;
    pages.push(current);
    current = "";
    pageIndex++;
  };

  const tryAppend = (unit: string, paragraphGap: boolean): boolean => {
    const next = appendEssayUnit(current, unit, paragraphGap);
    if (essayTextLineCost(next) <= lineBudget()) {
      current = next;
      return true;
    }
    return false;
  };

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi]!;
    const units =
      essayTextLineCost(para) > lineBudget()
        ? splitEssaySentences(para)
        : [para];

    for (let ui = 0; ui < units.length; ui++) {
      const unit = units[ui]!;
      const paragraphGap = ui === 0 && Boolean(current);

      if (tryAppend(unit, paragraphGap)) continue;

      if (current) flush();

      if (essayTextLineCost(unit) <= lineBudget()) {
        current = unit;
        continue;
      }

      const chunks = splitEssayOverflowUnit(unit, lineBudget());
      for (const chunk of chunks) {
        if (tryAppend(chunk, false)) continue;
        if (current) flush();
        if (essayTextLineCost(chunk) <= lineBudget()) {
          current = chunk;
        } else {
          pages.push(chunk);
          pageIndex++;
        }
      }
    }
  }

  flush();
  return pages.length ? pages : [""];
}

/** Boş kalan yapraklara sonraki yapraktan cümle aktar */
function fillEssayPages(pages: string[]): string[] {
  const result = [...pages];

  for (let i = 0; i < result.length - 1; i++) {
    const budget = essayLinesForPage(i);
    const used = essayTextLineCost(result[i]!);
    if (used >= budget) continue;

    const next = result[i + 1]!;
    const nextLines = essayTextLineCost(next);

    if (nextLines <= ESSAY_TAIL_MERGE_MAX_LINES) {
      const whole = joinEssayPageChunks(result[i]!, next);
      if (essayFitsOnPage(whole, i)) {
        result[i] = whole;
        result.splice(i + 1, 1);
        i--;
        continue;
      }
    }

    const units = splitEssaySentences(next);
    let merged = result[i]!;
    let consumed = 0;

    for (let u = 0; u < units.length; u++) {
      const unit = units[u]!;
      const attempt = appendEssayUnit(merged, unit, false);
      if (essayTextLineCost(attempt) <= budget) {
        merged = attempt;
        consumed++;
      } else {
        break;
      }
    }

    if (consumed === 0) continue;

    const rest = units.slice(consumed).join(" ").trim();
    result[i] = merged;
    if (rest) {
      result[i + 1] = rest;
    } else {
      result.splice(i + 1, 1);
      i--;
    }
  }

  return result;
}

function mergeEssayTailPages(pages: string[]): string[] {
  if (pages.length < 2) return pages;

  const result = [...pages];
  let changed = true;

  while (changed && result.length >= 2) {
    changed = false;
    const lastIdx = result.length - 1;
    const tail = result[lastIdx]!;
    const prev = result[lastIdx - 1]!;

    if (essayTextLineCost(tail) > ESSAY_TAIL_MERGE_MAX_LINES) break;

    const pageIdx = lastIdx - 1;
    const mergedFlow = joinEssayPageChunks(prev, tail);
    const mergedPara = `${prev.trimEnd()}\n\n${tail.trimStart()}`;

    if (essayFitsOnPage(mergedFlow, pageIdx)) {
      result[pageIdx] = mergedFlow;
      result.pop();
      changed = true;
    } else if (essayFitsOnPage(mergedPara, pageIdx)) {
      result[pageIdx] = mergedPara;
      result.pop();
      changed = true;
    }
  }

  return result;
}

function stabilizeEssayPages(pages: string[]): string[] {
  let result = [...pages];
  let changed = true;

  while (changed) {
    changed = false;

    const filled = fillEssayPages(result);
    if (filled.length !== result.length || filled.some((p, i) => p !== result[i])) {
      result = filled;
      changed = true;
      continue;
    }

    const tailMerged = mergeEssayTailPages(result);
    if (
      tailMerged.length !== result.length ||
      tailMerged.some((p, i) => p !== result[i])
    ) {
      result = tailMerged;
      changed = true;
      continue;
    }

    for (let i = 0; i < result.length; i++) {
      const trimmed = result[i]!.trim();

      if (isEssaySectionMarker(trimmed) && i + 1 < result.length) {
        result.splice(i, 2, `${trimmed}\n\n${result[i + 1]}`);
        changed = true;
        break;
      }

      if (
        trimmed.length > 0 &&
        essayTextLineCost(trimmed) <= ESSAY_FRAGMENT_MERGE_MAX_LINES &&
        !isEssaySectionMarker(trimmed) &&
        i > 0
      ) {
        const prev = result[i - 1]!;
        const mergedFlow = joinEssayPageChunks(prev, trimmed);
        const mergedPara = `${prev.trimEnd()}\n\n${trimmed}`;
        const pageIdx = i - 1;
        if (essayFitsOnPage(mergedFlow, pageIdx)) {
          result.splice(i - 1, 2, mergedFlow);
          changed = true;
          break;
        }
        if (essayFitsOnPage(mergedPara, pageIdx)) {
          result.splice(i - 1, 2, mergedPara);
          changed = true;
          break;
        }
      }
    }
  }

  return result;
}

function paginateEssayParagraphs(paragraphs: string[]): string[] {
  const bundled = bundleEssaySectionParagraphs(paragraphs);
  const pages = paginateEssayParagraphsCore(bundled);
  return stabilizeEssayPages(pages);
}

function paginateWithBreaks(body: string, breaks: number[]): string[] {
  const sorted = [...breaks].sort((a, b) => a - b);
  const pages: string[] = [];
  let start = 0;

  for (const end of sorted) {
    const slice = body.slice(start, end).trim();
    if (slice) pages.push(slice);
    start = end;
  }

  const tail = body.slice(start).trim();
  if (tail) pages.push(tail);

  return pages.length ? pages : [body.trim() || ""];
}

function paginateBody(item: BookItem): string[] {
  const body = item.body_md ?? "";
  if (!body.trim()) return [""];

  if (item.page_breaks?.length) {
    const valid = item.page_breaks.filter(
      (n) => Number.isFinite(n) && n > 0 && n < body.length,
    );
    if (valid.length) return paginateWithBreaks(body, valid);
  }

  const paragraphs = splitIntoParagraphs(body);

  if (item.kind === "poem") {
    if (POEM_STANZA_PAGINATION_SLUGS.has(item.slug)) {
      return paginatePoemStanzas(paragraphs, item);
    }
    return paginatePoemLines(paragraphs, item);
  }

  if (item.kind === "essay") {
    return paginateEssayParagraphs(paragraphs);
  }

  return paginateParagraphs(
    paragraphs,
    PROSE_CHARS_FIRST_PAGE,
    PROSE_CHARS_CONTINUATION_PAGE,
  );
}

function paginateItemBody(item: BookItem, allItems: BookItem[]): PaginatedSlice[] {
  if (item.slug === "icindekiler") {
    return paginateTocItem(item, allItems);
  }

  return paginateBody(item).map((content) => ({ content }));
}

export function buildReaderPages(
  items: BookItem[],
  book?: Pick<Book, "title" | "author_name" | "cover_image_url">,
): ReaderPage[] {
  const pages: ReaderPage[] = [];
  let globalIndex = 0;

  if (book) {
    pages.push({
      itemId: "book-cover",
      itemTitle: book.title,
      itemKind: "page",
      itemSlug: "kapak",
      sectionTitle: "Kapak",
      sectionType: "front_matter",
      pageIndex: 0,
      totalPagesInItem: 1,
      globalPageIndex: globalIndex++,
      content: book.author_name,
      isCover: true,
    });
  }

  for (const item of items) {
    const contentPages = paginateItemBody(item, items);
    const sectionTitle = item.section?.title ?? "";
    const sectionType = item.section?.type ?? "front_matter";

    contentPages.forEach(({ content, tocSlice }, pageIndex) => {
      pages.push({
        itemId: item.id,
        itemTitle: item.title,
        itemKind: item.kind,
        itemSlug: item.slug,
        sectionTitle,
        sectionType,
        pageIndex,
        totalPagesInItem: contentPages.length,
        globalPageIndex: globalIndex++,
        content,
        tocSlice,
      });
    });
  }

  return pages;
}

export function findPageIndexByItemId(
  pages: ReaderPage[],
  itemId: string,
  pageIndex = 0,
): number {
  const idx = pages.findIndex(
    (p) => p.itemId === itemId && p.pageIndex === pageIndex,
  );
  return idx >= 0 ? idx : 0;
}
