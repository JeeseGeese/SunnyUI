import React, { useEffect, useRef, useState } from "react";
import litBaseImg from "../assets/sunny/stagepoweron/litBase.png";
import darkBaseImg from "../assets/sunny/stagepoweron/darkBase.png";
import bannerLeftImg from "../assets/sunny/stagepoweron/bannerLeft.png";
import bannerRightImg from "../assets/sunny/stagepoweron/bannerRight.png";
import {
  CW, CH, CUES, MOTION, Easing, clamp,
  BANNERS_LAYOUT, TRUSS, TRUSS_GLOW, STATIONS,
  rectClip, circleClip, STAGE_POWER_ON_SECONDS
} from "../animations/sunnyStagePowerOn";

const BANNER_IMG = { left: bannerLeftImg, right: bannerRightImg };

// How much of the 1024px-tall design canvas's top margin to trim so the
// visible 1536x696 window lines up with sunny-nav-banner.png's own (more
// tightly cropped) framing of the same truss+medallions+banners artwork
// underneath. Measured directly: litBase.png/darkBase.png's topmost opaque
// pixel row is 171 (of 1024); sunny-nav-banner.png's is 16 (of 696). Cropping
// 171-16=155px off the top lines the two truss beams up flush. Re-measure if
// either asset is re-exported.
const CROP_TOP_PX = 155;

// Fade the overlay out over this long once the Hold scene finishes, so any
// small pixel misalignment with the real nav bar underneath isn't a hard cut.
const FADE_MS = 260;

function Lit({ clip, o, src }) {
  return (
    <img
      src={src}
      alt=""
      draggable="false"
      style={{
        position: "absolute", left: 0, top: 0, width: CW, height: CH,
        clipPath: clip, WebkitClipPath: clip, opacity: clamp(o, 0, 1),
        pointerEvents: "none", userSelect: "none"
      }}
    />
  );
}

function Glow({ x, y, w, h, color, o }) {
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h,
        background: `radial-gradient(closest-side, ${color}, rgba(0,0,0,0))`,
        mixBlendMode: "screen", opacity: clamp(o, 0, 1), pointerEvents: "none"
      }}
    />
  );
}

