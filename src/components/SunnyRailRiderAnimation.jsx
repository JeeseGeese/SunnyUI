import React, { useEffect, useRef } from "react";
import plainImg from "../assets/sunny/railrider/plain.png";
import fullImg from "../assets/sunny/railrider/full.png";
import bodyImg from "../assets/sunny/railrider/body.png";
import railImg from "../assets/sunny/railrider/rail.png";
import {
  RAIL_RIDER_TIMING, FRAMES, RAIL_RIDER_BANDS, G0, G1,
  angleAt, xAt, xLowAt, sqAt, bobAt, clamp, smoothstep
} from "../animations/sunnyRailRiderAnimation";

// Native canvas sizes of the source art (see sunnyRailRiderAnimation.js) —
// both taller than wide, so (like SunnyRageAnimation) they're fit by height
// within the square character box, not by width.
const SPIN_W = 768, SPIN_H = 1210; // plain.png / full.png
const RIG_W = 768, RIG_H = 1152;   // body.png / rail.png

function fireRing(el) {
  if (!el) return;
  el.style.transition = "none";
  el.style.opacity = "0.95";
  el.style.transform = "scale(.25)";
  requestAnimationFrame(() => {
    el.style.transition = "transform 380ms cubic-bezier(.2,.8,.3,1), opacity 380ms linear";
    el.style.opacity = "0";
    el.style.transform = "scale(2.6)";
  });
}

function setStreaks(els, k) {
  els.forEach((s, i) => {
    if (!s) return;
    s.style.opacity = (k * (i === 1 ? 0.5 : 0.75)).toFixed(2);
    s.style.transform = `scaleX(${(0.15 + 0.85 * k).toFixed(3)})`;
  });
}

