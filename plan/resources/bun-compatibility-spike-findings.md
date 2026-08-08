# Bun Compatibility Spike — Findings

Spike for `plan/phase-01-cli-foundation/002-bun-compatibility-spike.md`. Time-boxed
(~1 day budget). Harness lives in the task worktree at `spike/bun-compat/` (see
that directory's `README.md`); this report is the deliverable.

## Recommendation: conditional GO, with a required mitigation before packaging

`bun build --compile` **is viable** as the packaging strategy for the eventual
single-binary CLI — Bun's own `child_process` primitives (`execSync`, `exec`,
`execFileSync`) work correctly inside a compiled standalone binary: spawning real
external binaries (`git`, `hub`, `gh`), capturing stdout/stderr, exit-code handling,
and PATH resolution for external tools all behaved identically to `node`.

**However, the codebase's actual current dependency does not work as-is.**
`shelljs` — which `@liquid-labs/liq-projects`' GitHub-integration code depends on
throughout (both directly, and via `@liquid-labs/shell-toolkit`'s `tryExec`/
`tryExecAsync`) — **fails to even load** inside a `bun build --compile` binary, or
inside any bundled (`bun build`, non-compile) Bun output. It works fine only when
run *unbundled* via `bun run <source>.mjs` against a real on-disk `node_modules`.

