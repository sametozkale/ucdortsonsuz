import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-5 w-auto",
  md: "h-7 w-auto",
  lg: "h-10 w-auto",
  xl: "h-14 w-auto",
} as const;

const stroke = 1.75;
/** Kare ve daire ile aynı görsel yükseklik (iç ölçü 16px). */
const shapeSize = 16;
const shapeTop = 4;
const shapeCenterY = shapeTop + shapeSize / 2;

/** Yukarı bakan üçgen; tüm köşelerde eşit radius */
const trianglePath =
  "M9.15 5.31 L2.85 18.69 Q2 20.5 4 20.5 L16 20.5 Q18 20.5 17.15 18.69 L10.85 5.31 Q10 3.5 9.15 5.31 Z";

interface LogoMarkProps {
  className?: string;
  size?: keyof typeof sizes;
}

/**
 * Üç · Dört · Sonsuz — üçgen, yuvarlatılmış kare, daire (yan yana, kontur).
 */
export function LogoMark({ className, size = "md" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 80 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
      aria-hidden
    >
      <path
        d={trianglePath}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dört — yuvarlatılmış kare */}
      <rect
        x="26"
        y={shapeTop}
        width={shapeSize}
        height={shapeSize}
        rx="4"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      {/* Sonsuz — kare ile aynı çap (r=8 → yükseklik 16) */}
      <circle
        cx="58"
        cy={shapeCenterY}
        r={shapeSize / 2}
        stroke="currentColor"
        strokeWidth={stroke}
      />
    </svg>
  );
}
