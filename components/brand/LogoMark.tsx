import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-5 w-auto",
  md: "h-7 w-auto",
  lg: "h-10 w-auto",
  xl: "h-14 w-auto",
} as const;

const stroke = 1.75;

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
      {/* Üç — yukarı bakan üçgen, 16×16 kutu */}
      <path
        d="M10 4L18 20H2L10 4z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      {/* Dört — yuvarlatılmış kare, 16×16 */}
      <rect
        x="26"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      {/* Sonsuz — çap 16 daire */}
      <circle
        cx="58"
        cy="12"
        r="7.125"
        stroke="currentColor"
        strokeWidth={stroke}
      />
    </svg>
  );
}
