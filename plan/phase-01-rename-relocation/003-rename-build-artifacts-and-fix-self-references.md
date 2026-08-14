# Rename Build Artifacts and Fix Self-References

## Purpose and scope

Rename the built-artifact filename (and the `Makefile`/`src/` naming that produces it) from `sdlcpilot-cli` to `sdlc-cli`, and fix every in-repo self-reference to the old package name and its `SDLCPilot` branding in `README.md`, `docs/**/*.md`, and the `spike/` scratch scripts. No standard Flow skill applies beyond ordinary file editing; follow this task document directly.

This task is independent of and parallel-eligible with `002-update-package-identity-and-urls.md` (disjoint files: this task owns `Makefile`/`src/`/`README.md`/`docs/`/`spike/`; task 002 owns `package.json`/`bun.lock`/the git remote) and with `001-rename-github-repository.md` (which touches no repository files at all).

## Requirements

### 1. Build-artifact naming cascade

- `Makefile` line 1: `BUILD_KEY:=sdlcpilot-cli` → `BUILD_KEY:=sdlc-cli`.
- `Makefile` line 5: `CATALYST_JS_CLI=$(DIST)/sdlcpilot-cli.js` → `CATALYST_JS_CLI=$(DIST)/sdlc-cli.js`. This is a **hardcoded** filename, not derived from `BUILD_KEY` — must be edited explicitly; changing `BUILD_KEY` alone does not change it. This must match exactly the `dist/sdlc-cli.js` filename task 002's `package.json` `main`/`bin` edits use.
- Rename `src/sdlcpilot-cli.mjs` → `src/sdlc-cli.mjs` (`git mv`).
- In the renamed file, rename the exported function `startSDLCPilotCLI` → `startSdlcCLI` (avoid naming it `startCLI` — that name is already taken by the file's own `import { startCLI } from '@liquid-labs/plugable-express-cli'`; a same-name local binding would shadow/conflict).
- `src/index.js`: update the import path (`'./sdlcpilot-cli'` → `'./sdlc-cli'`) and the imported/called symbol name (`startSDLCPilotCLI` → `startSdlcCLI`).
- `src/test/catalyst-cli.test.js`: update the import path (`'../sdlcpilot-cli'` → `'../sdlc-cli'`) and every reference to `startSDLCPilotCLI` (the import, the `describe('startSDLCPilotCLI', ...)` label, and the call inside the `test(...)` body) to `startSdlcCLI`.
- These are purely internal identifiers (this package publishes only the built CLI binary via `files: ["dist/*"]`; nothing external imports this module by name), so this rename carries no external-compatibility risk.

### 2. `README.md`

- Line 12: `2. Install 'sdlcpilot-cli' and '@sdlcforge/core-server':` → `2. Install '@sdlcforge/sdlc-cli' and '@sdlcforge/core-server':`.
- Line 13: `npm i -g sdlcpilot-cli @sdlcforge/core-server` → `npm i -g @sdlcforge/sdlc-cli @sdlcforge/core-server`.
- Line 5: `Command line interface for SDLCPilot, a Software Development Life Cycle management tool.` — reword to drop the `SDLCPilot` brand noun, consistent with this same file's own `#` title (already reads `# sdlcforge cli`, not `# SDLCPilot ...` — a partial manual edit from before this plan). Suggested wording: `Command line interface for SDLC management, part of the SDLCForge platform.` — exact phrasing is your discretion, but the resulting text must not contain the literal string `SDLCPilot`.
- Line 24 (`sdlc server plugins bundles add -- bundles=sdlcpilot-github-node`): **do not change.** `sdlcpilot-github-node` names a plugin bundle registered in a different component's registry, not this package's own identity — out of scope for this rename.
- Leave the rest of the file (usage walkthrough, install troubleshooting steps that don't name the package) untouched.

### 3. `docs/*.md` — top-level

- `docs/index.md` line 1: `# <span id="sdlcpilot_documentation">SDLCPilot Documentation</span>` → `# <span id="sdlc_cli_documentation">SDLC CLI Documentation</span>`. (Confirmed via repo-wide grep that no other file links to the `#sdlcpilot_documentation` anchor, so the id rename is safe.)
- `docs/concepts.md` line 1: `# SDLCPilot Concepts` → `# SDLC CLI Concepts`. Line 4: `... SDLCPilot implements automated change control ...` → reword to drop the brand noun (e.g., `... the CLI implements automated change control ...`).
- `docs/common-usage/projects.md` line 1: `# SDLCPilot Common Usage : Projects` → `# SDLC CLI Common Usage : Projects`. Line 3: `SDLCPilot can be used to quickly set up ...` → reword (e.g., `The CLI can be used to quickly set up ...`).
- The following files each carry the identical two-occurrence banner pattern `[<- SDLCPilot Documentation](./index.md)` (once near the top, once at the bottom) — change both occurrences in each file to `[<- SDLC CLI Documentation](./index.md)`, matching the retitled `docs/index.md`:
  - `docs/heartbeat.md`
  - `docs/help.md`
  - `docs/server.md`
  - `docs/credentials.md`
  - `docs/work.md`
  - `docs/projects.md`
  - `docs/orgs.md`
- `docs/common-usage/cli.md` and `docs/common-usage/work.md` — confirmed via grep to carry **no** `sdlcpilot`/`SDLCPilot` self-references; no change needed.
- `docs/projects.md` line 122's illustrative example (`'@liquid-labs/some-project' would be saved in '~/liquid-labs/some-project'`) is a generic usage example for the `retainLeadingAt` setting, not a self-reference to this project's own org — it would work identically with any org name. Optional, low-priority: you may refresh it to `@sdlcforge/some-project` / `~/sdlcforge/some-project` for freshness, but this is not required for task completion and must not block validation.

### 4. `spike/bun-compat/`

- `spike/bun-compat/harness.mjs` line 51 and `spike/bun-compat/harness-raw-childprocess.mjs` line 20: the temp-directory prefix strings `'sdlcpilot-bun-spike-'` / `'sdlcpilot-bun-spike-raw-'` — rename to `'sdlc-cli-bun-spike-'` / `'sdlc-cli-bun-spike-raw-'` for consistency with the rest of the sweep. Purely cosmetic (a local scratch-directory name prefix with no external visibility), low risk.
- Every other `@liquid-labs/...` reference in `spike/bun-compat/README.md`, `harness.mjs`, and `harness-raw-childprocess.mjs` (`@liquid-labs/liq-projects`, `@liquid-labs/shell-toolkit`, `@liquid-labs/github-toolkit`) names **other** packages that are not part of this rename — leave every one of those untouched.

## Validation

- `git status` shows changes limited to: `Makefile`, `src/sdlc-cli.mjs` (renamed from `src/sdlcpilot-cli.mjs`), `src/index.js`, `src/test/catalyst-cli.test.js`, `README.md`, the ten `docs/*.md` files listed above, and the two `spike/bun-compat/*.mjs` files.
- `grep -rn --include='*.js' --include='*.mjs' --include='*.md' -i 'sdlcpilot' . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=test-staging --exclude-dir=.git --exclude-dir=worktrees` returns **no** hits outside of: (a) this plan's own `plan/` documents (which legitimately discuss the old name while describing the rename), and (b) the deliberately-untouched `sdlcpilot-github-node` bundle-name string in `README.md`.
- `grep -rn 'SDLCPilot' README.md docs/ src/` returns no hits (all retitled/reworded per Requirements 2–3).
- `node -e "require('./src/index.js')"` is not expected to work standalone (this is an `.mjs`/ESM-flavored source tree built via `make build`) — instead, confirm the rename is internally consistent by grepping: `grep -rn 'sdlc-cli\|startSdlcCLI' src/` shows the new file, import, and symbol names used consistently across `src/index.js` and `src/test/catalyst-cli.test.js`.
- Do not run `make build`/`make test` in this task — `package.json`'s `main`/`bin` fields (task 002's scope) must also have landed for a real build to succeed; that combined verification is task 004's job.

## Checkpoint hints

- After the `Makefile`/`src/` build-artifact rename cascade (Requirement 1).
- After the `README.md` edits (Requirement 2).
- After the `docs/*.md` sweep (Requirement 3).
- After the `spike/bun-compat/` edits (Requirement 4).

## Assumptions

- "SDLCPilot" as a prose/title brand noun is being retired in favor of generic "SDLC CLI" framing, not replaced with a new "SDLCForge Pilot"-style brand — inferred from `README.md`'s own already-partially-updated `#` title (`# sdlcforge cli`) and the wave's stated intent to match "the sdlcforge product-naming convention core-server already uses." This is a judgment call, flagged in `plan/overview.md`'s "Flagged for manager" section — if you find stronger contrary evidence while working this task, note it in your report rather than silently picking different wording.
- `dist/` is gitignored — no stale, git-tracked, old-named build output needs deleting.

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — notes the partial manual `README.md` title edit that motivates the branding judgment call above.
