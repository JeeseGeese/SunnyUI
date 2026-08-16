import React, { useEffect, useRef, useState } from "react";

export default function SunnyPoseAnimation({
  animation,
  alt = "Sunny animation",
  paused = false
}) {
  const frames = animation?.frames || [];
  const [index, setIndex] = useState(0);

  // Tracks how many times the repeat window (repeatFrom..repeatUntil) has
  // played and the currently-picked repeat count, for animations like
  // headbang that repeat a "bang" section a random number of times before
  // settling out. Reset whenever the animation itself changes.
  const repeatState = useRef({ cycles: 0, target: 0 });

  useEffect(() => {
    setIndex(0);
    repeatState.current = { cycles: 0, target: 0 };
  }, [animation]);

  useEffect(() => {
    if (paused || frames.length < 2) return;

    const current = frames[index];
    const timer = window.setTimeout(() => {
      setIndex((oldIndex) => {
        const { repeatFrom, repeatUntil, repeatMin, repeatMax } = animation || {};
        const hasRepeatWindow =
          Number.isInteger(repeatFrom) && Number.isInteger(repeatUntil);
        let next = oldIndex + 1;

        if (hasRepeatWindow && oldIndex === repeatUntil) {
          repeatState.current.cycles += 1;
          if (repeatState.current.cycles === 1) {
            const lo = Math.max(1, repeatMin ?? 1);
            const hi = Math.max(lo, repeatMax ?? lo);
            repeatState.current.target = lo + Math.floor(Math.random() * (hi - lo + 1));
          }
          if (repeatState.current.cycles < repeatState.current.target) {
            next = repeatFrom;
          }
        }

        if (next < frames.length) return next;

        repeatState.current = { cycles: 0, target: 0 };
        return animation?.loop === false ? oldIndex : 0;
      });
    }, current?.holdMs ?? 180);

    return () => window.clearTimeout(timer);
  }, [animation, frames, index, paused]);

  if (!frames.length) return null;

  const frame = frames[index];
  // A frame can cap the animation's baseScale lower than the default — used
  // when a specific pose's silhouette reaches further out than most frames
  // do, so the shared zoom would clip it. See sunnyAnimations.js.
  const baseScale = frame.baseScale ?? animation?.baseScale ?? 1;

  const img = (
    <img
      src={frame.src}
      alt={alt}
      draggable="false"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "bottom center",
        transform: `scale(${frame.scale ?? 1})`,
        filter: frame.blur ? `blur(${frame.blur}px)` : "none",
        userSelect: "none",
        pointerEvents: "none"
      }}
    />
  );

  // baseScale crops in on a pose set whose source canvas carries extra
  // headroom (see sunnyAnimations.js). Applied as its own bottom-anchored
  // wrapper, separate from the per-frame `frame.scale` above, so it doesn't
  // change that existing (reference-faithful, center-origin) squash/impact
  // emphasis — it only trims the outer margin, clipped by this wrapper.
  if (baseScale === 1) return img;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      transform: `scale(${baseScale})`,
      transformOrigin: "50% 100%"
    }}>
      {img}
    </div>
  );
}
