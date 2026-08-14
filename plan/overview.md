# Pluggable Defaults Rename

## Purpose and scope

This plan is part of Wave 1 ("Framework Naming Cleanup") of the `sdlcforge-modernization` wave plan (lead project: `core-server`). It corrects a double-g misspelling: "pluggable-defaults" should be "plugable-defaults" (single g). This plan-group spans three projects, each with its own plan worktree registered under the shared slug `pluggable-defaults-rename`:

- **pluggable-defaults** — the source of truth for the rename (directory rename, GitHub repo rename via `gh`, `package.json` name/main/repository/bugs/homepage fixes, reverting a public-API naming regression in `src/locations.mjs`, and — per the user's explicit decision — a version bump and `npm publish` of the corrected package). Registered as this plan-group's phase 1, tasks 001-005, in `pluggable-defaults`'s own plan worktree.
- **liq-work** — a consumer. Investigated, found already fully single-g and correct; a single verification task registered as phase 2 in `liq-work`'s own plan worktree.
- **sdlcpilot-cli** (THIS project) — another consumer. Its `package.json` already depends on `@liquid-labs/plugable-defaults` at `^1.0.0-alpha.4` (the correct single-g npm package name), resolving successfully against a real npm publish from Nov 2023 — no live/latent registry bug, contrary to an earlier incorrect investigation this plan-group corrects. `src/sdlcpilot-cli.mjs` imports `PLUGABLE_PLAYGROUND` and `PLUGABLE_REGISTRY` from `@liquid-labs/plugable-defaults` using the correct single-g identifier names, matching what the published `1.0.0-alpha.4` version actually exports.

### This project's own slice

An independent, repo-wide investigation (documented in [double-g-sweep.md](./notes/double-g-sweep.md)) was performed during planning, covering all 27 git-tracked files plus untracked content outside `node_modules/`, `.git/`, `worktrees/`, `.yalc/`, and gitignored build/test-scratch directories (`dist/`, `test-staging/`, `qa/`). The investigation confirms:

1. **No hardcoded double-g reference.** No link to `https://github.com/liquid-labs/pluggable-defaults` (double-g) and no prose spelling out "pluggable-defaults" double-g when naming the dependency exists anywhere in this repo. The only two "pluggable" hits repo-wide both concern the separate, unrelated `@liquid-labs/pluggable-express` package (covered by its own, already-planned `pluggable-express-rename` plan-group): a historical, already-merged sentence in `plan/plan-summary-modernization-foundation.md`, and the `l9ql` follow-up item in `plan/followups.yaml` — explicitly out of scope per this plan's instructions, and left untouched.
2. **No naming mismatch (item 2 of the requesting investigation).** `src/sdlcpilot-cli.mjs` is the only file in the whole repo that imports from `@liquid-labs/plugable-defaults`; it imports `PLUGABLE_PLAYGROUND` and `PLUGABLE_REGISTRY`, both single-g. Direct inspection of the resolved, installed npm package (`node_modules/@liquid-labs/plugable-defaults@1.0.0-alpha.4`, matching the locked `bun.lock` resolution against the real npm registry tarball) confirms it exports `PLUGABLE_CLI_SETTINGS_PATH`, `PLUGABLE_PLAYGROUND`, and `PLUGABLE_REGISTRY`, all in the correct single-g spelling — including the installed package's own `repository.url` field, which already reads the single-g GitHub path. This published version predates the double-g regression that affects `pluggable-defaults`'s *current source* (fixed by that project's own phase 1), not the already-published tarball `sdlcpilot-cli` depends on. No `PLUGGABLE_*` (double-g) identifier or env var appears anywhere in this repo.
3. **No config/env-var assumption mismatch (item 3).** `sdlcpilot-cli` never reads `process.env.PLUGABLE_PLAYGROUND`/`PLUGABLE_REGISTRY`/`PLUGABLE_CLI_SETTINGS_PATH` directly — it only calls the imported accessor functions. No on-disk config-directory path segment is hardcoded anywhere in this repo's source, `README.md`, `Makefile`, or `package.json`. The `l9ql` follow-up (stale `plugable-express` transitive-dependency version bug) is unrelated to this defaults rename and is not touched.

Because the investigation is conclusive — there is genuinely nothing in this repo's source, docs, or config to change — this plan-group's slice of this project registers a single lightweight verification task that re-runs the definitive repo-wide grep sweep and documents the "nothing found" outcome, per [double-g-sweep.md](./notes/double-g-sweep.md)'s Conclusion, mirroring how the sibling `liq-work` project's own `pluggable-defaults-rename` plan and `plugable-express-cli`'s `pluggable-express-rename` plan each handled an identical "nothing to change, verify" outcome. The task is sequenced to run after `pluggable-defaults`'s own phase 1 tasks (directory rename, GitHub repo rename, `package.json` fixes, and the `src/locations.mjs` regression revert) land, so the "nothing to change" verdict is confirmed against the dependency's fully-corrected *post-rename* state rather than a snapshot that could be invalidated by that rename landing later.

A future follow-up — flagged for the manager, not registered as a task here — could bump this repo's `@liquid-labs/plugable-defaults` dependency spec beyond `^1.0.0-alpha.4` once `pluggable-defaults`'s own plan publishes a newer version under the corrected name; that publish has not yet happened and the version number is not yet finalized, so no task is created for it now.

### Out of scope

- Plugin-consolidation work (Wave 2), compile-time-manifest work (Wave 3), CLI/MCP unification (Wave 4) — separate, later wave plan-groups already recorded (placeholder) in the wave manifest at `core-server`'s `plan/waves/sdlcforge-modernization/manifest.yaml`.
- The unrelated `pluggable-express-rename` plan-group — already fully planned separately.
- The `l9ql` follow-up item in `plan/followups.yaml` (stale `plugable-express` transitive-dependency version bug) — unrelated to this defaults rename, not touched.

## Current status

Plan created with a single phase (phase 3, continuing this plan-group's federated phase numbering from `pluggable-defaults`'s phase 1 and `liq-work`'s phase 2). No prior phases exist in this project's own plan; phase 3 is this project's first and only phase and begins immediately — its one task has no unmet prerequisites of its own beyond the cross-project dependency noted above (which the task's own Validation step accounts for by re-running the sweep at execution time).

## Overview

### Phase 3 — Verification sweep

Single phase, single task. Confirms this project needs no code/doc/config changes for the `pluggable-defaults` → `plugable-defaults` rename, and records that confirmation durably.

- [`001-verify-no-double-g-references.md`](./phase-03-verification-sweep/001-verify-no-double-g-references.md) — re-run the repo-wide double-g grep sweep (tracked and relevant untracked files, plus the import/export naming-mismatch check) and confirm no genuine "pluggable-defaults" (double-g) content reference, hardcoded double-g GitHub link, or import/export naming mismatch exists in this repo. No code changes expected; this task is verification-only unless the sweep surfaces something the planning-time investigation missed, in which case the task documents and flags it rather than silently expanding scope.

No parallelism applies (single task). No `doc-updates` phase is registered — this plan makes no architectural changes: no public API/component-boundary change, no new subsystem, no spec-defined-behavior change, and no tracked-state addition/removal.