This is a **blocker for shipping the current shell-out code as-is** in a compiled
binary, but it is a narrow, well-understood, and fixable blocker — not a signal to
abandon `bun build --compile` and fall back to esbuild + Node SEA (synthesis §4).
See [Recommendation detail](#recommendation-detail-and-path-forward) below.

## What was tested

Per the task's requirements, a throwaway harness (`spike/bun-compat/harness.mjs`)
was built to exercise the real `projects create` shell-out pattern end-to-end,
verified against `liq-projects/src/handlers/projects/_lib/create-lib.mjs` and
`@liquid-labs/shell-toolkit`'s `try-exec.mjs`/`try-exec-async.mjs` (both wrap
`shelljs`'s `shell.exec`):

1. `git init` (via `shell.exec('cd "<dir>" && git init --quiet . && ...')`, mirroring
   `create-lib.mjs`'s staging-directory init step).
2. A mock of `hub create` / `gh repo create`: a local bare git repo stood in for the
   GitHub remote (the task's own allowance — "acceptable to mock ... against a
   scratch/test repo, or a local git remote" — was used to avoid real network/auth
   side effects and leftover GitHub artifacts), plus **spawning the real installed
   `hub` and `gh` binaries** (`hub --version`, `gh --version`) to validate PATH
   resolution and stdout capture for those exact external tools without touching
   the network.
3. `git push --set-upstream origin main` against the mock remote, including the
   production code's retry-on-failure loop shape.
4. Label/milestone setup: investigation of `@liquid-labs/github-toolkit`'s
   `setupGitHubLabels`/`setupGitHubMilestones` (referenced from the liq-projects
   research note) found these are **Octokit/HTTP-based (`fetch`), not
   `child_process`-based** — so they carry none of the `child_process` compatibility
   risk this spike targets. The harness exercises a real `fetch` call to
   `https://api.github.com/rate_limit` as a stand-in, and it passed, but this is a
   secondary/informational check, not part of the core risk surface.

Also covered, per the task's explicit list of quirks to watch for:

- **stdio handling**: `shell.exec`'s `silent: true` stdout/stderr capture, and raw
  `execSync`'s `stdio`/`encoding` handling.
- **PATH resolution**: spawning `git`/`hub`/`gh` by bare name (no absolute path),
  relying on the compiled binary's inherited `PATH`.
- **environment variable passing**: see [Finding 3](#finding-3-bun-execsyncexec-does-not-auto-inherit-post-startup-processenv-mutations-secondary-quirk-not-currently-hit-by-shelljs) below — a real, separate quirk was found here.
- **exit-code handling**: a deliberately failing command (`git
  this-is-not-a-real-git-subcommand`) was run to confirm non-zero exit codes and
  stderr are captured correctly.
- **signal handling**: **not tested** — out of scope for the time-box once the
  blocking finding below emerged; flagged as a follow-up if further Bun-compat
  validation is pursued (e.g. before the packaging phase actually starts).

Both the harness source (`bun run harness.mjs`, unbundled) and the **compiled
binary** (`bun build --compile --outfile harness-bin harness.mjs`, then running
`./harness-bin` directly) were run, per the task's requirement to validate the
compiled-binary code path specifically. A second harness
(`harness-raw-childprocess.mjs`) repeats the same checks using raw
`node:child_process` directly, with no `shelljs` dependency, as a differential
control.

## Findings

### Finding 1: `shelljs` fails to load inside any bundled Bun output (BLOCKING)

`shelljs`'s entrypoint (`shelljs/shell.js`) eagerly loads all 27 of its command
modules via a dynamic, string-concatenated `require`:

```js
// shelljs/shell.js
require('./commands').forEach(function (command) {
  require('./src/' + command);   // 'cat', 'cd', 'chmod', ..., 'exec', ..., 'which'
});
```

Bun's bundler (used by both plain `bun build` and `bun build --compile`) cannot
statically resolve a computed `require()` specifier like `'./src/' + command`, so
none of these 27 submodules get embedded in the bundle/binary. At runtime, the very
first one attempted (`cat`, first in the array) throws immediately — **before any
application code runs**, since this happens at module-load time from the top-level
`import shell from 'shelljs'` / `require('shelljs')`:

```
error: Cannot find module './src/cat' from '/$bunfs/root/harness-bin'
```

Reproduced identically:
- Compiled standalone binary (`bun build --compile`): fails.
- Plain bundled output run with `bun`(`bun build` without `--compile`, then `bun
  <bundled-output>.js`): fails identically — this is a Bun **bundler** limitation,
  not something specific to standalone-executable compilation.
- `--external shelljs` (excluding it from the compile bundle, relying on runtime
  module resolution instead), run as
  `bun build --compile --external shelljs --outfile harness-external-bin harness.mjs`
  (mirrors the plain `bun build --compile --outfile harness-bin harness.mjs`
  invocation above, with the added flag; the resulting `harness-external-bin`
  binary is the `.gitignore` entry of the same name): **also fails** — `error:
  Cannot find package 'shelljs' from '/$bunfs/root/...'` — a standalone compiled
  binary has no real on-disk location to resolve `require('shelljs')` against
  unless a real `node_modules` is shipped alongside it, which defeats the point of
  a self-contained single binary.
- Only unbundled `bun run harness.mjs` (interpreted directly from source, resolving
  `require()` against the real on-disk `node_modules`) works.

**Practical impact**: as things stand today, none of `create-lib.mjs`,
`rename-lib.mjs`, `publish-lib.mjs`, `do-npm-publish.mjs`, or
`@liquid-labs/shell-toolkit`'s `tryExec`/`tryExecAsync` (all of which import
`shelljs`, directly or transitively) can be part of a `bun build --compile` binary
without first removing the `shelljs` dependency from that code path.

### Finding 2: raw `node:child_process` works correctly in a compiled binary (validates the strategy)

With `shelljs` removed from the equation (`harness-raw-childprocess.mjs`, using
`execSync`/`exec` directly), every check passed identically between source and the
compiled binary:

- `git init`, `git add`/`commit`, `git push --set-upstream` (including spawning
  `git` as an external binary via bare-name PATH resolution) — all correct.
- Spawning the real `hub` and `gh` binaries and capturing their stdout — correct.
- `npm init -y` (mirroring `create-lib.mjs`'s own `git init --quiet . && npm init
  -y > /dev/null` staging-directory setup step) — correct.
- Async `child_process.exec` — correct.
- Non-zero exit code + stderr capture on a deliberately failing command — correct.

This is the key positive signal: Bun's compiled-binary support for `child_process`
subprocess spawning, stdio capture, exit codes, and PATH-based external-binary
resolution is solid. The blocker is specific to `shelljs`'s implementation
strategy, not to Bun's `child_process` compatibility in general.

### Finding 3: Bun `execSync`/`exec` does not auto-inherit post-startup `process.env` mutations (secondary quirk, not currently hit by `shelljs`)

A real, reproducible divergence from Node semantics was found and isolated (verified with a minimal
repro, identical under `bun run` and inside the compiled binary — not
compile-specific):

```js
process.env.MY_VAR = 'value'
execSync('echo "$MY_VAR"')                       // Bun: '' (empty) — Node: 'value'
execSync('echo "$MY_VAR"', { env: process.env }) // Bun: 'value' — matches Node
```

Node's documented default for `child_process.exec`/`execSync` is to inherit the
*live* `process.env` object, so a runtime mutation like `process.env.FOO = 'bar'`
is visible to a child spawned afterward with no explicit `env` option. Bun does not
appear to pick up such mutations unless `env` is passed explicitly.

**This does not currently affect `shelljs`-based code**: `shelljs`'s own
`exec.js` already explicitly sets `env: process.env` on every call (both the sync
and async paths), so it is not vulnerable to this quirk. It is recorded here
because (a) it's a genuine Node-compatibility gap worth knowing about, and (b) any
future code that shells out via raw `child_process` and relies on implicit env
inheritance (a common, easy-to-write pattern) would silently break under Bun. Not
severe enough on its own to change the go/no-go call, but worth a lint/code-review
note if/when the packaging phase actually begins.

## Recommendation detail and path forward

`bun build --compile` remains the right target for the eventual single-binary
packaging phase — the actual `child_process` runtime it provides is sound. The
concrete action item that phase (or a preceding cleanup task) needs to carry is:

**Remove the `shelljs` dependency from the GitHub-integration shell-out path**
(`@liquid-labs/liq-projects`'s `create-lib.mjs`, `rename-lib.mjs`,
`publish-lib.mjs`, `do-npm-publish.mjs`, and `@liquid-labs/shell-toolkit`'s
`try-exec.mjs`/`try-exec-async.mjs`) before compiling that code into a
standalone binary, replacing `shell.exec(cmd)` calls with equivalent
`node:child_process.execSync`/`exec` calls (Finding 2 shows this primitive works
correctly). This is a moderate, mechanical refactor (shelljs's own
`ShellString`-with-`code`/`stdout`/`stderr` return shape can be replicated with a
small wrapper) rather than an architectural rework, and it does not require
touching this task's own scope (`liq-projects` is explicitly read-only reference
material here — see the task doc's requirements).

If that dependency removal is judged too costly when the packaging phase actually
starts, the documented fallback (esbuild + Node SEA, synthesis §4) remains
available — but this spike did not find anything that makes `bun build --compile`
itself the wrong choice; the actual, narrow obstacle is one dependency's
require-loading strategy.

## Harness disposition

The throwaway harness (`spike/bun-compat/harness.mjs`,
`spike/bun-compat/harness-raw-childprocess.mjs`, `spike/bun-compat/README.md`) is
**kept in the task worktree, clearly marked spike-only** (see that directory's
`README.md`) rather than deleted, since it is small, self-contained (nothing under
`src/` imports from it), and reproduces the findings above on demand — useful if
this needs re-validating after a future `shelljs` removal or a Bun version bump.
Compiled binary artifacts (`harness-bin`, `harness-raw-bin`) are gitignored and were
not committed. No permanent dependency was added to `package.json`/`bun.lock` —
`shelljs` was already present in `node_modules` transitively and was imported
directly by the spike script without being declared.

## Cleanup performed

- All scratch directories (git-init'd staging dirs, local bare "remote" repos) were
  created under the OS temp directory and removed by the harness itself
  (`try`/`finally`) after each run; verified empty after the final run.
- No real GitHub repository, remote, label, or milestone was ever created — `hub
  create`/`gh repo create` were not invoked against the network; only `hub
  --version`/`gh --version` (harmless, no side effects) and a local bare git repo
  (mocking the remote) were used, per the task's explicit allowance to mock the
  GitHub network calls.
- No repo other than this one's own task worktree was modified. `liq-projects` was
  read-only reference material throughout.

## Environment

- Bun 1.3.14, macOS arm64 (host: darwin-arm64).
- `git` 2.55.0, `hub` (git version 2.55.0-compatible build), `gh` 2.96.0 — all
  resolved from the host's `PATH` (Homebrew installs at `/opt/homebrew/bin`).
