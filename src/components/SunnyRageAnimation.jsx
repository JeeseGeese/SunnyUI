import React, { useEffect, useRef, useState } from "react";
import rageSheet from "../assets/sunny/rage/sunny-rage-sheet.png";
import {
  COLS, ROWS, FRAMES, CELL_W, CELL_H, DUR, ENERGY, DEFAULT_CONFIG
} from "../animations/sunnyRageAnimation";

export default function SunnyRageAnimation({
  size = 340,
  paused = false,
  minSpeed = DEFAULT_CONFIG.minSpeed,
  maxSpeed = DEFAULT_CONFIG.maxSpeed,
  steps = DEFAULT_CONFIG.steps,
  cyclesPerStep = DEFAULT_CONFIG.cyclesPerStep
}) {
  // Cells are taller than wide (230x290), so a square box is height-constrained —
  // the opposite of every other pose set in this app, which are all wider than tall.
  const scale = size / CELL_H;

  // Speed climbs from min to max over `steps` levels, then back down, e.g.
  // [60,75,90,105,120,105,90,75] for steps=5 — same construction as the reference.
  const speedStepsRef = useRef(null);
  if (!speedStepsRef.current) {
    const up = [];
    for (let k = 0; k < steps; k++) {
      up.push(Math.round(minSpeed + (maxSpeed - minSpeed) * (k / (steps - 1))));
    }
    speedStepsRef.current = up.concat(up.slice(1, -1).reverse());
  }

  // Starts at frame 4 rather than 0: frames 0-3 are the sprite sheet's own
  // low-energy "wind-up" antic (ENERGY 0.05-0.28), and combined with the
  // speed ramp always starting at minSpeed on a fresh mount, that stretch
  // played for ~650ms of barely-visible motion every time Rage was
  // selected - read as a stuck first frame. Skipping straight to frame 4
  // (ENERGY 0.42, where visible motion starts) makes Rage react instantly;
  // later loops still cycle through the full 24-frame sheet, wind-up
  // included, once things are already moving and it's no longer the first
  // thing on screen.
  const stateRef = useRef({ i: 4, t: 0, step: 0, cycle: 0 });
  const lastRef = useRef(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (paused) return;
    let raf;
    lastRef.current = performance.now();
    const tick = (now) => {
      const raw = Math.min(64, now - lastRef.current);
      lastRef.current = now;
      const st = stateRef.current;
      const speed = speedStepsRef.current[st.step % speedStepsRef.current.length];
      st.t += raw * (speed / 100);
      let guard = 0;
      while (st.t >= DUR[st.i] && guard++ < 64) {
        st.t -= DUR[st.i];
        st.i++;
        if (st.i >= FRAMES) {
          st.i = 0;
          if (++st.cycle >= cyclesPerStep) {
            st.cycle = 0;
            st.step = (st.step + 1) % speedStepsRef.current.length;
          }
        }
      }
      forceRender((n) => n + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, cyclesPerStep]);

  const st = stateRef.current;
  const i = st.i;
  const speed = speedStepsRef.current[st.step % speedStepsRef.current.length];
  const p = Math.max(0, Math.min(1, st.t / DUR[i]));
  const eMix = ENERGY[i] + (ENERGY[(i + 1) % FRAMES] - ENERGY[i]) * p;
  const intensity = 0.45 + 0.55 * ((speed - minSpeed) / Math.max(1, maxSpeed - minSpeed));
  const s = Math.sin(p * Math.PI);
  const dir = i % 2 === 0 ? 1 : -1;
  const bob = -s * (1.2 + eMix * 4.6) * intensity;
  const rot = dir * s * eMix * 1.8 * intensity;
  const sq = 1 + s * eMix * 0.024 * intensity;

  const bodyTransform =
    `translate3d(0, ${bob.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${(2 - sq).toFixed(4)}, ${sq.toFixed(4)})`;
  const bgPosX = (i % COLS) * (100 / (COLS - 1));
  const bgPosY = Math.floor(i / COLS) * (100 / (ROWS - 1));

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
    }}>
      <div style={{ position: "relative", width: CELL_W * scale, height: CELL_H * scale }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 88%", transform: bodyTransform }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${rageSheet})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            pointerEvents: "none"
          }} />
        </div>
      </div>
    </div>
  );
}
