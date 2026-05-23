import Image from "next/image";
import { cn } from "@/lib/utils";

type AuthorPortraitShape = "portrait" | "circle";

interface AuthorPortraitProps {
  name: string;
  src?: string | null;
  className?: string;
  priority?: boolean;
  shape?: AuthorPortraitShape;
}

const shapeClasses: Record<AuthorPortraitShape, string> = {
  portrait:
    "aspect-[4/5] max-w-[16rem] rounded-xl",
  circle:
    "aspect-square max-w-[12rem] rounded-full sm:max-w-[14rem]",
};

export function AuthorPortrait({
  name,
  src,
  className,
  priority = false,
  shape = "circle",
}: AuthorPortraitProps) {
  const frameClass = cn(
    "author-portrait w-full overflow-hidden border border-border",
    shapeClasses[shape],
    className,
  );

  if (src) {
    return (
      <div className={cn(frameClass, "relative bg-surface")}>
        <Image
          src={src}
          alt={`${name} fotoğrafı`}
          fill
          sizes={
            shape === "circle"
              ? "(max-width: 768px) 12rem, 14rem"
              : "(max-width: 768px) 12rem, 16rem"
          }
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        frameClass,
        "flex items-center justify-center bg-surface-muted text-sm text-ink-tertiary",
      )}
      role="img"
      aria-label={`${name} fotoğrafı`}
    >
      Fotoğraf
    </div>
  );
}
