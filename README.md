# Sunny UI

## Current Checkpoint

**pV1.0 Sunny UI — Prototype Checkpoint** (tag: `pv1.0-sunny-ui`)

## Description

The UI designed to interface with Sunny. There will be different versions
depending on the different hardware the different builds of Sunny will have
— this repo is the first of those: a React component library and working
prototype of Sunny the Sunflower's interactive interface (an animatronic
mascot/robot by Do Better Design), for the desktop/browser baseline. A boot
sequence, a lit-up nav bar, and a character viewport with several animated
states that auto-cycle when left idle.

This is a design/prototyping library first. Use it to:
- keep Claude Design outputs visually consistent,
- rapidly prototype Sunny touchscreen screens,
- establish approved interaction patterns,
- provide a clear reference when recreating the interface in LVGL later.

Do **not** assume React is the final ESP32 runtime.

## Development Workflow

This project was built through a three-stage AI pipeline: **ChatGPT**
(concept, character art, animation keyframes) → **Claude Design** (animation
timing, HTML/CSS/JS prototypes) → **Claude Code** (component architecture,
asset integration, the implementation you're looking at), with a human
creative director approving each handoff. Full details:

- [`docs/UI_DESIGN_WORKFLOW.md`](docs/UI_DESIGN_WORKFLOW.md) — the pipeline itself
- [`docs/LESSONS_LEARNED.md`](docs/LESSONS_LEARNED.md) — concrete technical and creative lessons
- [`docs/AI_AGENT_ROLES.md`](docs/AI_AGENT_ROLES.md) — reusable agent-role guide for future projects
- [`docs/ANIMATION_PIPELINE.md`](docs/ANIMATION_PIPELINE.md) — how a Sunny animation goes from concept to shipped
- [`docs/PROJECT_ARCHITECTURE.md`](docs/PROJECT_ARCHITECTURE.md) — what currently exists in this codebase
- [`docs/HANDOFF.md`](docs/HANDOFF.md) — orientation for picking this project up cold
- [`docs/SUNNY_ASSET_INVENTORY.md`](docs/SUNNY_ASSET_INVENTORY.md) — inventory of Sunny-related files found outside this repo

## Components

- `SunnyButton`, `SunnyModeCard`, `SunnyStatusChip`, `SunnyToggle`, `SunnySlider`
- `SunnyHardwareStatus`, `SunnyAnimationViewport`, `SunnyToast`, `SunnyModal`
- `SunnyNavBar` (+ `SunnyStagePowerOn`, its one-time power-on light show)
- `SunnyCharacter` — dispatches to the current animation state:
  - `SunnyPoseAnimation` (idle, headbang)
  - `SunnyGyrateAnimation`
  - `SunnyRageAnimation`
  - `SunnyRailRiderAnimation`
- `SunnyBootSequence` — the 60s startup screen shown before the app itself

## Running Locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Hardware Target

Sunny's on-board display target is a **2.8-inch touchscreen**; design
tokens are authored against a 1024×600 reference resolution. Touchscreen
adaptation is planned as the next development phase, on a separate branch —
see `docs/HANDOFF.md`.

## Known-Good Baseline

> `pv1.0-sunny-ui` is the preserved known-good prototype baseline. Future
> touchscreen experiments must not destroy or overwrite this checkpoint.

## Design rules for Claude Design

When building a Sunny interface:

1. Reuse these components before inventing new ones.
2. Do not radically restyle approved components per screen.
3. Large touchscreen hit targets are mandatory.
4. Keep important actions within one or two taps.
5. Sunny should feel playful, mechanical, festival-minded, and alive.
6. Avoid generic SaaS dashboards, sterile minimalism, and unnecessary glass effects.
7. Prefer simple shapes, PNG/sprite assets, basic transforms, and effects that can later be reproduced in LVGL.
8. Preserve a known-good component once it is working; do not redesign it without a concrete reason.
9. Character animation must preserve Sunny's anatomy and registration across frames.
10. Any new component should solve a real repeated UI need.

## Prompt block for Claude Design

Use this at the top of a new Sunny design task:

> You are working inside the approved Sunny UI component system. Reuse the existing Sunny React components and theme tokens wherever possible. Do not invent a parallel visual language. Sunny is an interactive dancing sunflower robot by Do Better Design. The UI must feel playful, expressive, festival-minded, finger-friendly, and realistic to recreate later in LVGL. Preserve working patterns, keep major interactions within 1-2 taps, and avoid generic corporate dashboard styling.

Then append the specific screen or interaction you want designed.

## Approved Sunny character animations

Do not AI-interpolate or morph approved animation frames. If an animation is
refined, preserve stable registration/anatomy and make the change
reversible — see `docs/LESSONS_LEARNED.md` for how this project has handled
that in practice (e.g. `poses27` vs `poses27-clean`).

### Usage

```jsx
<SunnyCharacter state="idle" />
<SunnyCharacter state="headbang" />
<SunnyCharacter state="rage" />
<SunnyCharacter state="gyrate" />
<SunnyCharacter state="railrider" />
```

Left idle on the Home page, Sunny automatically transforms into Rail Rider
after 30s and then auto-cycles through every animation — see
`docs/PROJECT_ARCHITECTURE.md` for the state machine behind that.
