# Plan Summary: sdlcpilot-cli-rename

## What was planned and why

Rename and re-home the `sdlcpilot-cli` project: package/CLI identity moves from the `@liquid-labs`/`liquid-labs` org to the `@sdlcforge`/`sdlcforge` org, and the package itself is renamed from `sdlcpilot-cli` to `core-cli` (final target: package `@sdlcforge/core-cli`, GitHub repo `sdlcforge/core-cli`). This is plan-group `sdlcpilot-cli-rename` of Wave 2 ("Plugin Consolidation — Framework and Dev-Core") in the `sdlcforge-modernization` wave plan (lead project `core-server`). Single participant (`sdlcpilot-cli` only) — no federation, no dependency on the wave's other, still-unplanned plan-groups.

**In scope:** GitHub repo identity, `package.json` identity/URL fields, the built-artifact filename and its `Makefile`/`src` naming cascade, in-repo self-references (`README.md`, `docs/**/*.md`, source comments), the npm publish under the new scoped name, and the on-disk playground directory relocation (`liquid-labs/sdlcpilot-cli` → `sdlcforge/core-cli`).

**Explicitly out of scope:** the CLI/server binary-unification effort (`cli-mcp-binary-generation`, a separate later-wave plan-group building a future `sdlc-cli` as an encapsulation of a not-yet-existing `sdlc-core` package) — this plan is rename/relocation only, not a rebuild. Also out of scope: fixing up *other* projects' stale references to the old name (see [Flagged for manager](#flagged-for-manager) below) — that is follow-up work for those projects, not this plan-group.

## Purpose and scope

Rename and re-home the `sdlcpilot-cli` project: package/CLI identity moves from the `@liquid-labs`/`liquid-labs` org to the `@sdlcforge`/`sdlcforge` org, and the package itself is renamed from `sdlcpilot-cli` to `core-cli` (final target: package `@sdlcforge/core-cli`, GitHub repo `sdlcforge/core-cli`). This is plan-group `sdlcpilot-cli-rename` of Wave 2 ("Plugin Consolidation — Framework and Dev-Core") in the `sdlcforge-modernization` wave plan (lead project `core-server`). Single participant (`sdlcpilot-cli` only) — no federation, no dependency on the wave's other, still-unplanned plan-groups.

**In scope:** GitHub repo identity, `package.json` identity/URL fields, the built-artifact filename and its `Makefile`/`src` naming cascade, in-repo self-references (`README.md`, `docs/**/*.md`, source comments), the npm publish under the new scoped name, and the on-disk playground directory relocation (`liquid-labs/sdlcpilot-cli` → `sdlcforge/core-cli`).

**Explicitly out of scope:** the CLI/server binary-unification effort (`cli-mcp-binary-generation`, a separate later-wave plan-group building a future `sdlc-cli` as an encapsulation of a not-yet-existing `sdlc-core` package) — this plan is rename/relocation only, not a rebuild. Also out of scope: fixing up *other* projects' stale references to the old name (see [Flagged for manager](#flagged-for-manager) below) — that is follow-up work for those projects, not this plan-group.

## Current status

No active plan existed for this project before this session. This is the first invocation; `plan/overview.md`, `plan/TODO.yaml`, and the phase-01 task documents were authored fresh, then amended in a follow-up pass (below) once the target-identity discrepancy was resolved.

**Load-bearing discrepancy found during initial investigation, since resolved** (full detail in [GitHub and npm current-state investigation](./notes/github-and-npm-current-state.md)): the dispatch's assumed starting GitHub state — `liquid-labs/sdlcpilot-cli`, not yet transferred — was stale. The repo had **already been transferred** to the `sdlcforge` org, but was renamed in the same move to **`core-cli`**, not this plan's originally-assumed target `sdlc-cli`. At planning time `sdlcforge/sdlc-cli` did not exist, and the discrepancy was flagged in "Flagged for manager" below as needing explicit confirmation before task 001 (then a `gh repo rename` step) could safely run.

