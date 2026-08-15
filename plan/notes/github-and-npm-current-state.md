# GitHub and npm current-state investigation

## Purpose and scope

Findings from this planning session's own verification of the actual current GitHub and npm state, ahead of drafting the rename tasks. Recorded because the state found materially differs from the dispatch's assumed starting point.

## Addendum — resolution (2026-08-14, amendment session)

**The `core-cli`-vs-`sdlc-cli` discrepancy discussed throughout this document is now resolved.** The user was asked directly and confirmed: `core-cli` is the correct, intentional final name, not `sdlc-cli`. The live `sdlcforge/core-cli` state described below is the confirmed target identity, not a stale interim state needing correction.

The investigation below is preserved **unedited, as a historical record** of the discrepancy as it stood at planning time — including its framing of `sdlc-cli` as "the plan's target" and `core-cli` as "the interim/unexplained state." Read every below reference to `sdlc-cli` as the plan's then-assumed (and now superseded) target, and every reference to `core-cli` as what has since been confirmed correct. `plan/overview.md`'s "Current status" and "Flagged for manager" sections, and every phase-01 task document, have been amended to target `core-cli` throughout; this notes file has not been rewritten to match, so its own prose still reads as it did at the moment of discovery.

## npm — confirmed as assumed

- `npm view sdlcpilot-cli` resolves: published **unscoped**, `sdlcpilot-cli@1.0.0-alpha.10`, homepage `https://github.com/liquid-labs/sdlcpilot-cli#readme`. `npm view @liquid-labs/sdlcpilot-cli` 404s. This confirms the dispatch's framing: the package was never actually published under `@liquid-labs/sdlcpilot-cli` despite `package.json`'s `_comply.orgKey: "@liquid-labs"` implying that scope.
- `sdlc-cli` and `@sdlcforge/sdlc-cli` are both unclaimed on the npm registry (`npm view` 404s for each) — no naming collision blocks the target identity.
- `npm org ls sdlcforge` and `npm org ls liquid-labs` both list `zanerock` as `owner` — confirms the dispatch's claim that the user owns both scopes; no external approval needed for either an `@sdlcforge` publish or continuing to touch `@liquid-labs`.
- `npm whoami` → `zanerock` (an npm session is active in this environment), but per the sibling `pluggable-defaults-rename` plan's actual execution, a locally-active `npm whoami` session did **not** prevent `npm publish` from failing there on an expired/invalid registry credential — so task 004 should still expect the publish step itself may need to be handed to the user, per the dispatch's warning.

## GitHub — differs materially from the dispatch's assumed starting point

The dispatch states: "GitHub repo today: `liquid-labs/sdlcpilot-cli`. Target: `sdlcforge/sdlc-cli`... determine the right `gh` sequence (transfer + rename)."

Actual verified state (`gh api repos/liquid-labs/sdlcpilot-cli`, `gh api repos/sdlcforge/core-cli`, `gh repo list sdlcforge`, `git ls-remote` against both URLs):

- The repository has **already been transferred** from the `liquid-labs` org to the `sdlcforge` org. `gh api repos/liquid-labs/sdlcpilot-cli` redirects (GitHub's former-location redirect) to the same repo object as `gh api repos/sdlcforge/core-cli` (same `id: 697027637`). `git ls-remote git@github.com:liquid-labs/sdlcpilot-cli.git HEAD` and `git ls-remote git@github.com:sdlcforge/core-cli.git HEAD` both resolve to the identical commit (`f96ecc6f...`), which also matches this checkout's own `origin/main` after `git fetch`.
- However, the repo was **also renamed** in the same move — not to the plan's target `sdlc-cli`, but to **`core-cli`**. The live repo is `sdlcforge/core-cli`, confirmed to be the identical codebase (`gh api repos/sdlcforge/core-cli/contents/package.json` shows `"name": "sdlcpilot-cli"`, byte-identical to this checkout's own `package.json` at the same commit).
- `sdlcforge/sdlc-cli` does **not** exist (`gh api repos/sdlcforge/sdlc-cli` → 404). So the remaining GitHub-side work is a same-org **rename only** (`core-cli` → `sdlc-cli`), not the transfer-plus-rename the dispatch anticipated — a materially smaller/simpler operation.
- No corroborating record (commit message, `plan/followups.yaml`, wave manifest note) explains *why* the repo was renamed to `core-cli` rather than `sdlc-cli`, or when — `pushed_at` on the repo object is `2026-08-10T17:57:41Z`, four days before this planning session, and coincides closely with `sdlcforge/core-server`'s own `pushed_at` (`2026-08-10T18:00:20Z`), suggesting an org-wide, possibly-unrelated bulk transfer session rather than a deliberate decision to name this specific repo `core-cli`.
- Countervailing evidence strongly favors `sdlc-cli` as the still-correct target, all dated the same day as this dispatch or later: (1) the user's own `user_request` text for this plan explicitly names `sdlc-cli`/`sdlcforge/sdlc-cli` throughout; (2) the wave manifest at `sdlcforge/core-server`'s `plan/waves/sdlcforge-modernization/manifest.yaml`, itself updated `2026-08-14` (today), still describes this plan-group as "Rename sdlcpilot-cli to sdlcforge/sdlc-cli" with no mention of `core-cli`; (3) `core-server`'s own `README.md` and `AGENTS.md` (unrelated project, forward-looking reference) both say "migrating to `@sdlcforge/sdlc-cli`," not `core-cli`.
- Given the strength and recency of that corroborating evidence versus the unexplained, undocumented `core-cli` state, task 001 proceeds on `sdlc-cli` as the correct target and treats the current `core-cli` name as a stale/incomplete intermediate state to finish correcting — but this is flagged prominently in the structured report for explicit confirmation, since it is a real, unresolved discrepancy this planning session cannot fully resolve on its own authority.
- This finding **simplifies** task 001's actual `gh` operation: only `gh repo rename sdlc-cli --repo sdlcforge/core-cli` is needed (an in-org rename), not a `gh repo transfer` step — the org move is already done.
- This checkout's local `origin` remote still points at the old `git@github.com:liquid-labs/sdlcpilot-cli.git` URL (works today only because of GitHub's redirect); it needs updating regardless of the `core-cli` question, since even the current live location is `sdlcforge/*`, not `liquid-labs/*`.
- A second remote, `workspace` → `git@github.com:zanerock/sdlcpilot-cli.git`, is the user's personal fork/workspace remote (unrelated to the `liquid-labs`/`sdlcforge` org question). Left untouched — out of scope; noted here only so a future reader doesn't mistake its continued `sdlcpilot-cli` naming for a missed rename step.

## README.md — partial manual progress already visible

`README.md`'s `#` title already reads `# sdlcforge cli` (generic, de-branded), not `# SDLCPilot Documentation`-style branding — inconsistent with the rest of the README (install instructions still say `sdlcpilot-cli`) and with every `docs/*.md` file (all still titled/bannered `SDLCPilot ...`). This is further evidence of an in-progress, partially-done manual migration that this plan's task 003 completes and makes consistent.
