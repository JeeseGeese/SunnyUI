import React, { useEffect, useRef, useState } from "react";
import {
  DURATION_MS, CUE, STAGES,
  clamp, progressAt, fadeWindow, pop
} from "../animations/sunnyBootSequence";

const ACCENT = "#FFC61E";
const ACCENT_HI = "#FFE066";

/*
  Full-viewport boot/loading sequence, ported from the approved "Sunny Boot
  Sequence Animation" design handoff -- a single continuous 60s composition
  (see sunnyBootSequence.js for the timing table). Mounted once ahead of the
  main UI (see App.jsx); calls onComplete a single time at 60,000ms so the
  host can swap it out for the real app, which then runs its own stage
  power-on (SunnyStagePowerOn) as it mounts fresh.
*/
export default function SunnyBootSequence({ onComplete }) {
  const [ms, setMs] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    let raf;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = now - start;
      setMs(elapsed);
      if (!firedRef.current && elapsed >= DURATION_MS) {
        firedRef.current = true;
        onComplete?.();
      }
      if (elapsed < DURATION_MS + 600) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = clamp(ms, 0, DURATION_MS + 500);
  const pct = progressAt(t);

  // Power-on: two quick flickers, then settle by 1.2s.
  const powerOn = t > 1200
    ? 1
    : Math.min(1, t < 220 ? t / 1200 : t < 340 ? 0.85 : t < 500 ? 0.35 : t / 1200);

  let barIn = clamp((t - 550) / 600, 0, 1);
  barIn = 1 - Math.pow(1 - barIn, 3); // outCubic

  const motorPulse = pop(t, CUE.speaker - 450, 700, 0.016);
  const completePulse = pop(t, CUE.complete + 850, 800, 0.022);
  const barScale = motorPulse * completePulse;

  const eqAmt = fadeWindow(t, CUE.speaker, CUE.photo, 500, 500);
  const eq = eqAmt * (0.5 + 0.5 * Math.sin(((t - CUE.speaker) / 1000) * 9));
  const photoAmt = fadeWindow(t, CUE.photo, CUE.complete + 1200, 800, 800);
  const glow = 0.35 + 0.35 * eq + 0.45 * photoAmt + 36 * (completePulse - 1);

  let sweep = ((t - CUE.photo) / 2600) % 1;
  if (sweep < 0) sweep += 1;

  const dotPulse = 0.55 + 0.45 * Math.sin((t / 1000) * 3.4);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#08080A",
      fontFamily: '"Baloo 2", system-ui, sans-serif',
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden"
    }}>
      {/* sanctioned technical stage: faint grid + warm radial */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5 * powerOn,
        backgroundImage:
          "linear-gradient(rgba(255,198,30,.045) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255,198,30,.045) 1px, transparent 1px)",
        backgroundSize: "14px 14px"
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "52%", width: 900, height: 620,
        transform: "translate(-50%,-50%)", pointerEvents: "none",
        opacity: 0.55 * powerOn * (0.75 + 0.25 * (pct / 100)),
        background: "radial-gradient(closest-side, rgba(255,198,30,.13), rgba(255,198,30,0))"
      }} />

      <div style={{
        position: "relative", width: 660, maxWidth: "82vw",
        display: "flex", flexDirection: "column", alignItems: "stretch", gap: 26
      }}>
        {/* status line -- one message at a time */}
        <div style={{ position: "relative", height: 58, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 14, height: 14, borderRadius: 999, flex: "0 0 auto",
            background: ACCENT, opacity: powerOn * (0.35 + 0.65 * dotPulse),
            boxShadow: `0 0 ${10 + 14 * dotPulse}px rgba(255,198,30,${0.25 + 0.35 * dotPulse})`
          }} />
          <div style={{ position: "relative", flex: 1, height: 58 }}>
            {STAGES.map((s, i) => {
              const o = fadeWindow(t, s.from, s.to, 320, 280);
              return (
                <div key={i} style={{
                  position: "absolute", left: 0, top: 0, right: 0, height: 58,
                  display: "flex", alignItems: "center",
                  opacity: o * (i === 0 ? powerOn : 1),
                  fontFamily: s.display ? '"Bungee", system-ui, sans-serif' : '"Baloo 2", system-ui, sans-serif',
                  fontWeight: s.display ? 400 : 700,
                  fontSize: s.display ? 40 : 38,
                  letterSpacing: s.display ? "0.04em" : "0.01em",
                  color: s.display ? ACCENT : "#FFF6E0",
                  textTransform: s.display ? "uppercase" : "none",
                  textShadow: s.display
                    ? "0 0 24px rgba(255,198,30,.35)"
                    : `0 0 ${14 * (i === 0 ? powerOn : 1)}px rgba(255,246,224,.14)`,
                  whiteSpace: "nowrap"
                }}>{s.text}</div>
              );
            })}
          </div>
        </div>

        {/* loading bar */}
        <div style={{
          position: "relative", height: 34, borderRadius: 999,
          background: "#000",
          border: `2px solid ${barIn > 0.5 ? "#4A4A55" : "#232329"}`,
          opacity: barIn,
          transform: `scaleX(${0.965 + 0.035 * barIn}) scale(${barScale})`,
          transformOrigin: "50% 50%",
          overflow: "hidden",
          boxShadow: "inset 0 2px 0 rgba(0,0,0,.6)"
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct}%`,
            borderRadius: 999,
            background: `linear-gradient(180deg, ${ACCENT_HI} 0%, ${ACCENT} 45%, #E0A100 100%)`,
            boxShadow: `0 0 ${12 + 18 * glow}px rgba(255,198,30,${0.18 + 0.3 * glow})`,
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "38%",
              left: `${sweep * 138 - 38}%`,
              opacity: 0.5 * photoAmt,
              background: "linear-gradient(90deg, rgba(91,232,108,0), rgba(160,255,140,.85), rgba(91,232,108,0))"
            }} />
          </div>
        </div>

        {/* readout */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 16, letterSpacing: "0.06em", opacity: barIn * 0.9
        }}>
          <span style={{ color: "#6E6E7C", textTransform: "uppercase" }}>sunny · sys boot</span>
          <span style={{ color: pct >= 100 ? ACCENT : "#E8DCC0" }}>{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  );
}
