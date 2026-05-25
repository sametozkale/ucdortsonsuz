import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const proseClass = cn(
    "prose prose-neutral max-w-none font-serif",
    "prose-p:text-ink prose-p:leading-relaxed",
    "prose-headings:font-hero-title prose-headings:text-ink prose-headings:tracking-tight",
    "prose-a:text-ink prose-a:underline prose-a:underline-offset-[3px]",
    "prose-strong:text-ink",
    className,
  );

  if (typeof children === "string") {
    return (
      <div className={proseClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
      </div>
    );
  }

  return <div className={proseClass}>{children}</div>;
}
