# Stack tools

Run from this folder or with a path; they work on `/workspace/AFFiNE`
(override with `AFFINE_REPO`). None of them pushes.

| Tool | What it does |
| --- | --- |
| `stack-publish [--write]` | Generates `pr/*` and `fix/*` from `working/*` per `stack.yml`; shows file counts against canary and checks the result. `--write` sets the local branches. |
| `stack-typecheck [branch...]` | Type-checks each published branch on its own in a scratch worktree. |
| `stack-check rehearsal [--weeks N] [base..tip ...]` | Replays a history onto each of the last N weeks of upstream canary and counts conflicts. |
| `stack-check overlap` | Files edited by more than one working branch. |
| `stack-docs [--write]` | Refreshes PR page header lines and PR texts' "Depends on other PRs" from `stack.yml` and the generated branches. |
| `fix-classify <test>... -- <cmd>` | The canary check: runs the test on plain upstream canary in `/workspace/affine-canary`. |

`stack.yml` is read by `stacklib.py`'s small parser: keep one entry per line.
Process: `../process/`.
