import React, { useState } from "react";
import {
  SunnyAnimationViewport,
  SunnyBackgroundPicker,
  SunnyButton,
  SunnyCharacter,
  SunnyHardwareStatus,
  SunnyModeCard,
  SunnyNavBar,
  SunnySlider,
  SunnyStagePowerOn,
  SunnyStatusChip,
  SunnyToggle
} from "../components";
import useSunnyBackgroundMode from "../hooks/useSunnyBackgroundMode";
import useMockSpectrum from "../hooks/useMockSpectrum";
import useSunnyIdleAutoCycle from "../hooks/useSunnyIdleAutoCycle";
import sunnyLogo from "../assets/sunny/sunny-logo.png";

const LED_MODES = [
  { id: "party", label: "Party", icon: "🎉", accent: "var(--sunny-orange)" },
  { id: "rainbow", label: "Rainbow", icon: "🌈", accent: "linear-gradient(135deg, #FFD447, #FF8A30, #63B857, #5AC8FA, #C77DFF)" },
  { id: "sparkle", label: "Sparkle", icon: "✨", accent: "#FFF3B0" }
];

export default function ComponentShowcase() {
  const [page, setPage] = useState("home");
  // Plays once per page load/refresh (component library, no session storage
  // needed -- a fresh mount is exactly "loaded or refreshed"), overlaying the
  // nav bar until the stage "powers on"; the real SunnyNavBar underneath is
  // live the whole time and is simply revealed once this goes away.
  const [showPowerOn, setShowPowerOn] = useState(true);
  // Left alone on the Home page's Idle state, Sunny auto-transforms into the
  // Rail Rider idle loop after 30s and then auto-cycles through every
  // animation until the user presses a body button or leaves Home -- see
  // useSunnyIdleAutoCycle for the full state machine.
  const [sunnyState, setSunnyState] = useSunnyIdleAutoCycle(page === "home");
  const [backgroundMode, setBackgroundMode] = useSunnyBackgroundMode();

  const [audioReactiveEnabled, setAudioReactiveEnabled] = useState(true);
  const [ledsEnabled, setLedsEnabled] = useState(true);
  const [ledMode, setLedMode] = useState("party");
  const [ledBrightness, setLedBrightness] = useState(20);
  const [motorEnabled, setMotorEnabled] = useState(true);
  const [micSensitivity, setMicSensitivity] = useState(65);

  // DEMO / MOCK SPECTRUM DATA - see src/hooks/useMockSpectrum.js. Not wired
  // to Sunny's physical INMP441 microphone yet. Only the Status page's mic
  // level meter reads this now (the Home page's plant garden that used to
  // share it was removed) - paused (active: false) on every other page so
  // its animation loop isn't spending time re-rendering in the background,
  // e.g. while Headbang is playing on the Home page.
  const spectrumBands = useMockSpectrum({ bandCount: 9, active: page === "status" });
  const micLevelPct = Math.round(
    (spectrumBands.reduce((sum, v) => sum + v, 0) / spectrumBands.length) * 100
  );

  return (
    <main className="sunny-shell sunny-stack">
      <header>
        <div className="sunny-eyebrow">Do Better Design / Sunny UI</div>
        <h1 className="sunny-h1">Sunny Component Library</h1>
        <p className="sunny-muted">
          Reusable touchscreen components for Sunny. Big controls, simple state,
          playful motion, and no corporate dashboard nonsense.
        </p>
      </header>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img
          src={sunnyLogo}
          alt="Sunny by Do Better Design"
          draggable="false"
          style={{ width: 300, height: 100, userSelect: "none" }}
        />
      </div>

      <div style={{ maxWidth: 580, width: "100%", margin: "-14px auto -108px", position: "relative", zIndex: 1 }}>
        <SunnyNavBar
          active={page}
          onChange={setPage}
          items={[
            { id: "home", label: "HOME", icon: "🌻" },
            { id: "status", label: "STATUS", icon: "📶" },
            { id: "diag", label: "DIAG", icon: "⚙️" }
          ]}
        />
        {showPowerOn ? (
          <SunnyStagePowerOn onComplete={() => setShowPowerOn(false)} />
        ) : null}
      </div>

      {page === "diag" ? (
        <section className="sunny-panel" style={{ padding: 18 }}>
          <h2 className="sunny-section-title">Display</h2>
          <div style={{ marginTop: 14 }}>
            <SunnyBackgroundPicker mode={backgroundMode} onChange={setBackgroundMode} />
          </div>
        </section>
      ) : page === "status" ? (
        <>
          <section className="sunny-panel" style={{ padding: 18 }}>
            <h2 className="sunny-section-title">Behavior</h2>
            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <SunnyToggle
                checked={audioReactiveEnabled}
                onChange={setAudioReactiveEnabled}
                label="Audio Reactive"
                description="Respond to music"
              />
              <SunnyToggle
                checked={ledsEnabled}
                onChange={setLedsEnabled}
                label="LEDs"
                description="Body lights"
              />
              <SunnyToggle
                checked={motorEnabled}
                onChange={setMotorEnabled}
                label="Motor"
                description="Sunny movement"
              />
            </div>
          </section>

          <section className="sunny-panel" style={{ padding: 18 }}>
            <h2 className="sunny-section-title">LED Modes</h2>
            <div className="sunny-grid" style={{ marginTop: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
              {LED_MODES.map((mode) => (
                <SunnyModeCard
                  key={mode.id}
                  title={mode.label}
                  icon={mode.icon}
                  accent={mode.accent}
                  active={ledMode === mode.id}
                  onClick={() => setLedMode(mode.id)}
                />
              ))}
            </div>

            <div style={{ marginTop: 18, opacity: ledsEnabled ? 1 : 0.45, transition: "opacity 200ms ease" }}>
              <SunnySlider
                label="Body Light Brightness"
                value={ledBrightness}
                min={5}
                max={100}
                step={5}
                onChange={setLedBrightness}
              />
            </div>
          </section>

          <section className="sunny-panel" style={{ padding: 18 }}>
            <h2 className="sunny-section-title">Microphone</h2>
            <div style={{ marginTop: 14 }}>
              <SunnySlider
                label="Mic Sensitivity"
                value={micSensitivity}
                min={0}
                max={100}
                step={1}
                onChange={setMicSensitivity}
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>Mic Level</strong>
                <strong>{micLevelPct}%</strong>
              </div>
              <div style={{
                marginTop: 8,
                height: 14,
                borderRadius: 999,
                background: "rgba(40,40,40,.08)",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${micLevelPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "var(--sunny-green)",
                  transition: "width 160ms ease-out"
                }} />
              </div>
            </div>
          </section>

          <section className="sunny-panel" style={{ padding: 18 }}>
            <h2 className="sunny-section-title">Hardware</h2>
            <SunnyHardwareStatus name="ESP32-S3" detail="Controller online" icon="µ" status="ready" />
            <SunnyHardwareStatus name="WS2812 LEDs" detail="36 LEDs" icon="✦" status="ready" />
            <SunnyHardwareStatus name="DRV8833 Motor" detail="Driver ready" icon="↻" status="ready" />
            <SunnyHardwareStatus name="INMP441 Mic" detail="Listening" icon="◉" status="ready" />
            <SunnyHardwareStatus name="MAX98357A Amp" detail="Amplifier ready" icon="♪" status="ready" />
          </section>
        </>
      ) : (
        <>
          <section style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%" }}>
            <div style={{ maxWidth: 440, width: "100%", flexShrink: 0 }}>
              <SunnyAnimationViewport
                title="SUNNY"
                className="sunny-character-viewport"
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center"
                }}>
                  <SunnyCharacter
                    state={sunnyState}
                    size={390}
                    onBodyButtonPress={setSunnyState}
                  />

                  <div style={{ position: "absolute", right: 12, bottom: 12 }}>
                    <SunnyButton
                      variant="dark"
                      size="sm"
                      active={sunnyState === "idle"}
                      onClick={() => setSunnyState("idle")}
                    >
                      Idle
                    </SunnyButton>
                  </div>
                </div>
              </SunnyAnimationViewport>
            </div>
          </section>

          <div style={{
            maxWidth: 520,
            width: "100%",
            margin: "8px auto 0",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <SunnyStatusChip label="BODY LIGHTS" status={ledsEnabled ? "active" : "offline"} />
            <SunnyStatusChip label="MOTOR" status={motorEnabled ? "active" : "offline"} />
            <SunnyStatusChip label="AUDIO" status={audioReactiveEnabled ? "active" : "offline"} />
          </div>
        </>
      )}
    </main>
  );
}
