---
title: fix/inline-boundary-range
nav_order: 1
permalink: /pr-fix-inline-boundary-range/
---

# fix/inline-boundary-range: Deleting a selection in a multi-line cell (Firefox)
{: .no_toc }

Branch `fix/inline-boundary-range` · base `canary` · 3 files, +204 −3 · 250 files against canary
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="fix-inline-boundary-range" %}

1. TOC
{:toc}

## Why

In Firefox, selecting several lines of a multi-line database cell (Notes,
any rich-text cell) and pressing Backspace deleted **only the first line**
of the selection; the rest stayed. The same selection in a paragraph was
fine. Found in a live session (F-07, 2026-11-17): the selection ran from the
end of line 6 back to the first character; only line 1 went.

## What happens

- A cell's inline editor applies Backspace in its `beforeinput` handler.
  When the browser gives `getTargetRanges()`, that range is converted and,
  if it differs from the selection, used instead.
- Firefox gives the range on the editor's root element, as (root, child
  index): `(root, 0)` to `(root, 20)`, not inside text nodes.
- `nativePointToTextPoint` resolved such a point "roughly": offset 0 is the
  start of the first text, **any other offset is the end of the first
  text**. So `(root, 20)` became the end of line 1, and the delete covered
  line 1.
- Paragraphs handle Backspace on keydown, before `beforeinput`, so they
  never took this path. Chromium gives text-node boundaries, so it never
  hit it either.

## What changes

When a DOM range is converted (`domRangeToInlineRange`), a boundary given
as (root or line element, child index) is resolved by side: the range's
**start** is the start of the first text at or after that child, its
**end** is the end of the last text before it. Code that converts a single
point (no side) keeps the old behaviour.

Files: `blocksuite/framework/std/src/inline/utils/point-conversion.ts`,
`range-conversion.ts`, and the test.

## Testing

`blocksuite/integration-test/src/__tests__/database-cell-delete-selection.spec.ts`:

- forward and backward selections from the first character, over two and
  three lines, and over blank lines (the live text): pass before and after
  (Chromium gives text-node boundaries);
- **"a delete whose target range is given on the editor root element"**:
  sends the `beforeinput` Firefox sends (root, 0 → root, child after the
  last selected line). Fails on canary (only the first line deleted), passes
  with the fix.

Also run: the inline unit tests (`blocksuite/framework/std/src/__tests__/inline`,
29 tests) and the full desktop integration suite (no new failures; see the
baseline in the inbox).

## How to check it by hand

Firefox, any page: add a database, a rich-text column (Notes), and in one
cell type four lines with Shift+Enter between them (blank lines too).
Select from the end of the third line back to the very first character
(or forwards), press Backspace: the selected lines go, the fourth stays.

## Changes

Changes since the PR was first offered, newest first (see the
[definition of done](../process/#definition-of-done)).

- None yet.

## Open items

- Open the upstream issue and PR (draft below).
- Device check by Jasper in Firefox after the next build.

## Upstream issue (draft)

> **Deleting a multi-line selection in a database rich-text cell deletes only the first line (Firefox)**
>
> In Firefox, in a database table rich-text cell with several lines
> (Shift+Enter), select from the first character over two or more lines
> and press Backspace: only the first line of the selection is deleted.
>
> Cause: the inline editor's `beforeinput` handler prefers
> `event.getTargetRanges()`. Firefox reports the range on the inline root
> element, e.g. `(root, 0)`–`(root, 20)`. `nativePointToTextPoint` resolves an
> element point with a non-zero offset to the end of the **first** text node,
> so the end of the range becomes the end of line 1.