**Resolution (2026-08-14, this session):** the user was asked directly and confirmed **`core-cli` is the correct, intentional final name** — the live `sdlcforge/core-cli` state is not a stale interim state to correct, it is the confirmed target identity. This plan has been amended accordingly: every task document, this overview, and the notes file below now target `@sdlcforge/core-cli` / `sdlcforge/core-cli` throughout. Task 001 in particular was substantively rewritten from a `gh repo rename` operation to a verification-only check, since there is no GitHub-side rename left to perform. See the corrected "Flagged for manager" entry below for the full before/after record.

Also confirmed at planning time: the package is published on npm **unscoped** as `sdlcpilot-cli@1.0.0-alpha.10` (not `@liquid-labs/sdlcpilot-cli` as `package.json`'s `_comply.orgKey` field would suggest) — matching the dispatch's own caveat. `sdlc-cli` and `@sdlcforge/sdlc-cli` (the plan's original target name) were both confirmed unclaimed on the registry at that time; the user owns both the `liquid-labs` and `sdlcforge` npm orgs. `core-cli`/`@sdlcforge/core-cli`'s own npm-registry availability was not separately checked during planning (see task 002's and 004's References sections) — expected to be uncontested, since the user's own `sdlcforge` org already controls the GitHub name, but not independently confirmed until task 004's actual publish step.

## Overview

Single phase, five tasks, all directly actionable with information already in hand from this planning session's own investigation (repo/package/docs sweep, live `gh`/`npm` verification). No research delegation or user decision blocks task decomposition, so this is a single-phase plan (mirrors the Wave 1 sibling renames, `pluggable-express-rename` and `pluggable-defaults-rename`, both single-phase).

### Phase 1 — Rename and Relocation to SDLCForge

1. **[001 — Verify GitHub Repository Identity](./phase-01-rename-relocation/001-rename-github-repository.md)** (tier `sonnet-low`) — Verification-only: confirms `sdlcforge/core-cli` resolves correctly, confirms no stray `sdlcforge/sdlc-cli` exists, and confirms the local `origin` remote's current target. No `gh repo rename` (or any other mutating `gh` command) — the earlier plan draft's rename operation is obsolete now that `core-cli` is the confirmed target and the repo is already there. Isolated: touches no repository files.
2. **[002 — Update Package Identity and Repository URLs](./phase-01-rename-relocation/002-update-package-identity-and-urls.md)** (tier `sonnet-low`) — `package.json`'s `name`, `repository.url`, `bugs.url`, `homepage`, `_comply.orgKey`; the local `origin` git remote; regenerates `bun.lock`.
3. **[003 — Rename Build Artifacts and Fix Self-References](./phase-01-rename-relocation/003-rename-build-artifacts-and-fix-self-references.md)** (tier `sonnet-med`) — `Makefile`'s `BUILD_KEY`/`CATALYST_JS_CLI`, `src/sdlcpilot-cli.mjs` → `src/core-cli.mjs` (and its importers/exports), and the `README.md`/`docs/**/*.md`/spike-script self-references to the old package name and `SDLCPilot` branding.
4. **[004 — Bump Version, Rebuild, and Publish to npm](./phase-01-rename-relocation/004-bump-version-rebuild-and-publish.md)** (tier `sonnet-med`) — Bumps the alpha version, rebuilds, runs `make test`/`make lint`, and `npm publish`s under `@sdlcforge/core-cli`. Isolated from the doc/source-reference work above; likely needs manual/out-of-channel execution for the publish step specifically — the sibling `pluggable-defaults-rename` plan hit an expired/invalid npm registry credential on `npm publish` in this same environment.
5. **[005 — Relocate Project Directory](./phase-01-rename-relocation/005-relocate-project-directory.md)** (tier `sonnet-low`, **manager-executed, not task-agent-dispatched; runs last**) — Renames the local playground directory `liquid-labs/sdlcpilot-cli` → `sdlcforge/core-cli`, once tasks 001–004 have landed.

**Dependencies and parallelism.** Tasks 001, 002, and 003 touch disjoint resources (001 touches no repository files at all; 002 touches `package.json`/`bun.lock`/the local git remote; 003 touches `Makefile`/`src/`/`README.md`/`docs/`) and are mutually parallel-eligible — none blocks another technically. Task 004 depends on 002 and 003 both having landed (it needs the final `package.json` name/main fields and the renamed build artifact to build, test, and publish correctly); it does not hard-depend on 001, but should not run meaningfully ahead of it, since the published `package.json`'s `repository`/`homepage` fields name the confirmed `sdlcforge/core-cli` GitHub location that task 001 verifies. Task 005 (directory relocation) is sequenced strictly last, after all of 001–004 have landed, matching the sibling renames' pattern of running the on-disk directory move only once every other change is settled.

**Suggested dispatch grouping:** `{001, 002, 003}` in parallel, then `004` once both `002` and `003` have landed (with `001` ideally also settled by then), then `005` (manager-executed) once `004` has landed.

## Flagged for manager

- **GitHub target-name discrepancy — RESOLVED (2026-08-14, this session).** The live GitHub repo was already `sdlcforge/core-cli` (org transfer done, but renamed to `core-cli` rather than this plan's originally-assumed target `sdlc-cli`), with no record explaining the choice. The original version of this plan proceeded on `sdlc-cli` as still correct, based on same-day corroboration (the wave manifest, the original dispatch's own `user_request`, and `core-server`'s own docs all said `sdlc-cli`), but flagged it here as an inference rather than a confirmed decision, needing explicit user confirmation before task 001 (then a `gh repo rename` step) could safely run. **The user has since been asked directly and confirmed `core-cli` is the correct, intentional final name.** This plan has been amended throughout (this overview, all five task documents, and the notes file) to target `@sdlcforge/core-cli` / `sdlcforge/core-cli`. Task 001 was rewritten from a `gh repo rename sdlc-cli --repo sdlcforge/core-cli` operation to a verification-only check, since the confirmed target is already live. Full detail in [the notes file](./notes/github-and-npm-current-state.md).
- **Cross-project stale references (out of scope for this single-participant plan-group).** A repo-wide grep found other, unrelated projects still referencing the old `sdlcpilot-cli`/`@liquid-labs/sdlcpilot-cli` identity in ways that will go stale once this rename lands: `liquid-labs/plugable-express-cli`'s `README.md` (two GitHub-URL-bearing doc links), and `liquid-labs/sdlc-lib-build`'s `README.md` (one GitHub-URL-bearing doc link) — both unaffected by the `core-cli`-vs-`sdlc-cli` correction, still flagged as follow-up work. **`sdlcforge/core-server`'s own `README.md`/`AGENTS.md` is now also affected by that correction**: at planning time it said "currently `@liquid-labs/sdlcpilot-cli`" (itself already slightly wrong, since the live npm package was never actually scoped) and "migrating to `@sdlcforge/sdlc-cli`" — judged *already correct, no change needed* under the plan's then-assumed `sdlc-cli` target. With the target now confirmed as `core-cli`, that forward reference is **now stale** and *does* need a follow-up fix to say `@sdlcforge/core-cli` instead. All of these remain out of scope for this single-participant plan-group and are recorded here as flagged follow-ups rather than in-scope tasks.
- **"SDLCPilot" brand-name judgment call.** `README.md` and every `docs/*.md` file use "SDLCPilot" as a product-brand noun (page titles, banners, prose), distinct from the literal `sdlcpilot-cli` package-name string. Nothing in the request explicitly says to retire this brand noun, but `README.md`'s own `#` title has already been manually, partially updated to the generic "`sdlcforge cli`" (not a new "SDLCForge Pilot"-style brand), and the wave's own name/description frame this as adopting "the sdlcforge product-naming convention core-server already uses." Task 003 follows that precedent — generalizing "SDLCPilot" prose/titles into "SDLC CLI" framing rather than coining a replacement brand — documented as an assumption; flagging in case a distinct product brand identity was actually intended. **This judgment is deliberately unaffected by the `core-cli` target-identity correction**: the user-facing CLI command stays `sdlc` (see the next item), so "SDLC CLI" prose/title framing remains apt; only the literal package-name/repo-name/URL/filename occurrences change to `core-cli`.
- **`bin` command key vs. `core-cli` package name (new, this session).** Task 002 deliberately keeps the user-facing CLI command key `sdlc` unchanged — only its target file path changes — a decision this amendment session left untouched, since nothing in the user's `core-cli` confirmation asked for it to change. Flagging because "`core-cli`" as a package/repo name could arguably suggest a `core` command too; this plan does not act on that inference, and it would need its own explicit decision if ever pursued.

## Notes

- [GitHub and npm current-state investigation](./notes/github-and-npm-current-state.md) — live verification of the actual GitHub/npm state ahead of task drafting, including the `core-cli` discrepancy above.

## What shipped

### Phase 01 — Rename and Relocation to SDLCForge

1. **Verify GitHub Repository Identity** (`001-rename-github-repository.md`, tier `sonnet-low`) — Independently re-verified sdlcforge/core-cli is live/correct, no stray sdlc-cli exists, origin remote already repointed to sdlcforge/core-cli. No mutating gh command run, no repository files touched.
   Commit `3706f63`, merged at `2b1642c6d25373b8a6ef27479d2425ca688483ed`.

2. **Update Package Identity and Repository URLs** (`002-update-package-identity-and-urls.md`, tier `sonnet-low`) — Updated package.json identity fields (name, main, bin.sdlc target, repository.url, bugs.url, homepage, _comply.orgKey) to @sdlcforge/core-cli, left dependencies/devDependencies/author untouched. Verified origin remote already correct. Regenerated bun.lock via full reinstall since in-place bun install did not update the root name field.
   Commit `8b0c77d`, merged at `0998618361d745a9b9a3d42b08a5ce389080b194`.

3. **Rename Build Artifacts and Fix Self-References** (`003-rename-build-artifacts-and-fix-self-references.md`, tier `sonnet-med`) — Executed full build-artifact rename cascade (Makefile BUILD_KEY/CATALYST_JS_CLI, git mv src/sdlcpilot-cli.mjs to src/core-cli.mjs, startSDLCPilotCLI to startCoreCLI and consumers) plus README.md/docs/spike self-reference sweep per task doc. All validation checks pass; working tree clean.
   Commit `16fbd8d`, merged at `685a3a79b35627dd3f01fca03a4ff93875146c38`.

4. **Bump Version, Rebuild, and Publish to npm** (`004-bump-version-rebuild-and-publish.md`, tier `sonnet-med`) — Applied the two manager-approved fixes (PLUGABLE_REGISTRY hardcoded fallback, 2 spike lint fixes). bun install/make build/make test/make lint all pass clean. npm publish requires --tag alpha for this prerelease version (new finding, not in original task doc) and is blocked by the permission classifier plus a 401 credential issue in this environment - deferred to manual execution, matching documented precedent from the sibling pluggable-defaults-rename plan.
   Commit `f8bd2e6`, merged at `268483010967bfa651ed15f400272ff1fc4310e4`.

5. **Relocate Project Directory** (`005-relocate-project-directory.md`, tier `sonnet-low`) — Manager-executed directory relocation: pushed pending commits, moved liquid-labs/sdlcpilot-cli to sdlcforge/core-cli, repaired worktree linkage metadata, refreshed the project index, and updated session target-project state. All validation checks pass.
   No commit or merge SHA recorded.

## Key decisions

_No `## Why this shape` section is recorded in `plan/overview.md`, so this plan's cross-task rationale was never written down. Per-task outcomes are under "What shipped" above._

## Follow-up items

- **`UGij`** — **bun install alone (even with --force) did not** — bun install alone (even with --force) did not update bun.lock's root-package name field while node_modules was already populated in the worktree — only removing bun.lock and reinstalling from scratch worked. Worth noting in case this is a broader bun behavior.

- **`NbtV`** — **Lockfile regeneration re-resolved several @li** — Lockfile regeneration re-resolved several @liquid-labs/* and transitive dev dependencies to newer semver-compatible versions (e.g. comply-defaults alpha.8->alpha.9, plugable-defaults alpha.4->alpha.7) as a side effect of full reinstall rather than a prior-lockfile baseline. Within task's bun.lock scope but flagging as a side effect beyond the literal name-field change.

- **`2J1p`** — **make test broken: bun.lock-pinned @liquid-lab** — make test broken: bun.lock-pinned @liquid-labs/plugable-defaults@1.0.0-alpha.7 no longer exports PLUGABLE_REGISTRY, which src/core-cli.mjs imports and calls. Manager investigation (post-report) confirmed this is not a stale-lockfile artifact: plugable-defaults's own current source tree (post pluggable-defaults-rename plan, alpha.7) contains no PLUGABLE_REGISTRY function anywhere - it was dropped entirely. The main sdlcpilot-cli checkout's node_modules had a stale historical build that happened to still have it, masking the break until task 002's fresh bun.lock regeneration installed the real, current alpha.7. This is a genuine cross-project API removal/incompatibility, unrelated to the rename itself, requiring a product decision (restore an equivalent in plugable-defaults, or update core-cli to a different config mechanism, or remove the registry-default feature) - out of scope for this rename plan-group to guess at.

- **`dd6K`** — **make lint fails on 2 pre-existing errors in s** — make lint fails on 2 pre-existing errors in spike/bun-compat/harness-raw-childprocess.mjs (quote style) and spike/bun-compat/harness.mjs (unused execFileSync import) - trivial, mechanical, out of this task's diff scope, candidate for a quick separate fix.

- **`3Azo`** — **npm publish never attempted (blocked behind t** — npm publish never attempted (blocked behind the above); npm whoami also returns 401 in this environment - credential refresh will be needed once test/lint are unblocked.

- **`ixk8`** — **Task 5 (directory relocation) depends on task** — Task 5 (directory relocation) depends on task 4 completing - plan execution is paused here pending a decision on the PLUGABLE_REGISTRY break.

- **`oI9z`** — **npm publish --access public --tag alpha must** — npm publish --access public --tag alpha must be run manually from /Users/zane/playground/liquid-labs/sdlcpilot-cli/worktrees/plan/sdlcpilot-cli-rename-01-004 - blocked by the Claude Code permission classifier, not attempted as a workaround. Note --tag alpha is newly required for this prerelease version, not in the original task doc.

- **`0CmT`** — **npm whoami still returns 401 Unauthorized in** — npm whoami still returns 401 Unauthorized in this environment - credentials likely need refreshing before publish can succeed even absent the classifier block.

## Final Task State

# TODO

## Purpose and scope

Tracking document for the active plan.

## Tasks

### Phase 01 — Rename and Relocation to SDLCForge

- [x] [001-rename-github-repository.md](./phase-01-rename-relocation/001-rename-github-repository.md) — tier `sonnet-low` · branch `plan/sdlcpilot-cli-rename-01-001` · commit `3706f63` · merge `2b1642c6d25373b8a6ef27479d2425ca688483ed`
- [x] [002-update-package-identity-and-urls.md](./phase-01-rename-relocation/002-update-package-identity-and-urls.md) — tier `sonnet-low` · branch `plan/sdlcpilot-cli-rename-01-002` · commit `8b0c77d` · merge `0998618361d745a9b9a3d42b08a5ce389080b194`
- [x] [003-rename-build-artifacts-and-fix-self-references.md](./phase-01-rename-relocation/003-rename-build-artifacts-and-fix-self-references.md) — tier `sonnet-med` · branch `plan/sdlcpilot-cli-rename-01-003` · commit `16fbd8d` · merge `685a3a79b35627dd3f01fca03a4ff93875146c38`
- [x] [004-bump-version-rebuild-and-publish.md](./phase-01-rename-relocation/004-bump-version-rebuild-and-publish.md) — tier `sonnet-med` · branch `plan/sdlcpilot-cli-rename-01-004` · commit `f8bd2e6` · merge `268483010967bfa651ed15f400272ff1fc4310e4`
- [x] [005-relocate-project-directory.md](./phase-01-rename-relocation/005-relocate-project-directory.md) — tier `sonnet-low` · branch `main` · commit `…` · merge `…`
