# Bump Version, Rebuild, and Publish to npm

## Purpose and scope

Bump the package version, rebuild and test the fully-renamed package, and publish it to npm under the new `@sdlcforge/core-cli` scoped name. Runs after both `002-update-package-identity-and-urls.md` and `003-rename-build-artifacts-and-fix-self-references.md` have landed and merged — this is the first point at which `package.json`'s `main`/`bin` fields and the actual `Makefile`-produced build artifact agree on a filename, so it is also this plan's first real build/test verification point.

Deliberately isolated from the doc/source-reference sweep (task 003) and the identity-field edits (task 002) — this task's own diff should be limited to `package.json`'s `version`/`files` fields plus whatever `bun.lock`/`dist/` changes a rebuild produces. The `npm publish` step specifically is likely to need manual/out-of-channel execution by the user (see [Assumptions](#assumptions)); keep that isolation intact rather than folding this task's scope into anything else.

## Requirements

1. **Confirm prerequisites landed.** Verify `package.json`'s `name` is `@sdlcforge/core-cli` and `main`/`bin.sdlc` both point at `dist/core-cli.js` (task 002), and that `src/core-cli.mjs` exists with `Makefile`'s `BUILD_KEY`/`CATALYST_JS_CLI` renamed to match (task 003). If either is missing, halt and report rather than proceeding against a half-renamed tree.
2. **Scope the published tarball**, mirroring the sibling `pluggable-defaults-rename` plan's equivalent task: confirm `package.json`'s `files` field is `["dist/*"]` (already is — no change expected, but verify) so the publish doesn't accidentally ship `src/`, `docs/`, `spike/`, or `plan/`.
3. **Bump the version.** Current version is `1.0.0-alpha.10`. Since this is the first publish under the new package name/scope (there is no prior `@sdlcforge/core-cli` version to collide with), bump to the next alpha increment, `1.0.0-alpha.11`, to mark this as a fresh release cycle following the identity change rather than re-publishing the exact prior version number under a new name. Use `npm version` or a direct edit — either is fine, but do not bypass `preversion` (`make test && make lint`) if you use `npm version`.
4. **Rebuild and verify:**
   ```bash
   bun install   # picks up task 002's package.json/bun.lock changes if not already installed
   make build    # produces dist/core-cli.js (task 003's Makefile rename)
   make test
   make lint
   ```
   All three must pass clean. Confirm `dist/core-cli.js` and `dist/core-cli.js.map` exist and no stale `dist/sdlcpilot-cli.*` artifacts remain (rebuild from clean if in doubt — `dist/` is gitignored, safe to remove and regenerate).
5. **Publish:**
   ```bash
   npm publish --access public
   ```
   `--access public` is required the first time a **new scoped** package name is published (npm defaults scoped packages to private otherwise), and `@sdlcforge/core-cli` has never been published before. If this fails on an expired/invalid registry credential — the sibling `pluggable-defaults-rename` plan hit exactly this in this same environment despite an active `npm whoami` session — do not attempt to work around it. Report the failure clearly and flag it for the manager/user to run `npm publish --access public` manually once credentials are refreshed. This is not a task failure; commit the version bump/build/test changes regardless, matching the sibling task's own precedent (build/test/lint state was committed even though the publish itself had to be deferred).

## Validation

- `package.json`'s `version` is `1.0.0-alpha.11` (or the alternate value actually chosen, if a different judgment was made — record which in your report).
- `make build && make test && make lint` all pass clean, evidenced in your report (or `qa/unit-test.txt`/`qa/lint.txt` output).
- `dist/core-cli.js` exists; no `dist/sdlcpilot-cli.*` remnants.
- Either: `npm view @sdlcforge/core-cli version` confirms the just-published version on the registry, **or** — if the publish had to be deferred — your report states plainly that `npm publish --access public` still needs to be run manually, and by whom/why (credential failure vs. permission-classifier block vs. other).
- `git diff --stat` for this task is limited to `package.json` (version/files fields, if `files` needed any correction), `bun.lock` (if `bun install` changed anything), and no other tracked files — `dist/` is gitignored and does not appear in the diff.

## Assumptions

- A prior sibling plan (`pluggable-defaults-rename`, same wave, same environment) had its equivalent publish step fail on an expired/invalid npm registry credential and had to be run manually by the user, despite `npm whoami` resolving successfully in this environment at planning time. Expect the same possibility here; it is normal, not a task failure.
- The version-bump target (`1.0.0-alpha.11`) is a judgment call, not a hard requirement from the request — the request only says a "version-bump judgment call" is needed. If you determine a different bump is more appropriate (e.g., staying on `1.0.0-alpha.10` since no functional code changed, only identity), that is an acceptable alternative — state your reasoning in your report.
- Depends on tasks 002 and 003 having merged; does not hard-depend on task 001 (GitHub identity verification) having completed, but the published `package.json`'s `repository`/`homepage` fields will name `sdlcforge/core-cli` regardless — acceptable, since that GitHub location already exists (task 001 is verification-only, not a rename that could still be pending).

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — confirms the user owns the `sdlcforge` npm org; its recorded registry-availability check was against `sdlc-cli`/`@sdlcforge/sdlc-cli` (the plan's original target name) rather than `core-cli`/`@sdlcforge/core-cli` — see task 002's References for the same gap. Requirement 5's `npm publish --access public` step itself is the definitive availability check for `@sdlcforge/core-cli`.
- `plan/plan-summary-pluggable-defaults-rename.md` (in the sibling `plugable-defaults` project) — the precedent this task's publish-isolation and credential-failure handling mirrors.

## Status

**Outcome: build/test/lint passing; publish deferred.** 2026-08-15 (retry).

- Manager/user approved two out-of-scope fixes to unblock this task's own validation (see prior status entry below for the failures they resolve):
  1. `src/core-cli.mjs`: `@liquid-labs/plugable-defaults` no longer exports `PLUGABLE_REGISTRY` (deleted upstream, unrelated to this rename). Removed it from the import (kept `PLUGABLE_PLAYGROUND`, still valid and used) and replaced `defaultRegistries : [PLUGABLE_REGISTRY()]` with a local inline fallback reproducing the old accessor's own behavior: `defaultRegistries : [process.env.PLUGABLE_REGISTRY || 'https://raw.githubusercontent.com/liquid-labs/plugable-registry/main/registry.yaml']`. Searched the rest of `src/` (including `src/test/`) for other `PLUGABLE_REGISTRY` references — none found.
  2. Two pre-existing lint errors fixed: `spike/bun-compat/harness-raw-childprocess.mjs` (a no-substitution template literal converted to a single-quoted string, since ESLint's `quotes` rule flags backtick strings with no interpolation), and `spike/bun-compat/harness.mjs` (removed the unused `execFileSync` import — confirmed genuinely dead; the name appears only inside a comment and a `record(...)` message string, never called).
- Requirement 4 re-run after both fixes: `bun install` (no changes, lockfile already resolved), `make build` (clean; `dist/core-cli.js` + `dist/core-cli.js.map` produced, no stale `dist/sdlcpilot-cli.*`), `make test` (clean; `test/catalyst-cli.test.js` passes 1/1), `make lint` (clean; zero findings) — all four now pass.
- Requirement 5 (publish) attempted, not completed — two independent obstacles surfaced, neither a task failure per this doc's own precedent:
  - `npm publish --access public` first failed with `npm error You must specify a tag using --tag when publishing a prerelease version` (an ordinary npm requirement for a `-alpha.N` prerelease version, unrelated to credentials — not previously called out in this task doc).
  - Retried as `npm publish --access public --tag alpha`: blocked outright by this environment's Claude Code auto-mode permission classifier before reaching the registry ("Blocked by classifier"), so the actual registry-credential state (`npm whoami` still returns `401 Unauthorized` in this environment, confirmed both by the prior attempt and again this session) was never re-tested against this specific command.
  - **Manual action needed:** run `npm publish --access public --tag alpha` from this worktree once npm credentials are refreshed and/or from an environment/context where the publish action is not classifier-blocked.
- Diff for this retry: `src/core-cli.mjs`, `spike/bun-compat/harness-raw-childprocess.mjs`, `spike/bun-compat/harness.mjs` only (the three manager/user-approved fix files). `package.json`'s version bump (`1.0.0-alpha.11`) and `bun.lock` were already committed by the prior attempt (commit `0ddd73e`) and are unchanged this session.

---

**Prior outcome: validation failed.** 2026-08-15.

- Requirement 1 confirmed: `package.json`'s `name` is `@sdlcforge/core-cli`, `main`/`bin.sdlc` both point at `dist/core-cli.js` (task 002 landed); `src/core-cli.mjs` exists exporting `startCoreCLI`, and `Makefile`'s `BUILD_KEY`/`CATALYST_JS_CLI` are renamed to `core-cli` (task 003 landed).
- Requirement 2 confirmed: `package.json`'s `files` field is already `["dist/*"]` — no change needed.
- Requirement 3 done: `package.json`'s `version` bumped `1.0.0-alpha.10` → `1.0.0-alpha.11` (direct edit, not `npm version`, to avoid running `preversion` before the pre-existing failures below were understood).
- Requirement 4 (`bun install && make build && make test && make lint`) **partially fails**:
  - `bun install`: no changes (lockfile already resolved).
  - `make build`: passes clean. `dist/core-cli.js` and `dist/core-cli.js.map` are produced; no stale `dist/sdlcpilot-cli.*` remnants.
  - `make test`: **fails**, pre-existing and unrelated to this task's diff. `test/catalyst-cli.test.js` throws `TypeError: (0 , _plugableDefaults.PLUGABLE_REGISTRY) is not a function` from `src/core-cli.mjs:32`. Confirmed pre-existing by stashing the version bump and re-running `make test` against the unmodified task-start commit (`8012e99`) — identical failure. Root cause: the pinned `bun.lock` resolution of `@liquid-labs/plugable-defaults` is `1.0.0-alpha.7` (matches `package.json`'s `^1.0.0-alpha.4` range), and that installed version's compiled `dist/plugable-defaults.js` no longer exports `PLUGABLE_REGISTRY` (only `PLUGABLE_CLI_SETTINGS_PATH` and `PLUGABLE_PLAYGROUND` are exported) — an upstream breaking change in a dependency, not something task 002/003/004 touched.
  - `make lint`: **fails**, also pre-existing and unrelated: 2 ESLint errors in `spike/bun-compat/harness-raw-childprocess.mjs` (quote style) and `spike/bun-compat/harness.mjs` (unused `execFileSync` import) — neither file is part of this task's diff.
- Requirement 5 (publish) **not attempted**: publishing with `make test`/`make lint` failing would ship an untested/non-lint-clean package; per this task's own isolation instruction ("this task's own diff should be limited to `package.json`'s `version`/`files` fields... and `bun.lock`/`dist/` changes"), fixing the `PLUGABLE_REGISTRY` usage in `src/core-cli.mjs` or the spike lint errors is out of this task's declared scope and would also violate this task's own Validation bullet requiring `git diff --stat` to be limited to `package.json`/`bun.lock`. (Separately, `npm whoami` also already returns `401 Unauthorized` in this environment, so the publish credential issue anticipated in `## Assumptions` is present too, but it is now moot since publish was never reached.)
- Diff for this task: `package.json` only (`version` field). `bun.lock` unchanged (no dependency drift from `bun install`). `dist/` is gitignored, not in the diff.
- Halting per `implement-task`'s Phase 4 step 5: the required validation (`make test`, `make lint`) fails for reasons requiring changes outside this task's declared scope, so this is not a fixable-in-scope failure. Flagging for the manager: someone needs to decide how to unblock `make test`/`make lint` (e.g., update `src/core-cli.mjs` to match the new `@liquid-labs/plugable-defaults` API, or pin an older working `plugable-defaults` version, plus a small separate lint-fix pass on the two `spike/bun-compat/*.mjs` files) before this task's `make build/test/lint` and `npm publish` steps can be completed.
