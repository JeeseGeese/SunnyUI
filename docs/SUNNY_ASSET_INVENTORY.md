# Sunny Asset Inventory

Inventory of Sunny-related files found in `C:\Users\jesse\Downloads`, taken
during the pV1.0 preservation pass. **Read-only discovery — nothing in
Downloads was moved, renamed, deleted, or reorganized to produce this
document.** SHA-256 hashes and metadata were computed to identify exact
duplicates; nothing was deleted based on that.

Machine-readable version: [`sunny_asset_inventory.csv`](sunny_asset_inventory.csv)

## Scope and limitations (be upfront about what this is not)

- Covers **top-level Downloads items** matching Sunny/Sunflower naming, plus
  a **top-level-only** visual scan of all 264 generically-named image files
  (`ChatGPT Image *.png`, `image*.png`, `Untitled*`, `Screenshot*`, etc.) via
  contact sheets.
- Zip archives were **not extracted** — their contents are inferred from
  filename, size, and (for the already-extracted sibling folders) direct
  listing, not opened and verified file-by-file.
- Folders that are themselves Sunny-named were listed 1-2 levels deep, not
  exhaustively.
- Generic-named images **inside** subfolders/zips were not scanned — only
  the ones sitting loose at the top level of Downloads. A deeper pass is
  possible later if this proves valuable.
- Nothing here should be read as "approved" unless explicitly stated —
  existence in Downloads is not evidence of approval status.

## Production source mapping (highest-confidence findings)

These Downloads items are the **confirmed direct source** of assets
currently shipping in `SunnyUI/src/`, established either by matching code
comments in this repo or by direct content inspection this session:

| Downloads item | → | Current production asset | Evidence |
|---|---|---|---|
| `Sunny rage animation system (1)/export/sunny-rage-sheet.png` | → | `src/assets/sunny/rage/sunny-rage-sheet.png` | `sunnyRageAnimation.js` comment: *"Ported from the approved 'Sunny Rage Animation System (1)' reference"* |
| `Sunny Headbang Animation Final PV1/poses/hb01-10*.png` | → | `src/assets/sunny/headbang/hb01-10.png` | Matching filenames/pose count |
| `Sunny Headbang Animation Final PV1/poses27/*.png` | → | `src/assets/sunny/poses27/*.png` | Matching filenames, 27-frame set |
| `Sunny Transform.html` | → | `src/assets/sunny/railrider/{plain,full,body,rail}.png` + `SunnyRailRiderAnimation.jsx` | Decoded and extracted directly this session |
| `Sunny Stage Power-On.html` | → | `src/assets/sunny/stagepoweron/*.png` + `SunnyStagePowerOn.jsx` | Decoded and extracted directly this session |
| `Sunny Boot Sequence Animation/` | → | `SunnyBootSequence.jsx` + `src/animations/sunnyBootSequence.js` | Design-handoff bundle, ported directly this session |
| `sunny-nav-banner.png`, `sunny-logo.png` sources | ? | `src/assets/sunny/sunny-nav-banner.png`, `sunny-logo.png` | Not traced to a specific Downloads source this pass |

## Notable finding — an unintegrated approved animation may exist

`Sunny Idle animation loop/design_handoff_sunny_idle/` is a design-handoff
bundle (README.md, `sunny-idle.js`, `demo.html`, `assets/`, `reference/`) —
the same package shape as the Boot Sequence and Stage Power-On handoffs that
**were** integrated. The current `idle` state, per this repo's own README,
is *"the approved neutral Sunny pose with a very small CSS sway... A
dedicated idle PNG sequence can replace it later without changing the API."*

This folder may be exactly that dedicated sequence, never integrated.
**Approval status unknown** — flagging for human review, not assuming it
supersedes the current idle. If it is approved, the `SunnyCharacter` /
`useSunnyIdleAutoCycle` architecture already supports dropping in a new
`idle` animation component without changing any call site.

## Top-level Sunny/Sunflower-named items (38 found)

