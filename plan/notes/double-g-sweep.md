# Double-g reference sweep

## Purpose and scope

Records the independent, repo-wide investigation performed during planning for the `pluggable-defaults-rename` plan-group's slice in `sdlcpilot-cli`, confirming whether any genuine double-g ("pluggable-defaults") content reference, hardcoded double-g GitHub link, or naming mismatch against `@liquid-labs/plugable-defaults`'s exported API exists in this repo that would need to change once [pluggable-defaults](https://github.com/liquid-labs/pluggable-defaults)'s own rename (directory rename, GitHub repo rename, `package.json` fixes, the `src/locations.mjs` regression revert, and version bump/publish — phase 1 of that project's own plan) lands.

## Method

Enumerated every git-tracked file in the repo (`git ls-files`, 27 files) plus untracked/gitignored content outside `node_modules/`, `.git/`, `worktrees/`, `.yalc/`, `dist/`, `test-staging/`, and `qa/` (the latter four are gitignored build/test-scratch outputs rebuilt from `src/`). Ran from the plan worktree root (`/Users/zane/playground/liquid-labs/sdlcpilot-cli/worktrees/plan/pluggable-defaults-rename`), which mirrors the working tree's tracked/untracked content at plan-creation time:

```bash
git grep -ni 'pluggable' -- .
git grep -ni 'liquid-labs/pluggable' -- .
grep -rniI --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=worktrees \
  --exclude-dir=.yalc --exclude-dir=dist --exclude-dir=test-staging --exclude-dir=qa \
  'pluggable' .
grep -rniI --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=worktrees \
  --exclude-dir=.yalc --exclude-dir=dist -E 'PLUG(G)?ABLE_[A-Z_]*' .
grep -rniI --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=worktrees \
  --exclude-dir=.yalc --exclude-dir=dist 'plugable-defaults' .
```

Also directly inspected the resolved npm package's compiled output at `<project_root>/node_modules/@liquid-labs/plugable-defaults/dist/plugable-defaults.js` (the project root's `node_modules/`, since this plan worktree itself has no `node_modules/` installed — dependencies were not installed for this planning session) to confirm which names it actually exports, cross-checked against `<project_root>/bun.lock`'s locked resolution, and grepped every `src/**`, `docs/**`, and top-level file in this repo for any import site or content reference to `@liquid-labs/plugable-defaults` or `pluggable-defaults`.

## Findings

**1. No genuine double-g content reference exists anywhere in this repo.** The only "pluggable" hits (both `git grep` and the broader untracked-inclusive grep) are two, both concerning the separate, unrelated `pluggable-express`/`@liquid-labs/plugable-express` framework package (covered by its own already-planned `pluggable-express-rename` plan-group, out of this plan's scope regardless):

- `plan/followups.yaml:30` — the `l9ql` follow-up item ("Stale plugable-express dep: version bug fix"), which the user's request explicitly identifies as unrelated and out of scope. Its free text mixes spellings (`plugable-express` when naming the npm package/dependency, `pluggable-express` when naming the upstream project's own commit/repo) — an artifact of that item's own prose, not a defect in this repo's source, and not touched here per the explicit out-of-scope instruction.
- `plan/plan-summary-modernization-foundation.md:5` — a historical, already-merged sentence from a prior planning session recording `@liquid-labs/pluggable-express` as one of five repos in the Phase 0 "modernization-foundation" plan. Accurate historical record of that prior session's input, not live content to change.

No hardcoded link to `https://github.com/liquid-labs/pluggable-defaults` (or any `liquid-labs/pluggable*` URL) exists anywhere in this repo. No prose spells out "pluggable-defaults" (double-g) when referring to the defaults-provider dependency by name. `docs/server.md` and `docs/common-usage/cli.md` use the generic word "plugins" (server/API plugins, a distinct concept) but never "pluggable"/"plugable" as part of a package name. No CI/build/lint config references a double-g repo name or org path (this repo has no `.github/` CI workflow files).

**2. No naming mismatch exists between `sdlcpilot-cli`'s imports and `@liquid-labs/plugable-defaults`'s exported API.** `src/sdlcpilot-cli.mjs` is the only file anywhere in this repo (git-tracked or untracked, excluding build/test-scratch output) that references `@liquid-labs/plugable-defaults`. It imports two names, both single-g:

```js
import { PLUGABLE_PLAYGROUND, PLUGABLE_REGISTRY } from '@liquid-labs/plugable-defaults'
```

