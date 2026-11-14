---
title: pr/18a Note settings in the Properties panel
nav_order: 18.5
permalink: /pr-18a/
---

# pr/18a: Note settings in the Properties panel
{: .no_toc }

Branch `pr/18a-note-properties-panel` · base `pr/13 + pr/18` · 2 files, +114 −2 · 278 files against canary
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="18a" %}

1. TOC
{:toc}

## Why

[pr/18](../pr-18/) adds note fields (a name, an in-page background override,
an in-page border). The edgeless Properties panel comes from
[pr/12](../pr-12/). Showing the note fields in that panel needs both, so it
lives in this small branch instead of in pr/18. That way pr/18 applies
straight onto `canary` and can be reviewed on its own.

## What changes

- A **Note** section in the Properties panel: name, fill colour, in-page
  background override and colour, in-page border, and shadow.
- The panel (`EditorObjectPropertiesPanel`) opens for a selected note as well
  as for shapes and connectors.

Files: `blocksuite/affine/blocks/root/src/edgeless/configs/toolbar/properties-modal.ts`,
`packages/frontend/core/src/desktop/pages/workspace/detail-page/tabs/object-properties.tsx`.

## Changes

Changes since the PR was first offered, newest first (see the
[definition of done](../process/#definition-of-done)).

- None yet.

## Open items

- Not offered upstream yet: it depends on both pr/13 (which also edits the
  Properties panel) and pr/18. Open it once those merge; until then it is
  reviewed inside the fork.
