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

- [ ] **1. Archive.** Tag every `pr/*`, `fix/*` and `backup/*` branch tip as
      `archive/2026-11-13/<branch>`. Check every tag points at its branch's
      commit, then delete the `backup/*` branches (286) with Jasper's go.
- [ ] **2. Docs first.** This `process/` section, `tools/stack.yml`, the
      inbox moved to `inbox/FIXES.md`, and the pointer in
      `AFFiNE/.claude/CLAUDE.md`. Jasper reviews.
- [ ] **3. Create `working/*`** from today's branches, in the new order (see
      `tools/stack.yml`), by replaying each branch's own commits onto its new
      parent with `git merge-tree` + `git commit-tree` (no ref is moved until
      the result checks out):
  - [ ] upstream-bug fixes at the bottom: pr/00's settings fix (d92d4c28c6),
        pr/50, pr/51 → `working/fix/*` (canary check for each; if one turns
        out to be ours, it goes to its owning branch instead);
  - [ ] edgeless order `02 03 05 06 07 08 09 12 13 14 15 10 11` (merge-tree
        check on 2026-11-13: applies cleanly; type check still to do);
  - [ ] drop `pr/16` (empty) and `pr/20-spreadsheet` stays off the stack;
  - [ ] the rest of pr/00 (`cascade-rebase.sh`, `docs/pr-stack/`) goes:
        docs → `process/` here (already done in step 2), script retired;
        `pr/00` is not carried over;
  - [ ] `pr/N-build` → `working/pr/N-build`.
- [ ] **4. Corrections on `working/*`:**
  - [ ] split `working/pr/18a-note-properties-panel` out of pr/18: the Note
        section of the Properties panel (`properties-modal.ts`, +112 lines)
        and the `NoteBlockModel` case in `object-properties.tsx` (+4);
  - [ ] drop pr/41's `stencil-utils.ts` hunk (`webpackChunkName` comments:
        left over, the service worker now matches chunks by file extension);
  - [ ] remove the Playwright bump from pr/18 (back to canary's `=1.58.2`)
        and regenerate `yarn.lock`;
  - [ ] the List view fix `c7b503565c` from N-build to pr/19 (open item on
        the [pr/N page](../../pr-N/)).
- [ ] **5. Tree check.** `working/pr/N-build`'s tree equals today's
      `pr/N-build` tree except for the intended changes in step 4 (list the
      differing files and account for each).
- [ ] **6. Known issues.** Each open inbox item and known regression (e.g. the
      multi-line selection regression) gets a failing test and the canary
      check, and lands as a `fix(…)` commit on its owning branch or a
      `working/fix/*` branch. The archive tags keep the old fine-grained
      history for bisecting.
- [ ] **7. Rebase onto the latest canary** and run the full checks
      ([Weekly runbook](../weekly/), steps 1–2). Jasper: on-device check.
- [ ] **8. Build the tools** in `tools/`: `stack-publish`, `stack-check`,
      `fix-classify`. Run the rehearsal on the old history vs `working/*` and
      record the numbers here.
- [ ] **9. Publish.** Generate `pr/*`; every published branch type-checks on
      its own. Jasper's go, then force-push `working/*` and the published
      branches, open the fork-internal review PRs, install CodeRabbit on the
      fork.
- [ ] **10. Tidy the docs.** Overview (`index.md`) and `_data/prs.yml`: new
      order, bases, `alone` flags; remove the pr/00 page and card; pr/N page
      "Work on the stack" points here; README's "Opening a PR" section uses
      the generated branches (no more `standalone/`); add a **Changes**
      section to every PR page (empty to start; the definition of done fills
      it).

## Results

(Fill in as steps complete: tags, commits, rehearsal numbers, file counts per
published PR.)
