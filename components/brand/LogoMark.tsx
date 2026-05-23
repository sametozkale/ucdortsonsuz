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
/** Kare rx=4 → köşe oranı; üçgende ~2px fillet */
const cornerRadius = 2;

type Point = [number, number];

/** Üç köşede eşit yarıçaplı yuvarlak (kare ile uyumlu kontur) */
function roundedTrianglePath(
  apex: Point,
  bottomLeft: Point,
  bottomRight: Point,
  radius: number,
): string {
  const corners = [apex, bottomLeft, bottomRight];
  const n = corners.length;
  let d = "";

  for (let i = 0; i < n; i++) {
    const curr = corners[i]!;
    const prev = corners[(i + n - 1) % n]!;
    const next = corners[(i + 1) % n]!;

    const v1: Point = [curr[0] - prev[0], curr[1] - prev[1]];
    const v2: Point = [next[0] - curr[0], next[1] - curr[1]];
    const len1 = Math.hypot(v1[0], v1[1]);
    const len2 = Math.hypot(v2[0], v2[1]);
    const r = Math.min(radius, len1 / 2, len2 / 2);

    const p1: Point = [
      curr[0] - (v1[0] / len1) * r,
      curr[1] - (v1[1] / len1) * r,
    ];
    const p2: Point = [
      curr[0] + (v2[0] / len2) * r,
      curr[1] + (v2[1] / len2) * r,
    ];

    if (i === 0) {
      d += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    } else {
      d += `L ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    }
    d += `Q ${curr[0]} ${curr[1]} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }

  return `${d}Z`;
}

const triangleApex: Point = [10, shapeTop];
const triangleBaseY = shapeTop + shapeSize + 0.5;
const trianglePath = roundedTrianglePath(
  triangleApex,
  [2.5, triangleBaseY],
  [17.5, triangleBaseY],
  cornerRadius,
);

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
        vectorEffect="non-scaling-stroke"
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
