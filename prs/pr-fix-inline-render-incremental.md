---
title: fix/inline-render-incremental
nav_order: 1
permalink: /pr-fix-inline-render-incremental/
---

# fix/inline-render-incremental: Don't redraw unchanged lines on every edit
{: .no_toc }

Branch `fix/inline-render-incremental` · base `canary` · 2 files, +222 −40 · 249 files against canary
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="fix-inline-render-incremental" %}

## Why

Typing in a large multi-line text, such as a database cell with a few
hundred lines, got slower as the text grew. Measured live (F-08,
2026-11-17): a cell of 227,000 characters and 1,001 lines took about
450 ms from key press to the next frame, with about 2,000 line and element
updates per key.

## What happens

`RenderService.render` (inline editor) rebuilt the template of **every**
line on every edit. Each line got a new `elements` array and each element
a new `delta` object, so Lit updated every `v-line` and `v-element`.

## What changes

`render` keeps each line's template with what it was made from (start
offset, text, attributes) and reuses it when those are unchanged; Lit then
sees identical values and skips the line. Typing at the end of a text
updates only that line; in the middle, the lines from the caret on (their
start offsets move, and LaTeX nodes use absolute offsets, so they must
update). The cache is cleared when the attribute renderer changes and by
`rerenderWholeEditor`.

Making edits in the middle constant-cost too would mean lines holding
relative offsets: a bigger change, left for later.

## Testing

`blocksuite/integration-test/src/__tests__/inline-render-incremental.spec.ts`
(300-line cell): 3 keys at the end, 900 line updates before, at most 6
after; 1 key in the middle leaves the lines before it alone (300 before,
about 150 after). Fails on canary the same way. Also run: the std unit
tests (107), the full desktop and mobile integration suites (no new
failures).

## How to check it by hand

A database cell (or any multi-line text) with hundreds of lines: typing at
the end should feel as quick as in a short cell; in the middle, quicker
than before.

## Changes

- None yet.

## Open items

- Open the upstream issue and PR.
- Middle-of-text edits still scale with the lines after the caret.
