/*
  Ported from the approved "Sunny Transform.html" reference (a self-contained
  spin-transform + wavy idle-loop rig). Two phases, same math as the
  reference's own Component class:

  1. Spin transform (one-time): the plain flower whips around a Y-axis turn
     (angleAt), swaps to the full Rail Rider artwork edge-on mid-spin, fires
     a ring flash + speed streaks, then settles to a flat front-facing card.
  2. Rail Rider idle loop (continuous): hands off to a procedural wave rig —
     the character art is sliced into horizontal bands (buildRig) and each
     band is swayed independently (xAt/xLowAt), strongest near the head and
     tapering toward the pot, so Sunny reads as leaning/swaying on the rail
     rather than looping a fixed sprite sequence.

  Config values below are the reference's own authored/tuned defaults (its
  `data-props` panel defaults, which is what actually renders when the file
  is opened — not the `?? fallback` values in the class body, which only
  apply if a prop is left fully unset). Re-derive from "Sunny Transform.html"
  if the approved animation is ever revised.
*/

export const RAIL_RIDER_TIMING = {
  turns: 6,
  spinSeconds: 1.05,
  windUpSeconds: 0,
  settleSeconds: 0.1,
  startAtSpin: 0.34, // opens already mid-spin — the plain flower is never seen at rest
  fps: 14
};

export const RAIL_RIDER_WAVE = {
  amplitude: 5.2,
  waveLag: 0.6,
  compression: 0.34,
  headFollow: 0.22,
  potSway: 1.6
};

// FRAMES is the wave loop's authored period in "frame" units (paired with
// fps above to get the loop's real-time length), not a discrete sprite count.
export const FRAMES = 24;

// Y0: the canvas-% height (measured from the top) that reads as "at the pot
// rim" for the wave math's h=0 baseline. RAIL_Y: the canvas-% height where
// the rail sits, splitting the rig into upper (character) and lower (pot)
// band groups built independently in buildBandMeta.
export const Y0 = 76.8;
export const RAIL_Y = 57;
export const G0 = 0.26;
export const G1 = 0.42;

// Per-height sway multiplier curve (x = height fraction 0..1 from the pot
// rim, y = relative amplitude), smoothed via lerpTable's Catmull-ish
// smoothstep interpolation between control points.
const SHAPE = [
  [0, 0], [0.26, 0], [0.34, 0.34], [0.45, 0.84], [0.55, 1.00],
  [0.68, 0.82], [0.80, 0.60], [0.90, 0.44], [1, 0.36]
];

function lerpTable(table, h) {
  if (h <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    if (h <= table[i][0]) {
      const [x0, y0] = table[i - 1];
      const [x1, y1] = table[i];
      const u = (h - x0) / (x1 - x0);
      return y0 + (y1 - y0) * (u * u * (3 - 2 * u));
    }
  }
  return table[table.length - 1][1];
}

const gauss = (h, c, w) => {
  const d = (h - c) / w;
  return Math.exp(-d * d);
};

export const smoothstep = (a, b, h) => {
  const u = Math.max(0, Math.min(1, (h - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const clamp = (lo, hi, v) => Math.max(lo, Math.min(hi, v));

export function xAt(h, t) {
  let sh = lerpTable(SHAPE, h) * smoothstep(G0, G1, h);
  if (h > 0.62) sh *= RAIL_RIDER_WAVE.headFollow / 0.22;
  const extra = 0.55 * gauss(h, 0.55, 0.16) + 0.35 * gauss(h, 0.95, 0.10);
  return RAIL_RIDER_WAVE.amplitude * sh * Math.sin(2 * Math.PI * t - RAIL_RIDER_WAVE.waveLag * h - extra);
}

export function xLowAt(u, t) {
  const e = u * u * (3 - 2 * u);
  return RAIL_RIDER_WAVE.potSway * e * Math.sin(2 * Math.PI * t + 0.35 + 0.5 * u);
}

export function sqAt(t) {
  return RAIL_RIDER_WAVE.compression * (1 - Math.cos(4 * Math.PI * t)) / 2;
}

export function bobAt(t) {
  return 0.16 * (1 - Math.cos(4 * Math.PI * t + 1.1)) / 2;
}

// angleAt: Y-axis spin rotation (radians) at elapsed spin-phase time e.
export function angleAt(e) {
  const { windUpSeconds: wind, spinSeconds: spin, turns } = RAIL_RIDER_TIMING;
  if (e <= wind) {
    const p = clamp01(wind > 0 ? e / wind : 1);
    return -0.30 * (p * p * (3 - 2 * p));
  }
  const p = clamp01((e - wind) / spin);
  const u = p * p * (3 - 2 * p);
  return -0.30 + (2 * Math.PI * turns + 0.30) * u;
}

// buildBandMeta: static per-band layout (clip-path + transform-origin +
// wave-input params), computed once — the same 34 upper (character) + 17
// lower (pot) bands as the reference's buildRig, minus the actual DOM
// creation (SunnyRailRiderAnimation renders these via JSX instead).
function buildBandMeta() {
  const n = 34;
  const m = Math.max(8, Math.round(n * 0.5));
  const bands = [];

  for (let i = 0; i < n; i++) {
    const y0 = Math.max(0, (i * RAIL_Y) / n - 0.14);
    const y1 = ((i + 1) * RAIL_Y) / n + 0.14;
    const yc = ((i + 0.5) * RAIL_Y) / n;
    bands.push({ y0, y1, yc, low: false, h: (Y0 - yc) / Y0 });
  }

  const span = 100 - RAIL_Y;
  for (let i = 0; i < m; i++) {
    const y0 = RAIL_Y + (i * span) / m - 0.14;
    const y1 = RAIL_Y + ((i + 1) * span) / m + 0.14;
    const yc = RAIL_Y + ((i + 0.5) * span) / m;
    bands.push({ y0, y1, yc, low: true, u: (yc - RAIL_Y) / span });
  }

  return bands;
}

export const RAIL_RIDER_BANDS = buildBandMeta();
