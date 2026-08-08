# Plan Summary: modernization-foundation

## What was planned and why

This is Phase 0 ("Preconditions and de-risking") of a larger, multi-phase SDLCForge/SDLCPilot modernization effort. Phase 0 spans five repositories under one shared plan slug (`modernization-foundation`): `@sdlcforge/core-server`, `@liquid-labs/pluggable-express`, `liq-projects`, `liq-work`, and `sdlcpilot-cli` (this repo). The overall modernization (documented in full at `/tmp/flow-sdlc-modernization/synthesis.md`, and rendered at `/tmp/flow-sdlc-modernization/synthesis-artifact.html`) will eventually consolidate ~13 small plugin packages into 4, move plugin composition from runtime/reflective to compile-time, ship a self-contained single-binary CLI via Bun, and add an MCP frontend. Phase 0 only covers foundational de-risking and prerequisites for that later work — it does not implement any of the consolidation, compile-time composition, or binary packaging itself.

This repo's slice of Phase 0: this is the CLI half of the platform — 48 lines of its own configuration code, with all real command-parsing/transport logic living in `@liquid-labs/plugable-express-cli`. It's slated for deletion once a later phase collapses it and `core-server` into one product package, so its Phase 0 work is deliberately light: a documentation stopgap (not a full doc set), plus the highest-leverage risk-reduction spike in the whole plan — validating that Bun's `child_process` support can actually carry the heavy git/GitHub shell-out load this platform depends on, before any later phase commits real packaging work to that assumption.

### Phase 1 — CLI Documentation Stopgap and Bun Packaging Spike

- **001 — Documentation Stopgap.** Fixes a typo and two stale asides in the existing README, adds a short banner pointing at the modernization plan. Explicitly does *not* produce a full doc set — this repo is slated for deletion in a later phase, and its docs trigger (per synthesis §6) is "when the unified `sdlcpilot` product package exists," not Phase 0.
- **002 — Bun Compatibility Spike.** Time-boxed (~1 day) spike compiling a Bun binary that exercises the real `git`/`hub`/`gh`/`npm` shell-out pattern `projects create` uses today, to validate or invalidate `bun build --compile` as the eventual single-binary packaging strategy while course correction is still cheap. Produces a go/no-go finding, not production code.

Both tasks are independent and can run in parallel or either order.

## What shipped

### Phase 01 — CLI Documentation Stopgap and Bun Packaging Spike

1. **Documentation Stopgap** (`001-documentation-stopgap.md`, tier `haiku-low`) — Fixed three documentation issues in README.md: corrected mkdkir typo, removed stale package-name aside, removed unresolved TODO aside. Added a modernization banner after the title pointing at plan/. All four validation checks passed; only README.md was modified as required.
   Commit `de27e13`, merged at `001c97d`.

2. **Bun Compatibility Spike** (`002-bun-compatibility-spike.md`, tier `sonnet-high`) — Built and ran a Bun child_process compatibility spike against liq-projects' real projects-create shell-out pattern. Conditional go: Bun's own child_process primitives work correctly inside a bun build --compile standalone binary for git/hub/gh/npm. However shelljs itself (which the codebase's GitHub-integration shell-outs depend on) fails to load inside any bundled Bun output due to a dynamically-computed require() that Bun's bundler can't statically resolve. Secondary non-blocking finding: Bun's execSync/exec don't auto-inherit post-startup process.env mutations. Recommended path: replace shelljs with raw node:child_process in liq-projects before the later packaging phase, rather than abandoning bun build --compile. All scratch artifacts cleaned up; liq-projects was read-only throughout.
   Commit `2c38304`, merged at `25fd801`.

## Key decisions

_No `## Why this shape` section is recorded in `plan/overview.md`, so this plan's cross-task rationale was never written down. Per-task outcomes are under "What shipped" above._

## Follow-up items

- **`sSvA`** — **Findings report was written to the plan workt** — Findings report was written to the plan worktree (plan/resources/bun-compatibility-spike-findings.md) per the task doc's explicit instruction and the plan_worktree_path argument, rather than the task worktree — manager confirms this is the correct, intended pattern for this dispatch shape.

- **`j6jz`** — **liq-projects (read-only reference repo) has p** — liq-projects (read-only reference repo) has pre-existing uncommitted local WIP unrelated to this task — noted for visibility, already known to and now resolved by the manager (committed separately).

- **`MhCu`** — **The spike did not test signal handling (SIGTE** — The spike did not test signal handling (SIGTERM/SIGINT delivery to a spawned async subprocess), named in the task's list of quirks to check but dropped once the blocking shelljs finding emerged. Worth a follow-up spike check before the actual packaging phase.

- **`hwbY`** — **Actionable remediation surfaced by this spike** — Actionable remediation surfaced by this spike: replace shelljs with raw node:child_process in liq-projects's create-lib.mjs, rename-lib.mjs, publish-lib.mjs, do-npm-publish.mjs, and @liquid-labs/shell-toolkit's try-exec*.mjs. Out of this task's scope (liq-projects is read-only reference material); belongs to whichever later phase builds the actual packaging pipeline.

- **`jnPm`** — **Document harness-external-bin gitignore entry** — .gitignore adds a `harness-external-bin` entry (spike/bun-compat/) with no corresponding documentation of which build command produces it (unlike the two sibling entries, which map clearly to harness.mjs and harness-raw-childprocess.mjs). Likely the `--external shelljs` compile experiment mentioned in plan/resources/bun-compatibility-spike-findings.md's Finding 1, but that experiment's output filename is never stated. Either document the exact build command in the findings doc, or drop the orphaned gitignore entry.

- **`WYlk`** — **Bun spike: fix misleading node shebang** — spike/bun-compat/harness.mjs and harness-raw-childprocess.mjs both carry `#!/usr/bin/env node` shebangs despite existing specifically to validate Bun-specific compiled-binary behavior. If either were ever chmod +x'd and run directly, it would silently run under Node instead of Bun, invalidating the differential result with no error. Low real-world risk today (files are mode 100644, non-executable, and the README correctly instructs `bun run`/`bun build --compile`), but worth changing to `#!/usr/bin/env bun` (or dropping the shebang) to remove the latent footgun for future re-validation.

- **`u0Fw`** — **Bun spike: add SIGINT cleanup for scratch dir** — spike/bun-compat/harness.mjs and harness-raw-childprocess.mjs clean up their mkdtempSync scratch directory in a try/finally block, which covers normal completion and thrown exceptions, but neither registers a SIGINT/SIGTERM handler — a manual Ctrl+C mid-run (plausible, since one check does a real network fetch and another retries git push up to 5 times) bypasses the finally block and leaves the scratch directory on disk. Worth adding a process signal handler that runs the same rmSync cleanup, if this harness is run interactively again for future re-validation.

## Final Task State

# TODO

## Purpose and scope

Tracking document for the active plan.

## Tasks

### Phase 01 — CLI Documentation Stopgap and Bun Packaging Spike

- [x] [001-documentation-stopgap.md](./phase-01-cli-foundation/001-documentation-stopgap.md) — tier `haiku-low` · branch `plan/modernization-foundation-01-001` · commit `de27e13` · merge `001c97d`
- [x] [002-bun-compatibility-spike.md](./phase-01-cli-foundation/002-bun-compatibility-spike.md) — tier `sonnet-high` · branch `plan/modernization-foundation-01-002` · commit `2c38304` · merge `25fd801`
