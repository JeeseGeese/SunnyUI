import React from "react";

export default function SunnyToggle({
  checked = false,
  onChange,
  label,
  description
}) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
      minHeight: 62,
      cursor: "pointer",
    }}>
      <span>
        <span style={{ display: "block", fontWeight: 900 }}>{label}</span>
        {description ? (
          <span style={{ display: "block", marginTop: 3, fontSize: 12, opacity: .6 }}>
            {description}
          </span>
        ) : null}
      </span>

      <span style={{
        width: 58,
        height: 34,
        borderRadius: 999,
        padding: 4,
        background: checked ? "var(--sunny-green)" : "#D8D6CC",
        transition: "background 150ms ease",
        flex: "0 0 auto"
      }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        />
        <span style={{
          display: "block",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "white",
          transform: checked ? "translateX(24px)" : "translateX(0)",
          transition: "transform 150ms ease",
          boxShadow: "0 2px 6px rgba(0,0,0,.18)"
        }} />
      </span>
    </label>
  );
}
