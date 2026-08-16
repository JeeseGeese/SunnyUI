import React from "react";
import { TOUCH_SCREEN_WIDTH, TOUCH_SCREEN_HEIGHT } from "./touchscreenTokens";

/*
  Development-only chrome around the 320x240 touchscreen screen — a neutral
  backdrop, a hairline boundary marking exactly what the physical E32R28T
  panel will show, and a one-line label. Nothing inside the boundary is
  affected by this frame.

  `zoom` scales the finished 320x240 layout up for desktop inspection
  (?zoom=2 etc.). It is a preview magnifier only — the logical layout stays
  exactly 320x240 — and is NOT the touchscreen fitting mechanism.
*/
export default function TouchscreenPreviewFrame({ zoom = 1, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#23262C",
        padding: 24
      }}
    >
      <div>
        <div
          style={{
            marginBottom: 10,
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: ".06em",
            color: "rgba(255,255,255,.55)",
            textAlign: "center",
            userSelect: "none"
          }}
        >
          E32R28T · {TOUCH_SCREEN_WIDTH}×{TOUCH_SCREEN_HEIGHT} landscape (rotation 3)
          {zoom > 1 ? ` · preview zoom ${zoom}×` : " · actual pixels"}
        </div>
        <div
          style={{
            width: TOUCH_SCREEN_WIDTH * zoom,
            height: TOUCH_SCREEN_HEIGHT * zoom
          }}
        >
          <div
            style={{
              width: TOUCH_SCREEN_WIDTH,
              height: TOUCH_SCREEN_HEIGHT,
              transform: zoom > 1 ? `scale(${zoom})` : undefined,
              transformOrigin: "top left",
              outline: "1px solid rgba(255, 212, 71, .85)",
              outlineOffset: 1
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
