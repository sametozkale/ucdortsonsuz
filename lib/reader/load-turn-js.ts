declare global {
  interface JQuery {
    turn(options?: TurnJsOptions): JQuery;
    turn(method: "page"): number;
    turn(method: "page", page: number): JQuery;
    turn(method: "next"): JQuery;
    turn(method: "previous"): JQuery;
    turn(method: "size", width: number, height: number): JQuery;
    turn(method: "animating"): boolean;
    turn(method: "disable", disabled?: boolean): JQuery;
    turn(method: "display"): "single" | "double";
    turn(method: "display", display: "single" | "double"): JQuery;
    turn(method: "view"): number[];
    turn(method: "view", page: number): number[];
  }

  interface Window {
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
  }
}

export interface TurnJsOptions {
  width: number;
  height: number;
  display?: "single" | "double";
  autoCenter?: boolean;
  acceleration?: boolean;
  gradients?: boolean;
  duration?: number;
  elevation?: number;
  page?: number;
  when?: {
    turning?: (event: unknown, page: number, view: number[]) => void;
    turned?: (event: unknown, page: number, view: number[]) => void;
  };
}

let loadPromise: Promise<JQueryStatic> | null = null;

export function loadTurnJs(): Promise<JQueryStatic> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("turn.js yalnızca tarayıcıda yüklenebilir"));
  }

  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const jQuery = (await import("jquery")).default;
    window.jQuery = jQuery;
    window.$ = jQuery;

    if (typeof jQuery.fn.turn !== "function") {
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(
          'script[data-vendor="turn.js"]',
        );
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("turn.js yüklenemedi")),
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "/vendor/turn.js";
        script.async = true;
        script.dataset.vendor = "turn.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("turn.js yüklenemedi"));
        document.head.appendChild(script);
      });
    }

    return jQuery;
  })();

  return loadPromise;
}
