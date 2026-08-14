# Bump Version, Rebuild, and Publish to npm

## Purpose and scope

Bump the package version, rebuild and test the fully-renamed package, and publish it to npm under the new `@sdlcforge/sdlc-cli` scoped name. Runs after both `002-update-package-identity-and-urls.md` and `003-rename-build-artifacts-and-fix-self-references.md` have landed and merged — this is the first point at which `package.json`'s `main`/`bin` fields and the actual `Makefile`-produced build artifact agree on a filename, so it is also this plan's first real build/test verification point.

Deliberately isolated from the doc/source-reference sweep (task 003) and the identity-field edits (task 002) — this task's own diff should be limited to `package.json`'s `version`/`files` fields plus whatever `bun.lock`/`dist/` changes a rebuild produces. The `npm publish` step specifically is likely to need manual/out-of-channel execution by the user (see [Assumptions](#assumptions)); keep that isolation intact rather than folding this task's scope into anything else.

## Requirements

1. **Confirm prerequisites landed.** Verify `package.json`'s `name` is `@sdlcforge/sdlc-cli` and `main`/`bin.sdlc` both point at `dist/sdlc-cli.js` (task 002), and that `src/sdlc-cli.mjs` exists with `Makefile`'s `BUILD_KEY`/`CATALYST_JS_CLI` renamed to match (task 003). If either is missing, halt and report rather than proceeding against a half-renamed tree.
2. **Scope the published tarball**, mirroring the sibling `pluggable-defaults-rename` plan's equivalent task: confirm `package.json`'s `files` field is `["dist/*"]` (already is — no change expected, but verify) so the publish doesn't accidentally ship `src/`, `docs/`, `spike/`, or `plan/`.
3. **Bump the version.** Current version is `1.0.0-alpha.10`. Since this is the first publish under the new package name/scope (there is no prior `@sdlcforge/sdlc-cli` version to collide with), bump to the next alpha increment, `1.0.0-alpha.11`, to mark this as a fresh release cycle following the identity change rather than re-publishing the exact prior version number under a new name. Use `npm version` or a direct edit — either is fine, but do not bypass `preversion` (`make test && make lint`) if you use `npm version`.
4. **Rebuild and verify:**
   ```bash
   bun install   # picks up task 002's package.json/bun.lock changes if not already installed
   make build    # produces dist/sdlc-cli.js (task 003's Makefile rename)
   make test
   make lint
   ```
   All three must pass clean. Confirm `dist/sdlc-cli.js` and `dist/sdlc-cli.js.map` exist and no stale `dist/sdlcpilot-cli.*` artifacts remain (rebuild from clean if in doubt — `dist/` is gitignored, safe to remove and regenerate).
5. **Publish:**
   ```bash
   npm publish --access public
   ```
   `--access public` is required the first time a **new scoped** package name is published (npm defaults scoped packages to private otherwise), and `@sdlcforge/sdlc-cli` has never been published before. If this fails on an expired/invalid registry credential — the sibling `pluggable-defaults-rename` plan hit exactly this in this same environment despite an active `npm whoami` session — do not attempt to work around it. Report the failure clearly and flag it for the manager/user to run `npm publish --access public` manually once credentials are refreshed. This is not a task failure; commit the version bump/build/test changes regardless, matching the sibling task's own precedent (build/test/lint state was committed even though the publish itself had to be deferred).

## Validation

- `package.json`'s `version` is `1.0.0-alpha.11` (or the alternate value actually chosen, if a different judgment was made — record which in your report).
- `make build && make test && make lint` all pass clean, evidenced in your report (or `qa/unit-test.txt`/`qa/lint.txt` output).
- `dist/sdlc-cli.js` exists; no `dist/sdlcpilot-cli.*` remnants.
- Either: `npm view @sdlcforge/sdlc-cli version` confirms the just-published version on the registry, **or** — if the publish had to be deferred — your report states plainly that `npm publish --access public` still needs to be run manually, and by whom/why (credential failure vs. permission-classifier block vs. other).
- `git diff --stat` for this task is limited to `package.json` (version/files fields, if `files` needed any correction), `bun.lock` (if `bun install` changed anything), and no other tracked files — `dist/` is gitignored and does not appear in the diff.

## Assumptions

- A prior sibling plan (`pluggable-defaults-rename`, same wave, same environment) had its equivalent publish step fail on an expired/invalid npm registry credential and had to be run manually by the user, despite `npm whoami` resolving successfully in this environment at planning time. Expect the same possibility here; it is normal, not a task failure.
- The version-bump target (`1.0.0-alpha.11`) is a judgment call, not a hard requirement from the request — the request only says a "version-bump judgment call" is needed. If you determine a different bump is more appropriate (e.g., staying on `1.0.0-alpha.10` since no functional code changed, only identity), that is an acceptable alternative — state your reasoning in your report.
- Depends on tasks 002 and 003 having merged; does not hard-depend on task 001 (the GitHub repo rename) having completed, but the published `package.json`'s `repository`/`homepage` fields will name `sdlcforge/sdlc-cli` regardless of whether that GitHub location exists yet — acceptable, matching how `core-server`'s own docs already forward-reference this package's target identity before it exists.

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — confirms `@sdlcforge/sdlc-cli` is unclaimed on the npm registry and that the user owns the `sdlcforge` npm org.
- `plan/plan-summary-pluggable-defaults-rename.md` (in the sibling `plugable-defaults` project) — the precedent this task's publish-isolation and credential-failure handling mirrors.