used at `src/sdlcpilot-cli.mjs:5,25,26,32`. `PLUGABLE_CLI_SETTINGS_PATH` is not imported or referenced anywhere in this repo. The resolved, currently-installed npm package at the project root (`node_modules/@liquid-labs/plugable-defaults@1.0.0-alpha.4`, matching `package.json`'s `^1.0.0-alpha.4` spec and `bun.lock`'s locked resolution `sha512-DALBwlltBTyRcGvFCu2y3WK3kb9Lk0HJwqDFKo9SwStAqjnkt8aYp0sKO6BmFoxVqzHof9JcV5xJJITs5/IEMw==` against the real `registry.npmjs.org` tarball) exports all three names in the correct, single-g spelling:

```js
// node_modules/@liquid-labs/plugable-defaults/dist/plugable-defaults.js
exports.PLUGABLE_CLI_SETTINGS_PATH = function () { return process.env.PLUGABLE_CLI_SETTINGS_PATH || ... }
exports.PLUGABLE_PLAYGROUND = function () { return process.env.PLUGABLE_PLAYGROUND || process.env.LIQ_PLAYGROUND || ... }
exports.PLUGABLE_REGISTRY = function () { return process.env.PLUGABLE_REGISTRY || 'https://raw.githubusercontent.com/liquid-labs/plugable-registry/main/registry.yaml' }
```

The installed package's own `package.json` `repository.url` field already reads `git+ssh://git@github.com/liquid-labs/plugable-defaults.git` (single-g) — this published `1.0.0-alpha.4` tarball predates the double-g regression described in `pluggable-defaults`'s own phase 1 plan (which affects that project's *current source*, not the already-published tarball `sdlcpilot-cli` depends on), so there is no live or latent bug here. This confirms directly (not by assumption) that `sdlcpilot-cli`'s imports match the installed package's actual export names. The gitignored `test-staging/sdlcpilot-cli.js` compiled-test artifact (rebuilt from `src/`) independently confirms the same: it requires `@liquid-labs/plugable-defaults` and destructures `PLUGABLE_PLAYGROUND`/`PLUGABLE_REGISTRY`, both single-g.

**3. No `PLUGABLE_*`/`PLUGGABLE_*` environment variable or on-disk config-directory path is read, written, or referenced by `sdlcpilot-cli` itself.** `sdlcpilot-cli` never reads `process.env.PLUGABLE_PLAYGROUND`/`PLUGABLE_REGISTRY`/`PLUGABLE_CLI_SETTINGS_PATH` directly, nor any double-g variant — it only calls the imported accessor functions (`PLUGABLE_PLAYGROUND()`, `PLUGABLE_REGISTRY()`), which read those env vars internally inside `@liquid-labs/plugable-defaults`. No config-directory path segment (e.g. a `.plugable`/`.pluggable`-style dotfile or directory name) is hardcoded anywhere in this repo's own source, `README.md`, `Makefile`, or `package.json`. No `PLUGGABLE_*` (double-g) identifier or env var appears anywhere in the repo.

**4. `plan/manifest.yaml` and `plan/TODO.yaml` bookkeeping in this plan worktree are the expected, empty pre-registration state** (`plan/manifest.yaml` here reads `plans: []`, since that file is written only at the project root directly, never on a plan branch, per the Project Plan Document Standards' write rule) — not a defect. The project root's own `plan/manifest.yaml` (outside this worktree) already carries a `pluggable-defaults-rename` entry with a `dependencies` note referencing `/Users/zane/playground/liquid-labs/pluggable-defaults` and this plan-group's own slug; both are expected plan-group bookkeeping identifiers, not something to "fix."

## Conclusion

This project's slice of the `pluggable-defaults-rename` plan-group requires no source, doc, or config changes. `sdlcpilot-cli`'s `package.json` dependency spec, its two `PLUGABLE_PLAYGROUND`/`PLUGABLE_REGISTRY` import sites (the only import site anywhere in the repo), and the resolved npm package's actual exports are all already consistently single-g. Registered as a single lightweight verification task (phase 3, `plan/phase-03-verification-sweep/001-verify-no-double-g-references.md`) that re-runs this sweep as its Validation step, to be executed after `pluggable-defaults`'s own phase 1 tasks (directory rename, GitHub repo rename, `package.json` fixes, and the `src/locations.mjs` regression revert) have landed, so the verification is definitive against the dependency's fully-corrected post-rename state rather than a point-in-time snapshot.

A future follow-up — not registered as a task here, since it is not yet actionable — could bump this repo's `@liquid-labs/plugable-defaults` dependency spec beyond `^1.0.0-alpha.4` once `pluggable-defaults`'s own plan publishes a newer corrected-name version; the version number is not yet finalized and the publish has not yet happened, so no task is created for it now.
