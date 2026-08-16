import React from "react";
import SunnyPoseAnimation from "./SunnyPoseAnimation";
import SunnyGyrateAnimation from "./SunnyGyrateAnimation";
import SunnyRageAnimation from "./SunnyRageAnimation";
import SunnyRailRiderAnimation from "./SunnyRailRiderAnimation";
import { sunnyAnimations, sunnyNeutralPose } from "../animations/sunnyAnimations";

/*
  Hotspot geometry is calibrated to the pot artwork in
  src/assets/sunny/headbang/hb01.png (420x380, the neutral/idle pose that
  idle falls back to). Positions are % of the character box, derived from
  the image's object-fit:"contain" + objectPosition:"bottom center"
  placement, then padded out for an easier touch target. If the approved
  artwork is ever redrawn, these need to be recalibrated to match.
*/
const BODY_BUTTONS = [
  { id: "rage", state: "rage", label: "Rage", left: 38.5, top: 77.4, width: 11, height: 11 },
  { id: "headbang", state: "headbang", label: "Headbang", left: 49, top: 77.4, width: 12, height: 11 },
  { id: "gyrate", state: "gyrate", label: "Gyrate", left: 61.5, top: 77.4, width: 11, height: 11 }
];

/*
  The approved headbang pose set (src/assets/sunny/poses27, 324x263) frames
  the character much smaller within a taller canvas than hb01.png does, and
  is further zoomed by the animation's `baseScale` (see sunnyAnimations.js)
  to cut down the empty headroom. Since baseScale is no longer a single
  fixed value — most frames now carry their own per-frame cap so the wider
  swings (wind-up, rebound, overshoot) don't clip — the pot/button position
  actually drifts a few points frame to frame instead of holding still.
  These numbers target the time-weighted average scale across a full
  headbang cycle (~1.35, dominated by the repeating drive/impact/rebound
  section — computed from each frame's holdMs and baseScale, repeat count
  averaged), so the hotspot sits centered on where the buttons spend most
  of their time rather than perfectly matching any single frame. Only used
  while headbang is the active/visible pose set; rage, gyrate, and idle
  still render hb01.png and keep using BODY_BUTTONS unchanged.
*/
const BODY_BUTTONS_POSES27 = [
  { id: "rage", state: "rage", label: "Rage", left: 38.3, top: 75.5, width: 11, height: 11 },
  { id: "headbang", state: "headbang", label: "Headbang", left: 50.5, top: 75.5, width: 12, height: 11 },
  { id: "gyrate", state: "gyrate", label: "Gyrate", left: 60.4, top: 75.5, width: 11, height: 11 }
];

const POSES27_STATES = new Set(["headbang"]);

/*
  The approved gyrate dance sprites (src/assets/sunny/gyrate/pose01-20.png,
  340x320) are a completely different canvas/art style from hb01.png, fit by
  width the same way (contain, bottom-anchored) but on their own
  proportions. Measured directly from the rendered 390x390 character box at
  the loop's front-facing start (pose01) by pixel-reading the Rage/Headbang/
  Gyrate capsule positions. The dance's three nested transforms (hips/
  squash/soft, see SunnyGyrateAnimation) are all anchored at the pot rim, so
  the pot only jitters a few px through the loop instead of being perfectly
  static — close enough for this hotspot to stay usable throughout.
*/
const BODY_BUTTONS_GYRATE = [
  { id: "rage", state: "rage", label: "Rage", left: 39.7, top: 83.9, width: 11, height: 11 },
  { id: "headbang", state: "headbang", label: "Headbang", left: 52.6, top: 83.9, width: 12, height: 11 },
  { id: "gyrate", state: "gyrate", label: "Gyrate", left: 65.9, top: 83.9, width: 11, height: 11 }
];

const GYRATE_STATES = new Set(["gyrate"]);

/*
  The approved rage sprite sheet (src/assets/sunny/rage/sunny-rage-sheet.png,
  24 cells of 230x290) is yet another distinct canvas — and unlike every
  other pose set in this app, the cells are taller than wide, so a square
  box is height-constrained (fit by height) instead of width-constrained,
  which also leaves side margins instead of top/bottom ones. Measured
  directly from the rendered 390x390 character box at the loop's calmest
  frame (frame 1) by pixel-reading the Rage/Headbang/Gyrate capsule
  positions. The bob/rotate/squash overlay is anchored at 50% 88% (near the
  pot), so — like gyrate — the pot only jitters a few px through the loop.
*/
const BODY_BUTTONS_RAGE = [
  { id: "rage", state: "rage", label: "Rage", left: 43.6, top: 81.8, width: 11, height: 11 },
  { id: "headbang", state: "headbang", label: "Headbang", left: 57.7, top: 81.8, width: 12, height: 11 },
  { id: "gyrate", state: "gyrate", label: "Gyrate", left: 70.5, top: 81.8, width: 11, height: 11 }
];

const RAGE_STATES = new Set(["rage"]);

/*
  The approved Rail Rider art (src/assets/sunny/railrider/{plain,full,body,
  rail}.png) is a taller, differently-proportioned canvas again (768x1152 for
  the idle-loop body/rail pair, fit by height like rage). Measured by
  pixel-reading the Rage/Headbang/Gyrate capsule colors out of plain.png
  (768x1210, sharing the same native width and top-anchored composition as
  the idle-loop pair), then re-expressed as a %-of-height against the
  shorter 1152px rig canvas the idle loop actually renders — X carries over
  unchanged since both canvases share the same 768px native width. Only used
  while railrider is the active/visible pose set.
*/
const BODY_BUTTONS_RAILRIDER = [
  { id: "rage", state: "rage", label: "Rage", left: 30.8, top: 74.5, width: 11, height: 11 },
  { id: "headbang", state: "headbang", label: "Headbang", left: 48, top: 74.5, width: 12, height: 11 },
  { id: "gyrate", state: "gyrate", label: "Gyrate", left: 65.8, top: 74.5, width: 11, height: 11 }
];

