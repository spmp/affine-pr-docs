---
title: Fixes
parent: Process
nav_order: 2
permalink: /process/fixes/
---

# Fixes
{: .no_toc }

1. TOC
{:toc}

## From report to fix

1. **Report.** Jasper adds the problem to `inbox/FIXES.md` under **Inbox**:
   a one-line title is enough.
2. **Triage** (agent, on "triage the inbox"). For each item: read the code,
   give it an `F-nn` id, merge items with one root cause, and move it to the
   **Tracker** with a route (`quick`, `999.x`, `debug`, `existing`,
   `question`), a lane and a priority. Questions go under **Open questions**.
   Lanes that don't share code can be worked in parallel.
3. **Failing test.** Write the test that shows the bug, on
   `working/pr/N-build` (the top of the stack, where the dev server runs).
   Prefer the narrowest test that shows it: unit, then integration, then e2e.
4. **Canary check** (below). This decides where the fix goes.
5. **Fix** until the test passes. Prove the test by reverting the fix and
   watching it fail.
6. **Confirm on device** (Jasper), for anything visible.
7. **Move the fix to its branch** and rebase the stack (see
   [Moving a commit to its branch](../commits/#moving-a-commit-to-its-branch)).
8. **Document** per the [definition of done](../#definition-of-done).

## The canary check

Run the failing test on upstream `canary`, without any of our branches:

```sh
git fetch upstream canary
git worktree add ../affine-canary upstream/canary     # once; later: git -C ../affine-canary checkout --detach upstream/canary
# copy the new test file(s) into ../affine-canary, then run the same command there
```

`tools/fix-classify <test file>` (to be built) does this and prints the
verdict.

| Result on canary | Meaning | Where the fix goes |
| --- | --- | --- |
| **Passes** | We introduced the bug. | A `fix(<area>): …` commit on the owning `working/pr/NN`, on top of its feature commit. It reaches upstream inside that PR. |
| **Can't run** (the feature isn't in canary) | Ours. | Same as above. |
| **Fails the same way** | Upstream's bug. | Its own `working/fix/<slug>` branch on canary, at the bottom of the stack; an upstream issue; an upstream PR from the generated `fix/<slug>`; a row in the [Fix register](../fix-register/). |
| **Fails differently** | Unclear: the test depends on something of ours. | Make the test narrower until it's one of the above. |

Record the result (command, commit of canary, verdict) in the fix's commit
message body, e.g. `Canary check: fails on upstream/canary 1a2b3c4 (upstream bug)`.

## Upstream-bug fixes

- One bug per branch. The branch holds the test and the fix and nothing else,
  and it must apply to plain canary.
- Open the upstream **issue** first (symptom, steps, the failing test), then
  the PR from `fix/<slug>` that refers to it.
- Feature branches above may rely on the fix. When upstream merges it, the
  working branch is dropped at the next rebase (see
  [When upstream merges a PR](../branches/#when-upstream-merges-a-pr)).

## Fixes from review comments

CodeRabbit and reviewer comments are read weekly (see
[Weekly runbook](../weekly/)). Each one worth acting on becomes an inbox item
with the PR and comment link, and goes through the same steps. Comments not
acted on get a short reply saying why, so the PR shows they were read.
