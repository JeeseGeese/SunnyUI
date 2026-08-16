/*
  Ported from the approved "Sunny Stage Power-On.html" reference — a
  continuous composition played once over the nav bar's own truss artwork:
  a dark copy of the master sits underneath and lit windows of the same
  master are clipped in, region by region, as the stage "powers on".

  The reference's own animation is built on a general-purpose composition/
  timeline authoring engine (scene cues, an editable playback bar, video
  export, etc.) that we don't need here — only the scene math itself is
  ported (Easing/clamp/animate, the CUES table, the MOTION helpers, and the
  BANNERS/TRUSS/STATIONS layout data), unchanged from the reference. See
  SunnyStagePowerOn.jsx for the player that drives T over these.

  CW/CH is the reference's own design canvas (1536x1024) that every
  coordinate below is authored against — SunnyStagePowerOn.jsx fits this by
  width and crops vertically to line up with the nav bar's own (differently
  cropped) sunny-nav-banner.png artwork underneath.
*/

export const CW = 1536;
export const CH = 1024;

export const Easing = {
  linear: (t) => t,
  easeOutQuad: (t) => t * (2 - t),
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// animate({from, to, start, end, ease})(t) -- single-segment tween. Returns
// `from` before `start`, `to` after `end`.
export function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// The reference's own authored scene list (window.OM_SCENES) -- durations
// only, no `nat` overrides, so authored time and playback time are 1:1 and
// each cue is simply the cumulative sum of the durations before it.
const SCENES = [
  { name: "Banners", dur: 1.25 },
  { name: "TrussNeon", dur: 0.9 },
  { name: "Stations", dur: 0.95 },
  { name: "StageLights", dur: 0.8 },
  { name: "PowerSurge", dur: 0.6 },
  { name: "Hold", dur: 1.2 }
];

function deriveCues(scenes) {
  let t = 0;
  const table = {};
  for (const s of scenes) {
    table[s.name] = Math.round(t * 1000) / 1000;
    t += s.dur;
  }
  return { table, total: Math.round(t * 1000) / 1000 };
}

const { table: CUES, total: TOTAL_SECONDS } = deriveCues(SCENES);
export { CUES };
export const STAGE_POWER_ON_SECONDS = TOTAL_SECONDS; // 5.7s

// Three motion curves used throughout the scene -- nothing else eases.
export const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  settle: (T, at) => (T <= at ? 0 : Math.exp(-9 * (T - at)) * Math.sin((T - at) * 22)),
  lamp: (T, at) => {
    const t = T - at;
    if (t < 0) return 0;
    if (t < 0.05) return 0.5;          // startup flick
    if (t < 0.09) return 0.1;
    if (t < 0.15) return 0.82;
    return 0.82 + 0.18 * Easing.easeOutQuad(clamp((t - 0.15) / 0.45, 0, 1));
  }
};

export const BANNERS_LAYOUT = [
  { key: "left", x: 0, y: 336, w: 312, h: 540, topL: 115, topR: 292, off: 0 },
  { key: "right", x: 1224, y: 336, w: 312, h: 540, topL: 1246, topR: 1425, off: 0.09 }
];

// Truss neon groups, left -> right.
export const TRUSS = [[110, 400], [400, 700], [700, 1000], [1000, 1250], [1250, 1436]];
export const TRUSS_GLOW = [
  { x: 255, y: 218, c: "rgba(255,40,190,0.5)" },
  { x: 550, y: 218, c: "rgba(60,200,255,0.5)" },
  { x: 850, y: 218, c: "rgba(255,60,200,0.45)" },
  { x: 1125, y: 218, c: "rgba(90,120,255,0.5)" },
  { x: 1343, y: 218, c: "rgba(190,80,255,0.4)" }
];
export const STATIONS = [
  { ring: [462, 378, 142], plaque: [368, 524, 560, 644], glow: "rgba(255,45,170,0.42)", ringGlow: "rgba(255,200,40,0.4)", d: 0 },
  { ring: [760, 376, 134], plaque: [668, 524, 860, 644], glow: "rgba(40,230,225,0.42)", ringGlow: "rgba(255,90,40,0.4)", d: 0.3 },
  { ring: [1062, 376, 132], plaque: [968, 524, 1164, 644], glow: "rgba(255,45,170,0.42)", ringGlow: "rgba(90,220,255,0.42)", d: 0.6 }
];

export const rectClip = (l, t, r, b) => `inset(${t}px ${CW - r}px ${CH - b}px ${l}px)`;
export const circleClip = (cx, cy, r) => `circle(${r}px at ${cx}px ${cy}px)`;
