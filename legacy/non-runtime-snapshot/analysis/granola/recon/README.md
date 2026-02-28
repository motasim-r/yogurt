# Granola Reverse-Engineering Workspace

This directory contains extracted artifacts and reconstruction outputs used to build a clean-room internal prototype.

## Layout

- `../raw/`: raw extracted assets from the installed app bundle.
- `./prettified/`: prettified JS/CSS/HTML from extracted artifacts.
- `./module-index.md`: static index of entrypoints, renderer chunks, IPC-like strings, and feature-flag text hits.
- `./ipc-contract-draft.md`: curated high-confidence IPC/event channel candidates.
- `./window-lifecycle-map.md`: observed + inferred window lifecycle mapping.
- `./renderer-route-state-map.md`: inferred renderer route/state structure used by the prototype.
- `./known-gaps.md`: known reverse-engineering limits for this milestone.
- `./runtime/`: runtime observation reports and capture attempts.
- `./tests/`: reproducibility checks for extracted manifests.

## Scripts

- `scripts/extract-granola-artifacts.sh`
- `scripts/prettify-bundles.sh`
- `scripts/build-module-index.sh`
- `scripts/runtime-observe-granola.sh`
