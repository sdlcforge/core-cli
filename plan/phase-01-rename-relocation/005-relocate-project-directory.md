# Relocate Project Directory

## Purpose and scope

Rename the local playground checkout directory from `liquid-labs/sdlcpilot-cli` to `sdlcforge/sdlc-cli`, matching the playground's `<org>/<repo>` convention now that both the GitHub location (task 001) and the package identity (tasks 002–004) have moved. **Manager-executed, not task-agent-dispatched** — mirrors the sibling `pluggable-defaults-rename` and `pluggable-express-rename` plans' equivalent tasks, for the same reason: a task agent's own worktree lives under the very directory being renamed, so this step cannot safely run from inside a task-agent dispatch. Runs strictly last, after tasks 001–004 have all landed and merged.

## Requirements

1. Confirm tasks 001–004 have all landed (GitHub repo resolves at `sdlcforge/sdlc-cli`; `package.json` name/URLs are correct; build artifacts and self-references are renamed; the version bump/build/test/publish task is complete or its publish step has been explicitly handed off).
2. Ensure the working tree is clean (no uncommitted changes) before moving the directory — check `git status` at `liquid-labs/sdlcpilot-cli` first, and stash or commit anything outstanding.
3. Move the directory:
   ```bash
   mkdir -p ~/playground/sdlcforge
   git -C ~/playground/liquid-labs/sdlcpilot-cli worktree list   # confirm no other active worktrees would be orphaned by the move
   mv ~/playground/liquid-labs/sdlcpilot-cli ~/playground/sdlcforge/sdlc-cli
   ```
   Adjust the exact `mv` invocation for the actual resolved playground root if it differs from `~/playground`.
4. Verify the moved checkout is still a healthy git repository (`git -C ~/playground/sdlcforge/sdlc-cli status`, `git -C ~/playground/sdlcforge/sdlc-cli remote -v`) and that any registered Flow plan/session state (`.flow/`) still resolves correctly from the new path — re-run `flow-mcp` project-index refresh if available, since the project index caches paths.
5. This step is **not** a task-agent dispatch — the manager (or the user directly) performs it, then closes out this plan via `finalize-completed-plan-documents` from the new location.

## Validation

- `~/playground/sdlcforge/sdlc-cli` exists and is a healthy git checkout (`git status`, `git log -1` both succeed).
- `~/playground/liquid-labs/sdlcpilot-cli` no longer exists.
- No other worktree (e.g. this very plan worktree, `worktrees/plan/sdlcpilot-cli-rename`) is left orphaned or broken by the move — `git worktree list` from the new location shows all worktrees resolving under the new parent path.
- The project index (`.flow/project-index.json` at the playground root, if present) is refreshed or confirmed to correctly resolve the project at its new path rather than a stale cached location.

## Assumptions

- The playground root is `~/playground` with the `<org>/<repo>` convention already established by the Wave 1 sibling renames (`liquid-labs/pluggable-express` → `liquid-labs/plugable-express`, `liquid-labs/pluggable-defaults` → `liquid-labs/plugable-defaults`) — this task follows the identical pattern, just also crossing org boundaries (`liquid-labs` → `sdlcforge`) since this rename is an org move, not merely a spelling fix.
- Any git worktrees nested under the old path (including this plan's own worktree at `worktrees/plan/sdlcpilot-cli-rename`, and the task worktrees for 001–004) should already be torn down/merged by the time this step runs — a manager relocating a directory with active worktrees still attached should confirm `git worktree list` is clean first, per Requirement 3, rather than relying on `mv` to silently carry them along correctly.

## References

- `plan/plan-summary-pluggable-defaults-rename.md` (sibling project) and `plan/plan-summary-pluggable-express-rename.md`-equivalent (if present at `plugable-express`) — the precedent this task's manager-executed, last-sequenced directory-move mirrors.
