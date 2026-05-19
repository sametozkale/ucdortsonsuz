/**
 * Sayfa çevirme motoru — StPageFlip / turn.js / mesh-flipbook tekniklerinden esinlenme:
 * - Dikey şeritlere bölünmüş silindirik büküm (Three.js n-gon yaklaşımının DOM karşılığı)
 * - Hareketli katlama gölgesi ve translateZ ile derinlik sıralaması
 * - Köşe dalgası: serbest kenar hafif önde, cilt hattı arkada kalır
 */

export const FLIP_STRIP_COUNT = 14;

export type FlipDirection = "forward" | "backward";

export const FLIP_DURATION_S = 0.94;
export const FLIP_EASE = [0.22, 0.68, 0.24, 1] as const;

export interface FlipLighting {
  foldScrim: number;
  spineShade: number;
  groundShadow: number;
  edgeSheen: number;
  foldLineX: number;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Şerit dönüşü (derece). t=0 cilt, t=1 serbest kenar.
 * İleri: 0 → -180; geri: -180 → 0
 */
export function computeStripRotationDeg(
  stripIndex: number,
  stripCount: number,
  progress: number,
  direction: FlipDirection,
): number {
  const p = clamp01(progress);
  const t = stripIndex / Math.max(1, stripCount - 1);

  if (direction === "forward") {
    const lead = Math.pow(t, 0.82);
    const base = -180 * p * lead;
    const curlWave = Math.sin(p * Math.PI) * (1 - t) * 6;
    return base - curlWave;
  }

  const trail = Math.pow(1 - t, 0.82);
  const base = -180 * (1 - p * trail);
  const curlWave = Math.sin(p * Math.PI) * t * 6;
  return base + curlWave;
}

/** Kağıt sertliği — serbest kenar hafif öne eğilir */
export function computeStripRotateXDeg(
  stripIndex: number,
  stripCount: number,
  progress: number,
): number {
  const p = clamp01(progress);
  const t = stripIndex / Math.max(1, stripCount - 1);
  return Math.sin(p * Math.PI) * (1 - t) * 5;
}

/** GPU katman sıralaması — şeritler üst üste binince doğru örtüşme */
export function computeStripTranslateZ(
  stripIndex: number,
  stripCount: number,
  progress: number,
  direction: FlipDirection,
): number {
  const p = clamp01(progress);
  const angle = computeStripRotationDeg(
    stripIndex,
    stripCount,
    p,
    direction,
  );
  const rad = (angle * Math.PI) / 180;
  const lift = Math.sin(p * Math.PI);
  return Math.sin(-rad) * stripIndex * 1.4 + lift * 10;
}

/** Şerit üzerinde aydınlatma (0–1) */
export function computeStripShade(
  stripIndex: number,
  stripCount: number,
  progress: number,
  direction: FlipDirection,
): number {
  const angle = computeStripRotationDeg(
    stripIndex,
    stripCount,
    progress,
    direction,
  );
  const rad = (angle * Math.PI) / 180;
  const facing = Math.max(0, Math.cos(rad));
  const lift = Math.sin(clamp01(progress) * Math.PI);
  return 0.08 + (1 - facing) * 0.35 + lift * 0.12;
}

export function computeFlipLighting(progress: number): FlipLighting {
  const p = clamp01(progress);
  const lift = Math.sin(p * Math.PI);
  return {
    foldScrim: 0.02 + lift * 0.48,
    spineShade: 0.1 + lift * 0.52,
    groundShadow: lift * 0.4,
    edgeSheen: Math.max(0, Math.cos(p * Math.PI)) * 0.6,
    foldLineX: 8 + p * 72,
  };
}
