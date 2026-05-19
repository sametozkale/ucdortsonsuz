import { BOOK_TITLE } from "@/lib/constants";

export default function OkuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reader-root min-h-dvh bg-bg" aria-label={`${BOOK_TITLE} okuyucu`}>
      {children}
    </div>
  );
}
