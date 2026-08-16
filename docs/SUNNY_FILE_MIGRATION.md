# Sunny File Migration Log

Tracks every file/folder actually moved or copied during the pV1.0
preservation operation. If it isn't listed here, it wasn't touched.

## What was moved/copied

| Old path | New path | Action |
|---|---|---|
| `C:\Users\jesse\Downloads\sunny-component-library\sunny-component-library\` | `%USERPROFILE%\DOBETTERCODE\BACKUPS\SunnyUI-pre-pV1.0\` | **Copied** (safety backup, excl. `node_modules`) |
| `C:\Users\jesse\Downloads\sunny-component-library\sunny-component-library\` | `%USERPROFILE%\DOBETTERCODE\SunnyUI\` | **Copied** (new permanent development location, excl. `node_modules`, `dist`) |

That's it. The original Downloads copy at
`C:\Users\jesse\Downloads\sunny-component-library\` was **not deleted or
modified** — see `docs/HANDOFF.md` / the final preservation report for
whether it's safe to remove later.

## What was NOT moved (deliberately)

- All 38 top-level Sunny-named items catalogued in
  `docs/SUNNY_ASSET_INVENTORY.md` remain exactly where they were in
  Downloads.
- The `SunnyUI-Source-Assets/` folder structure was created as an empty
  scaffold (`01_Reference_Images/` through `99_Needs_Review/`) alongside
  `SunnyUI/`, but **no files were placed into it yet**. Populating it is a
  separate future pass — see the proposed-destination column in
  `sunny_asset_inventory.csv` for a starting point.
- No file inside Downloads was renamed.
- No duplicate was deleted (see the duplicate report in
  `SUNNY_ASSET_INVENTORY.md` — one exact duplicate and two near-duplicates
  were found and left in place).

## Why the source-asset migration was deferred

Several of the un-inventoried zip archives are large (up to ~102 MB) and
their contents haven't been individually verified yet. Moving/copying them
before they've been triaged risks recreating the same "scattered and
unsorted" problem one directory over. Per the operation's own preservation
principle — **preserve first, document second, organize third** — this pass
stopped at documentation. A follow-up pass can use
`sunny_asset_inventory.csv` as its starting worklist.
