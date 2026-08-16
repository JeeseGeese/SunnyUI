import React from "react";

export default function SunnyHardwareStatus({
  name,
  detail,
  status = "ready",
  icon = "•"
}) {
  const colors = {
    ready: "var(--sunny-success)",
    active: "var(--sunny-yellow)",
    warning: "var(--sunny-warning)",
    error: "var(--sunny-danger)",
    offline: "#A8A8A8"
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "42px 1fr auto",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      borderBottom: "1px solid rgba(40,40,40,.08)"
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        background: "rgba(40,40,40,.06)",
        fontSize: 18,
        fontWeight: 900
      }}>
        {icon}
      </div>

      <div>
        <div style={{ fontWeight: 900 }}>{name}</div>
        {detail ? <div style={{ fontSize: 12, opacity: .58, marginTop: 2 }}>{detail}</div> : null}
      </div>

      <span style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: colors[status] || colors.ready
      }} />
    </div>
  );
}
