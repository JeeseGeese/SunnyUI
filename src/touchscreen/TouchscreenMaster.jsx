import React, { useLayoutEffect, useRef, useState } from "react";
import ComponentShowcase from "../screens/ComponentShowcase";
import {
  TOUCH_SCREEN_WIDTH,
  TOUCH_SCREEN_HEIGHT,
  MASTER_WIDTH
} from "./touchscreenTokens";

/*
  Touchscreen mode = the approved pV1.0 screen, miniaturized as ONE unit.

  The REAL ComponentShowcase renders here, live and interactive, in its own
  approved 900px-wide coordinate system — every child keeps its approved
  position, size, spacing, and overlap, and all animation/state runs in
  master coordinates. The master's rendered height is measured from the DOM
  (ResizeObserver, so page changes re-fit automatically), then the whole
  composition gets ONE uniform contain-scale:

      scale = min(320 / MASTER_WIDTH, 240 / masterHeight)

  centered in the 320x240 canvas. No per-element touchscreen layout, no
  X/Y-independent scaling, no cropping; any leftover margin stays neutral
  background.

  Two deliberate, touchscreen-scoped presentation adjustments (scoped CSS
  below — the approved components/files themselves are untouched):
  - the dev-library text header ("Sunny Component Library" eyebrow/title/
    blurb) is hidden: the approved master reference begins at the Sunny
    logo, and that text is component-library chrome, not Sunny UI.
  - .sunny-shell's min-height:100vh is neutralized inside the master so
    the measured height is the composition's real content bounds (the
    shell's own align-content:start means children are laid out
    identically either way — trailing empty space is all that differs).

  The canvas background mirrors sunny.css's body backgrounds (keyed off
  the same [data-sunny-background] attribute the in-app picker sets), so
  the small letterbox margins read as the same stage environment.
*/
export default function TouchscreenMaster() {
  const masterRef = useRef(null);
  const [masterHeight, setMasterHeight] = useState(null);

  useLayoutEffect(() => {
    const el = masterRef.current;
    if (!el) return undefined;
    const measure = () => setMasterHeight(el.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = masterHeight
    ? Math.min(TOUCH_SCREEN_WIDTH / MASTER_WIDTH, TOUCH_SCREEN_HEIGHT / masterHeight)
    : TOUCH_SCREEN_WIDTH / MASTER_WIDTH;
  const left = (TOUCH_SCREEN_WIDTH - MASTER_WIDTH * scale) / 2;
  const top = masterHeight
    ? Math.max(0, (TOUCH_SCREEN_HEIGHT - masterHeight * scale) / 2)
    : 0;

  return (
    <div
      className="ts-master"
      style={{
        position: "relative",
        width: TOUCH_SCREEN_WIDTH,
        height: TOUCH_SCREEN_HEIGHT,
        overflow: "hidden"
      }}
    >
      <div
        ref={masterRef}
        data-master-height={masterHeight ?? "measuring"}
        data-master-scale={scale.toFixed(4)}
        style={{
          position: "absolute",
          left,
          top,
          width: MASTER_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        }}
      >
        <ComponentShowcase />
      </div>

      <style>{`
        /* Content bounds, not viewport-filler, drive the measured height. */
        .ts-master .sunny-shell {
          min-height: 0;
        }

        /* Component-library text chrome — not part of the approved Sunny
           screen composition (which begins at the Sunny logo). */
        .ts-master .sunny-shell > header {
          display: none;
        }

        /* Mirror of sunny.css's body backgrounds so the letterbox margins
           match the active background mode. Values copied verbatim; keep
           in sync if sunny.css's body backgrounds ever change. */
        .ts-master {
          background:
            radial-gradient(circle at 10% 10%, rgba(255, 212, 71, .38), transparent 26%),
            radial-gradient(circle at 90% 18%, rgba(99, 184, 87, .18), transparent 24%),
            var(--sunny-cream);
        }

        :root[data-sunny-background="dark"] .ts-master {
          background:
            radial-gradient(circle at 10% 10%, rgba(255, 212, 71, .12), transparent 30%),
            radial-gradient(circle at 90% 18%, rgba(99, 184, 87, .10), transparent 26%),
            #1C1917;
        }

        :root[data-sunny-background="party"] .ts-master {
          background:
            radial-gradient(circle at 15% 15%, rgba(255, 212, 71, .60), transparent 38%),
            radial-gradient(circle at 85% 10%, rgba(255, 138, 48, .50), transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(99, 184, 87, .48), transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(199, 125, 255, .52), transparent 42%),
            radial-gradient(circle at 50% 50%, rgba(255, 105, 180, .28), transparent 55%),
            #1B1420;
        }
      `}</style>
    </div>
  );
}
