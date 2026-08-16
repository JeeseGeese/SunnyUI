import React from "react";

export default function SunnyModeCard({
  title,
  subtitle,
  icon = "🌻",
  active = false,
  onClick,
  accent = "var(--sunny-yellow)"
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: "100%",
        minHeight: 132,
        textAlign: "left",
        borderRadius: 20,
        border: active ? "3px solid var(--sunny-charcoal)" : "2px solid rgba(40,40,40,.09)",
        background: active ? accent : "var(--sunny-paper)",
        boxShadow: "0 6px 18px rgba(40,40,40,.08)",
        padding: 16,
        cursor: "pointer",
        color: "var(--sunny-charcoal)",
        transition: "transform 140ms ease",
      }}
    >
      <div style={{ fontSize: 30, lineHeight: 1 }}>{icon}</div>
      <div style={{ marginTop: 12, fontSize: 18, fontWeight: 950 }}>{title}</div>
      {subtitle ? (
        <div style={{ marginTop: 5, fontSize: 13, opacity: .65, lineHeight: 1.3 }}>
          {subtitle}
        </div>
      ) : null}
    </button>
  );
}
