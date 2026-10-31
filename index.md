---
title: Overview
nav_order: 0
permalink: /
---

# AFFiNE fork: PR notes
{: .no_toc }

This site explains the pull requests from the
[spmp/AFFiNE](https://github.com/spmp/AFFiNE) fork that are being offered to
[upstream AFFiNE](https://github.com/toeverything/AFFiNE). Each PR's
description on GitHub is short and links to its page here. The page has the
full explanation, screenshots and review notes.

Last updated: 2026-10-31, after the rebase onto upstream `canary`.

## How the PRs relate to each other

The fork carries its work as one **linear stack** of branches on top of
upstream `canary`. Each branch holds one feature or theme and is based on the
branch before it:

```
canary
└─ pr/00  tidy-up and tools
   └─ pr/02 … pr/17   edgeless canvas and export features
      └─ pr/18  reusable blocks (note and database references)
         └─ pr/19  to-do lists, databases and the Journal Todo
            └─ pr/30, pr/31   mobile
               └─ pr/40, pr/41, pr/42   server and PWA
                  └─ pr/50, pr/51   standalone engine fixes
                     └─ pr/N-build   fork-only build and deploy
```

A PR can depend on the branches below it, so reviewing in stack order is
easiest. Each page lists what its PR depends on. The standalone fixes
(`pr/50`, `pr/51`) and the server branches (`pr/40`) depend on nothing above
`canary` and can be reviewed in any order.

## Numbering

| Range        | Meaning                                                        |
| ------------ | -------------------------------------------------------------- |
| `pr/00`      | Fork tooling and tidy-ups                                      |
| `pr/02–pr/2x`| Features: edgeless canvas, blocks, databases, Journal Todo     |
| `pr/30–pr/3x`| Mobile client                                                  |
| `pr/40–pr/4x`| Server side, including PWA serving                             |
| `pr/50–pr/5x`| Standalone, high-level fixes (good upstream candidates alone)  |
| `pr/N-build` | Fork-only build and deploy (not offered upstream)              |

## The PRs

Sizes are the branch's own diff against the branch below it.

### Tooling

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/00 Tidy-up and tools](pr-00/) | Keep customised editor settings when a setting gains a new field; stack tooling | 5 files, +974 |

### Edgeless canvas

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/02 Colour palettes](pr-02/) | Palette sets (incl. gradients) for shapes, pen and connectors, managed in Settings | 37 files, +3.5k |
| [pr/03 Dotted line style](pr-03/) | A dotted stroke style for shapes, connectors and notes | 19 files, +195 |
| [pr/05 Connector core](pr-05/) | Rounded connectors, line jumps, waypoints, many new arrowheads, endpoint scale | 42 files, +4.1k |
| [pr/06 Connector from hover](pr-06/) | Start a connector by hovering a shape's edge anchors | 12 files, +689 |
| [pr/07 Flips](pr-07/) | Flip shapes horizontally and vertically, text stays readable | 17 files, +725 |
| [pr/08 Grid and snapping](pr-08/) | Grid size, snap-to-grid and the grid anchor point, in the zoom toolbar | 25 files, +1.4k |
| [pr/09 Shapes and edges](pr-09/) | ~60 new shapes (flowchart, arrows, containers, mind-map) and a searchable shape browser | 83 files, +13.7k |
| [pr/10 Library shapes](pr-10/) | ~8,900 draw.io library stencils in ~200 categories, lazy-loaded | 237 files, +5.6M (generated) |
| [pr/11 Advanced shapes](pr-11/) | Collapsible containers and connector trees, mind-map branch shapes | 18 files, +1.3k |
| [pr/12 Properties panel](pr-12/) | A full properties panel for shapes and connectors in the right sidebar | 8 files, +2k |
| [pr/13 Frame resize](pr-13/) | Size frames and frame embeds by zoom, width or aspect; hide grid, inner frames, notes | 11 files, +1.3k |
| [pr/14 PNG metadata](pr-14/) | Exported PNGs carry the frame; importing the PNG restores it | 15 files, +1.6k |
| [pr/15 Markdown/HTML export-import](pr-15/) | Frames and frame embeds survive Markdown and HTML export and import | 17 files, +1.6k |
| [pr/17 Middle-click paste guard](pr-17/) | Regression test for the Linux middle-click paste setting | 2 files, +57 |

`pr/16-frame-from-image-insert` has no changes left: its work is covered by
`pr/14` and upstream. It will be dropped, so it has no page.

### Documents, databases and the Journal Todo

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/18 Reusable blocks](pr-18/) | Show a note or a database from this or another page in place, editable | 127 files, +11k |
| [pr/19 To-do lists, databases and the Journal Todo](pr-19/) | Task hierarchy, List view, to-do ↔ database, a Journal Todo table on every journal page | 216 files, +32.7k |

### Mobile

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/30 Mobile keyboard toolbar](pr-30/) | Toolbar stays on the keyboard; database and reference tools | 34 files, +3.7k |
| [pr/31 Mobile settings](pr-31/) | Open the full settings from mobile | 7 files, +292 |

### Server and PWA

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/40 Server compression](pr-40/) | Compression for static assets and API responses | 4 files, +34 |
| [pr/41 PWA](pr-41/) | Installable, offline-capable web and mobile app | 30 files, +3.5k |
| [pr/42 Debug back channel](pr-42/) | Debug-log upload and remote eval for live debugging on devices | 21 files, +1.4k |

### Standalone engine fixes

| PR | What it does | Size |
| -- | ------------ | ---- |
| [pr/50 Store parent index](pr-50/) | Block parent lookup is O(1) instead of a whole-doc scan | 2 files, +226 |
| [pr/51 Toast container](pr-51/) | Toasts work again after the editor they were attached to is gone | 1 file, +4 |

## Reading a PR page

Each page has the same sections:

- **Why:** the problem, in user terms.
- **What changes:** what a user sees.
- **How it works:** the implementation, for reviewers.
- **Testing:** automated tests, and what was checked by hand or on a device.
- **Open items:** known gaps and follow-ups.
