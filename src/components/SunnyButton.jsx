import React from "react";

export default function SunnyButton({
  children,
  variant = "primary",
  size = "md",
  active = false,
  disabled = false,
  icon,
  onClick,
  className = "",
  ...props
}) {
  const palette = {
    primary: ["var(--sunny-yellow)", "var(--sunny-charcoal)"],
    green: ["var(--sunny-green)", "white"],
    orange: ["var(--sunny-orange)", "white"],
    dark: ["var(--sunny-charcoal)", "white"],
    ghost: ["transparent", "var(--sunny-charcoal)"],
  };

  const heights = { sm: 44, md: 54, lg: 64 };
  const [background, color] = palette[variant] || palette.primary;

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        minHeight: heights[size] || heights.md,
        borderRadius: 16,
        border: active ? "3px solid var(--sunny-charcoal)" : "2px solid rgba(40,40,40,.10)",
        padding: "0 18px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        fontWeight: 900,
        letterSpacing: ".01em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? .45 : 1,
        background,
        color,
        boxShadow: variant === "ghost" ? "none" : "0 5px 0 rgba(40,40,40,.22)",
        transform: active ? "translateY(3px)" : "translateY(0)",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        userSelect: "none",
      }}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}
