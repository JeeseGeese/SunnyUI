// pv1.1 touchscreen constants — the CONFIRMED physical target:
// ELEGOO / LCDWIKI E32R28T, 2.8" ILI9341 + XPT2046 resistive touch,
// ESP32-WROOM-32E, physically validated LANDSCAPE 320x240 at display
// rotation=3 (see docs/TOUCHSCREEN_HARDWARE_RECOVERY.md).
//
// Touchscreen mode does NOT recompose the UI for this size. The approved
// pV1.0 Home composition is the master design; TouchscreenMaster renders
// the real ComponentShowcase at its own approved dimensions and scales
// the WHOLE composition uniformly (one factor, no per-element layout)
// into the 320x240 canvas. Only the touchscreen preview reads these —
// the desktop/reference UI does not.

export const TOUCH_SCREEN_WIDTH = 320;
export const TOUCH_SCREEN_HEIGHT = 240;

// The approved composition's own coordinate system width: .sunny-shell is
// `width: min(100%, 900px)` (src/theme/sunny.css) — 900 is the layout
// width the approved Home was designed and approved at. The master's
// height is whatever the real composition measures at this width; it is
// measured live from the rendered DOM (TouchscreenMaster), never assumed.
export const MASTER_WIDTH = 900;
