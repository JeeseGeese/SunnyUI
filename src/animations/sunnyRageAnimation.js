/*
  Ported from the approved "Sunny Rage Animation System (1)" reference
  (export/sunny-rage.html's <sunny-rage> custom element). A 24-pose sprite
  sheet (6 cols x 4 rows, 230x290 cells) played back with a per-frame
  duration + "energy" curve, plus a five-step speed ramp that climbs from
  min to max and back down (holding each step for cyclesPerStep full 24-pose
  loops) — the same numbers as the reference's own demo instantiation
  (min-speed=60 max-speed=120 steps=5 cycles-per-step=2). Energy drives how
  hard Sunny bobs/rotates/squashes each frame; speed (relative to min/max)
  drives an overall intensity multiplier on top of that. Kept as data here,
  same as sunnyAnimations.js, so the numbers stay auditable against the
  reference independent of the render code in SunnyRageAnimation.jsx.
*/

export const COLS = 6;
export const ROWS = 4;
export const FRAMES = 24;
export const CELL_W = 230;
export const CELL_H = 290;

export const DUR = [
  110, 100, 95, 90, 85, 80, 72, 72,
  66, 60, 58, 58, 58, 58, 60, 62,
  56, 68, 60, 70, 90, 110, 130, 150
];

export const ENERGY = [
  0.05, 0.10, 0.20, 0.28, 0.42, 0.52, 0.68, 0.74,
  0.86, 0.92, 0.88, 0.94, 0.90, 0.96, 0.82, 0.86,
  1.00, 0.98, 0.94, 0.90, 0.55, 0.36, 0.20, 0.08
];

export const DEFAULT_CONFIG = {
  minSpeed: 60,
  maxSpeed: 120,
  steps: 5,
  cyclesPerStep: 2
};
