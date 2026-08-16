import hb01 from "../assets/sunny/headbang/hb01.png";

import p01_neutral from "../assets/sunny/poses27-clean/01_neutral.png";
import p02_antic_back1 from "../assets/sunny/poses27-clean/02_antic_back1.png";
import p03_antic_back2 from "../assets/sunny/poses27-clean/03_antic_back2.png";
import p04_antic_back3 from "../assets/sunny/poses27-clean/04_antic_back3.png";
import p05_stretch_up1 from "../assets/sunny/poses27-clean/05_stretch_up1.png";
import p06_stretch_up2 from "../assets/sunny/poses27-clean/06_stretch_up2.png";
import p07_drive1 from "../assets/sunny/poses27-clean/07_drive1.png";
import p08_drive2 from "../assets/sunny/poses27-clean/08_drive2.png";
import p09_drive3 from "../assets/sunny/poses27-clean/09_drive3.png";
import p10_drive4 from "../assets/sunny/poses27-clean/10_drive4.png";
import p11_drive5 from "../assets/sunny/poses27-clean/11_drive5.png";
import p12_impact1 from "../assets/sunny/poses27-clean/12_impact1.png";
import p13_impact2 from "../assets/sunny/poses27-clean/13_impact2.png";
import p14_squash1 from "../assets/sunny/poses27-clean/14_squash1.png";
import p15_squash2 from "../assets/sunny/poses27-clean/15_squash2.png";
import p16_lowest from "../assets/sunny/poses27-clean/16_lowest.png";
import p17_rebound_start1 from "../assets/sunny/poses27-clean/17_rebound_start1.png";
import p18_rebound_start2 from "../assets/sunny/poses27-clean/18_rebound_start2.png";
import p19_rebound_up1 from "../assets/sunny/poses27-clean/19_rebound_up1.png";
import p20_rebound_up2 from "../assets/sunny/poses27-clean/20_rebound_up2.png";
import p21_peak_rebound from "../assets/sunny/poses27-clean/21_peak_rebound.png";
import p22_overshoot1 from "../assets/sunny/poses27-clean/22_overshoot1.png";
import p23_overshoot2 from "../assets/sunny/poses27-clean/23_overshoot2.png";
import p24_settle1 from "../assets/sunny/poses27-clean/24_settle1.png";
import p25_settle2 from "../assets/sunny/poses27-clean/25_settle2.png";
import p26_return from "../assets/sunny/poses27-clean/26_return.png";
import p27_ready from "../assets/sunny/poses27-clean/27_ready.png";

// poses27-clean/ is a pixel-level copy of the approved src/assets/sunny/poses27/
// frames with two fixes, both applied programmatically (no manual redraw):
//
// 1. A ~1-2px white edge fringe baked into the original export (between the
//    black cartoon outline and the transparent boundary, invisible on light
//    backgrounds, glaring on dark ones) has been made transparent, on every
//    frame. Only pixels touching full transparency were touched.
//
// 2. On 9 frames — 01_neutral-adjacent poses 03_antic_back2, 07_drive1,
//    09_drive3, 11_drive5, 12_impact1, 15_squash2, 16_lowest,
//    17_rebound_start1, 22_overshoot1 — one leaf was rendered solid white
//    instead of green in the original export (a real content defect, not
//    edge fringe). It's recolored using that same frame's own stem pixels,
//    sampled row-by-row and applied only inside the defective leaf's exact
//    original silhouette — real approved color data reused, not generated.
//
// The original poses27/ folder is untouched for reference/reversibility.
// neither of which is an edge-cleanup change, so it was left untouched
// pending a decision on how to handle it.

// Rage/Gyrate still fall back to the original approved neutral pose — unchanged
// by this port. See SunnyCharacter's BODY_BUTTONS comment for why the poses27
// set isn't used there yet.
export const sunnyNeutralPose = hb01;

