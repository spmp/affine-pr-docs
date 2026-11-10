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

The fork carries its work as one **linear stack** of branches on top of
upstream `canary`. Each branch holds one feature or theme and is based on the
one before it. Reviewing in stack order is easiest; the "Reviewable alone" PRs
can go first, in any order.

```
canary
└─ pr/02 … pr/17   edgeless canvas and export
   └─ pr/18  reusable blocks
      └─ pr/19  to-do lists, databases and the Journal Todo
         └─ pr/30, pr/31   mobile
            └─ pr/40, pr/41, pr/42   server and PWA
               └─ pr/50, pr/51   standalone fixes
                  └─ pr/00  tidy-up and tools (fork tooling)
                     └─ pr/N-build   fork-only build and deploy
```

Branch numbers: `00` tooling, `02–2x` features, `30s` mobile, `40s` server,
`50s` standalone fixes, `N-build` fork-only. `pr/16` is empty (its work is in
`pr/14` and upstream) and will be dropped.

Last updated 2026-11-01.
