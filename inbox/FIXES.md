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

## Tracker

Triaged 2026-11-13. Groups (A–I) are explained below the table; items in one
group share a cause or a code area and are worked together. Lanes that differ
can run in parallel.

| ID | Title | Group | Route | Lane | Pri | Status | Ref |
|----|-------|-------|-------|------|-----|--------|-----|
| F-01 | Store: 5 `block.unit.spec.ts` tests fail (nested/deep prop changes don't notify) | A | fix | store | high | built | pr/18 `fix(store): update prop signals synchronously again…` |
| F-02 | Table view: new labels / colour changes don't show until redraw | A | fix | db-view | high | built | pr/19 `fix(database): table cells show new select labels…`; test `database-select-tag-render.spec.ts` |
| F-03 | Table view: deleting rows jumps to the top of the database | A | upstream fix | db-view | med | built | `working/fix/inline-container-selection`: found with the live caret probe; test `inline-container-selection.spec.ts` |
| F-04 | Table view: Enter / Shift+Enter in a cell | B | upstream fix + feature | db-view | high | built | `fix/table-title-enter`: the title's Enter now finishes editing like the other text cells; pr/21: setting "Enter adds a new row in database tables" (off by default) |
| F-05 | Table view: indent / outdent keys don't work | B | fix | db-view | med | built | pr/19 `fix(database): Mod-Shift-. / Mod-Shift-, indent…`; 2026-11-17 live: did nothing in plain tables (no hierarchy columns) and from Notes cells, fixed in pr/19 `fix(database): indent and outdent rows in every table…`; tests `database-table-indent-keys`, `list-indent-shortcut` |
| F-06 | Table view: three clicks to edit a text cell | B | upstream fix | db-view | med | built | `working/fix/keep-editor-focus`: a late selection update took focus out of the cell being edited (traced live on a long page with references); test `database-cell-keeps-focus.spec.ts` |
| F-07 | Deleting a selection that starts at the first character deletes the wrong text (paragraphs and cells) | C | upstream fix | selection | high | built | live 2026-11-17 (Firefox): multi-line Notes cell, only line 1 deleted; paragraphs fine. Upstream bug (element-boundary target range read as end of line 1): `fix/inline-boundary-range`. Jasper's second case (selection leaving the first paragraph) still to record |
| F-08 | Slowdowns: large pages, typing in large database cells | D | interactive debug | perf | med | existing | backlog 999.18 |
| F-09 | Mobile Journal Todo: drag indicator/lines sometimes missing while dragging a row | E | debug | journal-todo | med | triaged | 999.18 (drag) |
| F-10 | Frame render options (grid, inner frames, notes) can't be found; add tests | F | feature | edgeless | med | built | pr/13: Show Grid/Frames/Notes in both Frame size menus; tests in `frame-sizing.spec.ts` |
| F-11 | Copy several Journal Todo rows: paste into another journal, paste as Markdown todo list | G | 999.x | journal-todo | med | built | pr/22: select rows (table, and now List view / Journal Todo: Escape, Shift+arrows, handle click), copy in 3 formats + rows, paste as new rows. Device check pending. See *F-11 design* below |
| F-12 | PWA: restore page and scroll position after iOS reloads the app | G | 999.x | pwa | med | triaged | pr/41 |
| F-13 | Database: how to add a paragraph after a database block | G | upstream fix | db-view | low | built | `working/fix/database-escape-to-block`: Escape ×3 from a cell selects the block, Enter adds a paragraph |
| F-14 | pr/02–pr/07 don't type-check on their own | H | quick (stack) | stack | high | done | 4 files moved down from later branches; all 26 published branches type-check alone |
| F-15 | Other failing unit tests: database ancestor promotion, shape-browser ordering, typst timeout | H | fix | stack | med | built | shape-browser + typst in pr/10; cascade rule in pr/19 (child reverts, confirmed 2026-11-14) |
| F-16 | affine-pr-docs much more complete (Todo columns, Todo→Database, indentation, Kanban promotion and menus, due dates) | I | docs | docs | med | built (draft) | new page `guide-tasks.md` (how-to with the real menu labels); pr-19 page already lists the features |
| F-17 | Mobile (prod): Enter on a to-do item often inserts a newline instead of a new item; clicking away and back fixes it | C | interactive debug | selection | high | triaged | 2026-11-17 report; same symptom as F-18 |
| F-18 | Mobile (prod): Enter in a heading inside a referenced note inserts a newline in the heading instead of a new paragraph; clicking away and back fixes it | C | interactive debug | note-ref | high | triaged | 2026-11-17 report; hypothesis below |
| F-19 | Mobile (prod): a strange box appeared in a referenced note after typing `)` and Enter; hard or impossible to delete on mobile | C | interactive debug | note-ref | med | triaged | 2026-11-17 live (prod, journal Nov 17): a `note-ref` inside a list item points at a hidden EdgelessOnly note holding an **orphaned empty "Journal Todo" database** (0 rows, **no views**, nothing references it; today's Journal Todo is a view-ref to another page's table). Two bugs: the orphan is left behind (journal-todo setup / source selection, pr/19), and the note-ref picker offers it (it only excludes hidden notes that a `database-ref` points at). Trigger (`)` + Enter on mobile) still unknown |

### Groups

**A. Reactivity (F-01, F-02, maybe F-03).** *Update 2026-11-13: F-01 and
F-02 turned out to be separate. F-01: pr/18 deferred every prop-signal write
to a microtask; now synchronous again, under each view's mutex (fixed in
pr/18). F-02: pr/19's column lookup read the raw `columns` prop, so cells had
no reactive dependency on it (fixed in pr/19, with an integration test that
fails without the fix; passes on canary and pr/18). F-03 doesn't reproduce
in a 60-row desktop table, by data or by the Backspace path: need your steps.*
Original notes: Five store unit tests fail with
values not updating after nested or deep prop changes (e.g. `{color: 'red'}`
where `'yellow'` is expected). Our store changes are pr/18's
`sync-controller.ts` and `reactive/proxy.ts`. Database select options and
their colours are nested props, which fits "labels don't show until redraw".
A whole-view re-render instead of a fine-grained update could also explain
the jump to the top on row deletion. The failing tests are already the red
tests: fix in pr/18, then re-check F-02/F-03 on device.

