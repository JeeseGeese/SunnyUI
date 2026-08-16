import React from "react";

export default function SunnySlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = "%"
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>{label}</strong>
        <strong>{value}{unit}</strong>
      </div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{ width: "100%", marginTop: 10, accentColor: "var(--sunny-orange)" }}
      />
    </div>
  );
}
