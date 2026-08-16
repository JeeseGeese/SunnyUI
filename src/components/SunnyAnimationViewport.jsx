import React from "react";

export default function SunnyAnimationViewport({
  children,
  title = "Sunny",
  aspectRatio = "1 / 1",
  className = ""
}) {
  return (
    <section
      className={["sunny-animation-viewport", className].filter(Boolean).join(" ")}
      style={{
        overflow: "visible",
        background: "none",
        border: "none",
        boxShadow: "none"
      }}
      aria-label={title}
    >
      <div style={{
        aspectRatio,
        display: "grid",
        placeItems: "center",
        background:
          "var(--sunny-viewport-glow, radial-gradient(circle at center, rgba(255,212,71,.26), transparent 60%))"
      }}>
        {children}
      </div>
    </section>
  );
}
