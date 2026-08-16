import { useCallback, useEffect, useRef, useState } from "react";

// Plain gentle sway before the idle timer transforms Sunny into Rail Rider.
const IDLE_SWAY_SECONDS = 30;
// How long the Rail Rider transform + wave loop plays before the full
// auto-cycle (Rage -> Headbang -> Gyrate -> Rail Rider -> ...) takes over.
const RAIL_RIDER_INTRO_SECONDS = 30;

// Rough seconds-per-loop for each animation, derived from each animation's
// own authored timing (see sunnyAnimations.js, sunnyGyrateDance.js,
// sunnyRageAnimation.js, sunnyRailRiderAnimation.js) -- used only to size how
// long the auto-cycle lingers on a state (2-10 of its own loops), not to
// synchronize frame-accurate playback with those components, which free-run
// on their own rAF loops regardless of what this hook is doing.
const LOOP_SECONDS = {
  rage: 2.1,      // one 24-frame sheet pass at the speed ramp's mid speed (~90)
  headbang: 5.5,  // one full pass, including the "bang" window's avg 7.5 repeats
  gyrate: 2.3,    // CUE_DATA.authoredTotal
  railrider: 1.7  // one wave-loop pass at 24 frames / 14fps
};

// Rail Rider also pays a one-time ~1.55s spin-transform on every mount
// (windUpSeconds + spinSeconds + settleSeconds from sunnyRailRiderAnimation's
// RAIL_RIDER_TIMING) before the wave loop starts -- added on top of its
// loop budget so the loop count itself isn't eaten into by the transform.
const TRANSITION_SECONDS = { railrider: 1.55 };

const CYCLE_ORDER = ["rage", "headbang", "gyrate", "railrider"];

const randomLoopCount = () => 2 + Math.floor(Math.random() * 9); // 2-10 inclusive
const cycleDurationMs = (state) =>
  ((TRANSITION_SECONDS[state] || 0) + LOOP_SECONDS[state] * randomLoopCount()) * 1000;

const PHASE = { SWAY: "sway", INTRO: "intro", CYCLE: "cycle" };

/*
  Drives Sunny's "left alone on Idle" behavior: 30s of the plain gentle sway,
  then a one-time transform into the Rail Rider idle loop for 30s, then an
  indefinite auto-cycle through Rage/Headbang/Gyrate/Rail Rider (each shown
  for a randomized 2-10 of its own loops) -- until the caller reports user
  interaction via the returned setter, which hands control back to the
  caller and stops the timers.

  `active` gates the whole thing on being on the screen that actually shows
  Sunny. The timers are fully torn down (and the state reset back to plain
  idle) whenever the caller isn't active, so coming back to that screen
  always starts from a fresh 30s count rather than resuming mid-cycle
  off-screen.
*/
export default function useSunnyIdleAutoCycle(active) {
  const [sunnyState, setSunnyState] = useState("idle");
  const timerRef = useRef(null);
  const phaseRef = useRef(PHASE.SWAY);
  const cycleIndexRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Kept in a ref (reassigned every render) so the setTimeout chain below
  // always calls the latest closure without needing to re-arm on every
  // render -- the classic "latest ref" escape hatch from an effect's
  // dependency array.
  const advanceRef = useRef(null);
  advanceRef.current = () => {
    if (phaseRef.current === PHASE.SWAY) {
      phaseRef.current = PHASE.INTRO;
      setSunnyState("railrider");
      timerRef.current = setTimeout(() => advanceRef.current(), RAIL_RIDER_INTRO_SECONDS * 1000);
      return;
    }
    if (phaseRef.current === PHASE.INTRO) {
      phaseRef.current = PHASE.CYCLE;
      cycleIndexRef.current = 0;
    } else {
      cycleIndexRef.current = (cycleIndexRef.current + 1) % CYCLE_ORDER.length;
    }
    const next = CYCLE_ORDER[cycleIndexRef.current];
    setSunnyState(next);
    timerRef.current = setTimeout(() => advanceRef.current(), cycleDurationMs(next));
  };

  useEffect(() => {
    if (!active) {
      clearTimer();
      phaseRef.current = PHASE.SWAY;
      cycleIndexRef.current = 0;
      setSunnyState("idle");
      return;
    }
    if (phaseRef.current === PHASE.SWAY) {
      timerRef.current = setTimeout(() => advanceRef.current(), IDLE_SWAY_SECONDS * 1000);
    }
    return clearTimer;
    // advanceRef/clearTimer are stable refs/callbacks; only `active` should
    // re-arm this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Explicit user interaction: a body-button press or the Idle button.
  // Always takes over from whatever the auto-cycle was doing; picking Idle
  // re-arms a fresh 30s sway timer, picking anything else just shows that
  // animation with no further auto behavior until Idle is pressed again.
  const setUserState = useCallback((next) => {
    clearTimer();
    cycleIndexRef.current = 0;
    phaseRef.current = PHASE.SWAY;
    setSunnyState(next);
    if (next === "idle" && active) {
      timerRef.current = setTimeout(() => advanceRef.current(), IDLE_SWAY_SECONDS * 1000);
    }
  }, [active, clearTimer]);

  return [sunnyState, setUserState];
}
