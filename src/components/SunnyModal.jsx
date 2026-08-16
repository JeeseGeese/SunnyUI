import React from "react";
import SunnyButton from "./SunnyButton";

export default function SunnyModal({
  open,
  title,
  children,
  confirmLabel = "Got it",
  onConfirm,
  onClose
}) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(40,40,40,.52)",
      display: "grid",
      placeItems: "center",
      padding: 18
    }}>
      <section style={{
        width: "min(100%, 420px)",
        borderRadius: 24,
        background: "var(--sunny-paper)",
        padding: 20,
        boxShadow: "0 18px 50px rgba(0,0,0,.28)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: 0,
              background: "rgba(40,40,40,.07)",
              cursor: "pointer"
            }}
          >
            ×
          </button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
        <div style={{ marginTop: 18 }}>
          <SunnyButton onClick={onConfirm || onClose} variant="primary">
            {confirmLabel}
          </SunnyButton>
        </div>
      </section>
    </div>
  );
}
