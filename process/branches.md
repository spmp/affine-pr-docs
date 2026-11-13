---
title: Branches
parent: Process
nav_order: 1
permalink: /process/branches/
---

# Branches
{: .no_toc }

1. TOC
{:toc}

## Two layers

```
upstream/canary
  working/fix/<slug> …              upstream bugs, one branch each
    working/pr/02 … working/pr/42   features, in stack.yml order
      working/pr/N-build            build, deploy, fork tooling: run this
```

**`working/*`** is one linear stack. Each branch is based on the one before
it. This is where all work happens: commit, test, run, rebase. Its history is
kept: fixes stay as their own commits on top of the feature they fix.

**`pr/*` and `fix/*`** (no prefix) are what upstream sees. They are generated
from `working/*` and never edited by hand. Each one is a single squashed
commit, the branch's own change, placed on its `base` from
[`tools/stack.yml`](https://github.com/spmp/affine-pr-docs/blob/main/tools/stack.yml):
`canary` when it stands alone, otherwise the generated branch it really needs.
So an upstream PR shows only its own change plus the minimum below it.

Why two layers: a PR from a fork to upstream can only be based on an upstream
branch. If the PR branch is the working stack itself, every PR shows every
branch below it: today pr/51 shows 812 files. Upstream reviewers won't wade
through that, and CodeRabbit skips any PR over **300 files** (counted against
`canary`, including everything below it).

## Names

| Branch | Meaning |
| --- | --- |
| `working/fix/<slug>` | A fix for an upstream bug (the test fails on canary). Bottom of the stack. |
| `working/pr/NN-<slug>` | A feature, with its fixes on top. Numbering: `02–2x` editor and edgeless, `30s` mobile, `40s` server and PWA. A letter suffix (`18a`) is a small branch split out of `NN` for dependency reasons. |
| `working/pr/N-build` | Build and deploy only (Dockerfile, Compose, rebuild scripts, the catch-up migration). Never published. |
| `pr/NN-<slug>`, `fix/<slug>` | Generated for upstream. The name is `publish:` in `stack.yml`. Existing upstream PRs keep their branch names (a PR's head branch can't be renamed), so `pr/50` and `pr/51` keep their `pr/` names though they are fixes. |

Backups are **tags** (`archive/<date>/<branch>`), never branches. See
[Commits and history](../commits/#backups-are-tags).

## Order and bases

`tools/stack.yml` is the single source for both:

- **The working order.** Upstream-bug fixes first, then features. The order
  matters for `--update-refs` rebases and for generation.
- **Each published branch's `base`.** Rule: a branch's published lineage
  (base, base's base, …) must keep the same relative order as the working
  stack. That is why the working stack has `10` and `11` after `15`: the
  published edgeless chain is `02 → 03 → 05 → … → 09 → 12 → 13 → 14 → 15 →
  10 → 11`, so pr/10's 237 files no longer push 12–15 over the 300-file limit.

A branch with **two bases** (`18a`, which adds pr/18's note settings to the
Properties panel from pr/12, a file pr/13 also edits, so its bases are pr/13
and pr/18) is generated on a merge commit that combines both.
Its upstream PR is opened once both bases have merged; until then it is
reviewed only inside the fork.

A `base` marked `status: tentative` is a best guess until the generator has
built it and the type check passes on it.

## Generating the published branches

`tools/stack-publish` (run from this repository: `tools/stack-publish`, then
`tools/stack-publish --write`) does, for each published entry, bottom to
top:

1. Take the working branch's own change: the diff from the working branch
   below it to the working branch.
2. Apply it as one commit onto the entry's base (`upstream/canary` or the
   already-generated published base). The commit message is the PR title plus
   the **Changes** list from `prs/pr-NN.md`.
3. Stop on any conflict: it means `base` is missing a real dependency. Fix
   `stack.yml` (or move the hunk to the branch that owns it), don't hand-edit
   the result.
4. Report each branch's files against canary, and flag any over CodeRabbit's
   300-file limit.
5. Check: applying all generated branches together on `canary` gives the same
   tree as the working stack up to the last published branch.

Type-checking each generated branch on its own is a separate step before a
publish: `tools/stack-typecheck` (about a minute per branch, in a scratch
worktree). Upstream merges PRs one at a time, so each must build alone.

It writes local branches only. Pushing is a separate, reviewed step (see
[Weekly runbook](../weekly/#publishing-upstream)). Pushing a `pr/*` branch
updates its open upstream PR in place.

## Fork-internal review PRs

Each published branch with a non-canary base also gets a PR **inside the
fork**: head `pr/NN`, base its published base. Its diff is exactly that
branch's change, so CodeRabbit (installed on spmp/AFFiNE) reviews each change
on its own however deep the chain. These PRs are never merged; they exist for
review. Their comments are read with `gh` in the weekly run.

## When upstream merges a PR

At the next weekly rebase:

1. Drop that branch's commits from `working/*` (canary now has them; upstream
   squash-merges, so git won't drop them by itself).
2. Remove its entry from `stack.yml`, re-point anything based on it to its
   base.
3. Mark it merged on its PR page and the overview.
