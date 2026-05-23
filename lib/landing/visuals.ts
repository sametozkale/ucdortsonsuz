/** Vitrin kartları için dönen gradient sınıfları (görsel yoksa veya kapak türevi). */
export function showcaseVisualClass(index: number): string {
  return `landing-showcase-visual--${index % 4}`;
}
