---
title: pr/N Build and use the stack
nav_order: 99
permalink: /pr-N/
---

# pr/N: Build, run and work on the stack
{: .no_toc }

Branch `pr/N-build` · base `pr/00` · 16 commits · 7 files, +861 −9 ·
**fork only, not offered upstream**
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="N" %}

1. TOC
{:toc}

## Why

`pr/N-build` is the top of the stack, so it contains every PR's changes. It
adds only what's needed to build and deploy the fork: a Dockerfile, a Compose
file and a rebuild script. This is the branch to run, test and deploy. The
branches below it are what gets reviewed upstream.

The stacking tools (`scripts/cascade-rebase.sh` and the `docs/pr-stack/`
conventions) are on [pr/00](../pr-00/), just below this branch. They are
kept out of the feature branches so the upstream PRs don't include them;
run them from a `pr/N-build` checkout.

## Get the stack

```sh
git clone https://github.com/spmp/AFFiNE.git && cd AFFiNE
git remote add upstream https://github.com/toeverything/AFFiNE.git
git fetch origin 'refs/heads/pr/*:refs/heads/pr/*'
git fetch upstream canary && git branch -f canary upstream/canary
git switch pr/N-build
```

The order of the branches is kept in `.git/machete`. That file is not in the
repository, so create it once. Each branch is indented under the one it is
based on:

```
canary
  pr/02-color-palettes
    pr/03-dotted-line-style
      pr/05-connector-core
        pr/06-connector-hover-initiation
          pr/07-flips
            pr/08-grid-and-snapping
              pr/09-shapes-and-edges
                pr/10-library-shapes
                  pr/11-advanced-shapes
                    pr/12-properties-menu-for-shapes-and-connectors
                      pr/13-frame-resize
                        pr/14-png-metadata-export-import
                          pr/15-md-html-export-import
                            pr/16-frame-from-image-insert
                              pr/17-middle-click-paste
                                pr/18-reusable-blocks
                                  pr/19-todo-database-integration-in-journal
                                    pr/30-mobile-keyboard-toolbar
                                      pr/31-mobile-settings
                                        pr/40-server-compression
                                          pr/41-server-pwa
                                            pr/42-mobile-debug-tools
                                              pr/50-store-parent-index
                                                pr/51-toast-container
                                                  pr/00-tidy-up-canary-and-tools
                                                    pr/N-build
```

`pr/16` is empty (its work is in [pr/14](../pr-14/)) and will be dropped.

## Run it with Docker

This builds the server, the web app, the admin panel and the mobile PWA from
your checkout, and runs them with Postgres and Redis:

```sh
docker compose up -d --build
```