const RAILRIDER_STATES = new Set(["railrider"]);

const STATE_BADGE_COLORS = {
  idle: { background: "var(--sunny-charcoal)", color: "#fff" },
  rage: { background: "var(--sunny-blue)", color: "#fff" },
  headbang: { background: "var(--sunny-danger)", color: "#fff" },
  gyrate: { background: "var(--sunny-yellow)", color: "var(--sunny-charcoal)" },
  railrider: { background: "var(--sunny-charcoal)", color: "#fff" }
};

// Display text for the status badge — distinct from the state id itself so
// the auto idle-cycle's Rail Rider phase can read as "Idlin'" (still an idle
// behavior, just a livelier one) rather than the raw state name.
const STATE_LABELS = {
  idle: "Idle",
  rage: "Rage",
  headbang: "Headbang",
  gyrate: "Gyrate",
  railrider: "Idlin'"
};

function SunnyCharacter({
  state = "idle",
  imageSrc,
  label = "Sunny",
  size = 240,
  paused = false,
  onBodyButtonPress
}) {
  const animation = sunnyAnimations[state];
  const isIdle = state === "idle";
  const isGyrate = GYRATE_STATES.has(state);
  const isRage = RAGE_STATES.has(state);
  const isRailRider = RAILRIDER_STATES.has(state);
  const badgeColors = STATE_BADGE_COLORS[state] || STATE_BADGE_COLORS.idle;
  const badgeLabel = STATE_LABELS[state] || state;
  const bodyButtons = isGyrate
    ? BODY_BUTTONS_GYRATE
    : isRage
      ? BODY_BUTTONS_RAGE
      : isRailRider
        ? BODY_BUTTONS_RAILRIDER
        : (POSES27_STATES.has(state) ? BODY_BUTTONS_POSES27 : BODY_BUTTONS);

  return (
    <div style={{
      display: "grid",
      placeItems: "center",
      minHeight: size + 44,
      position: "relative",
      overflow: "hidden"
    }}>
      <div
        aria-label={`${label} ${state}`}
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle, rgba(255,212,71,.32), rgba(255,255,255,0) 70%)"
        }}
      >
        {isGyrate ? (
          <SunnyGyrateAnimation size={size} paused={paused} />
        ) : isRage ? (
          <SunnyRageAnimation size={size} paused={paused} />
        ) : isRailRider ? (
          <SunnyRailRiderAnimation size={size} paused={paused} />
        ) : animation ? (
          <SunnyPoseAnimation
            animation={animation}
            paused={paused}
            alt={`${label} ${state}`}
          />
        ) : (
          <img
            src={imageSrc || sunnyNeutralPose}
            alt={`${label} ${state}`}
            draggable="false"
            className={isIdle ? "sunny-idle-character" : ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              userSelect: "none",
              pointerEvents: "none"
            }}
          />
        )}

        {onBodyButtonPress ? bodyButtons.map((button) => (
          <span
            key={button.id}
            style={{
              position: "absolute",
              left: `${button.left}%`,
              top: `${button.top}%`,
              width: `${button.width}%`,
              height: `${button.height}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <button
              type="button"
              className="sunny-body-hotspot"
              aria-label={button.label}
              onClick={() => onBodyButtonPress(button.state)}
            />
          </span>
        )) : null}
      </div>

      <div style={{
        position: "absolute",
        bottom: 0,
        padding: "7px 12px",
        borderRadius: 999,
        background: badgeColors.background,
        color: badgeColors.color,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: ".10em",
        textTransform: "uppercase",
        transition: "background 140ms ease, color 140ms ease"
      }}>
        {badgeLabel}
      </div>

      <style>{`
        @keyframes sunnyNaturalIdle {
          0%, 100% { transform: translateY(0) rotate(-0.6deg); }
          50% { transform: translateY(-3px) rotate(0.6deg); }
        }

        .sunny-idle-character {
          animation: sunnyNaturalIdle 2.8s ease-in-out infinite;
          transform-origin: 50% 88%;
        }

        @media (prefers-reduced-motion: reduce) {
          .sunny-idle-character {
            animation: none;
          }
        }

        .sunny-body-hotspot {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
        }

        .sunny-body-hotspot:hover {
          background: rgba(255,255,255,.16);
          box-shadow: 0 0 14px 3px rgba(255,255,255,.45);
        }

        .sunny-body-hotspot:active {
          transform: scale(0.90);
          background: rgba(255,255,255,.26);
          box-shadow: 0 0 18px 5px rgba(255,255,255,.6);
        }

        .sunny-body-hotspot:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
          box-shadow: 0 0 14px 3px rgba(255,255,255,.45);
        }
      `}</style>
    </div>
  );
}

/*
  Memoized because its parent (ComponentShowcase) re-renders on every
  useMockSpectrum tick (requestAnimationFrame-driven, ~60/sec) to feed the
  plant garden — without this, SunnyCharacter (and the setTimeout-scheduled
  headbang/idle frame advances inside it) re-rendered 60x/sec too, and that
  React work competing on the main thread was enough to measurably delay
  those timers, making headbang visibly slower than its authored timing.
  SunnyCharacter doesn't consume spectrum data at all, so skipping re-renders
  when only unrelated parent state changes is always safe here.
*/
export default React.memo(SunnyCharacter);