**B. Table-view keyboard and editing (F-04, F-05, F-06).** *Update
2026-11-13: F-04: upstream's title cell stops Enter from reaching the
table's own hotkey (which means "leave the cell and move down"), so Enter
inserted a newline; fixed on a new upstream-fix branch
`working/fix/table-title-enter` (published `fix/table-title-enter`). Shift+Enter
stays the newline. F-05: our indent/outdent shortcuts were bound as
`Mod-Shift-Period`/`Mod-Shift-Comma`, names the keymap never produces, so
they never fired (table, List view and list blocks); now `Mod-Shift-.` /
`Mod-Shift-,`, and they also work while a title is being edited. Tab in a
table still moves to the next cell. F-06 doesn't reproduce: need steps.*
Original notes: Our stack changes
the table's hotkeys, selection and the title cell. Found so far: in the table
view the title cell swallows Tab completely (List view lets it through), and
the table's indent keys are Mod-Shift-. / Mod-Shift-,. Enter and triple-click
need the canary check first: if upstream behaves the same, it's a separate
upstream fix; if not, we fix it in pr/19.

**C. Selection and deletion (F-07).** Same area as the parked multi-line
selection regression and the multi-row selection todo
(`AFFiNE/.planning/todos/pending/2026-10-01-multi-row-text-selection-in-database-rows.md`).
Needs a live session: reproduce, capture the selection state, then a test.
*Probe ready (2026-11-15):* `tools/live/f07-delete-probe.js` logs every
delete key / beforeinput with the native range, BlockSuite's selection and
the block text before and after; report with `f07-delete-report.js`.

**F-17, F-18 (Enter gives a newline).** Hypothesis, from reading: Enter
reaches the editor's keymap (which splits the item or paragraph) only while
that editor host's event dispatcher is *active*. If it isn't (focus moved
into a nested editor such as a referenced note, or the keyboard toolbar,
without the host noticing), the key falls through to the inline editor's
`beforeinput` (`insertParagraph`), which inserts a newline in the text.
Clicking away and back re-activates it, which matches the workaround. Test
live: log `std.event.active` of each `editor-host` on Enter.

