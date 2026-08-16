import React from "react";
import navBanner from "../assets/sunny/sunny-nav-banner.png";

/*
  Measured directly from sunny-nav-banner.png (1536x696 after cropping,
  rendered here at width:100%/height:auto so these percentages hold at any
  size). Each item's tap target covers its medallion + wooden nameplate sign
  together (a bigger, easier target). `bar` is the neon underglow strip
  beneath that item's sign specifically (color-detected per item: pink under
  Home/Diag, cyan under Status) — the source art has all three lit
  simultaneously, so the unselected two get covered by an opaque dark mask
  shaped to that strip, making them read as "off" while the selected one
  shows through. The side spotlights are a separate decoration further out
  toward the truss ends and are never masked. Positions are keyed by item id
  and only work for the fixed home/status/diag layout baked into this
  artwork — if the item set or artwork changes, these need to be redone.
*/
const NAV_HOTSPOTS = {
  home: {
    left: 31.25, top: 41.7, width: 19.3, height: 38.1,
    bar: { left: 24.7, top: 64.7, width: 12.0, height: 3.3 }
  },
  status: {
    left: 50.2, top: 41.7, width: 19.1, height: 38.1,
    bar: { left: 43.8, top: 64.8, width: 12.0, height: 3.3 }
  },
  diag: {
    left: 69.3, top: 41.7, width: 19.0, height: 38.1,
    bar: { left: 64.0, top: 64.8, width: 12.0, height: 3.3 }
  }
};

export default function SunnyNavBar({ items, active, onChange }) {
  return (
    <nav style={{ position: "relative", width: "100%", lineHeight: 0 }}>
      <img
        src={navBanner}
        alt="Sunny navigation"
        draggable="false"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          userSelect: "none",
          pointerEvents: "none"
        }}
      />

      {items.map((item) => {
        const spot = NAV_HOTSPOTS[item.id];
        if (!spot) return null;
        const selected = active === item.id;
        return (
          <React.Fragment key={item.id}>
            <span
              aria-hidden="true"
              className={selected ? "sunny-navbanner-bardim is-off" : "sunny-navbanner-bardim"}
              style={{
                left: `${spot.bar.left}%`,
                top: `${spot.bar.top}%`,
                width: `${spot.bar.width}%`,
                height: `${spot.bar.height}%`
              }}
            />
            <span
              style={{
                position: "absolute",
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <button
                type="button"
                onClick={() => onChange?.(item.id)}
                aria-label={item.label}
                aria-pressed={selected}
                className="sunny-navbanner-hotspot"
              />
            </span>
          </React.Fragment>
        );
      })}

      <style>{`
        .sunny-navbanner-hotspot {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: none;
          border-radius: 18px;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background 140ms ease, transform 140ms ease;
        }

        .sunny-navbanner-hotspot:hover {
          background: rgba(255,255,255,.10);
        }

        .sunny-navbanner-hotspot:active {
          transform: scale(0.96);
        }

        .sunny-navbanner-hotspot:focus-visible {
          outline: 2px solid white;
          outline-offset: 3px;
        }

        .sunny-navbanner-bardim {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          background: #0a0a0a;
          opacity: .92;
          transition: opacity 180ms ease;
        }

        .sunny-navbanner-bardim.is-off {
          opacity: 0;
        }
      `}</style>
    </nav>
  );
}
