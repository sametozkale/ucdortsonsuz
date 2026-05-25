import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none font-serif",
        "prose-p:text-ink prose-p:leading-relaxed",
        "prose-headings:font-hero-title prose-headings:text-ink prose-headings:tracking-tight",
        "prose-a:text-ink prose-a:underline prose-a:underline-offset-[3px]",
        "prose-strong:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