Open <http://localhost:3010>. The first build takes a long time because it
compiles Rust. Later builds are much quicker (see [below](#faster-rebuilds)).

- **Data** is kept in `./.docker/selfhost/data/` (storage, config, Postgres),
  which git and Docker ignore.
- **Server settings** in `docker-compose.yml` (host, external URL, mail) are
  only used on the first run. After that, edit
  `.docker/selfhost/data/config/config.json` or use the admin panel.
- **Search** is off by default. To turn it on, add
  `"indexer": { "enabled": true, "provider.type": "embedded" }` to
  `config.json`.
- **Phones** get the mobile site and PWA because `AFFINE_ENV: dev` is set.
  Install the PWA from Safari's Share menu (see [pr/41](../pr-41/)).
- **On-device debugging:** uncomment the `AFFINE_MOBILE_DEBUG_*` lines and set
  a secret token (see [pr/42](../pr-42/)).
- **Behind a reverse proxy:** there's a commented Traefik example in the
  Compose file.

### Faster rebuilds

The Dockerfile builds in stages, and each stage copies only the files it
needs. A change rebuilds only the stages that depend on it:

| Stage       | Rebuilds when these change                            |
| ----------- | ----------------------------------------------------- |
| `deps`      | any `package.json`, `yarn.lock`, `tools/`             |
| `native`    | Rust crates, `Cargo.toml` / `Cargo.lock`              |
| `server`    | `packages/backend`, `packages/common`                 |
| `web`       | `blocksuite`, `packages/common`, `packages/frontend`  |
| `prod-deps` | `package.json` files, `schema.prisma`                 |

So a front-end change rebuilds only `web` and the final image.

Build arguments (`docker compose build --build-arg NAME=value`):

- `GITHUB_SHA=$(git rev-parse HEAD)` stamps the commit into the app. It
  only affects the last stage, so it doesn't cause a rebuild.
- `REBUILD_DEPS`, `REBUILD_NATIVE`, `REBUILD_SERVER`, `REBUILD_WEB`: give one
  a new value, such as `$(date +%s)`, to force that stage and everything after
  it to rebuild.
- `BUILD_VERSION` overrides the version number. It must be valid SemVer: the
  server checks client versions and drops clients with an invalid one.
- `BUILD_TYPE` is the release channel (default `canary`).

### Rebuild automatically

`scripts/watch-compose-rebuild.sh` waits for a trigger file. When the file
appears, it builds, restarts the stack and shows the recent logs:

```sh
scripts/watch-compose-rebuild.sh -f docker-compose.yml -w rebuild
# then, whenever you want a rebuild:
touch rebuild/rebuild
```

- The build and deploy output also goes to `rebuild/docker-build.log` and
  `rebuild/docker-deploy.log`. The current state is in
  `rebuild/.affine-rebuild.status`.
- The trigger file is removed only when the run succeeds. If a run fails, the
  file stays so you can see what was asked for. Touch it again to retry.
- `--once` runs a single rebuild and exits. `-s affine` rebuilds only the app
  container.
- The build cache is trimmed to 80 GB before each build (`--keep-storage`).
  `--builder-mode none` keeps all of it.

## Run it for development

The usual AFFiNE development commands work on any branch:

```sh
yarn install
yarn dev            # front-end dev server, with live reload
```

For a full local server with a database, the Docker setup above is simpler.

## Work on the stack

The full rules and procedure are in `docs/pr-stack/README.md`, and what each
branch contains and its status are in `docs/pr-stack/ROADMAP.md`. Both are on
`pr/00`.

### Where a change goes

- **Each branch has one feature.** A fix goes into the branch that added the
  feature. For example, Journal Todo fixes go into `pr/19`, mobile included.
- **`pr/N-build` has no product changes.** You can try a fix here first, but
  move it to its owning branch before release.
- **A branch may only depend on branches below it.**
- **Back up before rewriting history**, under
  `backup/<YYYY-MM-DD>/<stage>/<branch>`:

  ```sh
  d=$(date +%F)
  for b in $(git branch --format='%(refname:short)' | grep '^pr/'); do
    git branch -f "backup/$d/pre-rebase/$b" "$b"
  done
  ```

### Run the stack script from a copy

`scripts/cascade-rebase.sh` is only on `pr/00` and `pr/N-build`. Switch to
a feature branch and it's gone from the checkout, and a rebase switches
branches as it goes. So copy it out once and run the copy:

```sh
git show pr/N-build:scripts/cascade-rebase.sh > ~/bin/cascade-rebase.sh
chmod +x ~/bin/cascade-rebase.sh
```

Re-copy it whenever pr/00 changes the script.

### Change a branch in the middle of the stack

Commit on the owning branch, then rebase everything above it:

```sh
git switch pr/19-todo-database-integration-in-journal
# edit, commit (or `git commit --fixup` and squash)
cascade-rebase.sh run --from pr/30-mobile-keyboard-toolbar
```

### Rebase the stack onto the latest upstream

```sh
git fetch upstream canary
git branch -f canary upstream/canary
cascade-rebase.sh plan        # show the order, change nothing
cascade-rebase.sh run --verify-cmd "git status --short"
```

`cascade-rebase.sh` rebases each branch onto the one before it, in the order
in `.git/machete`. It runs a plain `git rebase <parent>`, so it is for
keeping the existing order up to date. To change the order, as when `pr/00`
moved up the stack, replay each branch's own commits onto its new parent
instead, with `git replay --onto <new parent> <old parent>..<branch>`.

- **Conflicts:** it settles a conflict by itself only when one side is exactly
  the parent branch's version of the file. Anything else stops the run. Fix
  the files and `git add` them, then run `cascade-rebase.sh run` again
  to carry on. Don't run `git rebase --continue` yourself.
- **Other commands:** `status` shows where a stopped run is; `abort` cancels
  it without changing any branch.
- **Options:** `--from` and `--to` limit the range, `--dry-run` only prints
  the steps, and `--verify-cmd` runs a check after each branch.

### Check the result

Run the tests on `pr/N-build`:

| Suite                  | Command                                                         |
| ---------------------- | --------------------------------------------------------------- |
| Lint                   | `yarn lint:ox`                                                  |
| Type check             | `NODE_OPTIONS=--max-old-space-size=14384 yarn typecheck`        |
| Unit tests             | `yarn vitest run`                                               |
| BlockSuite integration | `cd blocksuite/integration-test && npx vitest run`              |
| Mobile integration     | the same, with `--config vitest.mobile.config.ts`               |
| E2E                    | `tests/affine-local` (Playwright)                               |
| Server                 | `yarn test` in `packages/backend/server`                        |

Known failures are listed in `docs/pr-stack/README.md`. Then rebuild and
check by hand on desktop and on a phone with the PWA. Only then force-push
(`git push --force-with-lease origin $(sed -n 's/^ *\(pr\/.*\)/\1/p' .git/machete)`, which pushes exactly the branches in the stack).

## What's on this branch

- **`Dockerfile`:** the staged build described above. It builds from the local
  checkout, not a fresh clone. It also sets `PUBLIC_PATH=/`, so the app loads
  its files from the server itself rather than a CDN, which the offline PWA
  needs.
- **`docker-compose.yml`:** the app, a migration job, Postgres (with pgvector)
  and Redis.
- **`scripts/watch-compose-rebuild.sh`:** the rebuild watcher.
- **`.dockerignore` / `.gitignore`:** leave out `node_modules`, crash dumps,
  local tools, rebuild logs and the Compose data folder.
- **A database catch-up migration**
  (`20260815000000_fork_catchup_converge_copilot_runtime`). Upstream rewrote
  one of its migrations after it first shipped. Databases that ran the early
  version would fail on a later migration. This adds what the newer version
  creates, and does nothing on a fresh install.
- **`tools/cli/src/rspack-shared/html-plugin.ts`:** the web build no longer
  fails when there's no `.git` folder, as in a Docker build. The commit hash
  then comes from `GITHUB_SHA`, or shows as `unknown`.

## Open items

- **Move a product fix to `pr/19`.** Commit `c7b503565c` (select-all and
  Backspace in a List view row) is a List view fix, and the stack's rules put
  it in `pr/19`.
