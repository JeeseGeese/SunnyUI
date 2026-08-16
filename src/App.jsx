import React, { useState } from "react";
import ComponentShowcase from "./screens/ComponentShowcase";
import { SunnyBootSequence } from "./components";

export default function App() {
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
