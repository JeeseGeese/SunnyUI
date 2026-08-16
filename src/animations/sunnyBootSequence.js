/*
  Ported from the approved "Sunny Boot Sequence Animation" design handoff
  (sunny-boot-component.js — the dependency-free reference the handoff calls
  out as usable directly in a web/JS environment). One continuous 60,000ms
  composition: a single status message at a time above a loading bar that
  fills 0% -> 100% on a keyframe table, then hands off to the main UI.

  Kept as data + pure functions here, same convention as every other
  Sunny*Animation's paired animations/*.js module, so the timing stays
  auditable against the reference independent of the render code in
  SunnyBootSequence.jsx. Time is elapsed milliseconds throughout (matching
  the reference), not seconds.
*/

export const DURATION_MS = 60000;

export const CUE = {
  boot: 0, leds: 5000, diag: 14000, motor: 23000,
  speaker: 33000, photo: 43000, complete: 57000, end: 60000
};

// display: true marks the final "COMPLETE" stage, which uses the display
// (Bungee, uppercase) treatment instead of the body (Baloo 2) one.
export const STAGES = [
  { text: "Booting.....", from: CUE.boot, to: CUE.leds },
  { text: "LEDS Initializing...", from: CUE.leds, to: CUE.diag },
  { text: "Running Diag....", from: CUE.diag, to: CUE.motor },
  { text: "Engaging Motor.....", from: CUE.motor, to: CUE.speaker },
  { text: "Testing Speaker.....", from: CUE.speaker, to: CUE.photo },
  { text: "Photosynthesizing...", from: CUE.photo, to: CUE.complete + 900 },
  { text: "Complete", from: CUE.complete + 900, to: CUE.end + 500, display: true }
];

// [time ms, percent, easing name] -- monotonic; progress never moves backward.
export const KEYS = [
  [0, 0, "linear"], [1000, 0, "linear"],
  [CUE.leds, 8, "inOutSine"],
  [CUE.diag, 23, "outQuart"],
  [CUE.diag + 2000, 28, "inOutSine"], [CUE.diag + 2600, 28, "linear"],
  [CUE.diag + 4600, 32, "inOutSine"], [CUE.diag + 5200, 32, "linear"],
  [CUE.diag + 7000, 35, "inOutSine"], [CUE.diag + 7600, 35, "linear"],
  [CUE.motor, 38, "inOutSine"],
  [CUE.motor + 2000, 41, "inOutSine"],
  [CUE.motor + 9600, 55, "outSine"],
  [CUE.speaker, 55, "linear"],
  [CUE.speaker + 5000, 64, "inOutSine"],
  [CUE.photo, 72, "inOutSine"],
  [CUE.photo + 9000, 90, "outSine"],
  [CUE.photo + 10600, 94, "inOutSine"],
  [CUE.photo + 12000, 96, "inOutSine"],
  [CUE.photo + 13200, 98, "inOutSine"],
  [CUE.complete, 98, "linear"],           // anticipation hold at 98%
  [CUE.complete + 900, 100, "outCubic"]   // finish at exactly 100%
];

const EASE = {
  linear: (t) => t,
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outSine: (t) => Math.sin((t * Math.PI) / 2),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outCubic: (t) => 1 - Math.pow(1 - t, 3)
};

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function progressAt(ms) {
  if (ms <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    if (ms <= KEYS[i][0]) {
      const [t0, v0] = KEYS[i - 1];
      const [t1, v1, ease] = KEYS[i];
      const p = t1 === t0 ? 1 : (ms - t0) / (t1 - t0);
      return v0 + (v1 - v0) * EASE[ease](clamp(p, 0, 1));
    }
  }
  return 100;
}

export function fadeWindow(ms, from, to, inMs, outMs) {
  return Math.min(clamp((ms - from) / inMs, 0, 1), clamp((to - ms) / outMs, 0, 1));
}

// 1 + amt * sin(pi*p) over the [at, at+dur] window -- used for the motor
// engage and completion confirmation pulses.
export function pop(ms, at, dur, amt) {
  const p = clamp((ms - at) / dur, 0, 1);
  return 1 + amt * Math.sin(p * Math.PI) * (p > 0 && p < 1 ? 1 : 0);
}
