# Update Package Identity and Repository URLs

## Purpose and scope

Update `package.json`'s identity and URL fields, the local `origin` git remote, and regenerate `bun.lock` to reflect the new `@sdlcforge/core-cli` identity and the `sdlcforge/core-cli` GitHub location. No standard Flow skill applies beyond ordinary file editing plus a dependency-lockfile regeneration; follow this task document directly.

This task is independent of and parallel-eligible with `003-rename-build-artifacts-and-fix-self-references.md` (disjoint files: this task owns `package.json`/`bun.lock`/the git remote; task 003 owns `Makefile`/`src/`/`README.md`/`docs/`) and with `001-rename-github-repository.md` (which touches no repository files at all).

## Requirements

1. **`package.json` field updates:**
   - `name`: `"sdlcpilot-cli"` → `"@sdlcforge/core-cli"`.
   - `main`: `"dist/sdlcpilot-cli.js"` → `"dist/core-cli.js"`. This must name the **same** built-artifact filename that task 003's `Makefile` changes will produce (`dist/core-cli.js`) — coordinate on this exact filename since the two tasks run in parallel and edit different files.
   - `bin`: keep the command key `sdlc` unchanged (that's what users type) but repoint its target: `{ "sdlc": "dist/sdlcpilot-cli.js" }` → `{ "sdlc": "dist/core-cli.js" }`.
   - `repository.url`: `"git+ssh://git@github.com/liquid-labs/sdlcpilot-cli.git"` → `"git+ssh://git@github.com/sdlcforge/core-cli.git"`.
   - `bugs.url`: `"https://github.com/liquid-labs/sdlcpilot-cli/issues"` → `"https://github.com/sdlcforge/core-cli/issues"`.
   - `homepage`: `"https://github.com/liquid-labs/sdlcpilot-cli#readme"` → `"https://github.com/sdlcforge/core-cli#readme"`.
   - `_comply.orgKey`: `"@liquid-labs"` → `"@sdlcforge"`.
   - Leave `dependencies`/`devDependencies` (still `@liquid-labs/comply-defaults`, `@liquid-labs/plugable-defaults`, `@liquid-labs/plugable-express-cli`, `@liquid-labs/catalyst-scripts-node-project`) and `author` untouched — none of those packages are renaming as part of this plan-group, and `author` is a personal identity, not an org identity.
2. **Local git remote:** update `origin` to the new location:
   ```bash
   git remote set-url origin git@github.com:sdlcforge/core-cli.git
   ```
   Leave the `workspace` remote (`git@github.com:zanerock/sdlcpilot-cli.git`, the user's personal fork) untouched — it is out of scope for this plan.
3. **Regenerate `bun.lock`** via `bun install` (or the project's equivalent) after the `package.json` name change, so the lockfile's own root-package `name` field (currently `"sdlcpilot-cli"` at line 6) matches. `node_modules` is not currently installed in this task's worktree — a plain install run is expected to also populate it as a side effect; that is fine.
4. Do not touch `Makefile`, anything under `src/`, `README.md`, or `docs/` — those are task 003's scope.

## Validation

- `git diff` shows exactly `package.json`, `bun.lock`, and no other tracked files changed.
- `grep -n '"name"' package.json` shows `"@sdlcforge/core-cli"`.
- `grep -n 'sdlcpilot\|liquid-labs' package.json` returns no hits (author's personal email domain aside — `zane@liquid-labs.com` in the `author` field is intentionally unchanged, per Requirement 1).
- `bun.lock`'s root package entry name matches `@sdlcforge/core-cli` (or the lockfile was regenerated cleanly with no leftover `sdlcpilot-cli` string).
- `git remote -v` shows `origin` pointing at `git@github.com:sdlcforge/core-cli.git` and `workspace` unchanged.
- This task does not run `make build`/`make test` itself — the renamed `main`/`bin` paths will not resolve to a real file until task 003's `Makefile`/`src` rename lands too; full build/test verification is task 004's job, after both 002 and 003 have merged.

## Assumptions

- Task 003 will independently rename the built-artifact filename to `dist/core-cli.js` (matching this task's `main`/`bin` edits) via `Makefile`'s `BUILD_KEY`/`CATALYST_JS_CLI` variables — the two tasks are coordinated on this exact filename despite running in parallel. If you land first, the `main`/`bin` paths will point at a not-yet-existing file until task 003 lands too; this is expected and not a failure of this task.
- `dist/` is gitignored (confirmed via `.gitignore`) — no stale, tracked, old-named build artifact needs deleting from git.

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — confirms the live npm package is unscoped `sdlcpilot-cli`, not `@liquid-labs/sdlcpilot-cli`. The registry-availability check the notes file recorded was against `sdlc-cli`/`@sdlcforge/sdlc-cli` (the plan's original target name); `core-cli`/`@sdlcforge/core-cli` were not separately checked during planning, since the live GitHub repo already confirms `core-cli` is a name the user's `sdlcforge` org already controls and uses — no separate npm-availability concern is expected, but this task's own `npm install`/publish-adjacent steps will surface any actual collision.
