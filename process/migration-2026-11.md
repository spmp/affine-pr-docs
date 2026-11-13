---
title: Migration (Nov 2026)
parent: Process
nav_order: 8
permalink: /process/migration-2026-11/
---

# Moving to working/* and generated pr/* branches
{: .no_toc }

One-off. Agreed with Jasper on 2026-11-13. Tick each step here as it's done,
with the commit or tag, so the work can be resumed by anyone. Nothing is
pushed until step 9.

Safety net: Jasper's copy of the whole checkout, `/workspace/AFFiNE_backup_2026-11-13`,
plus the tags from step 1.

1. TOC
{:toc}

## Steps

- [x] **1. Archive.** 315 tags `archive/2026-11-13/<branch>` for every `pr/*`,
      `fix/*` and `backup/*` branch, each checked against its branch. The 286
      `backup/*` branches were deleted (none were on GitHub). Other local
      branches (`old/*`, `tmp/*`, upstream copies) were left alone.
- [x] **2. Docs first.** `process/`, `tools/stack.yml`, `inbox/FIXES.md`, the
      **Fork workflow** section at the top of `AFFiNE/.claude/CLAUDE.md`.
- [x] **3. Create `working/*`** (26 branches), built in memory with
      `git merge-tree` + `git commit-tree` from the old branches, authors and
      messages kept, committer Jasper's noreply address:
  - [x] fixes at the bottom: `working/fix/editor-setting-fallback` (pr/00's
        d92d4c28c6), `working/fix/store-parent-index` (pr/50),
        `working/fix/toast-container` (pr/51);
  - [x] edgeless order `02 03 05 06 07 08 09 12 13 14 15 10 11`. pr/12's
        reorder of `filled`/`flipX`/`flipY` in `LocalShapeElementModel` now
        lands in pr/11, where `filled` is added;
  - [x] `pr/16` (empty) and `pr/00` not carried over; `pr/20-spreadsheet`
        stays off the stack; `cascade-rebase.sh` retired;
  - [x] `pr/N-build` → `working/pr/N-build` (15 commits).
- [x] **4. Corrections:**
  - [x] `working/pr/18a-note-properties-panel` split out of pr/18;
  - [x] pr/41's `stencil-utils.ts` hunk dropped;
  - [x] the Playwright bump removed from pr/18: it touched 13 `package.json`
        files, not just the root; all back to `=1.58.2`, lockfile entries
        identical to canary's;
  - [x] the List view fix (`fix(database): stop a real non-collapsed
        selection…`) moved from N-build to pr/19.
- [x] **5. Tree check.** Before the rebase, `working/pr/N-build` differed from
      the old `pr/N-build` only in: `docs/pr-stack/*`, `scripts/cascade-rebase.sh`
      (dropped), `stencil-utils.ts` (pr/41 hunk), the Playwright versions in
      13 `package.json` files and `yarn.lock`.
- [ ] **6. Known issues.**
  - [x] Canary check for the three fixes: all three are upstream bugs
        (recorded in their commit messages and the [Fix register](../fix-register/)).
        editor-setting-fallback's test fails *differently* on canary; a
        behaviour test through `watchAll()` would make it firm.
  - [ ] The inbox is empty. Known regression still open: multi-line text
        selection in database rows (`AFFiNE/.planning/todos/pending/`).
- [ ] **7. Rebase onto the latest canary and check.**
  - [x] Rebased onto `upstream/canary` 9c61550279 (2026-11-12; GitHub was
        unreachable for a fresh fetch). Two conflicts: an import in
        `kanban.unit.spec.ts` (pr/19; kept both) and `@react-email/render`
        in the server's `package.json` (pr/40; took canary's 2.2.0). Lockfile
        follow-ups folded in with `--fixup`: the Playwright pins (pr/18) and
        a `deepmerge` entry pr/41's new dependency needs.
  - [x] `yarn lint:ox` and the full type check pass on `working/pr/N-build`.
  - [x] Unit tests (`yarn vitest run`): 2,101 pass, 20 fail, none new.
        11 Electron tests (`recording-feature`, `workspace/handlers`) also
        fail on plain canary. 8 already failed on the old `pr/N-build`:
        `database.unit.spec.ts` (ancestor promotion), `shape-browser-library`
        (`_getFilteredItems is not a function`), 5 in the store's
        `block.unit.spec.ts`, `typst-preview` (30 s timeout).
        `share-import-controller.spec.tsx` failed 3 times while other heavy
        jobs ran and passed 4 of 4 runs on its own: flaky under load.
  - [ ] BlockSuite integration; e2e; server tests.
  - [ ] Jasper: rebuild and on-device check.
- [x] **8. Tools:** `stack-publish`, `stack-check` (rehearsal, overlap;
      churn not automated), `fix-classify`, `stack-docs`.
- [ ] **9. Publish.**
  - [x] `stack-publish --write`: 24 local branches; combined check OK.
  - [ ] Type-check each generated branch on its own (at least pr/15, pr/11,
        pr/18, pr/18a, pr/19, pr/30, pr/41: their bases changed).
  - [ ] GitHub token and CodeRabbit on the fork (Jasper).
  - [ ] Jasper's go; push `working/*` and the published branches; open the
        fork-internal review PRs; delete the remote `pr/00` and `pr/16`.
- [x] **10. Tidy the docs.** Overview diagram and cards; the pr/00 page is now
      the fix's page; a page for pr/18a; pr/N page; README; header lines and
      "Depends on other PRs" regenerated (`tools/stack-docs`); a **Changes**
      section on every PR page.

## Results

Published branches (files against canary; CodeRabbit's limit is 300):

| Branch | Base | Own files | vs canary |
| --- | --- | ---: | ---: |
| fix/editor-setting-fallback, pr/50, pr/51 | canary | 2–3 | 2–3 |
| pr/02 | canary | 37 | 37 |
| pr/03 … pr/09 | chain | 12–83 | 52–170 |
| pr/12 … pr/15 | chain after pr/09 | 7–17 | 174–208 |
| pr/10 | pr/15 | 237 | 423 (over) |
| pr/11 | pr/10 | 18 | 427 (over) |
| pr/17 | canary | 2 | 2 |
| pr/18 | canary | 112 | 112 |
| pr/18a | pr/13 + pr/18 | 2 | 285 |
| pr/19 | pr/18 | 218 | 298 |
| pr/30 | pr/19 | 34 | 324 (over) |
| pr/31, pr/40, pr/41 | canary | 7, 4, 29 | 7, 4, 29 |

Before: every upstream PR showed the whole stack below it (pr/51: 812 files).

Rebase rehearsal (`stack-check rehearsal`, last 8 weeks of canary): the new
41-commit stack has 26 conflicting commit replays in total (4 at most per
week, 0 on the latest canary); the 318-commit pre-squash history
(archive `backup/2026-10-31/pre-squash-and-reauthor`) has 24, but sits on an
older base, which favours it. Both are low; the remaining conflicts are
upstream changes next to our lines (`kanban.unit.spec.ts`, server
`package.json`, `tools/cli/src/bundle.ts`).
