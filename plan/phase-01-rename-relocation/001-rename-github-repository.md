# Verify GitHub Repository Identity

## Purpose and scope

Confirm the GitHub repository's identity already matches the confirmed target `sdlcforge/core-cli` — no rename operation is needed. This task is deliberately isolated — it touches no files in this repository — and is now **verification-only**.

**Context.** The dispatch that produced this plan assumed the starting state was `liquid-labs/sdlcpilot-cli`, not yet transferred to `sdlcforge`. Planning-time verification found this was stale: the repo had already been transferred to the `sdlcforge` org and renamed to `core-cli`, four days before the planning session, by an unknown actor with no recorded rationale. The plan originally treated this as an unresolved discrepancy — provisionally treating `core-cli` as a stale interim name that still needed correcting to `sdlc-cli` — and flagged it for explicit confirmation before this task could safely run (see [Assumptions](#assumptions)).

**The user has since been asked directly and has confirmed: `core-cli` is the correct, intentional final name**, not `sdlc-cli`. There is therefore **no GitHub rename operation left to perform** — the earlier version of this task, which planned a `gh repo rename sdlc-cli --repo sdlcforge/core-cli` step, is obsolete and has been replaced by this verification-only version. No mutating `gh` command (`gh repo rename`, `gh repo transfer`, or similar) should run as part of this task.

## Requirements

1. **Verify `sdlcforge/core-cli` resolves correctly:**
   ```bash
   gh api repos/sdlcforge/core-cli --jq '{full_name, name, html_url}'
   ```
   Confirm `full_name` is `sdlcforge/core-cli`.
2. **Confirm no stray `sdlcforge/sdlc-cli` exists** — a guard against a leftover from the earlier `sdlc-cli`-targeted plan draft, or any out-of-channel action taken between planning and execution:
   ```bash
   gh api repos/sdlcforge/sdlc-cli --jq '{full_name}' 2>&1  # expect 404
   ```
   If this unexpectedly resolves (i.e. `sdlcforge/sdlc-cli` exists), halt and report — do not rename, delete, or otherwise act on it yourself; this is a decision for the manager/user.
3. **Confirm the local git `origin` remote's current target**, for the record (this task does not modify the remote — that remains task 002's scope):
   ```bash
   git remote -v
   ```
   Report what `origin` currently resolves to in your structured report. At planning time it still pointed at the old `git@github.com:liquid-labs/sdlcpilot-cli.git` URL, working only via GitHub's former-location redirect (see the notes file) — task 002 is responsible for repointing it to `sdlcforge/core-cli`.
4. **Do not** modify any files in this repository, and do not run any mutating `gh` command. `package.json`'s `repository`/`bugs`/`homepage` fields, the local git `origin` remote, and `bun.lock` are all owned by task `002-update-package-identity-and-urls.md`, dispatched separately and in parallel. Keep this task's diff empty.

## Validation

- `gh api repos/sdlcforge/core-cli --jq '.full_name'` returns `sdlcforge/core-cli`.
- `gh api repos/sdlcforge/sdlc-cli` 404s (confirms no stray repo of that name was created).
- `git status` in this task's worktree shows no changes — this task is GitHub-state-only and read-only.
- Your structured report states plainly: (a) that `sdlcforge/core-cli` verified correctly, (b) that no stray `sdlcforge/sdlc-cli` exists, and (c) what the `origin` remote currently points at, for task 002's benefit.

## Assumptions

- **The target is confirmed as `core-cli`, not `sdlc-cli`.** This was an open, load-bearing discrepancy at planning time: the live GitHub repo was already `sdlcforge/core-cli` with no recorded rationale, while several same-day sources (the user's own original request, the `sdlcforge-modernization` wave manifest, and `sdlcforge/core-server`'s own docs) pointed to `sdlc-cli` instead. The user has since been asked directly and confirmed `core-cli` is correct and intentional. This task, and the rest of this plan, now treat `core-cli` as the confirmed final identity rather than an open question.
- The transfer-plus-rename to `sdlcforge/core-cli` already happened (four days before the planning session, per the notes file), performed by someone/something outside this plan's own history. This task does not need to repeat or redo that operation — only confirm the state it left behind is still as expected.
- This task is no longer at risk of the Bash-permission-classifier block an earlier draft of this task worried about (the sibling `pluggable-defaults-rename` plan hit one on its own `gh repo rename` step) — there is no mutating `gh` command left in this task's scope for that concern to apply to.

## References

- [GitHub and npm current-state investigation](../notes/github-and-npm-current-state.md) — the full verification trail behind this task's framing, including the original `core-cli`-vs-`sdlc-cli` discrepancy and its resolution.
- `plan/overview.md`'s "Flagged for manager" section — records the discrepancy as now resolved, per the user's confirmation.