function StageIntroScene({ T }) {
  const glow = 1;
  const stagger = 1;

  const surge = (() => {
    const t = T - CUES.PowerSurge;
    if (t < 0) return 0;
    if (t < 0.22) return Easing.easeOutQuad(t / 0.22);
    return 1 - Easing.easeInOutSine(clamp((t - 0.22) / 0.38, 0, 1));
  })();
  const globalLit = MOTION.enter(0, 1, CUES.PowerSurge - 0.25, CUES.PowerSurge + 0.35)(T);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, overflow: "hidden" }}>
      <img src={darkBaseImg} alt="" draggable="false" style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH }} />

      {/* PHASE 1 -- banners descend + unroll from the top beam */}
      {BANNERS_LAYOUT.map((b) => {
        const start = 0.05 + b.off * stagger;
        const end = start + 1.05;
        const p = MOTION.enter(0, 1, start, end)(T);
        const closed = 16;
        const h = clamp(closed + p * (b.h - closed) + 9 * MOTION.settle(T, end), closed, b.h + 10);
        const rolling = T < end + 0.02;
        const bright = 0.42 + 0.43 * Easing.easeOutQuad(clamp((T - start) / 1.4, 0, 1))
          + 0.15 * Easing.easeOutQuad(clamp((T - (CUES.PowerSurge - 0.25)) / 0.6, 0, 1));
        return (
          <React.Fragment key={b.key}>
            <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: Math.min(h, b.h), overflow: "hidden" }}>
              <img
                src={BANNER_IMG[b.key]}
                alt=""
                draggable="false"
                style={{
                  position: "absolute", left: 0, top: 0, width: b.w, height: b.h,
                  filter: `brightness(${bright.toFixed(3)}) saturate(${(0.6 + 0.4 * bright).toFixed(3)})`
                }}
              />
            </div>
            {rolling ? (
              <div style={{
                position: "absolute", left: b.topL, top: b.y + Math.min(h, b.h) - 15,
                width: b.topR - b.topL, height: 18, borderRadius: 9,
                background: "linear-gradient(180deg,#3a1050 0%,#a5199a 42%,#2b0c3f 100%)",
                boxShadow: "0 3px 0 rgba(0,0,0,0.55)",
                opacity: clamp((end + 0.02 - T) / 0.18, 0, 1)
              }} />
            ) : null}
          </React.Fragment>
        );
      })}

      {/* PHASE 2 -- top truss neon wakes up left -> right */}
      {TRUSS.map(([l, r], i) => {
        const at = CUES.TrussNeon - 0.35 + i * 0.17 * stagger;
        return <Lit key={`t${i}`} src={litBaseImg} clip={rectClip(l, 148, r, 352)} o={MOTION.lamp(T, at)} />;
      })}
      {TRUSS_GLOW.map((g, i) => (
        <Glow key={`tg${i}`} x={g.x} y={g.y} w={330} h={130} color={g.c}
          o={MOTION.lamp(T, CUES.TrussNeon - 0.35 + i * 0.17 * stagger) * 0.85 * glow} />
      ))}

      {/* PHASE 3 -- HOME / STATUS / DIAG rings, then their label neon */}
      {STATIONS.map((s, i) => {
        const ringAt = CUES.Stations - 0.15 + s.d * stagger;
        const labelAt = ringAt + 0.24;
        const ro = MOTION.lamp(T, ringAt), lo = MOTION.lamp(T, labelAt);
        return (
          <React.Fragment key={`s${i}`}>
            <Lit src={litBaseImg} clip={circleClip(s.ring[0], s.ring[1], s.ring[2])} o={ro} />
            <Glow x={s.ring[0]} y={s.ring[1]} w={s.ring[2] * 2.9} h={s.ring[2] * 2.9} color={s.ringGlow} o={ro * 0.5 * glow} />
            <Lit src={litBaseImg} clip={rectClip(s.plaque[0], s.plaque[1], s.plaque[2], s.plaque[3])} o={lo} />
            <Glow x={(s.plaque[0] + s.plaque[2]) / 2} y={s.plaque[3] - 16}
              w={s.plaque[2] - s.plaque[0] + 90} h={110} color={s.glow} o={lo * 0.8 * glow} />
          </React.Fragment>
        );
      })}

      {/* PHASE 4 -- side stage lights + end-plate lotus plates */}
      <Lit src={litBaseImg} clip={rectClip(0, 150, 118, 356)} o={MOTION.lamp(T, CUES.StageLights - 0.1)} />
      <Lit src={litBaseImg} clip={rectClip(1418, 150, CW, 356)} o={MOTION.lamp(T, CUES.StageLights + 0.05)} />
      <Glow x={68} y={278} w={200} h={200} color="rgba(255,60,200,0.4)" o={MOTION.lamp(T, CUES.StageLights - 0.1) * 0.8 * glow} />
      <Glow x={1462} y={278} w={200} h={200} color="rgba(190,70,255,0.4)" o={MOTION.lamp(T, CUES.StageLights + 0.05) * 0.8 * glow} />
      <Lit src={litBaseImg} clip={rectClip(282, 500, 356, 642)} o={MOTION.lamp(T, CUES.StageLights + 0.22)} />
      <Lit src={litBaseImg} clip={rectClip(1174, 530, 1244, 638)} o={MOTION.lamp(T, CUES.StageLights + 0.4)} />
      <Glow x={318} y={594} w={240} h={200} color="rgba(60,180,255,0.5)" o={MOTION.lamp(T, CUES.StageLights + 0.22) * 0.9 * glow} />
      <Glow x={1208} y={588} w={220} h={190} color="rgba(200,80,255,0.5)" o={MOTION.lamp(T, CUES.StageLights + 0.4) * 0.9 * glow} />

      {/* PHASE 5 -- everything reaches the master frame, one electrical swell */}
      <Lit src={litBaseImg} clip={rectClip(0, 0, CW, CH)} o={globalLit} />
      <div style={{
        position: "absolute", inset: 0, background: "#fff6e0",
        mixBlendMode: "screen", opacity: surge * 0.11 * glow, pointerEvents: "none"
      }} />
    </div>
  );
}

/*
  Plays the stage power-on once over the nav bar, then calls onComplete so
  the caller can unmount it and reveal the real (already-live underneath)
  SunnyNavBar. Sized by fitting the reference's 1536x1024 design canvas to
  this element's own measured width, then cropped/shifted (CROP_TOP_PX) to
  match sunny-nav-banner.png's tighter framing of the same artwork -- see
  the module doc comment in sunnyStagePowerOn.js.
*/
export default function SunnyStagePowerOn({ onComplete }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0);
  const [T, setT] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setScale(w / CW);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduced = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setT(STAGE_POWER_ON_SECONDS);
      setFading(true);
      const t = setTimeout(() => onComplete?.(), FADE_MS);
      return () => clearTimeout(t);
    }

    let raf;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      if (elapsed >= STAGE_POWER_ON_SECONDS) {
        setT(STAGE_POWER_ON_SECONDS);
        setFading(true);
        setTimeout(() => onComplete?.(), FADE_MS);
        return;
      }
      setT(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease`, pointerEvents: "none"
      }}
    >
      {scale > 0 ? (
        <div style={{
          position: "absolute", left: 0, top: -CROP_TOP_PX * scale,
          width: CW, height: CH,
          transform: `scale(${scale})`, transformOrigin: "top left"
        }}>
          <StageIntroScene T={T} />
        </div>
      ) : null}
    </div>
  );
}
