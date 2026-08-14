# Rename GitHub Repository

## Purpose and scope

Move the GitHub repository's final segment from `core-cli` to `sdlc-cli`, completing the identity move to `sdlcforge/sdlc-cli`. This task is deliberately isolated — it touches no files in this repository — because the `gh repo rename` operation has previously required manual/out-of-channel execution by the user in this same environment (see [Assumptions](#assumptions)).

**Important — verify before acting.** The dispatch that produced this plan assumed the starting state was `liquid-labs/sdlcpilot-cli`, not yet transferred to `sdlcforge`. Planning-time verification found this is stale: the repo has **already been transferred** to the `sdlcforge` org, but was renamed in the same move to `core-cli`, not `sdlc-cli`. `sdlcforge/sdlc-cli` does not yet exist. Do not assume either this task document's framing or the original dispatch's framing is still current — re-verify live state first per Requirement 1 below, since more time may have passed since this plan was authored.

## Requirements

1. **Re-verify current live state** before doing anything else:
   ```bash
   gh api repos/sdlcforge/core-cli --jq '{full_name, name}'
   gh api repos/sdlcforge/sdlc-cli --jq '{full_name, name}' 2>&1  # expect 404
   ```
   - If `sdlcforge/sdlc-cli` already exists (rename already done, e.g. by the user out-of-channel since planning), skip the rename command in Requirement 2 and proceed straight to Requirement 3's verification.
   - If `sdlcforge/core-cli` no longer exists and no `sdlcforge/sdlc-cli` exists either, halt and report — the repo has moved somewhere unexpected and this task should not guess.
2. **Rename the repository** (same-org rename — the org transfer to `sdlcforge` is already done, confirmed at planning time):
   ```bash
   gh repo rename sdlc-cli --repo sdlcforge/core-cli --yes
   ```
   If this command is blocked by a Bash-permission classifier (the sibling `pluggable-defaults-rename` plan hit exactly this on its own `gh repo rename` step in this same environment), do not attempt a workaround — report the block clearly in your structured report and flag it for the manager/user to run manually. Do not treat this as a task failure; note it as a deferred manual step, matching how the sibling plan's equivalent task reported it.
3. **Verify the final state** resolves correctly:
   ```bash
   gh api repos/sdlcforge/sdlc-cli --jq '{full_name, html_url}'
   ```
   Confirm `full_name` is `sdlcforge/sdlc-cli`.
4. **Do not** modify any files in this repository as part of this task — `package.json`'s `repository`/`bugs`/`homepage` fields, the local git `origin` remote, and `bun.lock` are all owned by task `002-update-package-identity-and-urls.md`, dispatched separately and in parallel. Keep this task's diff empty (or, if the manual `gh` step could not be run and had to be deferred, still empty — this task never touches tracked files).

## Validation

- `gh api repos/sdlcforge/sdlc-cli --jq '.full_name'` returns `sdlcforge/sdlc-cli`, whether the rename ran directly in this task or was completed manually out-of-channel and merely confirmed here.
- `git status` in this task's worktree shows no changes — this task is GitHub-state-only.
- Your structured report states plainly whether the `gh repo rename` command ran directly or was blocked/deferred to manual execution, and if deferred, that the manager/user still needs to run it before `sdlcforge/sdlc-cli` will resolve.

## Assumptions

- **The rename target is `sdlc-cli`, not `core-cli`.** This is an inference from strong same-day corroborating evidence (this plan's own dispatch text, the `sdlcforge-modernization` wave manifest, and `sdlcforge/core-server`'s own docs all say `sdlc-cli`), not a confirmed decision — the live `core-cli` name has no recorded rationale. `plan/overview.md`'s "Flagged for manager" section carries this forward for explicit confirmation. If you discover evidence during this task that `core-cli` was actually the deliberately chosen final name, halt and report rather than renaming over it.
- A prior sibling plan (`pluggable-defaults-rename`, same wave, same environment) had its own `gh repo rename` step blocked by a Bash-permission classifier and had to be run manually by the user. Expect the same here; this is normal, not a task failure.
- The user is authenticated (`gh auth status` confirmed `zanerock`, `repo` scope, admin rights) and owns the `sdlcforge` org, so no cross-org approval is needed even if the command does succeed directly.

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — the full verification trail behind this task's framing.
- `plan/overview.md`'s "Flagged for manager" section — the `core-cli`-vs-`sdlc-cli` discrepancy this task's Assumptions section carries forward.