/*
  Canonical approved Idle + Headbang timing, ported from the approved
  "Sunny Animation Standalone" pose-based reference (poses27 frame set /
  "Sunny Headbang Animation Final PV1"). Keep frame order, holdMs, and the
  headbang repeat window stable unless the animation itself is intentionally
  revised and re-approved.

  Headbang structure: frames 0-5 are a one-time wind-up (anticipation +
  stretch), frames 6-20 are the drive/impact/rebound "bang" that repeats a
  random number of times (repeatMin-repeatMax reps, matching the reference's
  headbangMin/headbangMax), and frames 21-26 are the settle/return that plays
  once before the whole thing loops back to neutral.
*/
export const sunnyAnimations = {
  headbang: {
    loop: true,
    repeatFrom: 6,
    repeatUntil: 20,
    repeatMin: 5,
    repeatMax: 10,
    // Poses27's canvas has a lot of headroom around the character, and how
    // much varies a lot frame to frame — the resting poses (neutral, impact,
    // settle) use only the bottom-center of the canvas, but the wind-up and
    // rebound/overshoot swings reach much further out toward every edge.
    // 1.5 is the size used for the ~9 frames that can safely take it without
    // clipping (measured per-frame from each cleaned pose27-clean PNG's own
    // alpha bounds). The other ~18 frames cap out lower — each one gets its
    // own `baseScale` below, computed as the largest zoom that keeps that
    // specific frame's silhouette fully inside the box (with a small safety
    // margin), so Sunny is exactly as big as each pose safely allows rather
    // than a single shared value that either clips the wide swings or
    // undersizes everything else. All bottom-anchored, so the pot never
    // jumps — see SunnyPoseAnimation's wrapping-div implementation.
    // Re-derive these any time the poses27-clean art changes.
    baseScale: 1.5,
    frames: [
      { src: p01_neutral, holdMs: 70 },
      { src: p02_antic_back1, holdMs: 60, baseScale: 1.29 },
      { src: p03_antic_back2, holdMs: 60, baseScale: 1.28 },
      { src: p04_antic_back3, holdMs: 70, baseScale: 1.05 },
      { src: p05_stretch_up1, holdMs: 60, baseScale: 1.12 },
      { src: p06_stretch_up2, holdMs: 95, baseScale: 1.06 },
      { src: p07_drive1, holdMs: 40, baseScale: 1.18 },
      { src: p08_drive2, holdMs: 35, baseScale: 1.23 },
      { src: p09_drive3, holdMs: 35, baseScale: 1.29 },
      { src: p10_drive4, holdMs: 32, blur: 1.2, baseScale: 1.2 },
      { src: p11_drive5, holdMs: 32, blur: 1.2, baseScale: 1.46 },
      { src: p12_impact1, holdMs: 30, blur: 1.2 },
      { src: p13_impact2, holdMs: 30, blur: 1.2 },
      { src: p14_squash1, holdMs: 55, scale: 1.04, baseScale: 1.48 },
      { src: p15_squash2, holdMs: 45, scale: 1.04 },
      { src: p16_lowest, holdMs: 60, scale: 1.04 },
      { src: p17_rebound_start1, holdMs: 38, baseScale: 1.21 },
      { src: p18_rebound_start2, holdMs: 38, baseScale: 1.44 },
      { src: p19_rebound_up1, holdMs: 40, baseScale: 1.18 },
      { src: p20_rebound_up2, holdMs: 45, baseScale: 1.22 },
      { src: p21_peak_rebound, holdMs: 70, baseScale: 1.42 },
      { src: p22_overshoot1, holdMs: 60, baseScale: 1.18 },
      { src: p23_overshoot2, holdMs: 70, baseScale: 1.06 },
      { src: p24_settle1, holdMs: 60, baseScale: 1.37 },
      { src: p25_settle2, holdMs: 60, baseScale: 1.48 },
      { src: p26_return, holdMs: 75 },
      { src: p27_ready, holdMs: 90 }
    ]
  }

  // Idle intentionally has no entry here: SunnyCharacter falls back to the
  // original static hb01 pose + CSS "sunnyNaturalIdle" wobble for the idle
  // state — the pre-port idle behavior, confirmed as the one to keep.
  // (A poses27-based 30-step idle sequence exists in this session's history
  // if it's ever wanted again, but it is not the current choice.)
};
