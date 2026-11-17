---
title: fix/cell-value-rerender
nav_order: 1
permalink: /pr-fix-cell-value-rerender/
---

# fix/cell-value-rerender: Typing in one cell redraws every select cell
{: .no_toc }

Branch `fix/cell-value-rerender` · base `canary` · 2 files, +125 −2 · 248 files against canary
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="fix-cell-value-rerender" %}

## Why

Typing in any database cell re-rendered every select / multi-select cell in
the table on every key: 92 updates per key on a 46-row table (F-08, live
session 2026-11-17). On a large page that is part of why typing feels slow.

## What happens

A cell's value is read through its property's schema (`zod` `safeParse`),
which returns a **new** array or object on every read. Any change to the
database recomputes every cell's `value$`, so a multi-select cell gets a
"new" array with the same ids and re-renders.

## What changes

`CellBase.value$` (`data-view/src/core/view-manager/cell.ts`) keeps the
previous value when the new one is the same, or an array / plain object
with the same items, so nothing downstream sees a change.

## Testing

`blocksuite/integration-test/src/__tests__/database-cell-rerender.spec.ts`:
5 keys in a Notes cell of a 6-row table with tags: 30 select-cell updates
before, 0 after. Fails on canary the same way. Also run: data-view and
database unit tests (248), the database integration specs (131).

## How to check it by hand

A table with a multi-select column filled in on many rows and a text
column: type in a text cell. Before, a performance recording shows every
select cell updating per key; after, none.

## Changes

- None yet.

## Open items

- Open the upstream issue and PR.
