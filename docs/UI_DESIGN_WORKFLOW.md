# Sunny UI Design Workflow

How the current Sunny UI (pV1.0) actually got built. Reconstructed from the
project's own file trail — the design-handoff bundles in Downloads, the
approved-frame naming conventions on disk, and the component library's own
code comments — not from assumption.

## The pipeline

```
ChatGPT                Claude Design              Claude Code            Human
(concept, art,    →    (animation, HTML      →    (components,     ↔    (creative
 keyframes)             prototypes)                integration,          director)
                                                    Git, cleanup)
```

### Stage 1 — Concept / Brainstorming (ChatGPT)

ChatGPT is the front end of this pipeline: interface ideas, mascot behavior,
layout concepts, and — critically — turning "make Sunny do X" into an
explicit visual/animation brief. The Downloads folder is full of dated
`ChatGPT Image <date>.png` exports, evidence this is genuinely where new
Sunny visuals start, not just a brainstorming aid used once.

### Stage 2 — Visual Asset Development (ChatGPT / image generation)

This is where the project's most important discipline shows up in the
filenames themselves. A recurring pattern in Downloads:

```
Sunny_Bull_Approved_Frames_01-10.zip
Sunny_Bull_NORMALIZED_01-10.zip
Sunny_Bull_REGISTERED_01-10.zip
```

That's three explicit passes over the same animation: approve the frames,
normalize them (consistent canvas/exposure/style), then register them
(consistent anchor point so the character doesn't jitter frame to frame).
Dedicated "24 FRAME ANIMATION REFERENCE SHEET" images (e.g. a "Sunny stem /
body wiggle loops" sheet and a "Sunny UI banner unroll + lights on" sheet)
were produced as planning artifacts before any animation was built — the
motion was designed on paper (well, on a grid of thumbnails) first.

Lesson embedded in this pattern: **small incremental changes between frames,
on a fixed canvas, with a fixed registration point, produce animation that
holds together.** Every animation actually shipped in the component library
follows this — see `docs/LESSONS_LEARNED.md`.

### Stage 3 — Claude Design (visual prototyping)

Once a keyframe set or visual direction is approved, Claude Design turns it
into a working, animated HTML/CSS/JS prototype. In this project these show
up as self-contained `.dc.html` / `.html` exports — e.g. `Sunny Transform.html`
(the Rail Rider spin-transform + wave-loop rig), `Sunny Stage Power-On.html`
(the nav bar truss lighting sequence), and the `Sunny Boot Sequence
Animation` handoff bundle (60s boot/loading sequence, shipped as a proper
design-handoff package with a README, a dependency-free JS module, and the
original React/JSX source).

What was actually useful from these exports, concretely:
- **Timing/easing tables** — every one of these exports separates "what
  moves when" (a keyframe/cue table) from "how it's drawn" (the render
  code). That split is what made porting them into React tractable — the
  data tables were copied close to verbatim into this project's
  `src/animations/*.js` files.
- **The rendered art itself** — several exports bundle their own PNG/image
  assets (base64-embedded in the `.dc.html` files, or shipped alongside as
  in the boot-sequence handoff). These became the actual production assets
  under `src/assets/sunny/`.
- **The motion math** — spin/wave/lamp/pulse formulas were ported as pure
  functions, independent of the authoring tool's own timeline engine (which
  was not brought into the app — see `docs/PROJECT_ARCHITECTURE.md`).

What was *not* useful and was deliberately left behind: the authoring tool's
own generic composition/export/editor machinery bundled inside the `.dc.html`
files (playback scrubbers, video export, watercolor-layer helpers, etc.) —
none of that runs in the shipped app.

### Stage 4 — Claude Code (implementation)

Claude Code (this tool, running in VS Code) is the integration and
architecture layer: extracting assets out of Claude Design exports, writing
the paired `animations/*.js` (data/math) + `components/*.jsx` (render) module
for each animation, wiring state management, calibrating interactive hotspots
against the actual art (by reading pixel data, not eyeballing), assembling
the reusable component library, and handling Git/filesystem/build concerns.

### Stage 5 — Human Approval Loop

```
Idea → AI concept → Human review → Small correction → Human approval → Next iteration
```

The project's own README states this as a rule ("Preserve a known-good
component once it is working; do not redesign it without a concrete
reason") and it played out directly during this session: the Stage Power-On
overlay was built, the human flagged a visual defect (a hard black
background), that one property was fixed without touching anything else,
the human flagged a second, more precise defect (a ~65px vertical
misalignment), it was fixed with a measured correction — not a redesign —
and approved. That loop, repeated, is the actual working method:

> **Once something is approved, preserve it and modify only the requested
> property.** Don't reinterpret it, don't regenerate it, don't "improve" it
> as a side effect of fixing something else.

See `docs/LESSONS_LEARNED.md` for the concrete technical lessons that fall
out of this workflow, and `docs/AI_AGENT_ROLES.md` for a reusable version of
the role split.
