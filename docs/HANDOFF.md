# Handoff — Sunny UI

Concise orientation for another AI coding agent, or a fresh session on a
different computer, picking this project up.

## What this is

Sunny UI is the touchscreen interface for Sunny, an animatronic sunflower
mascot/robot by Do Better Design. This repo is a **React + Vite web
prototype** of that interface — the design/behavior reference, not
necessarily the final ESP32/LVGL runtime (see `README.md`'s original design
note on that). It includes a boot sequence, a nav bar with a power-on light
show, and a character viewport with five animated states (idle, rage,
headbang, gyrate, rail rider) that auto-cycle when left alone.

## Current checkpoint

**pV1.0 Sunny UI — Prototype Checkpoint**, tagged `pv1.0-sunny-ui` on
`main`. This is the known-good preserved baseline. Do not force-push over
it or rewrite its history.

## Pre-Feature Asset Harvest

**Before starting any significant new feature, animation, redesign, or
integration, check what already exists before building something new.**

1. Check `src/assets/sunny/` (production assets) and
   `SunnyUI-Source-Assets/` (source archive, if populated) for material
   relevant to the feature.
2. Check `docs/SUNNY_ASSET_INVENTORY.md` and `sunny_asset_inventory.csv`
   for what's already catalogued in Downloads.
3. If a relevant Downloads folder/zip contains many generically-named
   images (`image.png`, `image (1).png`, numbered exports, screenshots,
   unlabeled Claude Design/ChatGPT exports), **generate a contact-sheet
   montage first** — tile thumbnails into one grid image and inspect that,
   rather than skipping past them or opening dozens of files one at a time.
4. Visually scan the contact sheet(s) for anything relevant.
5. Open any matching zips or design-handoff packages found.
6. Review previously-approved reference/keyframe material before designing
   something new.
7. Only then start implementing.

This is a **context-gathering step, not a redesign step** — don't move,
rename, or delete anything to do it, just look.

**Why this is a rule, not a suggestion:** the pV1.0 asset inventory pass
(done *after* most of this session's features were already built) found a
Sunny wiring diagram, an unintegrated Idle-animation design handoff, and
several nav-bar animation keyframe sheets — all sitting in Downloads under
generic `ChatGPT Image <date>.png` filenames. That material would have
directly informed earlier feature work if checked first. Skipping this step
risks rebuilding something that already exists, missing approved reference
art, losing continuity with prior design decisions, and wasted work — do
the harvest **before** building, not as a retrospective cleanup pass.

## How to run it

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

No environment variables, no external services, no backend — it's a fully
static client app.

## Important files — read before changing

- `src/components/SunnyCharacter.jsx` — the state dispatcher for every
  character animation, plus the per-art-style hotspot coordinate tables.
  Coordinates in here are hand-measured against specific PNGs; don't
  "clean up" the numbers without re-measuring against the actual asset.
- `src/hooks/useSunnyIdleAutoCycle.js` — the idle→transform→auto-cycle state
  machine. Non-obvious timing logic; read the comments before touching it.
- `src/animations/*.js` — timing tables and motion math ported from
  approved Claude Design exports. These encode **approved, tested timing**.
  Changing a number here changes how an approved animation looks; treat
  that as a design change, not a refactor.
- `docs/PROJECT_ARCHITECTURE.md` — what currently exists, factually.

## Files that should not be casually changed

- Anything under `src/assets/sunny/` — production art. If a fix is needed,
  follow the project's own precedent: produce a new, separately-named file
  (see `poses27` vs `poses27-clean`) rather than overwriting the approved
  original.
- Timing/easing constants in `src/animations/*.js` — these were extracted
  from approved Claude Design references; treat any change as re-approving
  a design decision, not a code cleanup.
- Hotspot coordinate tables in `SunnyCharacter.jsx` / `SunnyNavBar.jsx` —
  measured against specific pixel art; changing the art requires
  re-measuring these, not guessing new numbers.

## Where things live

- **Animations:** `src/animations/` (data/math) paired 1:1 with
  `src/components/Sunny*Animation.jsx` (render). Same naming convention for
  both files in a pair.
- **Production assets:** `src/assets/sunny/<feature>/` — one subfolder per
  animation/feature.
- **Source/reference material** (ChatGPT exports, Claude Design HTML
  prototypes, rejected experiments, prior project versions): kept **outside**
  this repo, in `SunnyUI-Source-Assets/` alongside it (see
  `docs/SUNNY_ASSET_INVENTORY.md` for what's there and why it isn't in Git).

## Known-good commands

```bash
npm install && npm run build   # should complete with 0 errors
npm run dev                    # should serve without console errors
```

## Known limitations

- No test suite or CI.
- Design tokens target a 1024×600 reference screen; the running app itself
  is a normal responsive web page, not locked to that resolution.
- No backend/hardware wiring — LED/motor/audio toggles on the Status page
  are UI-only, not connected to real hardware.
- `dist/` is gitignored (regenerate with `npm run build`); don't expect it
  to be present right after a fresh clone.

## Planned next development step

**Formatting and testing the current Sunny UI on Sunny's 2.8-inch
touchscreen, while preserving the desktop/browser pV1.0 baseline.** Do this
work on a new branch (recommended: `pv1.1-touchscreen`), not on `main` —
`main` at the `pv1.0-sunny-ui` tag must remain a working, unmodified
reference point.
