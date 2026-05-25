import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn(className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={cn("text-page-title mt-3", eyebrow ? "" : "mt-0")}>{title}</h1>
      {description && (
        <p className="prose-width mt-4 text-ink-secondary">{description}</p>
      )}
    </header>
  );
}
