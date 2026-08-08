# Documentation Stopgap

## Purpose and scope

`sdlcpilot-cli` has no standard Flow documentation and, per the modernization synthesis (`/tmp/flow-sdlc-modernization/synthesis.md` §6), will not get any — this repo's own README/generated docs describe today's two-package, HTTP-mediated CLI-to-server model, and this repo is slated for deletion once Phase 4 of the broader modernization collapses it and `core-server` into a single `sdlcpilot` product package. Writing a full doc set now would document an architecture this whole effort exists to remove.

This task is the "do now" stopgap the synthesis calls for: fix a couple of small, currently-misleading rough edges in the existing README, and add a short banner pointing readers at the modernization plan, without expanding the doc set.

## Requirements

- In `README.md`, fix the `mkdkir` typo (should be `mkdir`) in the "Create a minimal project" usage step.
- Remove the parenthetical "(These package names will be updated shortly.)" aside after the `npm i -g sdlcpilot-cli @sdlcforge/core-server` install command — either delete it outright, or replace it with accurate current-state text if the package-name migration status is now known (check whether `@sdlcforge/sdlc-cli` or similar has actually shipped; if not, simply remove the aside rather than leaving a stale promise).
- Remove or resolve the "(TODO: I think this may be automated somewhere...)" aside on the "Create a minimal project" step similarly — either confirm whether it is automated and update the text accordingly, or remove the aside if it's simply unresolved uncertainty that isn't this task's job to investigate further.
- Add a short (2-3 sentence) banner near the top of `README.md` (after the title, before "Install") noting that this project is part of an active modernization effort and pointing at the plan for context — reference `/tmp/flow-sdlc-modernization/synthesis.md` by describing its content in one sentence rather than assuming the reader has filesystem access to that exact path (e.g., "This CLI is being consolidated into a single self-contained binary as part of an in-progress SDLCForge modernization; see the project's `plan/` directory for details.").
- Do not write a full README rewrite, an architecture doc, a spec doc, or any other new documentation file. Do not touch the generated `docs/index.md` / generated endpoint-reference docs — they regenerate from the live API spec and are out of scope here.

## Validation

- `grep -n "mkdkir" README.md` returns no matches.
- `grep -n "will be updated shortly\|TODO: I think this may be automated" README.md` returns no matches.
- The new banner text is present near the top of `README.md` and reads clearly on its own (no dangling references to files the reader can't access).
- No other file in the repo is modified by this task.

## Metadata

architectural_impact: false
