import React, { useEffect, useRef, useState } from "react";
import {
  CUE_DATA, CUES, LOOP, MOTION, SPRITE_W, SPRITE_H,
  TRACK_TIMELINE, Easing, warpToAuthored
} from "../animations/sunnyGyrateDance";

import pose01 from "../assets/sunny/gyrate/pose01.png";
import pose02 from "../assets/sunny/gyrate/pose02.png";
import pose03 from "../assets/sunny/gyrate/pose03.png";
import pose04 from "../assets/sunny/gyrate/pose04.png";
import pose05 from "../assets/sunny/gyrate/pose05.png";
import pose06 from "../assets/sunny/gyrate/pose06.png";
import pose07 from "../assets/sunny/gyrate/pose07.png";
import pose08 from "../assets/sunny/gyrate/pose08.png";
import pose09 from "../assets/sunny/gyrate/pose09.png";
import pose10 from "../assets/sunny/gyrate/pose10.png";
import pose11 from "../assets/sunny/gyrate/pose11.png";
import pose12 from "../assets/sunny/gyrate/pose12.png";
import pose13 from "../assets/sunny/gyrate/pose13.png";
import pose14 from "../assets/sunny/gyrate/pose14.png";
import pose15 from "../assets/sunny/gyrate/pose15.png";
import pose16 from "../assets/sunny/gyrate/pose16.png";
import pose17 from "../assets/sunny/gyrate/pose17.png";
import pose18 from "../assets/sunny/gyrate/pose18.png";
import pose19 from "../assets/sunny/gyrate/pose19.png";
import pose20 from "../assets/sunny/gyrate/pose20.png";

const POSES = [
  pose01, pose02, pose03, pose04, pose05, pose06, pose07, pose08, pose09, pose10,
  pose11, pose12, pose13, pose14, pose15, pose16, pose17, pose18, pose19, pose20
];

export default function SunnyGyrateAnimation({
  size = 340,
  paused = false,
  bootyGain = 1,
  swayGain = 1,
  crossfadeMs = 0
}) {
  // Fit-by-width, matching the object-fit:"contain" + bottom-center
  // convention used everywhere else in SunnyCharacter — the sprite (340x320)
  // is wider than tall, so width is the constraining dimension in a square box.
  const scale = size / SPRITE_W;

  const [, tick] = useState(0);
  const playT = useRef(0); // wall-clock playback seconds, wraps at CUE_DATA.total

  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    let raf;
    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      playT.current = (playT.current + dt) % CUE_DATA.total;
      tick((n) => n + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const T = warpToAuthored(CUE_DATA, playT.current);
  const loopT = ((T % LOOP) + LOOP) % LOOP;

  let idx = 0;
  for (let i = 0; i < TRACK_TIMELINE.length; i++) {
    if (loopT >= TRACK_TIMELINE[i].start) idx = i;
  }
  const cur = TRACK_TIMELINE[idx];
  const next = TRACK_TIMELINE[(idx + 1) % TRACK_TIMELINE.length];
  const xfade = crossfadeMs / 1000;
  const fade = Math.min(xfade, (cur.end - cur.start) * 0.25);
  const fadeStart = cur.end - fade;
  const f = fade > 0 && loopT > fadeStart
    ? Easing.easeInOutSine(Math.min(1, (loopT - fadeStart) / fade))
    : 0;

  const c = MOTION.compress(loopT);
  const s = MOTION.sway(loopT) * swayGain;
  const cheek = MOTION.spring(loopT, 0.048, 0.125) * 0.085 * bootyGain;

  // 1. hips: sway + drop, anchored at the pot rim
  const hips = `translate3d(${(s * 2.2).toFixed(2)}px, 0, 0) rotate(${(s * 2.6).toFixed(2)}deg)`;
  // 2. body compression, same anchor (volume preserved)
  const squash = `translate3d(0, ${(c * 2.4).toFixed(2)}px, 0) scale(${(1 + c * 0.05).toFixed(4)}, ${(1 - c * 0.06).toFixed(4)}) rotate(${(-s * 1.1).toFixed(2)}deg)`;
  // 3. soft-body follow-through: origin at the head, so the booty carries the jiggle
  const softLift = cheek * 250;
  const soft = `translate3d(0, ${softLift.toFixed(2)}px, 0) scale(${(1 + cheek * 1.25).toFixed(4)}, ${(1 - cheek).toFixed(4)})`;

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
      <div style={{ position: "relative", width: SPRITE_W * scale, height: SPRITE_H * scale }}>
        <div style={{
          position: "absolute", left: 0, top: 0, width: SPRITE_W, height: SPRITE_H,
          transformOrigin: "0 0", transform: `scale(${scale})`
        }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 94%", transform: hips }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 94%", transform: squash }}>
              <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 16%", transform: soft }}>
                {POSES.map((src, i) => {
                  const p = i + 1;
                  const on = p === cur.pose ? 1 - f : (p === next.pose ? f : 0);
                  return (
                    <img
                      key={p}
                      src={src}
                      alt=""
                      draggable="false"
                      decoding="sync"
                      style={{
                        position: "absolute", left: 0, top: 0, width: SPRITE_W, height: SPRITE_H,
                        opacity: on, willChange: "opacity", backfaceVisibility: "hidden",
                        pointerEvents: "none", userSelect: "none"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
