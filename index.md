---
title: Overview
nav_order: 0
permalink: /
---

# AFFiNE fork: PR notes
{: .no_toc }

<p class="lead-in">The pull requests from the <a href="https://github.com/spmp/AFFiNE">spmp/AFFiNE</a> fork offered to <a href="https://github.com/toeverything/AFFiNE">upstream AFFiNE</a>, one card each. Open a card for the full explanation, how it works and how it was tested.</p>

<p class="lead-in"><span class="chip chip--ok">Reviewable alone</span> applies straight onto <code>canary</code>. <span class="chip">Stacked</span> builds on the PR before it.</p>

{% for group in site.data.prs.groups %}
<h2 class="pr-group-title">{{ group.name }}</h2>
<div class="pr-grid">
{%- for id in group.prs %}
{% include pr-card.html id=id %}
{%- endfor %}
</div>
{% endfor %}

## How the PRs fit together

Each PR branch is generated from the fork's working stack so that it carries
as little as possible: it sits straight on `canary` when it can ("Reviewable
alone"), otherwise on only the PRs it really needs. The edgeless chain is the
one long dependency; `pr/10` (the generated draw.io libraries, 237 files) is
last in it so the PRs before it stay small enough for automated review.

```
canary
├─ fix/editor-setting-fallback, pr/50, pr/51   fixes for upstream bugs
├─ pr/02 → 03 → 05 → 06 → 07 → 08 → 09 → 12 → 13 → 14 → 15 → 10 → 11
│                                         edgeless canvas and export
├─ pr/17                                  middle-click paste
├─ pr/18 → pr/19 → pr/30                  reusable blocks, Journal Todo, mobile toolbar
│     └─ pr/18a (also needs pr/13)        note settings in the Properties panel
├─ pr/31                                  mobile settings
├─ pr/40                                  server compression
└─ pr/41                                  PWA
```

Not offered upstream: `pr/42` (debug back channel) and the fork's own build
([pr/N](pr-N/)). How the branches are made and kept up to date:
[Process](process/).

Last updated 2026-11-13.
