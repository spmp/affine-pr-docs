---
title: Process
nav_order: 100
has_children: true
permalink: /process/
---

# How the fork is worked on
{: .no_toc }

How changes to the [spmp/AFFiNE](https://github.com/spmp/AFFiNE) fork are made,
fixed, rebased and offered upstream. Written for people and for agents (Claude
Code, GSD): follow it as written, and change it here before changing how the
work is done.

1. TOC
{:toc}

## The short version

- **Two layers of branches.** `working/*` is one linear stack that we develop,
  run and rebase weekly. `pr/*` and `fix/*` are **generated** from it for
  upstream, each based on as little as possible so its PR shows only its own
  change. See [Branches](branches/).
- **To use the fork, run `working/pr/N-build`.** It contains everything. The
  `pr/*` branches are for upstream review only.
- **Every fix starts with a failing test, then the canary check**: if the test
  also fails on upstream `canary`, the bug is upstream's and the fix gets its
  own `working/fix/*` branch and upstream PR; otherwise it goes on the branch
  that owns the feature. See [Fixes](fixes/).
- **Weekly:** rebase `working/*` onto the latest `canary`, run the checks,
  read new review comments. **When we choose:** regenerate and push `pr/*`.
  See [Weekly runbook](weekly/).
- **History:** few, well-described commits per branch; noise is folded in with
  `git commit --fixup`. Backups are tags, never branches. See
  [Commits and history](commits/).

## Where things live

| What | Where |
| --- | --- |
| Process (this section) | `affine-pr-docs/process/` |
| Branch order and bases | `affine-pr-docs/tools/stack.yml` |
| Stack tools (rebase, generate, checks) | `affine-pr-docs/tools/` |
| Fix inbox (raw reports) | `affine-pr-docs/inbox/FIXES.md` |
| Upstream-bug fixes and their issues/PRs | [Fix register](fix-register/) |
| What each PR does, and its changes | `prs/pr-NN.md` (one page per PR) |
| Upstream PR descriptions | `pr-text/pr-NN.md` |
| Build, deploy, Docker | `working/pr/N-build` ([pr/N page](../pr-N/)) |
| Agent entry point | `AFFiNE/.claude/CLAUDE.md` (untracked; points here) |

The stack tools and `stack.yml` live in this repository, not in the fork,
because every branch of the fork is rewritten on each rebase and a script on a
branch disappears when you switch away from it. Everything needed to *build
and deploy* the fork stays on `working/pr/N-build`.

## Definition of done

A change (feature or fix) is done when all of these hold:

1. **Test first.** A test that failed before the change and passes after it.
   For a fix, the failing state was proven by reverting the fix.
2. **Canary check recorded** (fixes only): where the test was run against
   `upstream/canary` and what it showed. See [Fixes](fixes/).
3. **On the right branch:** the owning `working/pr/*`, or its own
   `working/fix/*`. Never left on `working/pr/N-build` unless it is build or
   deploy work.
4. **Checks pass on `working/pr/N-build`:** `yarn lint:ox`, the full type check
   (`NODE_OPTIONS=--max-old-space-size=14384 yarn typecheck`), and the unit and
   e2e tests for the area touched.
5. **Confirmed on device** by Jasper for anything a user sees (desktop
   browser, phone, PWA). Only Jasper marks this.
6. **Documented, in the same session:**
   - the PR page `prs/pr-NN.md`, under **Changes**: one line per fix or
     behaviour change, newest first, with the commit;
   - for an upstream bug: a row in the [Fix register](fix-register/);
   - `pr-text/pr-NN.md` if the upstream description is now wrong;
   - the inbox tracker row moved on.
7. **Pushed** per the rules in [Setup and access](setup/#what-agents-may-do-alone).

## Keeping these docs true

- Change the process **here first**, then work that way. If a step here turns
  out wrong while doing it, fix the page in the same session.
- `tools/stack.yml` changes in the same commit as the stack change it
  describes.
- Each PR page's **Changes** list is the record of what changed in that PR
  after it was first offered. The generated `pr/*` commit is one squashed
  commit, so this list is where reviewers see the history.
- Agents: read this section before any stack, branch or fix work. The pointer
  in `AFFiNE/.claude/CLAUDE.md` exists so this is never skipped.
