---
title: Plain-text formats
nav_order: 97
permalink: /plain-text-formats/
---

# Plain text and Markdown the fork writes
{: .no_toc }

Every place this fork's features put plain text or Markdown somewhere (the
clipboard so far), what exactly it writes, and what is lost. Input for the
PRs in the 60s (Markdown export and import, server- and client-side
creation of Markdown documents from a workspace), whose aim is the lowest
loss and the widest transport for every item on an AFFiNE page. Keep this
page up to date as features change.

1. TOC
{:toc}

## Clipboard: database rows and cells (pr/22, F-11)

How rows are selected and where each format pastes:
[pr/22](../pr-22/#how-to-select). AFFiNE itself pastes from its own
clipboard types (`blocksuite/database/rows`, `BLOCKSUITE/SNAPSHOT`), so the
plain text below is what **other** apps get.

| Copied | `text/plain` | `text/html` | Lost in plain text |
| --- | --- | --- | --- |
| Table rows | GFM Markdown table of the view's shown columns, padded so the columns line up, header row from the column names; done column `[x]` / `[ ]`; `\|` escaped; line breaks in a cell as `<br>` | `<table>` with `<thead>`, line breaks as `<br>` | indent levels (a table cell can't hold leading spaces); hidden columns; cell types (a date is its display text) |
| List view rows (Journal Todo) | GFM task list: `- [ ] title`, `- [x] title`, two spaces per indent level; the List view's shown fields follow the title, each after a **tab**; trailing empty fields dropped; tabs and line breaks inside a field become a space | nested `<ul>` with a disabled checkbox per item, fields after the title separated by tabs | field names (positional only); line breaks in fields |
| One column of cells (table) | `- value` per line, empty cells left out, line breaks as a space | (none) | which column it was; empty cells |
| Several columns of cells | GFM Markdown table of those columns, padded (as table rows) | `<table>` of those columns | as table rows |

## How upstream already exports these (for comparison)

- A **database** block in upstream's Markdown export is a GFM table with
  the column names as the header
  (`blocksuite/affine/blocks/database/src/adapters/markdown.ts`), so the
  clipboard's table form matches it.
- **To-do list** items export as `- [ ]` / `- [x]`
  (`blocksuite/affine/blocks/list/src/adapters/markdown.ts`), which the
  List view form matches.

## Open questions for the 60s

- **Hierarchy in tables:** a Markdown table can't show task levels. Options:
  a level column, a prefix in the title (`↳`, non-breaking spaces), or a
  task list instead of a table when the table has levels.
- **Fields after a task:** tabs are compact and paste into spreadsheets
  split, but have no names. Alternatives: `key:: value` (Logseq/Dataview
  style), `(due 2026-11-20)`, or a trailing table.
- **Round trip:** pasting our own plain text back into AFFiNE goes through
  the Markdown import: a pasted Markdown table becomes a table, a task list
  a to-do list. Should importing a task list with tab-separated fields
  rebuild the fields?
- **References, notes, journal links** on rows (pr/19) have no plain-text
  form yet.
