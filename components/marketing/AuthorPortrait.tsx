import Image from "next/image";
import { cn } from "@/lib/utils";

type AuthorPortraitShape = "portrait" | "circle";
type AuthorPortraitSize = "default" | "sm";

interface AuthorPortraitProps {
  name: string;
  src?: string | null;
  className?: string;
  priority?: boolean;
  shape?: AuthorPortraitShape;
  /** Daire portre — `sm` Hakkımda vb. için */
  size?: AuthorPortraitSize;
}

const circleSizeClasses: Record<AuthorPortraitSize, string> = {
  default: "max-w-[12rem] sm:max-w-[14rem]",
  sm: "max-w-[10rem] sm:max-w-[11.5rem]",
};

const circleImageSizes: Record<AuthorPortraitSize, string> = {
  default: "(max-width: 768px) 12rem, 14rem",
  sm: "(max-width: 768px) 10rem, 11.5rem",
};

const shapeClasses: Record<AuthorPortraitShape, string> = {
  portrait: "aspect-[4/5] max-w-[16rem] rounded-xl",
  circle: "aspect-square rounded-full",
};

export function AuthorPortrait({
  name,
  src,
  className,
  priority = false,
  shape = "circle",
  size = "default",
}: AuthorPortraitProps) {
  const frameClass = cn(
    "author-portrait w-full overflow-hidden border border-border",
    shapeClasses[shape],
    shape === "circle" && circleSizeClasses[size],
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
              ? circleImageSizes[size]
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
