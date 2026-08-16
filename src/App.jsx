import React, { useState } from "react";
import ComponentShowcase from "./screens/ComponentShowcase";
import { SunnyBootSequence } from "./components";
import TouchscreenPreviewFrame from "./touchscreen/TouchscreenPreviewFrame";
import TouchscreenMaster from "./touchscreen/TouchscreenMaster";

// Development-only 320x240 touchscreen preview (pv1.1) — activated by
// ?touchscreen=1, e.g. http://localhost:5173/?touchscreen=1 (optionally
// ?touchscreen=1&zoom=2 to magnify the preview). Without the parameter the
// app renders the approved pV1.0 flow below, completely unchanged. Read
// once at module load — switching modes is a URL change, i.e. a reload.
const urlParams = new URLSearchParams(window.location.search);
const touchscreenPreview = urlParams.get("touchscreen") === "1";
const previewZoom = Math.min(4, Math.max(1, parseInt(urlParams.get("zoom") || "1", 10) || 1));

export default function App() {
  if (touchscreenPreview) {
    // The approved pV1.0 screen, uniformly scaled into 320x240 as one unit
    // (see TouchscreenMaster). Boots straight into it — the 60s boot
    // sequence is skipped in the preview.
    return (
      <TouchscreenPreviewFrame zoom={previewZoom}>
        <TouchscreenMaster />
      </TouchscreenPreviewFrame>
    );
  }

  return <NormalApp />;
}

function NormalApp() {
  // Plays once per page load/refresh, same as ComponentShowcase's own
  // showPowerOn -- a fresh mount is exactly "first loaded or refreshed".
  // Once it completes, ComponentShowcase mounts fresh and its stage
  // power-on (SunnyStagePowerOn) runs on top of the nav bar as usual.
  const [booted, setBooted] = useState(false);

  if (!booted) {
    return <SunnyBootSequence onComplete={() => setBooted(true)} />;
  }

  return <ComponentShowcase />;
}
