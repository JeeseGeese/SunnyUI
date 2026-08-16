# Project Architecture (pV1.0)

Documentation of what exists, as of the pV1.0 checkpoint. This is not a
proposed architecture — it describes the current, working codebase.

## Stack

- **Framework:** React 18.3.1 + Vite 6
- **Language:** JavaScript (JSX), no TypeScript
- **Styling:** inline style objects (per-component) + a small global
  `src/theme/sunny.css` for tokens/resets; no CSS framework
- **State:** local `useState` and a small number of custom hooks; no Redux/
  Context-based global store
- **Package manager:** npm (`package-lock.json` present)

## Entry point

```
index.html → src/main.jsx → src/App.jsx
```

`App.jsx` sequences the boot experience: it renders `SunnyBootSequence`
first, and on that component's `onComplete` callback, swaps in
`ComponentShowcase` (the main app screen). `ComponentShowcase` itself always
mounts with its own `showPowerOn` flag true, which runs `SunnyStagePowerOn`
over the nav bar before revealing the interactive nav bar underneath. So a
full page load is: **boot sequence (60s) → stage power-on (~5.7s) →
interactive UI**, with no manual wiring required beyond those two
`onComplete` callbacks.

## Folder structure

```
src/
  animations/     data + pure functions per animation (timing tables, easing,
                  keyframes, layout constants) — no rendering here
  assets/sunny/   production art, one subfolder per pose set / animation
  components/     one file per reusable UI piece, index.js re-exports most
                  of them (SunnyRailRiderAnimation and SunnyStagePowerOn's
                  internal parts are imported directly by their consumers,
                  not everything is re-exported — check index.js for the
                  current list before assuming a component is public)
  hooks/          custom hooks (background mode persistence, mock spectrum
                  data, the idle auto-cycle state machine)
  screens/        ComponentShowcase.jsx — the one full-page screen
  theme/          design tokens (tokens.js), CSS custom properties
                  (sunny.css), background-mode logic (backgroundMode.js)
```

## Component hierarchy (Home page)

```
App
└─ ComponentShowcase
   ├─ SunnyNavBar                     (HOME / STATUS / DIAG truss + hotspots)
   │  └─ SunnyStagePowerOn            (mounted once per page load, on top)
   ├─ SunnyAnimationViewport
   │  └─ SunnyCharacter               (state dispatcher)
   │     ├─ SunnyPoseAnimation        (idle, headbang — frame-sequence poses)
   │     ├─ SunnyGyrateAnimation      (procedural CSS-transform composition)
   │     ├─ SunnyRageAnimation        (sprite-sheet playback)
   │     └─ SunnyRailRiderAnimation   (spin-transform + band-sliced wave loop)
   ├─ SunnyButton                     (the pinned "Idle" control)
   └─ SunnyStatusChip × 3             (BODY LIGHTS / MOTOR / AUDIO)
```

`SunnyBootSequence` sits outside this tree entirely — `App.jsx` renders it
*instead of* `ComponentShowcase` until it completes.

## State architecture

- `ComponentShowcase` owns: `page` (`home`/`status`/`diag`), `sunnyState`
  (via `useSunnyIdleAutoCycle`, not a plain `useState` — see below),
  `backgroundMode`, `showPowerOn`, and the Status-page toggle/slider values.
  No prop-drilling framework; everything is passed as direct props.
- `useSunnyIdleAutoCycle(active)` is the one non-trivial state machine in
  the app: it returns `[sunnyState, setUserState]` with the same shape as
  `useState`, but internally runs a phased timer (plain idle sway → one-time
  Rail Rider transform → indefinite auto-cycle through
  rage/headbang/gyrate/railrider) that any explicit call to `setUserState`
  (a body-button press or the Idle button) immediately interrupts and takes
  over from. `active` (true only while `page === "home"`) gates the whole
  thing and resets to plain idle when false.
- Every animation component manages its own playback time internally via
  `requestAnimationFrame` — none of them read from or write to
  `ComponentShowcase`'s state beyond the `state`/`size`/`paused` props they're
  given.

## Menu / navigation architecture

`SunnyNavBar` renders one background image (`sunny-nav-banner.png`) with
per-item absolutely-positioned hotspot buttons on top, at hand-measured
percentage coordinates (see the comment block at the top of
`SunnyNavBar.jsx`). Each item also has a small "bardim" mask — an opaque
pill shape — placed over the *other* items' underglow strip so only the
selected page's strip reads as lit; the source art has all three lit
simultaneously, so "unselected" is simulated with a mask, not with a
separate unselected art asset.

## Shared/reusable components

`SunnyButton`, `SunnyToggle`, `SunnySlider`, `SunnyModeCard`,
`SunnyStatusChip`, `SunnyHardwareStatus`, `SunnyToast`, `SunnyModal`,
`SunnyAnimationViewport` — generic, state-free UI primitives used across
both the Home and Status/Diag pages. `PlantBand`, `SunnyPlantGarden`,
`SunnyPlantVisualizer` exist in the tree but are not currently mounted by
`ComponentShowcase` (see the comment in `ComponentShowcase.jsx` about the
mock-spectrum hook noting the "plant garden that used to share it was
removed").

## Current display assumptions

Design tokens (`tokens.js`) target a **1024×600** reference screen — this is
Sunny's on-board touchscreen resolution, and is the number to keep in mind
for the planned 2.8" touchscreen work (see `docs/HANDOFF.md`). The current
app itself is a normal responsive web page (not locked to 1024×600); several
components (`SunnyBootSequence`, `SunnyStagePowerOn`) render full-viewport
or fit-by-width specifically so they work in a browser window of any size,
while still being built from art authored against that 1024×600 target.

## Build process

- `npm run dev` — Vite dev server, hot module reload
- `npm run build` — Vite production build to `dist/` (not checked into Git;
  regenerate as needed)
- `npm run preview` — serve the production build locally
- No test suite, no linter config, no CI pipeline currently present
