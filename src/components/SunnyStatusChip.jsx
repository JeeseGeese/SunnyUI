import React from "react";

export default function SunnyStatusChip({
  label,
  status = "ready"
}) {
  const map = {
    ready: { dot: "var(--sunny-success)", text: "READY" },
    active: { dot: "var(--sunny-yellow)", text: "ACTIVE" },
    warning: { dot: "var(--sunny-warning)", text: "CHECK" },
    error: { dot: "var(--sunny-danger)", text: "FAULT" },
    offline: { dot: "#A8A8A8", text: "OFFLINE" },
  };

  const state = map[status] || map.ready;

  return (
    <div className="sunny-status-chip" style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      minHeight: 34,
      borderRadius: 999,
      padding: "0 12px",
      background: "rgba(255,255,255,.76)",
      border: "1px solid rgba(40,40,40,.10)",
      fontSize: 12,
      fontWeight: 900,
    }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: state.dot }} />
      <span>{label}</span>
      <span style={{ opacity: .5 }}>{state.text}</span>
    </div>
  );
}
