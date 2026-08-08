# Bun `child_process` compatibility spike (throwaway)

**Spike-only. Not wired into the real build. Not a dependency of `src/` or `dist/`.**

This directory holds the harness scripts for the Bun `bun build --compile` /
`child_process` compatibility spike described in
`plan/phase-01-cli-foundation/002-bun-compatibility-spike.md`. Findings are
recorded in `plan/resources/bun-compatibility-spike-findings.md` (on the plan
worktree for the `modernization-foundation` plan).

- `harness.mjs` — exercises the real `@liquid-labs/liq-projects` `projects create`
  shell-out pattern (`shelljs`'s `shell.exec`, as used via `@liquid-labs/shell-toolkit`'s
  `tryExec`/`tryExecAsync`) for `git init`/`add`/`commit`/`push`, spawning the real
  `hub`/`gh` binaries, and a `fetch` call standing in for the Octokit-based
  label/milestone setup calls.
- `harness-raw-childprocess.mjs` — the same checks using raw `node:child_process`
  (`execSync`/`exec`) directly, with no `shelljs` dependency, used as a differential
  control to isolate whether a failure is in Bun's `child_process` support itself or
  specific to `shelljs`'s dynamic-`require` command-loading design.

Run either with `bun run <file>.mjs` (interpreted) or compile first with
`bun build --compile --outfile <name> <file>.mjs` and run the resulting binary
directly — the compiled-binary code path is the one that matters for this spike
(see the findings doc). Compiled binaries are gitignored (`.gitignore` entries for
`spike/bun-compat/*-bin`); regenerate them locally if you need to re-run the compiled
check.

This directory can be deleted at any time without affecting the real CLI — nothing
under `src/` imports from it.
