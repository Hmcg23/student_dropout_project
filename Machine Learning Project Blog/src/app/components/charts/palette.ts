/**
 * Chart palette — validated on the #ffffff chart surface with the dataviz
 * validator (categorical set checked with --pairs all, since donut slices and
 * grouped bars put any two marks side by side).
 *
 * Three hues only, all used exactly as specified. Worst pair CVD ΔE 17.7,
 * normal-vision 21.4, every slot >= 3:1 on white.
 */

export const CRIMSON = "#dc143c"; // Classic Crimson
export const MAGENTA = "#7e1f86"; // Dark Magenta
export const AMETHYST = "#9d79bc"; // Amethyst Smoke

/** Lighter crimson step for ordinal before/after pairs (ΔL 0.20, 2.65:1). */
export const CRIMSON_LIGHT = "#ef7b93";

/** Chart chrome — stays neutral so color only ever encodes data. */
export const INK = "#1a1a1a";
export const MID = "#5c5c5c";
export const LIGHT = "#8a8a8a";
export const GRID = "#e5e5e5";
export const MUTED = "#737373";

/**
 * Outcome identity, ordered by severity so the eye lands on risk first.
 * Worst all-pairs CVD ΔE 17.7, normal-vision 21.4, every slot >= 3:1.
 */
export const CLASS_COLORS: Record<string, string> = {
  Dropout: CRIMSON,
  Enrolled: MAGENTA,
  Graduate: AMETHYST,
};

/** Two-series charts take the two darkest hues — thin ROC lines need the depth. */
export const SERIES_PRIMARY = CRIMSON;
export const SERIES_SECONDARY = MAGENTA;

/** Diverging poles: amethyst sits furthest from crimson in hue, so it carries
 *  the opposite sign more clearly than magenta, which neighbours crimson. */
export const PROTECTIVE = AMETHYST;
export const RISK = CRIMSON;

/** Sequential heatmap fill: crimson over the surface, near-zero recedes to white. */
export const heatFill = (intensity: number) =>
  `rgba(220, 20, 60, ${0.06 + intensity * 0.94})`;

/** Contrast crossover: above this the blend is dark enough that white beats ink. */
export const HEAT_TEXT_FLIP = 0.81;

export const AXIS_TICK = {
  fill: MUTED,
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
};
