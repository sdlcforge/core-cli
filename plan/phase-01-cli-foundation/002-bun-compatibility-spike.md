# Bun Compatibility Spike

## Purpose and scope

The user has decided (2026-08-07 planning session) that the Bun migration already underway in this repo (`bun.lock` present, a Bun shebang already in `dist/sdlcpilot-cli.js`, a recent "converted to bun" commit) is **strategic**: `bun build --compile` is the intended packaging path for the eventual self-contained single-binary CLI (a later modernization phase, not this one). The modernization synthesis (`/tmp/flow-sdlc-modernization/synthesis.md` §4 "Packaging: Bun", and §7 Phase 0 item 4) flags Bun's Node compatibility for heavy `child_process` use as **the top risk to that entire later packaging strategy**, since `liq-projects`/GitHub-integration code shells out constantly to `git`, `hub`, `npm`, and `gh`. The synthesis explicitly calls for spiking this now, in Phase 0, "while course correction is still cheap" — not deferring it to the phase that actually builds the shipping binary.

This task is a time-boxed spike (~1 day budget), not production packaging work. Its job is to produce a clear go/no-go signal on Bun's `child_process` compatibility for this codebase's actual shell-out patterns, not to ship anything.

## Requirements

- Write a small, throwaway Bun-compiled test harness (does not need to live permanently in this repo — a `spike/` directory that can be deleted after, or documented and then removed, is fine) that exercises the real `projects create` flow's shell-out pattern end-to-end:
  1. `git init` (or equivalent) in a scratch directory.
  2. `hub create` (or `gh repo create`, whichever this codebase's `liq-projects`/GitHub-integration code actually invokes today — check `/Users/zane/playground/liquid-labs/liq-projects` source, e.g. via `shelljs`/`shell-toolkit` calls, to use the *real* invocation pattern, not a guessed one) against a real or mocked GitHub target.
  3. `git push`.
  4. Label/milestone setup calls (whatever the real `projects create` flow does — reference the liq-projects research note at `/tmp/flow-sdlc-modernization/liq-projects.md` for the specific operations if useful).
  - It is acceptable to mock the actual GitHub network calls (e.g. against a scratch/test repo, or a local git remote) — the point is exercising Bun's `child_process` behavior under the same shell-out *pattern* the real code uses (subprocess spawning, stdout/stderr capture, exit-code handling, environment/PATH inheritance), not validating GitHub API correctness.
  - Compile this test harness with `bun build --compile` and run the **compiled binary** (not `bun run` on the source) — the spike must validate the compiled-binary code path specifically, since that's what production packaging will actually ship.
- Record the outcome — pass, fail, or partial, with specifics — in a short spike report: `plan/resources/bun-compatibility-spike-findings.md` in this repo's plan worktree. Cover:
  - Did the compiled binary successfully spawn and communicate with `git`/`hub`/`gh`/`npm` subprocesses?
  - Any Bun-specific `child_process` quirks encountered (stdio handling differences, PATH resolution differences, environment variable passing, signal handling, etc.).
  - A clear go/no-go recommendation: does this validate `bun build --compile` as the packaging strategy for the later single-binary phase, or does it surface a blocker that should route back to the fallback (esbuild + Node SEA, per synthesis §4)?
- Do not modify `liq-projects` or any other repo as part of this spike — the harness is self-contained within this repo (or a scratch location), and existing production code is read-only reference material for what pattern to replicate.
- Clean up any scratch GitHub repos, local git remotes, or other spike artifacts created during testing before finishing.

## Validation

- `plan/resources/bun-compatibility-spike-findings.md` exists and contains a clear go/no-go recommendation with supporting detail.
- If a `spike/` directory or similar throwaway harness was added, confirm it's either removed before the final commit or clearly marked as spike-only (not integrated into the real build) — the task's own report should state which choice was made and why.
- No unrelated repo (`liq-projects`, `core-server`, etc.) was modified.
- No leftover scratch GitHub repos or git remotes from testing.

## Metadata

architectural_impact: false