| Item | Type | Size | Modified | SHA-256 (short) | Notes |
|---|---|---|---|---|---|
| `sunny-component-library` | dir | — | 2026-08-15 | — | **The active project** (nested `sunny-component-library/sunny-component-library/`), now copied to `DOBETTERCODE/SunnyUI` |
| `sunny-component-library-v1` | dir | — | 2026-08-09 | — | Prior version, same nested structure. Historical checkpoint. |
| `sunny-component-library-v1.zip` | zip | 1.03 MB | 2026-08-09 | `9e84f02b6823` | Zipped copy of the above |
| `sunny-component-library-v2-headbang.zip` | zip | 1.17 MB | 2026-08-09 | `e2c1e5f35630` | An intermediate v2 checkpoint, headbang-focused |
| `sunny-component-library.zip` | zip | 0.01 MB | 2026-08-09 | `368cc4021db2` | Tiny — likely an empty/near-empty zip or a manifest-only archive; not verified |
| `Sunny Headbang Animation Final PV1/` | dir | — | 2026-08-13 | — | Source of hb01-10 + poses27 (see mapping table above) |
| `Sunny Headbang Animation Final PV1.zip` | zip | 37.25 MB | 2026-08-13 | `5fde69e0fb83` | Zipped copy |
| `Sunny Idle animation loop/` | dir | — | 2026-08-15 | — | **Unintegrated design handoff — see finding above** |
| `Sunny rage animation system (1)/` | dir | — | 2026-08-15 | — | Source of production rage sprite sheet |
| `Sunny rage animation system (1).zip` | zip | 1.30 MB | 2026-08-15 | `be18cd112c9f` | Not byte-identical to the non-"(1)" zip below |
| `Sunny rage animation system.zip` | zip | 1.57 MB | 2026-08-15 | `43128ebc5c44` | Different content from the "(1)" zip — likely an earlier revision, not a simple duplicate |
| `Sunny Boot Sequence Animation/` | dir | — | 2026-08-15 | — | Integrated this session (`SunnyBootSequence`) |
| `Sunny Boot Sequence Animation.zip` | zip | 0.02 MB | 2026-08-15 | `4645a68b6df8` | Tiny — likely a thin wrapper, not the full bundle |
| `Sunny Stage Power-On.html` | file | 5.24 MB | 2026-08-14 | `aba4faaeaefa` | Integrated this session (`SunnyStagePowerOn`) |
| `Sunny Transform.html` | file | 5.83 MB | 2026-08-15 | `7929393e3094` | Integrated this session (`SunnyRailRiderAnimation`) |
| `Sunny Animation Standalone.html` | file | 1.56 MB | 2026-08-13 | `0f2f8b4b3ba7` | **Exact duplicate** of the "(1)" file below |
| `Sunny Animation Standalone (1).html` | file | 1.56 MB | 2026-08-13 | `0f2f8b4b3ba7` | **Exact duplicate** — same SHA-256 as above |
| `Sunny Booty Bounce.html` | file | 3.79 MB | 2026-08-14 | `7b02b09f3ba3` | NOT identical to the "(1)" file — different content, ~7 min apart |
| `Sunny Booty Bounce (1).html` | file | 3.79 MB | 2026-08-14 | `8bc662d86d7b` | NOT identical to the base file — likely a revised regeneration |
| `Sunny animation rig build.zip` | zip | 34.44 MB | 2026-08-09 | `d3ac1d00bbce` | Not yet opened/classified |
| `Sunny_Bull_Approved_Frames_01-10.zip` | zip | 25.10 MB | 2026-08-09 | `b995179f1d24` | Approved-frames stage of a "Bull" character animation pipeline (see `docs/ANIMATION_PIPELINE.md`) |
| `Sunny_Bull_NORMALIZED_01-10.zip` | zip | 21.65 MB | 2026-08-09 | `5f169c423ca3` | Normalization stage of the same pipeline |
| `Sunny_Bull_REGISTERED_01-10.zip` | zip | 23.47 MB | 2026-08-09 | `0867a0625b35` | Registration stage of the same pipeline |
| `sunny_dance_from_sheet_package.zip` | zip | 50.70 MB | 2026-08-09 | `1c928d8102e8` | Not yet opened/classified |
| `sunny_puppet_animation_v2_package.zip` | zip | 70.74 MB | 2026-08-09 | `5782c505ae95` | Not yet opened/classified |
| `sunny_rigid_cutout_v1_package.zip` | zip | 83.78 MB | 2026-08-09 | `3c34a2b6c23b` | Not yet opened/classified |
| `sunny_zero_deform_package.zip` | zip | 102.44 MB | 2026-08-09 | `36ffa5ab9dfe` | Largest single item found — not yet opened/classified |
| `SUNNY_BODY_REFERENCE_PHOTOS.zip` | zip | 5.24 MB | 2026-07-31 | `2bedda5be4ac` | Likely physical-hardware reference (photos), not UI art |
| `Sunny_Original_Mechanism_Photos/` | dir | — | 2026-08-01 | — | Real camera JPEGs of physical mechanism — **engineering reference for the physical robot, not this web UI** |
| `Sunny_Original_Mechanism_Photos.zip` | zip | 4.21 MB | 2026-08-01 | `790efbb82538` | Zipped copy of the above |
| `Sunny_UI_Reference_Pack_CLEAN/` | dir | — | 2026-08-12 | — | Curated reference pack — mix of descriptively-named ("Sunny booty cheeks") and generic ChatGPT-dated files |
| `Sunny_UI_Reference_Pack_CLEAN.zip` | zip | 2.11 MB | 2026-08-09 | `2f64e31cc418` | Zipped copy |
| `Sunny_UI_Reference_Pack_FINAL(1).zip` | zip | 6.52 MB | 2026-08-09 | `399af4114610` | A later/"FINAL" pack, not verified against CLEAN for overlap |
| `Sunny Icon Header v1.png` | file | 2.16 MB | 2026-08-14 | `7b949a0e4f0a` | Standalone icon/header art |
| `Sunny Logo.png` | file | 1.41 MB | 2026-08-14 | `4a5ad1b3dc98` | Standalone logo art — compare against `src/assets/sunny/sunny-logo.png` before assuming identical |
| `Sunny glasses rage gremn.png` | file | 2.02 MB | 2026-08-13 | `de36b80b63b9` | Standalone reference/concept art |
| `Sunflower_V1_Phase2_Deliverables.md` | file | 0.02 MB | 2026-07-09 | `d320b764e5fe` | Written deliverables doc — worth reading in a future pass, not opened this pass |
| `a123_turtle_sunflower_keychain_s.stl` | file | 8.37 MB | 2025-09-11 | `3a4b977ca7ba` | 3D-print STL — a turtle/sunflower keychain, unrelated product, **not part of the Sunny UI or robot project** |

