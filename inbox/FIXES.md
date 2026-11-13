# Fixes Inbox

Living intake for fixes: on-device reports and review comments. Jasper writes raw reports in **Inbox**; Claude triages
them into the **Tracker** and routes each to a GSD destination. This file is the source of truth
between sessions. Don't keep fix state only in chat.

## How it flows

1. **Write** (Jasper): add an item under Inbox. Only the one-line title is required. Fill the
   other fields when you know them.
2. **Triage** (Claude, on "triage FIXES.md"): read the code for each item, give it an `F-nn` id,
   group items that share a root cause, then move it to the Tracker with a route:
   - `quick`: small, obvious, one commit. Run with `/gsd-quick` (or `/gsd-fast`).
   - `999.x`: needs investigation or more than one commit. Becomes a `### Phase 999.x` entry in
     AFFiNE/.planning/ROADMAP.md `## Backlog`; promote with `/gsd-review-backlog`, then discuss,
     plan, execute.
   - `debug`: cause unknown and a repro is needed first. `/gsd-debug` session in `.planning/debug/`.
   - `existing`: duplicate of, or folded into, an existing 999.x or todo (noted in the tracker).
   - `wontfix` / `question`: needs your decision. Shown under **Open questions**.
3. **Parallel**: each tracked item gets a **Lane**, the code area it touches. Items in different
   lanes can run at the same time (separate `/gsd-workstreams` or worktrees). Items in the same
   lane run one after another. Order inside a lane comes from `Pri`.
4. **Fix**: every route follows process/fixes.md (failing test, canary check, owning branch or
   `working/fix/*`).
5. **Close**: status goes `new → triaged → in-progress → built → device-OK → done`.
   `built` means committed and awaiting your on-device check. Only you move an item to `device-OK`.

Lanes (extend as needed): `toolbar` (mobile keyboard toolbar), `db-view` (database / list / table
views), `journal-todo`, `note-ref` (linked notes / references), `selection` (inline / range / caret),
`pwa` (SW, offline, install, icons), `layout` (viewport, scroll, safe-area), `desktop`.

## Inbox

<!-- Template: copy and fill. Everything except the title is optional.

### <one-line title>
- Where: mobile PWA / mobile Safari / desktop / tablet
- Pri: high / med / low
- Steps: what you did
- Expected / Actual:
- Since: when it started, if you know (build / date)
- Notes / screenshots:
-->

### Unit tests failing on the stack (found in the 2026-11-13 migration run)
- Where: `yarn vitest run` on `working/pr/N-build`; all also fail on the old `pr/N-build`, so not caused by the migration
- Pri: med
- Notes:
  - `blocksuite/affine/all/src/__tests__/database/database.unit.spec.ts`: "promotes ancestors from descendant done and cascades todo without overwriting manual done descendants" (pr/19 area)
  - `blocksuite/affine/gfx/shape/src/__tests__/shape-browser-library.unit.spec.ts`: "places drawio categories after base ordering": `this._getFilteredItems is not a function` (pr/09/10 area)
  - `blocksuite/framework/store/src/__tests__/block.unit.spec.ts`: 5 tests (signal props atom/nested/stash-and-pop, deep sync, shared array splice): store change in our stack (pr/50 or pr/18?)
  - `packages/frontend/core/src/modules/code-block-preview-renderer/typst-preview.integration.spec.ts`: 30 s timeout; passes on plain canary, so something in our stack
  - Flaky under load: `share-import-controller.spec.tsx` "retains the original image preview…" (passes alone)

## Tracker

| ID | Title | Route | Lane | Pri | Status | Ref (999.x / commit / debug file) |
|----|-------|-------|------|-----|--------|-----------------------------------|

## Open questions

<!-- Questions Claude raises during triage that need Jasper's decision. Answer inline. -->
