---
title: Weekly runbook
parent: Process
nav_order: 4
permalink: /process/weekly/
---

# Weekly runbook
{: .no_toc }

Target: **2–3 hours of Jasper's time a week**, most of it the on-device check
and decisions. Agents do the mechanical steps and stop at each **Jasper**
step.

1. TOC
{:toc}

## Every week

### 1. Rebase onto the latest canary (agent, ~30 min unattended)

```sh
cd AFFiNE
git fetch upstream canary
d=$(date +%F)
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/working/); do
  git tag "archive/$d/pre-rebase/$b" "$b"
done
git rebase -i --autosquash --update-refs upstream/canary working/pr/N-build
```

- Save the todo list as it comes up unless commits need moving (see
  [Moving a commit](../commits/#moving-a-commit-to-its-branch)). Agents can't
  use an editor: they prefix the command with `GIT_SEQUENCE_EDITOR=:` to
  accept the list as generated.
- **Conflicts:** resolve the code; for `yarn.lock` take canary's side, then
  `yarn install` and amend. Note every conflict (file, branch, cause) in the
  run log: repeated ones mean commits need regrouping.
- If the rebase goes wrong: `git rebase --abort`, or restore from the
  `archive/<date>/pre-rebase/` tags.
- A branch whose PR upstream has merged: drop its commits here (see
  [Branches](../branches/#when-upstream-merges-a-pr)).

### 2. Check (agent, ~1 h unattended)

On `working/pr/N-build`:

| Check | Command |
| --- | --- |
| Lint | `yarn lint:ox` |
| Type check | `NODE_OPTIONS=--max-old-space-size=14384 yarn typecheck` |
| Unit | `yarn vitest run` |
| BlockSuite integration | `cd blocksuite/integration-test && npx vitest run` (and `--config vitest.mobile.config.ts`) |
| E2E | `tests/affine-local`, Playwright, `--workers=1 --trace off` |
| Server | `yarn test` in `packages/backend/server` |

Compare with last week's results: only **new** failures matter here; known
ones are listed in the run log. Then rebuild the Docker image
([pr/N](../../pr-N/)).

### 3. Read reviews (agent, ~15 min)

```sh
gh pr list --repo toeverything/AFFiNE --author spmp --state all
gh api repos/toeverything/AFFiNE/pulls/<n>/comments      # inline review comments
gh pr view <n> --repo toeverything/AFFiNE --comments      # conversation
```

Also the fork-internal review PRs (`--repo spmp/AFFiNE`). Each new comment
worth acting on becomes an inbox item with its link; merged or closed PRs are
noted for step 1 next week.

### 4. Jasper (~1–2 h)

- On-device smoke test of the rebuilt N-build: desktop browser, phone, PWA.
- Confirm or reject the `built` items in the inbox tracker.
- Answer open questions; pick the next fixes.

### 5. Push the working stack (agent, after step 4)

```sh
git push --force-with-lease origin $(git for-each-ref --format='%(refname:short)' refs/heads/working/)
```

This only updates the fork's `working/*` branches, which nobody upstream
sees.

## Publishing upstream

Not every week: when there's something worth showing (new fixes, a fresh
rebase after a quiet spell, review comments answered). Every publish
force-pushes the `pr/*` branches and so updates the open upstream PRs and
triggers CodeRabbit again.

1. `tools/stack-publish` regenerates `pr/*` and `fix/*` locally and runs its
   checks (see [Branches](../branches/#generating-the-published-branches)).
2. `tools/stack-check` rehearsal, if commits were regrouped since last time.
3. **Jasper** reviews the list of branches that changed and gives the go.
4. Push the changed published branches:
   `git push --force-with-lease origin <branches>`.
5. `tools/stack-docs --write` refreshes the PR pages' header lines and the
   PR texts' "Depends on other PRs" sections from `stack.yml`; commit them.
6. Update the fork-internal review PRs' bases if a base changed. Jasper opens
   upstream PRs for any new `fix/*` (with its issue) and pastes PR text that
   changed into the upstream descriptions.
7. If the order or bases changed: the overview diagram in `index.md` and the
   cards in `_data/prs.yml` (`alone: true` = based on canary).

## Run log

Keep a short log per run in [Runs](../runs/) (`process/runs.md`): date, canary commit, conflicts (file and branch), new
failures, time spent, anything that should change in this runbook.
