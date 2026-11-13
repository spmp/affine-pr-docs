---
title: pr/N Build and use the stack
nav_order: 99
permalink: /pr-N/
---

# pr/N: Build, run and work on the stack
{: .no_toc }

Branch `working/pr/N-build` · top of the working stack · 15 commits ·
**fork only, not offered upstream**
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="N" %}

1. TOC
{:toc}

## Why

`working/pr/N-build` is the top of the fork's working stack, so it contains
every PR's changes. It adds only what's needed to build and deploy the fork: a
Dockerfile, a Compose file and a rebuild script. **This is the branch to run,
test and deploy.** The `pr/*` branches are generated from the working stack
for upstream review only.

How the stack is worked on, fixed, rebased and published, and the tools for
it, are in this site's [Process](../process/) section.

## Get the stack

```sh
git clone https://github.com/spmp/AFFiNE.git && cd AFFiNE
git remote add upstream https://github.com/toeverything/AFFiNE.git
git fetch origin 'refs/heads/working/*:refs/heads/working/*'
git fetch upstream canary
git switch working/pr/N-build
```

The order of the branches, and what each upstream branch is based on, is in
[`tools/stack.yml`](https://github.com/spmp/affine-pr-docs/blob/main/tools/stack.yml)
in this site's repository. For end-to-end tests, see the Playwright setting in
[Setup](../process/setup/#playwright).

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

See [Process](../process/): where a change goes, the canary check for fixes,
the weekly rebase and checks, and publishing the upstream branches.

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

- None.
