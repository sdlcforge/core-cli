# Modernization Foundation — Overview (sdlcpilot-cli)

## Purpose and scope

This is Phase 0 ("Preconditions and de-risking") of a larger, multi-phase SDLCForge/SDLCPilot modernization effort. Phase 0 spans five repositories under one shared plan slug (`modernization-foundation`): `@sdlcforge/core-server`, `@liquid-labs/pluggable-express`, `liq-projects`, `liq-work`, and `sdlcpilot-cli` (this repo). The overall modernization (documented in full at `/tmp/flow-sdlc-modernization/synthesis.md`, and rendered at `/tmp/flow-sdlc-modernization/synthesis-artifact.html`) will eventually consolidate ~13 small plugin packages into 4, move plugin composition from runtime/reflective to compile-time, ship a self-contained single-binary CLI via Bun, and add an MCP frontend. Phase 0 only covers foundational de-risking and prerequisites for that later work — it does not implement any of the consolidation, compile-time composition, or binary packaging itself.

This repo's slice of Phase 0: this is the CLI half of the platform — 48 lines of its own configuration code, with all real command-parsing/transport logic living in `@liquid-labs/plugable-express-cli`. It's slated for deletion once a later phase collapses it and `core-server` into one product package, so its Phase 0 work is deliberately light: a documentation stopgap (not a full doc set), plus the highest-leverage risk-reduction spike in the whole plan — validating that Bun's `child_process` support can actually carry the heavy git/GitHub shell-out load this platform depends on, before any later phase commits real packaging work to that assumption.

## Current status

Plan created 2026-08-07. No tasks started. Neither task in this repo's phase has a cross-project dependency — both can start immediately.

## Overview

### Phase 1 — CLI Documentation Stopgap and Bun Packaging Spike

- **001 — Documentation Stopgap.** Fixes a typo and two stale asides in the existing README, adds a short banner pointing at the modernization plan. Explicitly does *not* produce a full doc set — this repo is slated for deletion in a later phase, and its docs trigger (per synthesis §6) is "when the unified `sdlcpilot` product package exists," not Phase 0.
- **002 — Bun Compatibility Spike.** Time-boxed (~1 day) spike compiling a Bun binary that exercises the real `git`/`hub`/`gh`/`npm` shell-out pattern `projects create` uses today, to validate or invalidate `bun build --compile` as the eventual single-binary packaging strategy while course correction is still cheap. Produces a go/no-go finding, not production code.

Both tasks are independent and can run in parallel or either order.

## Open questions (not resolved by this plan)

- **Is Bun's role in packaging validated by this spike sufficient, or does a negative/partial finding require re-opening the packaging-strategy decision?** If task 002's spike finds a real blocker, the fallback (esbuild + Node SEA, per synthesis §4) becomes the live path for the later single-binary phase — that's a decision for the manager/user once the spike reports back, not something this plan pre-resolves.
