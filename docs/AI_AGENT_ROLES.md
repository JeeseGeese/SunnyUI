# AI Agent Roles — Reusable Guide

Which tool should get which kind of task. Developed on the Sunny UI project;
intended to be reused on future Do Better projects, not Sunny-specific.

## ChatGPT — Creative Development

Best for:
- Brainstorming and open-ended concept exploration
- Visual concepts, character/mascot design, style direction
- Prompt refinement for image generation
- Animation planning and frame breakdowns (keyframe sheets, pose grids)
- Workflow planning
- Troubleshooting *concepts* ("what should this feel like") rather than code

Not the right tool for: final implementation, architecture decisions, or
anything that needs to stay byte-for-byte consistent with an existing
codebase.

## Claude Design — Visual Prototyping

Best for:
- Turning an approved concept/keyframe set into a working animated prototype
- HTML/CSS/JS mockups that are actually interactive, not static comps
- Timing and transition experimentation
- Layout exploration at real fidelity

Output worth keeping: the timing/cue tables and motion math, and any bundled
production art. Output *not* worth keeping: the authoring tool's own
generic timeline/export/editor scaffolding — that's infrastructure for
building the prototype, not part of the product.

## Claude Code — Implementation

Best for:
- Project architecture and structure
- Turning approved prototypes/assets into reusable components
- Asset extraction and integration (including decoding bundled/exported
  design files back into individual production assets)
- State management, interaction wiring, hotspot calibration
- Filesystem organization, Git, build verification, portability
- Anything that needs to be correct, reversible, and auditable

Not the right tool for: originating visual direction. It implements and
integrates decisions that have already been made upstream — it shouldn't be
the one deciding what Sunny should look like.

## Human — Creative Director

Responsible for:
- Selecting which concept/design gets carried forward
- Deciding what must NOT change once approved
- Judging quality — "does this look/feel right" is a human call, not an AI
  self-assessment
- Preserving visual identity across iterations
- Approving each checkpoint before the next stage builds on it

## Why the split works

Each stage narrows the space of things that can change. ChatGPT can
reinterpret Sunny freely (that's its job at that stage). Claude Design
should only be exploring *motion and interaction* on top of already-approved
art, not redrawing the character. Claude Code should only be
*implementing* what's already been visually approved — never regenerating
art, never re-timing an approved animation as a side effect of an unrelated
fix. Collapsing these into one agent, or one pass, removes the natural
checkpoints where the human gets to say "yes, that's Sunny" before more work
gets built on top of it — and that's where drift comes from.
