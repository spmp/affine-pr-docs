---
title: Fix register
parent: Process
nav_order: 6
permalink: /process/fix-register/
---

# Upstream-bug fixes
{: .no_toc }

Bugs in upstream AFFiNE that we fixed: the test failed on plain `canary`
(see [The canary check](../fixes/#the-canary-check)). Each has its own
`working/fix/*` branch at the bottom of the stack, an upstream issue, and an
upstream PR from the generated branch. Fixes to our own features are not
listed here; they're in each PR page's **Changes**.

| Fix | Symptom | Test | Canary check | Issue | PR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `editor-setting-fallback` | Customised editor settings reset to defaults when a setting gains a new field | `parse-setting-with-fallback.spec.ts` | 2026-11-13: fails differently on canary (the tested function is new); the bug is in upstream's `watchAll()` by reading. A behaviour test through `watchAll()` would make it firm. | — | — | pending |
| `keep-editor-focus` | A database cell being edited loses focus on a later selection update, so typing goes nowhere and a third click is needed | `database-cell-keeps-focus.spec.ts` | 2026-11-15: fails on canary the same way | — | — | pending |
| `inline-container-selection` | Deleting table rows jumps the page to the table's first row: a selection left on a wrapper of the table made every title editor claim the caret | `inline-container-selection.spec.ts` | 2026-11-14: fails on canary the same way | — | — | pending |
| `database-escape-to-block` | No keyboard way to select a database block (Escape cycles cell ↔ row), so no way to add a paragraph after a table followed by a heading | `database-paragraph-after.spec.ts` | 2026-11-14: the Escape path is identical upstream | — | — | pending |
| `table-title-enter` | Enter in a table title cell inserts a newline, while every other text cell finishes editing | `database-table-cell-keys.spec.ts` | 2026-11-13: fails on canary the same way | — | — | pending |
| `store-parent-index` (published as `pr/50-store-parent-index`) | Parent and root lookups walk the whole document; typing on long pages is slow | `parent-lookup.unit.spec.ts` | 2026-11-13: fails the same way (20,300 walks, < 5 expected) | — | [#15845](https://github.com/toeverything/AFFiNE/pull/15845) | open |
| `toast-container` (published as `pr/51-toast-container`) | Toasts stop showing after leaving the page they first appeared on; a redirect can be undone | `browser-adapter.spec.tsx` | 2026-11-13: fails the same way (the redirect is undone) | — | [#15846](https://github.com/toeverything/AFFiNE/pull/15846) | open |

Status: `pending` → `issue opened` → `open` (PR) → `merged` (drop the working
branch at the next rebase) or `closed` (decide: keep in the fork or drop).
