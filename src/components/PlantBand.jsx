import React from "react";

/*
  A single animated plant standing in for one frequency band. Purely
  presentational - given a type and a normalized level, it renders that
  plant at a height/bloom driven by level. It never generates its own data;
  see SunnyPlantVisualizer / src/hooks/useMockSpectrum.js for where levels
  come from.

  The stem group and the head group share one coordinate trick: the stem is
  drawn at full height (100 units) then scaled down from its base, and the
  head group is translated by exactly the height the stem "lost" so it
  always sits on top of the current stem instead of floating away from it.
*/
const STEM_MIN_SCALE = 0.28;
const STEM_SCALE_RANGE = 0.72;
const STEM_TRAVEL = 100; // must match the stem rect height below

const ACCENT_PALETTE = [
  { bloom: "#FFD447", center: "#E8B978" },
  { bloom: "#FF8A30", center: "#E8B978" },
  { bloom: "#FFA8C5", center: "#E8B978" }
];

export default function PlantBand({
  type = "flower",
  level = 0.15,
  active = true,
  accent = 0
}) {
  const clamped = Math.max(0, Math.min(1, active ? level : 0.05));
  const stemScale = STEM_MIN_SCALE + clamped * STEM_SCALE_RANGE;
  const headLift = (1 - stemScale) * STEM_TRAVEL;
  const headScale = 0.82 + clamped * 0.28;
  const leafAngle = 10 + clamped * 20;
  const palette = ACCENT_PALETTE[accent % ACCENT_PALETTE.length];

  return (
    <svg
      className="sunny-plant"
      viewBox="0 0 28 140"
      width="16"
      height="80"
      aria-hidden="true"
    >
      <g
        className="plant-stem-group"
        style={{ transform: `scaleY(${stemScale})`, transformOrigin: "14px 140px" }}
      >
        <rect className="plant-stem" x="12" y="40" width="4" height={STEM_TRAVEL} rx="2" />
      </g>

      <g
        className="plant-head-group"
        style={{ transform: `translateY(${headLift}px) scale(${headScale})`, transformOrigin: "14px 40px" }}
      >
        {type === "flower" && (
          <g transform="translate(14, 28)">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={angle}
                className="plant-petal"
                cx="0"
                cy="-11"
                rx="5.5"
                ry="8.5"
                fill={palette.bloom}
                transform={`rotate(${angle})`}
              />
            ))}
            <circle className="plant-center" r="6" fill={palette.center} />
          </g>
        )}

        {type === "corn" && (
          <g transform="translate(14, 18)">
            <path
              className="plant-husk"
              d="M -5 28 Q -16 18 -10 -2 Q -6 10 -5 28 Z"
              style={{ transform: `rotate(-${leafAngle * 0.6}deg)`, transformOrigin: "-5px 26px" }}
            />
            <path
              className="plant-husk"
              d="M 5 28 Q 16 18 10 -2 Q 6 10 5 28 Z"
              style={{ transform: `rotate(${leafAngle * 0.6}deg)`, transformOrigin: "5px 26px" }}
            />
            <rect className="plant-cob" x="-5" y="-22" width="10" height="32" rx="5" />
            <line className="plant-kernel-line" x1="-5" y1="-13" x2="5" y2="-13" />
            <line className="plant-kernel-line" x1="-5" y1="-5" x2="5" y2="-5" />
            <line className="plant-kernel-line" x1="-5" y1="3" x2="5" y2="3" />
          </g>
        )}

        {type === "sprout" && (
          <g transform="translate(14, 40)">
            <path
              className="plant-leaf"
              d="M 0 0 Q -15 -9 -13 -24 Q -2 -17 0 0 Z"
              style={{ transform: `rotate(-${leafAngle}deg)`, transformOrigin: "0px 0px" }}
            />
            <path
              className="plant-leaf"
              d="M 0 0 Q 15 -6 15 -19 Q 3 -13 0 0 Z"
              style={{ transform: `rotate(${leafAngle * 0.7}deg)`, transformOrigin: "0px 0px" }}
            />
            <circle className="plant-bud" cx="0" cy="-3" r="3" />
          </g>
        )}
      </g>
    </svg>
  );
}
