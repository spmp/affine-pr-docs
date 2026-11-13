---
title: Setup and access
parent: Process
nav_order: 5
permalink: /process/setup/
---

# Setup and access
{: .no_toc }

1. TOC
{:toc}

## Checkouts

```
/workspace/AFFiNE            the fork; normally on working/pr/N-build
/workspace/affine-pr-docs    this repository: docs, stack.yml, tools, inbox
/workspace/affine-canary     a worktree of upstream/canary for canary checks
```

```sh
git clone https://github.com/spmp/AFFiNE.git && cd AFFiNE
git remote add upstream https://github.com/toeverything/AFFiNE.git
git fetch origin 'refs/heads/working/*:refs/heads/working/*'
git fetch upstream canary
git switch working/pr/N-build
git worktree add ../affine-canary upstream/canary
```

## Playwright

**Required.** Use the Playwright version canary pins (`@playwright/test` in
the root `package.json`, `=1.58.2` as of 2026-11-13). Never bump it in a
feature branch.

The dev container runs Ubuntu 26.04, which Playwright 1.58 doesn't recognise:
`playwright install` stops with *"Playwright does not support
chromium-headless-shell on ubuntu26.04-x64"*. Tell it to use the Ubuntu 24.04
build, the one upstream's CI uses:

```sh
export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64   # in the container's environment
yarn playwright install chromium chromium-headless-shell
```

Checked on 2026-11-13: the 24.04 build of Chrome Headless Shell 145
(Playwright 1.58.2) downloads and runs on 26.04. If a system library is ever
missing, it fails at browser launch and names it.

When canary moves to a new Playwright version, run the install command again
after the weekly rebase.

## GitHub access

### Token

A **fine-grained personal access token**:

- **Resource owner:** spmp
- **Repository access:** only select repositories: `spmp/AFFiNE`,
  `spmp/affine-pr-docs`
- **Permissions:**
  - Contents: read and write (push)
  - Pull requests: read and write (fork-internal review PRs, reading and
    replying to comments)
  - Workflows: read and write (some branches change
    `.github/workflows/build-test.yml`; GitHub rejects such pushes without it)
  - Metadata: read (added automatically)
- **Expiry:** 90 days; renew it in the weekly run when it's close.

Store it as a **secret** in the environment, as `GH_TOKEN`; never in a file or
a plain environment variable.

A fine-grained token can't open or edit PRs or issues on
`toeverything/AFFiNE` (you aren't a member there). Reading it is fine (it's
public), and pushing `pr/*` to the fork updates the upstream PRs in place. So
only **opening a new upstream PR or issue**, or editing an upstream PR's
description, is done by Jasper: the agent prepares the exact `gh` command and
text.

### CodeRabbit on the fork

Install the CodeRabbit GitHub app on `spmp/AFFiNE` (free for public repos). It
then reviews the fork-internal review PRs (see
[Branches](../branches/#fork-internal-review-prs)).

### What agents may do alone

| Action | Alone? |
| --- | --- |
| Read upstream and fork PRs, comments, issues | Yes |
| Commit to `working/*`, rebase it, tag backups | Yes |
| Push `working/*` to the fork | Yes, after the weekly checks pass and Jasper's on-device step |
| Generate `pr/*` and `fix/*` locally | Yes |
| Push `pr/*` or `fix/*` (updates upstream PRs) | Only with Jasper's go for that publish |
| Open, update or close fork-internal review PRs | Yes |
| Reply to review comments | Fork-internal: yes. Upstream: Jasper |
| Open upstream PRs or issues | Jasper (agent prepares them) |
| Delete branches or tags | Only when asked |

## Agent entry point

`AFFiNE/.claude/CLAUDE.md` is untracked (git ignores `.claude/`), so it is
always there in the workspace whatever branch is checked out. It holds a
short **Fork workflow** section that points to this process and repeats the
hard rules. Keep that section short; the detail lives here.
