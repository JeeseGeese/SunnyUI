# Animation Pipeline

The specific animation workflow this project actually used, reconstructed
from file naming conventions found in Downloads and from how each shipped
animation is structured in code.

## The process

```
1.  Define animation concept                    (ChatGPT, human-directed)
2.  Establish canonical Sunny reference          (existing approved art)
3.  Generate major key poses                     (ChatGPT)
4.  Approve poses individually                   (human)
5.  Add intermediate frames                      (ChatGPT, small deltas only)
6.  Normalize frame canvas                       (fixed size, consistent style)
7.  Register character position                  (fixed anchor point)
8.  Export transparent assets                    (PNG, alpha channel)
9.  Test animation separately                    (standalone HTML, Claude Design)
10. Send approved sequence to Claude Design       (timing/easing authored)
11. Integrate into component library              (Claude Code — this repo)
12. Test state transitions                        (in SunnyCharacter)
13. Preserve source frames                        (original + any cleaned copy)
```

Steps 5-7 are not hypothetical — they're the literal three-zip pipeline found
in Downloads for one animation:

```
Sunny_Bull_Approved_Frames_01-10.zip   (step 4/5)
Sunny_Bull_NORMALIZED_01-10.zip        (step 6)
Sunny_Bull_REGISTERED_01-10.zip        (step 7)
```

Step 13 shows up directly in this repo: `src/assets/sunny/poses27/` (original
export) sits alongside `src/assets/sunny/poses27-clean/` (the same frames
with a documented, narrowly-scoped fix — edge-fringe removal and one
mis-colored leaf — applied programmatically, never by hand-editing the
approved source).

## Common failure modes (why the discipline above exists)

These are the standard ways AI-generated character animation breaks, and
the reason each step above exists as a guard against it:

- **Character drifting** — proportions or pose subtly changing generation to
  generation. Guarded against by step 2 (always reference the canonical
  approved art, never a previous generation's output) and by never
  regenerating an approved frame.
- **Changing facial features / incorrect hand or body orientation** —
  guarded against by individual pose approval (step 4) rather than approving
  a whole batch at once.
- **Inconsistent proportions across a sequence** — guarded against by
  normalization (step 6) and registration (step 7) as explicit, separate
  passes, not left to "look consistent enough."
- **Background contamination** — transparent-canvas export (step 8) with a
  documented cleanup pass when needed (the poses27-clean edge-fringe fix).
- **Jitter** — a moving/inconsistent anchor point between frames. This is
  exactly what "registration" (step 7) exists to prevent, and it shows up
  again downstream in code: every shipped animation component is
  bottom-anchored to a fixed point rather than scaled/positioned
  independently per frame.
- **Excessive movement between frames** — breaks the "small incremental
  change" principle (see `docs/LESSONS_LEARNED.md`); the fix is regenerating
  the intermediate frame, not asking the animation code to smooth over it.
- **Blurry upscaling** — guarded against in code by scaling each pose set at
  its own native resolution (`scale = size / nativeHeight`) rather than
  forcing every asset through one shared scale factor.
- **Accidentally replacing approved art** — guarded against procedurally:
  corrections produce a new file (`poses27` → `poses27-clean`), never an
  in-place overwrite of the approved original.
- **Animation state regression** — guarded against by keeping each state
  (`idle`, `rage`, `headbang`, `gyrate`, `railrider`) as an independent
  component with its own data module; changing one cannot silently alter
  another's timing or math.

## What actually happens at integration (step 11)

Concretely, in this codebase, integrating an approved Claude Design export
means:

1. Decode the export if it's a bundled `.dc.html` artifact (font/image data
   is base64-embedded; extract the actual PNG/JS assets from it).
2. Port the timing/cue table and motion math into a paired
   `src/animations/<name>.js` module — data and pure functions only.
3. Build the render component in `src/components/Sunny<Name>Animation.jsx`,
   driven by its own `requestAnimationFrame` loop, matching the
   `{ size, paused }` prop convention every other animation component uses.
4. Wire it into `SunnyCharacter` as a new `state` branch.
5. If the art includes interactive regions (e.g. body-button capsules),
   measure their pixel coordinates directly from the source PNG rather than
   eyeballing them — see the pixel-measurement lesson in
   `docs/LESSONS_LEARNED.md`.
6. Verify live in a browser (screenshots at minimum; full interaction
   testing where practical) before considering the integration done.
