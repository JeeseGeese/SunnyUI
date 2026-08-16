import { useEffect, useState } from "react";

/*
  DEMO / MOCK SPECTRUM DATA.

  This hook fabricates a plausible, smoothly animated audio spectrum for
  prototyping <SunnySpectrumAnalyzer />. It is NOT connected to Sunny's
  physical INMP441 microphone or any real audio pipeline.

  Future real architecture:
    INMP441 mic -> ESP32 samples -> FFT -> normalized [0..1] bands
  should be delivered in this exact shape (an array of numbers, one per
  band) so it can replace this hook as a drop-in without changing
  SunnySpectrumAnalyzer or anything that consumes its output.
*/
export default function useMockSpectrum({ bandCount = 12, active = true } = {}) {
  const [bands, setBands] = useState(() =>
    Array.from({ length: bandCount }, () => 0.15)
  );

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!active || reduceMotion) {
      // Static (non-animated) but still music-shaped snapshot.
      setBands(Array.from({ length: bandCount }, (_, i) =>
        0.22 + 0.32 * Math.abs(Math.sin(i * 0.8 + 1.2))
      ));
      return;
    }

    // Each band eases toward an occasionally-shifting random target rather
    // than jumping to a new random value every frame - attack (rise) is
    // faster than release (fall), like real VU meter ballistics.
    const bandState = Array.from({ length: bandCount }, () => ({
      value: 0.15 + Math.random() * 0.2,
      target: 0.2 + Math.random() * 0.5,
      nextTargetAt: performance.now() + 150 + Math.random() * 350
    }));

    // Throttled to ~24fps: this is a decorative simulation (plant garden +
    // a mic-level meter), not something that needs to be pixel-perfectly
    // smooth. Driving a React state update at full 60fps here was cascading
    // into every plant band re-rendering 60x/sec, which was enough main-
    // thread contention to visibly delay unrelated setTimeout-scheduled
    // animation timing elsewhere on the page (e.g. Headbang).
    const FRAME_INTERVAL_MS = 1000 / 15;
    let raf;
    let lastUpdate = 0;
    const tick = (now) => {
      if (now - lastUpdate >= FRAME_INTERVAL_MS) {
        lastUpdate = now;
        for (const b of bandState) {
          if (now >= b.nextTargetAt) {
            b.target = 0.08 + Math.random() * 0.85;
            b.nextTargetAt = now + 150 + Math.random() * 350;
          }
          const rising = b.target > b.value;
          b.value += (b.target - b.value) * (rising ? 0.16 : 0.06);
        }
        setBands(bandState.map((b) => Math.max(0, Math.min(1, b.value))));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bandCount, active]);

  return bands;
}