## Generic/untitled ChatGPT image harvest (top-level Downloads only)

264 generically-named images (`ChatGPT Image <date>.png`, plus `image*`,
`Untitled*`, `Screenshot*`, `download*`, `generated*` patterns) sit loose at
the top level of Downloads, spanning **April 2025 through August 2026**.
Inspected via 9 contact-sheet montages (27-30 thumbnails each) rather than
individually, per the harvest request.

**Finding: the overwhelming majority (indices #0-235, ~236 of 264) are
unrelated to Sunny** — they belong to other client work found in the same
Downloads folder (a paintball team brand called "Butchers Northwest," a
"Baby Butchers" spinoff, a "Witchcraft" logo project, several action-figure
packaging mockups, an owl-lamp product, a shark/Venom mashup, and a
"Turner & Co Hardscapes" logo). None of these were misclassified as
Sunny-related.

**Finding: a dense, confirmed Sunny cluster exists at indices #236-263**
(the most recent images in the set, 2026-07-31 through 2026-08-15) —
overlapping almost exactly with this session's own active development
window. Confidence: **SUNNY_CONFIRMED** for all of these (visually verified,
not inferred from filename or timestamp alone):

| # | Filename | Dimensions | Category | Description | Sequence/Group |
|---|---|---|---|---|---|
| 236 | `ChatGPT Image Jul 31, 2026, 04_09_50 PM.png` | 1536×1024 | SUNNY ART / DESIGN REFERENCE | "Do Better" mandala logo + "I HAVE LIVED 1000 LIVES" potato mascot | Do Better Design branding sheet |
| 237 | `ChatGPT Image Jul 31, 2026, 04_09_56 PM.png` | 1536×1024 | SUNNY ART / DESIGN REFERENCE | Near-identical variant of #236 | Same, ~6s apart |
| 238 | `ChatGPT Image Jul 31, 2026, 08_34_39 PM.png` | 1024×1536 | DESIGN REFERENCE | "Sunny Dev Blog" website mockup | — |
| 239 | `ChatGPT Image Jul 31, 2026, 08_35_00 PM.png` | 1024×1536 | DESIGN REFERENCE | "Ready to Groove" — sunflower product/growth poster | Possibly related to boot/growth concept |
| 240 | `ChatGPT Image Jul 31, 2026, 10_49_30 PM.png` | 1536×1024 | SUNNY ART | "DO BETTER / DO BETTER" mandala + potato mascot, second pass | — |
| 241 | `ChatGPT Image Jul 31, 2026, 10_51_58 PM.png` | 1402×1122 | DESIGN REFERENCE / possibly ENGINEERING-ADJACENT | "Sunny by Sunflower" physical product concept board (pot, buttons, hardware layout) | APPROVAL STATUS UNKNOWN — appears conceptual, not measured hardware |
| 242 | `ChatGPT Image Aug 1, 2026, 11_22_32 AM.png` | 1536×1024 | DESIGN REFERENCE (labeled "engineering" but not validated) | "SUNNY — COMPLETE WIRING DIAGRAM" | **Do not treat as validated engineering data — concept-stage only; cross-check against the SUNNY-ENGINEERING repo before relying on it** |
| 243 | `ChatGPT Image Aug 7, 2026, 04_16_17 PM.png` | 1697×927 | DESIGN REFERENCE | Component/hardware layout concept | APPROVAL STATUS UNKNOWN |
| 244 | `ChatGPT Image Aug 13, 2026, 06_37_22 PM.png` | 1672×941 | SUNNY ART / ANIMATION KEYFRAME SHEET | "SUNNY STEM / BODY WIGGLE LOOPS — 24 FRAME ANIMATION REFERENCE SHEET" | Idle/wiggle animation planning |
| 245 | `ChatGPT Image Aug 14, 2026, 06_53_43 AM.png` | 1535×1024 | SUNNY ART | "Do Better Design / DBD" logo sheet with sunflower assets | — |
| 246 | `ChatGPT Image Aug 14, 2026, 07_39_27 AM.png` | 1758×895 | DESIGN REFERENCE (REJECTED?) | Wood-plank-style HOME/STATUS/DIAG icon row — an alternate/earlier nav-bar art style, visually different from the shipped metal-truss design | APPROVAL STATUS UNKNOWN — likely superseded |
| 247-251 | `ChatGPT Image Aug 14, 2026, 07_4*.png` | ~1672-1916×~821-941 | DESIGN REFERENCE | Metal-truss nav bar banner variants (different lighting states) — very likely direct reference for `sunny-nav-banner.png` / Stage Power-On art | Sequence — nav bar development |
| 252-253 | `ChatGPT Image Aug 14, 2026, 10_2-3*.png` | ~1048×1500 | SUNNY ART | Clean "I HAVE LIVED 1000 LIVES" potato mascot on white | Confirms deliberate, reused character asset |
| 254-260 | `ChatGPT Image Aug 14, 2026, 10_3*/11_1*.png` | ~1536-1774×~821-1024 | DESIGN REFERENCE / ANIMATION KEYFRAME SHEET | More nav-bar truss variants; #260/261 area includes a dark-background multi-frame grid resembling a "banner unroll + lights on" reference sheet | Sequence — nav bar / stage power-on development |
| 261-263 | `ChatGPT Image Aug 15, 2026, 09_4*.png` and Aug 15 late-evening | ~1448-1491×~1055-1086 | SUNNY ART / ANIMATION KEYFRAME SHEET | "SUNNY STARTUP / BOOT SEQUENCE" small pot/growth-stage icon grid, plus a larger nursery-tray-style grid of sunflower icons | Boot sequence concept art — predates/parallels the shipped `SunnyBootSequence` |

None of #236-263 were copied, moved, or renamed — they remain exactly where
they are in Downloads. If this project moves into an organized
`SunnyUI-Source-Assets/` structure in a future pass, these are strong
candidates for `05_Claude_Design_Exports/` or `03_Animation_Keyframes/`
depending on which ones turn out to be direct sources vs. planning
artifacts.

**Not scanned this pass:** generic-named images inside the Sunny-named
subfolders/zips themselves (e.g. `Sunny_UI_Reference_Pack_CLEAN/` contains
several `ChatGPT Image *.png` and bare-UUID-named files not enumerated
above), and any generic images elsewhere in Downloads outside the top
level. These are plausible locations for more material if a deeper pass is
wanted later.

## Duplicate report

Only one **exact** (SHA-256-identical) duplicate pair found at the top
level:

- `Sunny Animation Standalone.html` == `Sunny Animation Standalone (1).html`
  (both `0f2f8b4b3ba7...`) — classic browser re-download naming, 17 seconds
  apart.

Two **near-duplicate, NOT identical** pairs worth human attention (same
naming pattern, similar size, different hash — likely a regeneration or
revision, not a straight duplicate):

- `Sunny Booty Bounce.html` vs `Sunny Booty Bounce (1).html`
- `Sunny rage animation system.zip` vs `Sunny rage animation system (1).zip`

**No files were deleted.** All duplicates and near-duplicates are preserved
exactly where found, per the preservation-first principle for this
operation.

## What was NOT done in this pass

- Zip archives were not extracted or hashed internally.
- No file was moved out of Downloads (except the one, already-approved
  action: copying the live `sunny-component-library` project itself to
  `DOBETTERCODE/SunnyUI` — see `docs/HANDOFF.md`).
- Generic images inside subfolders/zips were not scanned.
- `Sunflower_V1_Phase2_Deliverables.md` was located but not read/summarized.
- The physical-hardware material (`Sunny_Original_Mechanism_Photos`,
  `SUNNY_BODY_REFERENCE_PHOTOS.zip`, the wiring-diagram image at #242) is
  flagged here for completeness but belongs conceptually to the separate
  `SUNNY-ENGINEERING` project (`C:\Users\jesse\OneDrive\SUNNY-BODY-001\
  SUNNY-ENGINEERING\`), not this UI repo — see that project's own docs
  before treating anything here as validated hardware data.
