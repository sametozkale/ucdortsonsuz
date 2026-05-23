import type JQuery from "jquery";

/** turn.js kıvrım katmanı (fparent) — kapakta köşe radius için işaretlenir. */
export function tagTurnFoldLayer($magazine: JQuery) {
  const turnData = $magazine.data() as { fparent?: JQuery };
  turnData.fparent?.addClass("turn-js-fold-layer");
}

/** turn.js tek sayfa modunda kıvrım altında görünen p-temporal — beyaz kağıt. */
export function styleTurnTemporalPaper($magazine: JQuery) {
  const data = $magazine.data() as {
    display?: string;
    pageObjs?: Record<string, JQuery>;
  };

  if (data.display !== "single") return;

  const $temporal = data.pageObjs?.[0];
  if (!$temporal?.length) return;

  $temporal
    .addClass("turn-js-temporal-paper")
    .css({
      backgroundColor: "var(--color-surface)",
      backgroundImage: "none",
    });

  tagTurnFoldLayer($magazine);
}
