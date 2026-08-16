import React from "react";
import SunnyModeCard from "./SunnyModeCard";

const OPTIONS = [
  {
    id: "light",
    title: "Light",
    subtitle: "The classic cream.",
    icon: "☀",
    accent: "var(--sunny-yellow)"
  },
  {
    id: "dark",
    title: "Dark",
    subtitle: "Easy on the eyes.",
    icon: "☾",
    accent: "#C9CDD6"
  },
  {
    id: "party",
    title: "Party",
    subtitle: "Festival glow.",
    icon: "✦",
    accent: "linear-gradient(135deg, #FFE59A, #FFB199, #C9F2C0, #E3C6FF)"
  }
];

export default function SunnyBackgroundPicker({ mode, onChange }) {
  return (
    <div>
      <div className="sunny-eyebrow">Background</div>
      <div
        className="sunny-grid"
        style={{ marginTop: 10, gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {OPTIONS.map((option) => (
          <SunnyModeCard
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            icon={option.icon}
            accent={option.accent}
            active={mode === option.id}
            onClick={() => onChange?.(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
