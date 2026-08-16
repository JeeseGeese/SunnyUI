import React from "react";
import PlantBand from "./PlantBand";

/*
  Presentational plant-garden replacement for the old spectrum bars:
  receives normalized [0..1] band levels via props and never fabricates its
  own data (see src/hooks/useMockSpectrum.js). Plant type per band cycles
  sprout/flower/corn; `typeOffset` staggers that cycle so the left and right
  gardens don't read as mirrored clones even though they share one bands
  array.
*/
const TYPE_CYCLE = ["sprout", "flower", "corn"];

export default function SunnyPlantVisualizer({
  bands = [],
  active = true,
  mirror = false,
  typeOffset = 0,
  className = "",
  style = {}
}) {
  const ordered = mirror ? [...bands].reverse() : bands;

  return (
    <div
      aria-hidden="true"
      className={["sunny-plant-visualizer", className].filter(Boolean).join(" ")}
      style={{ pointerEvents: "none", ...style }}
    >
      {ordered.map((level, i) => {
        const cycleIndex = i + typeOffset;
        const clamped = Math.max(0, Math.min(1, active ? level : 0.05));
        return (
          <div
            className="sunny-plant-band"
            key={i}
            style={{ "--plant-level": clamped }}
          >
            <PlantBand
              type={TYPE_CYCLE[cycleIndex % TYPE_CYCLE.length]}
              level={level}
              active={active}
              accent={Math.floor(cycleIndex / TYPE_CYCLE.length)}
            />
          </div>
        );
      })}
    </div>
  );
}