**D. Performance (F-08).** Already backlog 999.18. Needs a live session with
a large page and profiling. *2026-11-17:* Jasper has a production page with
very large database cells where typing slows as a cell grows; that page is
the case to profile. Firefox has no long-frame API, so attribution needs
Chrome, or timing wrappers on the suspect code (cell re-render, Yjs text
observers, the inline editor's render) installed through the probe.

*Live session 2026-11-17 (prod, Firefox, "Pain body worksheets": 46 rows,
one cell of 227k chars / 1,001 lines, 23.7k DOM nodes).* Key press to next
frame: big cell ~450 ms (first frame 200-270 ms on every other key), short
cells 60-90 ms. No single long task: it is many updates per key.

1. **The inline editor re-renders the whole text on every key** (upstream
   `RenderService.render`): every line gets a new `elements` array and new
   absolute offsets, so ~2,000 `v-line`/`v-element` updates per key in the
   big cell. Cost grows with the cell's size.
2. **Every key in any cell re-renders all the table's select cells**: 92
   `affine-database-multi-select-cell` updates per key (46 rows x 2); a
   cell seems to get a new value whenever any cell changes.

Plan agreed with Jasper (2026-11-17): **fix (2) first, then (1)**, each with
a failing test that counts updates per key, the canary check, then a
before/after measurement on the same page. To start after the interactive
tests (F-19, F-17/F-18, F-09) are done. Probes: `tools/live/f08-*`; the
lite timing in this note's figures (the heavy profilers inflate times).
*Probe ready:* `tools/live/f08-perf-probe.js` (key-to-frame times by where
the caret is, worst long animation frames with script attribution, page
size); report with `f08-perf-report.js`.

**E. Mobile drag indicator (F-09).** Intermittent, mobile only. Same code
area as 999.18's slow row dragging.
*Probe ready:* `tools/live/f09-drag-probe.js` samples every frame of a row
drag (drop line and ghost present, pointer y); report with
`f09-drag-report.js`. The line is removed whenever the controller finds no
insert position under the pointer, which is the first suspect.

**F. Frame render options (F-10).** pr/13 added show/hide grid, inner frames
and notes, but they appear only in the edgeless Properties panel (select the
frame, … menu → Properties). The frame embed's own toolbar in a page has
only the size options. Decide where they belong, then add them with e2e tests.

**G. Features (F-11, F-12, F-13).** New behaviour: each gets a short design
note before code. F-13 may already work upstream in a way that isn't obvious.

**H. Stack hygiene (F-14, F-15).** *Update 2026-11-13: F-14 done. F-15:
the shape-browser test used a stale fake `this` and an outdated list; the
typst test's bare Vite server crawled the repo's .html files into the
playground and pr/10's generated stencil tables (~4.7 M lines of TS), taking
30 s on its own: both fixed in pr/10. Also removed 20 test-failure
screenshots committed into pr/18, pr/19, pr/30 and moved pr/19's
`.gitignore`/rebuild-script changes to N-build. The database cascade test
needs a decision (Open questions).* No user-visible change; needed before the
next upstream publish.

**I. Docs (F-16).** Independent of code; can run in parallel.

## Open questions

- **F-16:** is the new *Guide - tasks and the Journal Todo* page the kind of
  completeness you meant? It needs screenshots and a check against the app.
- **F-04 / F-05 device check:** Enter and Shift+Enter in a table title cell;
  Mod-Shift-. / Mod-Shift-, in a table, the Journal Todo and a bulleted list.
- **F-01 / F-02 device check:** labels and colours in a table; and inline
  equations on a page that also has a reference (the case the old
  microtask deferral was added for).

- **F-10:** where should the frame render options be? Options: the frame
  embed's toolbar in the page (next to size), the frame's own toolbar in
  edgeless, or both.
- **F-13:** what do you do today to get a paragraph after a database block,
  and what would you expect (Enter on the last row? click below? an arrow
  key)? I'll check what upstream does.
- **F-11:** when pasting rows into another journal, should they become new
  rows in that journal's todo table, or references to the same tasks?
- **F-04:** which behaviour do you want in a table cell: Enter = next row and
  Shift+Enter = newline (spreadsheet style), or Enter = newline? I'll compare
  with upstream first.

<!-- Questions Claude raises during triage that need Jasper's decision. Answer inline. -->

## Flaky tests (not caused by recent changes)

- Integration (BlockSuite) baseline, 2026-11-15: with the default config,
  `edgeless/last-props.spec.ts` "shapes" and four `mobile/*` files fail on
  both the old (pre-migration) and current stack; the mobile files belong to
  `vitest.mobile.config.ts`. With that config, only
  `keyboard-enter-focus-loss.spec.ts` "pressing Enter on an empty root-level
  row…" fails (also on the old stack). `slash-menu-touch.spec.ts` can fail
  in a full run but passes on its own. Parallel full runs make focus tests
  interfere: use `--no-file-parallelism`.
  2026-11-17 full run: `edgeless/mindmap.spec.ts` (3 tests) also failed in
  the parallel run but passes on its own, with and without the change.

- `blocksuite/framework/store/src/__tests__/parent-lookup.unit.spec.ts` "repeated
  lookups do not walk the whole document": spies on global Yjs methods, so it
  can count calls from other tests running alongside; passes on its own.
- `share-import-controller.spec.tsx` "retains the original image preview…":
  fails only under load.

## F-11 design (copy rows)

Copying selected rows (List view / Journal Todo, and table rows) puts three
formats on the clipboard, so each target picks the one it understands:

- **AFFiNE:** the rows as to-do list items, nesting kept. Pasted into a
  page they become a to-do list; pasted into another journal's Journal Todo
  (or any task table) they become **new rows** (new tasks, not references),
  keeping status, hierarchy and the optional fields.
- **text/plain, Markdown:** `- [ ] task` / `- [x] done task`, two spaces of
  indent per level. Works in any text editor or Markdown app.
- **text/html:** a nested `<ul>` with `<input type="checkbox" checked>`
  items, for rich-text apps.

Selecting several rows first needs row multi-select in the List view (the
pending todo on multi-row selection). Answers 2026-11-14: new rows, not
references.

*2026-11-15:* tables done in pr/22 (`working/pr/22-copy-rows`). Pasting into
a page uses an AFFiNE block snapshot rather than the HTML, because the HTML
and Markdown importers drop the ticks. Paste into a table inserts after the
last selected row; levels are relative to that row. Still to do: List view
(Journal Todo) row multi-select, then the same copy and paste there via the
shared `rows-clipboard.ts` helpers.

*2026-11-15, later:* List view done too (second commit on pr/22): Escape in
a row selects it, Shift+Up/Down extends, handle click / Shift+click /
Ctrl+click, Enter edits, Escape again selects the block. Paste of copied
rows works with rows selected or while typing in a row (after that row).
Tested inside a reference too. Not done: Delete on selected rows, Tab to
indent them, drag-selecting text across rows.

## Raw reports (triaged 2026-11-13)

### No drag indicator or drag lines in Journal Todo in mobile when dragging row
Sometimes, not all the time

### Database table view in desktop, created labels do not show until page redraw, same with change of color

### Database table view in desktop, triple click to get to edit a row

### Database table view in desktop, enter for new row? Shift enter for new line within row - keep it standard! Not sure on Mobile?
- Inconsistent, behaviour changed at some point so so enter was newline. Previoulsy required shift enter and enter returned the cell to selected rather than editing
- Check tests against upstream, if this is an introduced error then fix in place, otherwise new PR/fix

### Database, how to get a newline after the block?

### PWA: Can it store page and place on page so that when iOS reaps it and pwa reloads that we're back where we were?

### Database table view indent/non-indent keys not working

### Database table jump to top of table on deletion of row

### Frame resize: I cannot find the options for showing or hiding grid etc. in frame, where where they, where should they be? Lets have tests for this!

### (New feature): Journal/Todo: I need to be able to copy multiple rows so that I can 1) Paste into another journal, and 2) Paste as plain text (markdown todo list)

### Update affine-pr-docs to be much mo
re complete
At least:
- All the Todo list changes - columns etc.
- Todo to Database 
- Database indentation
- To Kanban for promotion
- Kanban/database promotion menu items
- Due Date in Journal

### Fixes that may require interactive debug session
- Slowdowns on large pages
- Slowdowns in large database cell entry
- Selecting text that includes the first character and deleting, deletes the unselected text, or more accuratley, it deletes what looks to the user like random text. This is also prevalent in Database cells as well as in normal paragraph.

### Unit tests failing on the stack (found in the 2026-11-13 migration run)
- Where: `yarn vitest run` on `working/pr/N-build`; all also fail on the old `pr/N-build`, so not caused by the migration
- Pri: med
- Notes:
  - `blocksuite/affine/all/src/__tests__/database/database.unit.spec.ts`: "promotes ancestors from descendant done and cascades todo without overwriting manual done descendants" (pr/19 area)
  - `blocksuite/affine/gfx/shape/src/__tests__/shape-browser-library.unit.spec.ts`: "places drawio categories after base ordering": `this._getFilteredItems is not a function` (pr/09/10 area)
  - `blocksuite/framework/store/src/__tests__/block.unit.spec.ts`: 5 tests (signal props atom/nested/stash-and-pop, deep sync, shared array splice): store change in our stack (pr/50 or pr/18?)
  - `packages/frontend/core/src/modules/code-block-preview-renderer/typst-preview.integration.spec.ts`: 30 s timeout; passes on plain canary, so something in our stack
  - Flaky under load: `share-import-controller.spec.tsx` "retains the original image preview…" (passes alone)

### pr/02-pr/07 don't type-check on their own (found 2026-11-13)
- Where: each generated branch alone (`yarn typecheck` in a worktree of it); the old branches failed the same way
- Pri: high (upstream merges them one at a time)
- Notes: errors disappear at pr/08, so code or tests sit one branch too low or a needed change sits too high.
  - pr/02, pr/03: `tests/blocksuite/e2e/edgeless/color-palettes.spec.ts` uses `gradientFinal` / `gradientDirection` on a helper's return type that doesn't have them yet
  - pr/05: `blocksuite/affine/components/src/edgeless-shape-color-picker/color-picker.ts` calls with 2 arguments where 3 are expected
  - pr/06: the same, plus `edge-nodes.spec.ts`
  - pr/07: the same, plus `edgeless-auto-complete.ts`
  - Re-check with `tools/stack-typecheck pr/02-color-palettes …`
