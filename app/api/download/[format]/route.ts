import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasBookEntitlement, isReaderDevBypass } from "@/lib/auth/entitlement";
import {
  getBookDownloadFilename,
  getBookDownloadFormat,
  isBookDownloadFormatId,
} from "@/lib/book/downloads";
import { getBook } from "@/lib/book/queries";
import { BOOK_SLUG } from "@/lib/constants";

export async function GET(
  _request: Request,
  context: { params: Promise<{ format: string }> },
) {
  const { format } = await context.params;

  if (!isBookDownloadFormatId(format)) {
    return NextResponse.json({ error: "Geçersiz format" }, { status: 400 });
  }

  const downloadFormat = getBookDownloadFormat(format);
  if (!downloadFormat) {
    return NextResponse.json({ error: "Geçersiz format" }, { status: 400 });
  }

  const book = await getBook();
  const entitled =
    (await hasBookEntitlement(book.id)) || isReaderDevBypass();

  if (!entitled) {
    return NextResponse.json({ error: "Erişim gerekli" }, { status: 403 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "downloads",
    `${BOOK_SLUG}${downloadFormat.extension}`,
  );

  try {
    const file = await readFile(filePath);
    const filename = getBookDownloadFilename(downloadFormat);

    return new NextResponse(file, {
      headers: {
        "Content-Type": downloadFormat.mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Dosya henüz hazır değil" },
      { status: 404 },
    );
  }
}
