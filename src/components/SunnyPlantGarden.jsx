import React from "react";
import SunnyPlantVisualizer from "./SunnyPlantVisualizer";

/*
  Five depth-layered SunnyPlantVisualizer rows sharing one bands array, so
  Sunny reads as standing in the middle of a dense garden bed instead of
  flanked by a single flat row. Each layer sits on its own baseline (`bottom`
  offset) instead of stacking on the same line: the back two rows are set
  higher and smaller/dimmer (further away), the front two are set lower and
  bigger (closer to the viewer), and the middle row is the original
  baseline, scaled up along with the rest. Each layer also gets its own
  typeOffset so the rows don't look like copies of each other.
*/
const LAYERS = [
  { bottom: 25, scale: 0.47, opacity: 0.5, offset: 6 },
  { bottom: 13, scale: 0.58, opacity: 0.75, offset: 9 },
  { bottom: 0, scale: 0.72, opacity: 1, offset: 0 },
  { bottom: -10, scale: 0.85, opacity: 1, offset: 3 },
  { bottom: -20, scale: 1.0, opacity: 1, offset: 12 }
];

export default function SunnyPlantGarden({
  bands = [],
  active = true,
  mirror = false,
  typeOffset = 0,
  className = "",
  style = {}
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        flex: "1 1 auto",
        minWidth: 0,
        height: 140,
        ...style
      }}
    >
      {LAYERS.map((layer, i) => (
        <SunnyPlantVisualizer
          key={i}
          bands={bands}
          active={active}
          mirror={mirror}
          typeOffset={typeOffset + layer.offset}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: layer.bottom,
            height: 110,
            transform: `scale(${layer.scale})`,
            transformOrigin: "50% 100%",
            opacity: layer.opacity,
            zIndex: i
          }}
        />
      ))}
    </div>
  );
}
