---
title: Guide - tasks and the Journal Todo
nav_order: 98
permalink: /guide-tasks/
---

# Using tasks, databases and the Journal Todo
{: .no_toc }

How to use the task features from [pr/19](pr-19/) (with [pr/18](pr-18/)'s
references and [pr/30](pr-30/)'s mobile toolbar). Each step names the actual
menu item. Draft of 2026-11-13, written from the code: check it against the
app and correct anything that reads differently on screen.

1. TOC
{:toc}

## Start a task list

- **In a page:** type a to-do list as usual (`[]` + space). Indent and
  outdent items with **Tab** / **Shift+Tab**, or **Cmd/Ctrl+Shift+.** /
  **Cmd/Ctrl+Shift+,**.
- **Optional fields on items** (a date, a cost, a progress bar…): the
  to-do list's toolbar has a **Settings** button. Choose the fields, their
  layout (inline, aligned, right), and how ticks map to a database status.
- **Ticking:** ticking every child ticks the parent; unticking a child
  unticks it again, through every level.

## Turn a to-do list into a database

Select the list, then **Create Table** in the selection toolbar. Order,
parent/child structure and the optional fields are kept; ticks become the
status column (named per the list's settings: status column, Done label,
Not-done label).

## Work with tasks in a database

- **Indent / outdent a row:** the row menu's **Indent Row** / **Unindent
  Row**, **Cmd/Ctrl+Shift+.** / **Cmd/Ctrl+Shift+,**, or drag the row by its
  handle. In a table, **Tab** moves to the next cell, as in a spreadsheet.
- **Edit a cell:** click to select, click again (or press **Enter**) to
  edit. While editing, **Enter** leaves the cell and moves down; **Shift+Enter**
  is a new line.
- **List view:** add a List view to see the table as a checklist that types
  like a to-do list (Enter splits a row, Backspace at the start merges it
  into the row above, drag handles reorder and re-indent).

## Select rows

**In a table:**

- **Click the checkbox** at a row's left (hover to see it). Each click adds
  or removes that row.
- **From the keyboard:** while typing in a cell, **Escape** stops editing
  (the cell is selected); **Escape** again selects the cell's row;
  **Shift+↑/↓** adds rows above or below; **Escape** once more selects the
  whole database, and **Enter** then adds a paragraph after it.
- **A block of cells:** click a cell, then **Shift+click** another (or
  drag, or **Shift+arrows**).

**In a List view (the Journal Todo):**

- While typing in a row, **Escape** selects the row (it turns light blue).
- Or **click the grip** at the row's left (hover to see it).
  **Shift+click** another grip selects the rows between; **Ctrl/Cmd+click**
  adds or removes one row.
- **Shift+↑/↓** extends the selection, **↑/↓** moves it, **Enter** goes
  back to typing in the row, **Escape** selects the whole database.
- Dragging the grey selection square over the list selects the whole
  database block, not rows.

**On a phone (Journal Todo and tables):**

- **Long-press a row** (hold still about half a second): it turns light
  blue and a bar appears at the bottom.
- **Tap** other rows to add or remove them.
- **Tap Copy** in the bar (a database when pasted into a page), or **hold
  Copy** to copy as text (plain to-do items or a standard table), then
  **Done**.
- To paste rows: long-press inside a row's text (or a page paragraph) and
  choose **Paste**.

## Copy and paste rows

Select rows (above), **Ctrl/Cmd+C**, then:

- **Into another table or Journal Todo:** click into a row (or select one)
  and **Ctrl/Cmd+V**. The rows are added **as new tasks** after that row,
  with their indent and done state. They are copies; the originals stay
  where they were.
- **Into a page:** click into a paragraph and paste.
  - Rows from a **table** become a **new table** of just those rows, with
    all their columns.
  - Rows from the **Journal Todo** (List view) become a **new database in
    List view** with just those rows, like a small Journal Todo.
  - For plain items instead, on the phone **hold Copy** (copy as text) and
    paste: a to-do list from the Journal Todo, a standard table from a
    table.
- **Into another app:** rows from a table paste as a Markdown table (or a
  real table in a spreadsheet or rich-text editor); rows from the Journal
  Todo as `- [ ] task` lines, with the shown fields after each task,
  separated by tabs.
- **One column of cells** copies as a simple list, `- value` per line.

The exact formats: [Plain-text formats](plain-text-formats/).

## Keys in a table

- **Enter** finishes editing a cell. To make Enter add a new row below
  instead (in title, text and number cells), turn on **Settings → Editor →
  General → Enter adds a new row in database tables**. **Shift+Enter** is a
  new line inside a text cell either way.
- **Tab / Shift+Tab** move to the next / previous cell.
- **Cmd/Ctrl+Shift+.** / **Cmd/Ctrl+Shift+,** indent / outdent the row,
  from any cell, in any table (a table made from scratch gets its task
  hierarchy the first time a row is indented).

## Let parents follow their subtasks

In the table or Kanban menu, **Parent status behavior** sets the rules for
that table (the defaults are in **Settings → Editor**, section *List,
Database, and Kanban*):

| Menu item | What it does |
| --- | --- |
| **Done when all children are done** / **Disable parent done inheritance** | A parent becomes Done when all its subtasks are Done, or not. |
| **Disable parent progress inheritance** | Stops a parent moving to In Progress when a subtask starts. |
| **Auto-demote auto-derived Done** / **Keep auto-derived Done locked** | Whether a parent that became Done automatically goes back when a subtask is reopened. A parent you set to Done yourself stays Done. |
| **Manual Done cascades to descendants** / **Manual Done does not cascade** | Whether setting a parent to Done by hand sets all its subtasks to Done. |

## Promote tasks on a Kanban board

- Add a **Kanban** view. Its columns come from the Kanban column list in
  **Settings → Editor** (`Label:status` pairs, such as Todo, In Progress,
  Done). Moving a card between columns changes its status, and the parent
  rules above apply.
- Narrow the board by level (All, 0–5), or to **Show children** /
  **Show descendants** of one parent.

## The Journal Todo

- **Insert it:** `/Journal Todo` in a journal page (on a phone, the keyboard
  toolbar's database group). It shows one shared task table, filtered to
  that day.
- **Choose the table:** **Set Journal Todo Table** (use an existing table) or
  **New Journal Todo Table** (start a fresh one; if it replaces an earlier
  one you're asked **Copy undone tasks?**).
- **In the journal template:** put a Journal Todo in the template, and each
  new day's journal gets one pointing at the current table.
- **Notes on a task:** the row menu's **New note** or **Link existing note**.
- **Due dates:** the Due date column is hidden by default; **Show "Due date"
  in Journal todo** in settings makes new ones visible. Overdue unfinished
  tasks are highlighted (or hidden, per **Highlight after due date**); done
  tasks get a done date and leave the calendar unless *Hide from calendar
  when done* is off.

## Move a table

**Move to page...** in the table's menu moves it to another page; every
reference keeps working.
