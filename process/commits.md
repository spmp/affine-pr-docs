---
title: Commits and history
parent: Process
nav_order: 3
permalink: /process/commits/
---

# Commits and history
{: .no_toc }

The aim: a history that says what changed and why, with little noise, that
rebases onto a new canary every week without a fight.

1. TOC
{:toc}

## What a working branch looks like

```
working/pr/19-todo-database-integration-in-journal
  feat(…): Journal Todo …                  the feature, one commit (or a few
                                           logical parts)
  fix(journal-todo): … (F-12)              one commit per real fix, each with
  fix(list-view): … (F-15)                 its test, oldest first
```

- **Feature commits**: one per logical part. A reviewer should be able to
  read each on its own. The message says what it does and why.
- **Fix commits**: one per fix that a user or reviewer would recognise: it
  has a test and an inbox id. They stay separate in `working/*`; the
  published `pr/*` commit squashes them in and lists them in its message.
- **Noise is folded in, not kept**: formatting, WIP, review tweaks, and fixes
  to a fix that never reached a device. Commit these with
  `git commit --fixup=<commit>`; the weekly rebase folds them into that commit
  (`--autosquash`).
- **`yarn.lock`** changes go in their own commit per branch
  (`chore(deps): lockfile`). On a rebase conflict, take canary's version,
  run `yarn install`, and commit the result. Never merge it by hand.
- **No tooling bumps in feature branches.** Dependency versions follow canary
  (Playwright included: see [Setup](../setup/#playwright)).

## Moving a commit to its branch

Work happens on top of `working/pr/N-build`. To move a finished commit down
to the branch that owns it, rebase the stack interactively with
`--update-refs`:

```sh
git rebase -i --update-refs upstream/canary working/pr/N-build
```

The todo list shows an `update-ref refs/heads/working/…` line at the end of
each branch. Move the commit's `pick` line up to just above the
`update-ref` line of its branch. Save; every branch above moves with it.

Agents can't use the editor; they write the todo list with a script and pass
it as `GIT_SEQUENCE_EDITOR="cp <todo file>"`.

A `--fixup` commit needs no moving: `--autosquash` puts it next to the commit
it fixes, inside that commit's branch.

## Backups are tags

`--update-refs` moves **every local branch** that points at a commit being
rebased. A backup *branch* pointing at the same commit as `working/pr/14`
would be "rebased" too and stop being a backup. Tags are never moved by a
rebase, so all backups are tags:

```sh
d=$(date +%F)
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/working/); do
  git tag "archive/$d/$b" "$b"
done
```

They don't show in `git branch`, cost nothing, and are pushed only if asked
(`git push origin 'refs/tags/archive/<date>/*'`). Restore with
`git branch -f <branch> archive/<date>/<branch>`.

## Measuring lumpiness

Three checks, all computed in memory with `git merge-tree` so no branch
moves. `tools/stack-check` (to be built) runs them; the first is the one that
decides.

1. **Rebase rehearsal.** Take upstream `canary` as it was at the end of each
   of the last 8–10 weeks, replay the stack onto each, commit by commit, and
   count conflicts. Compare two candidate histories (say, before and after a
   squash): fewer conflicts wins. Run it before every regrouping of commits.
2. **Churn inside a branch.** For each commit, the share of its changed lines
   that rewrite lines added by an earlier commit on the same branch. High
   churn without an inbox id means noise: fold it in.
3. **Overlap between branches.** Hunks edited by more than one branch. Each
   one is a conflict waiting to happen when the lower branch changes. Move
   the hunk to the lower branch where it belongs.

Why squashing helps: a hunk that upstream changes must be resolved once per
commit of ours that touches it. Five commits touching it means five
resolutions; one commit means one.

`git rerere` stays **off**: it caused problems here before. Careful commit shape is meant to make it unnecessary.
