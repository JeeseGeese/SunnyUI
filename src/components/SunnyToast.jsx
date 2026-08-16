import React from "react";

export default function SunnyToast({
  title,
  message,
  type = "success"
}) {
  const map = {
    success: "var(--sunny-success)",
    warning: "var(--sunny-warning)",
    error: "var(--sunny-danger)",
    info: "var(--sunny-yellow)"
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "8px 1fr",
      overflow: "hidden",
      borderRadius: 16,
      background: "var(--sunny-paper)",
      border: "1px solid rgba(40,40,40,.10)",
      boxShadow: "0 8px 22px rgba(40,40,40,.12)"
    }}>
      <div style={{ background: map[type] || map.info }} />
      <div style={{ padding: 13 }}>
        <div style={{ fontWeight: 950 }}>{title}</div>
        {message ? <div style={{ marginTop: 3, fontSize: 13, opacity: .66 }}>{message}</div> : null}
      </div>
    </div>
  );
}
