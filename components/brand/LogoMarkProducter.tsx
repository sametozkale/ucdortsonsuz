import { cn } from "@/lib/utils";

const sizes = {
  sm: { icon: 20, gap: 5 },
  md: { icon: 28, gap: 6 },
  lg: { icon: 40, gap: 8 },
  xl: { icon: 56, gap: 10 },
} as const;

const stroke = 1.5;

/** Figma Producter — play (−90°), record, stop (Üç · Dört · Sonsuz) */
const paths = {
  play:
    "M4 12V8.44C4 4.02 7.13 2.21 10.96 4.42L14.05 6.2L17.14 7.98C20.97 10.19 20.97 13.81 17.14 16.02L14.05 17.8L10.96 19.58C7.13 21.79 4 19.98 4 15.56V12Z",
  record:
    "M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z",
  stop:
    "M9.3 21H14.7C19.2 21 21 19.2 21 14.7V9.3C21 4.8 19.2 3 14.7 3H9.3C4.8 3 3 4.8 3 9.3V14.7C3 19.2 4.8 21 9.3 21Z",
} as const;

function MarkIcon({ d, size }: { d: string; size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface LogoMarkProducterProps {
  className?: string;
  size?: keyof typeof sizes;
}

export function LogoMarkProducter({ className, size = "md" }: LogoMarkProducterProps) {
  const { icon, gap } = sizes[size];

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap }}
      aria-hidden
    >
      <span className="inline-flex shrink-0 -rotate-90">
        <MarkIcon d={paths.play} size={icon + 1} />
      </span>
      <MarkIcon d={paths.record} size={icon} />
      <MarkIcon d={paths.stop} size={icon} />
    </span>
  );
}
