# Lessons Learned — Sunny UI (pV1.0)

Concrete lessons pulled from the actual project: file naming conventions,
code comments left by prior work, and this session's own build/fix/verify
cycles. Nothing here is invented — each lesson points at where it comes from.

## Visual Design Lessons

**Preserve character consistency; don't regenerate approved assets.**
`sunnyAnimations.js` carries this note verbatim: *"Rage/Gyrate still fall
back to the original approved neutral pose — unchanged by this port."* When
a new pose set (`poses27`) was cleaned up for edge artifacts, the fix was
applied to a **copy** (`poses27-clean/`) with the original left untouched
"for reference/reversibility" — the approved source is never overwritten in
place.

**Fixed registration prevents jitter.** Every sprite/pose animation in this
project is bottom-anchored and scaled per its own canvas, not scaled once
and reused — `SunnyPoseAnimation` applies a per-frame `baseScale` precisely
because different frames' silhouettes reach different distances from a
shared bottom anchor; a single shared zoom either clips wide frames or
undersizes the rest.

**Smaller frame-to-frame movement reads smoother.** The headbang animation's
27 frames use small per-frame hold times (30-95ms) with a distinct
"wind-up → repeat window → settle" structure, rather than one long
monolithic motion — the repeat window (frames 6-20) plays 5-10 times
(randomized) before settling, so the same small set of frames reads as
variable-length motion instead of needing more frames.

**Animation reference sheets communicate motion intent before it's built.**
The Downloads harvest turned up dedicated 24-frame grid reference images
(e.g. a body-wiggle-loop sheet, a banner-unroll-and-lights-on sheet) that
predate the corresponding shipped animations — motion was planned visually
before any code was written.

**Separate animation states make implementation tractable.** Every distinct
Sunny behavior (`idle`, `rage`, `headbang`, `gyrate`, `railrider`) is its own
component with its own paired data module, dispatched by a single `state`
string in `SunnyCharacter`. None of them share render logic, which means
fixing or re-tuning one can't regress another.

**Keep approved source assets even after "improving" them.** Same pattern
as the poses27/poses27-clean split above — cleanup and correction produce a
new file; they don't mutate the approved one.

## AI Collaboration Lessons

**Agents perform better with clearly separated responsibility.**

| Agent | Responsibility |
|---|---|
| ChatGPT | Concept, art direction, prompt engineering, keyframe/pose generation |
| Claude Design | Animation math, HTML/CSS/JS prototypes, timing tables |
| Claude Code | Architecture, asset extraction/integration, components, Git, filesystem |
| Human | Creative director — approves, corrects one property at a time, decides what must not change |

Using one agent for every stage produced more drift (each regeneration is a
fresh reinterpretation of "what Sunny looks like"); using a specialized
stage per agent, with the human gating each handoff, kept the mascot's
proportions, palette, and personality consistent across dozens of separately
generated assets over several months of Downloads history.

**The correction loop works best as one property at a time.** Observed
directly this session on the Stage Power-On feature: flagged issue → fixed
issue → re-verified → next flagged issue → fixed → re-verified. Neither fix
touched anything beyond the specific defect reported.

**Measure, don't eyeball, when precision matters.** The first attempt at
cropping the Stage Power-On overlay to match the nav bar underneath used an
eyeballed offset and looked "close enough" in an isolated screenshot — but
was off by 65px against the real asset. The fix was to decode the PNGs and
find the exact topmost-opaque-pixel row in both images, then compute the
offset as a difference of two measured numbers. Visual "looks right" checks
are not a substitute for pixel measurement when two different source assets
need to align.

## Animation Lessons

Concrete implementation patterns actually used in this codebase:

- **Discrete pose sequences** (`SunnyPoseAnimation` + `sunnyAnimations.js`):
  an array of `{src, holdMs, scale?, baseScale?, blur?}` frames, advanced by
  `setTimeout`, with an optional `repeatFrom`/`repeatUntil`/`repeatMin`/
  `repeatMax` window for a randomized-length repeating section (headbang).
- **Sprite-sheet playback** (`SunnyRageAnimation`): one background-image
  sprite sheet, positioned via `background-position` percentages per frame
  index, driven by a per-frame duration table plus a 5-step speed ramp
  (min→max→min) so the same 24 frames read as an escalating/decelerating
  loop.
- **Procedural CSS-transform composition** (`SunnyGyrateAnimation`,
  `SunnyRailRiderAnimation`): no frame images at all for the motion itself —
  named motion curves (hip sway, compression, spring/jiggle) computed from
  elapsed time and applied as `transform`/`opacity` to layered divs. The
  Rail Rider idle loop goes further: the character art is sliced into ~50
  horizontal band `<div>`s via `clip-path`, each swayed independently by a
  height-dependent sine formula, so a single static image reads as a
  continuously waving character with no per-frame art at all.
- **Composited scene overlays** (`SunnyStagePowerOn`, `SunnyBootSequence`):
  a "dark" and a "lit" copy of the same master art, with the lit copy
  revealed region-by-region via clipped, independently-timed opacity ramps —
  no new art needed per lighting stage, just clip-path windows over the one
  lit asset.
- **Avoiding first-frame flicker**: components that open "mid-motion"
  (Rail Rider's spin transform) explicitly paint the correct starting
  transform synchronously on mount, rather than letting the first frame
  render at rest and pop into motion a tick later.
- **Transparent PNGs throughout**, bottom-anchored and fit to each asset's
  own aspect ratio (`scale = size / nativeHeight`) rather than a single
  shared scale — avoids both clipping and blurry upscaling across pose sets
  that were exported at different native resolutions.
- **Preloading / no explicit preloader**: assets are all bundled by Vite
  (`import x from "./assets/..."`), so they're fetched as part of normal
  page load rather than an ad hoc runtime fetch — there is no separate
  loading-flicker problem to solve for the animation art itself.

## Component Design Lessons

- **`SunnyCharacter` is the single dispatch point.** It takes a `state`
  string and renders the matching animation component, the matching
  hotspot-button set, and a status badge — adding a new animation state
  means adding one branch here, not touching the call sites.
- **Status labels are decoupled from state ids.** `STATE_BADGE_COLORS` and
  `STATE_LABELS` are separate lookup tables keyed by the same state string,
  which is what let the Rail Rider auto-idle phase display as "Idlin'"
  without needing a new state value or touching any other component.
- **Hotspot button sets are per-art-style, not per-state.** Different pose
  sets (`BODY_BUTTONS`, `BODY_BUTTONS_GYRATE`, `BODY_BUTTONS_RAGE`,
  `BODY_BUTTONS_RAILRIDER`, `BODY_BUTTONS_POSES27`) exist because each art
  asset places the interactive Rage/Headbang/Gyrate capsules at different
  pixel coordinates — reusing one hotspot layout across different art would
  silently misalign the tap targets.
- **`onBodyButtonPress` is a plain callback prop**, not internal state —
  `SunnyCharacter` doesn't own the current state, its parent does. This is
  what allowed the auto-idle-cycle hook (`useSunnyIdleAutoCycle`) to be
  swapped in as a drop-in replacement for `useState` without changing
  `SunnyCharacter` at all.