export default function SunnyRailRiderAnimation({ size = 340, paused = false }) {
  const rigScale = size / RIG_H;
  const spinScale = size / SPIN_H;
  const rigW = RIG_W * rigScale;
  const rigH = RIG_H * rigScale;
  const spinW = SPIN_W * spinScale;
  const spinH = SPIN_H * spinScale;

  const spinElRef = useRef(null);
  const ringElRef = useRef(null);
  const rigElRef = useRef(null);
  const streakElsRef = useRef([]);
  const bandElsRef = useRef([]);

  useEffect(() => {
    if (paused) return;

    const { windUpSeconds: wind, spinSeconds: spin, settleSeconds: settle, startAtSpin, fps } = RAIL_RIDER_TIMING;
    const done = wind + spin + settle;
    const state = { e: wind + spin * startAtSpin, t: 0, swapped: false, handed: false, prevCos: undefined };

    // Paint the true starting pose immediately (already mid-spin) instead of
    // a flash of the resting plain art on mount.
    if (spinElRef.current) {
      spinElRef.current.style.backgroundImage = `url(${plainImg})`;
      spinElRef.current.style.opacity = "1";
      const a0 = angleAt(state.e);
      spinElRef.current.style.transform = `scaleX(${Math.cos(a0).toFixed(4)})`;
      spinElRef.current.style.filter = "blur(4px)";
    }
    if (rigElRef.current) rigElRef.current.style.opacity = "0";
    setStreaks(streakElsRef.current, 0);
    if (ringElRef.current) ringElRef.current.style.opacity = "0";

    let raf;
    let last = performance.now();

    const applyPose = (t) => {
      const sq = sqAt(t);
      const bob = bobAt(t);
      RAIL_RIDER_BANDS.forEach((b, i) => {
        const el = bandElsRef.current[i];
        if (!el) return;
        if (b.low) {
          const xl = xLowAt(b.u, t);
          const sl = (xLowAt(Math.min(1, b.u + 0.06), t) - xLowAt(Math.max(0, b.u - 0.06), t)) / 0.12;
          const rl = clamp(-1.4, 1.4, sl * 0.35);
          el.style.transform = `translateX(${xl.toFixed(3)}%) rotate(${rl.toFixed(2)}deg)`;
          return;
        }
        const x = xAt(b.h, t);
        const slope = (xAt(Math.min(1, b.h + 0.04), t) - xAt(Math.max(0, b.h - 0.04), t)) / 0.08;
        const rot = clamp(-2.5, 2.5, -slope * 0.05);
        const g = smoothstep(G0, G1, b.h);
        const y = g * (sq * (0.12 + 0.88 * b.h) + bob * smoothstep(0.6, 1, b.h));
        el.style.transform = `translate(${x.toFixed(3)}%, ${y.toFixed(3)}%) rotate(${rot.toFixed(2)}deg)`;
      });
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.e += dt;

      if (state.e < wind + spin) {
        const a = angleAt(state.e);
        const a2 = angleAt(state.e + 0.016);
        const vel = Math.abs(a2 - a) / 0.016;
        const sx = Math.cos(a);
        const p = wind + spin > 0 ? (state.e - wind) / spin : 1;
        if (!state.swapped && p > 0.45 && state.prevCos !== undefined && (state.prevCos < 0) !== (sx < 0)) {
          state.swapped = true;
          if (spinElRef.current) spinElRef.current.style.backgroundImage = `url(${fullImg})`;
          fireRing(ringElRef.current);
        }
        state.prevCos = sx;
        const lean = Math.sin(a) * 3.5;
        const lift = -1.2 * Math.min(1, vel / 26);
        const blur = Math.min(7, vel * 0.22);
        if (spinElRef.current) {
          spinElRef.current.style.transform = `translateY(${lift.toFixed(2)}%) rotate(${lean.toFixed(2)}deg) scaleX(${sx.toFixed(4)})`;
          spinElRef.current.style.filter = blur > 0.4
            ? `blur(${blur.toFixed(2)}px) drop-shadow(0 0 26px rgba(255,62,165,${Math.min(0.65, vel / 44).toFixed(2)}))`
            : "none";
        }
        setStreaks(streakElsRef.current, Math.min(1, Math.max(0, vel / 30 - 0.25)));
      } else if (state.e < done) {
        const p = settle > 0 ? (state.e - wind - spin) / settle : 1;
        const d = Math.exp(-5.5 * p) * Math.cos(11 * p);
        if (spinElRef.current) {
          spinElRef.current.style.transform = `rotate(${(d * 2.2).toFixed(2)}deg) scaleX(${(1 - d * 0.13).toFixed(4)})`;
          spinElRef.current.style.filter = "none";
        }
        setStreaks(streakElsRef.current, 0);
      } else {
        if (!state.handed) {
          state.handed = true;
          if (spinElRef.current) spinElRef.current.style.opacity = "0";
          if (rigElRef.current) rigElRef.current.style.opacity = "1";
          state.t = 0;
        }
        state.t = (state.t + dt / (FRAMES / fps)) % 1;
        applyPose(state.t);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      {[
        { top: "36%", height: 6, color: "#FF3EA5" },
        { top: "47%", height: 4, color: "var(--sunny-yellow)" },
        { top: "58%", height: 6, color: "#FF3EA5" }
      ].map((s, i) => (
        <div
          key={i}
          ref={(el) => (streakElsRef.current[i] = el)}
          style={{
            position: "absolute", left: 0, right: 0, top: s.top, height: s.height,
            background: s.color, opacity: 0, transform: "scaleX(0)", pointerEvents: "none"
          }}
        />
      ))}

      <div style={{ position: "relative", width: rigW, height: rigH }}>
        <div
          ref={ringElRef}
          style={{
            position: "absolute", left: "50%", top: "46%",
            width: rigW * 0.9, height: rigW * 0.9,
            marginLeft: -(rigW * 0.9) / 2, marginTop: -(rigW * 0.9) / 2,
            border: "6px solid var(--sunny-yellow)", borderRadius: 999,
            opacity: 0, transform: "scale(.2)", pointerEvents: "none"
          }}
        />

        <div
          ref={spinElRef}
          style={{
            position: "absolute", left: "50%", bottom: 0,
            width: spinW, height: spinH,
            marginLeft: -spinW / 2,
            backgroundImage: `url(${plainImg})`,
            backgroundSize: "100% 100%", backgroundRepeat: "no-repeat",
            transformOrigin: "50% 100%", opacity: 0, pointerEvents: "none"
          }}
        />

        <div ref={rigElRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
          {RAIL_RIDER_BANDS.map((b, i) => (
            <div
              key={i}
              ref={(el) => (bandElsRef.current[i] = el)}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${bodyImg})`,
                backgroundSize: "100% 100%", backgroundRepeat: "no-repeat",
                clipPath: `inset(${b.y0}% 0 ${Math.max(0, 100 - b.y1)}% 0)`,
                transformOrigin: `50% ${b.yc}%`,
                willChange: "transform", pointerEvents: "none"
              }}
            />
          ))}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${railImg})`,
            backgroundSize: "100% 100%", backgroundRepeat: "no-repeat",
            pointerEvents: "none"
          }} />
        </div>
      </div>
    </div>
  );
}
