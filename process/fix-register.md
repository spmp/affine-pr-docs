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
| `editor-setting-fallback` | Customised editor settings reset to defaults when a setting gains a new field | `parse-setting-with-fallback.spec.ts` | pending | — | — | moving from pr/00 |
| `store-parent-index` (published as `pr/50-store-parent-index`) | see [pr/50](../../pr-50/) | — | pending | — | [#15845](https://github.com/toeverything/AFFiNE/pull/15845) | open |
| `toast-container` (published as `pr/51-toast-container`) | see [pr/51](../../pr-51/) | — | pending | — | [#15846](https://github.com/toeverything/AFFiNE/pull/15846) | open |

Status: `pending` → `issue opened` → `open` (PR) → `merged` (drop the working
branch at the next rebase) or `closed` (decide: keep in the fork or drop).
