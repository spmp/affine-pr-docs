# affine-pr-docs

Source for <https://spmp.github.io/affine-pr-docs/>: one page per pull
request in the [spmp/AFFiNE](https://github.com/spmp/AFFiNE) PR stack.

- `index.md`: the stack overview.
- `prs/`: one page per PR (the long explanation, with screenshots).
- `pr-text/`: the short PR descriptions to paste into GitHub. Each one links
  to its page. Not published on the site.
- `assets/images/pr-NN/`: screenshots and recordings for PR `NN`.

## Adding a PR's picture

Each PR has one picture. It is shown on its card on the overview and at the
top of its page.

1. Save it as `assets/images/pr-NN/hero.png` (`.jpg`, `.gif` and `.webp` work
   too; an animated GIF plays on both).
2. Commit and push. Nothing else to edit: the placeholder is replaced
   automatically.

Tips:

- Cards crop to 16:10 from the **top-left**, so put the interesting part
  there. The page shows the whole picture.
- About 1600 px wide is plenty.
- The text on each placeholder ("Screenshot to come: …") says what the
  picture should show. It comes from `shot:` in `_data/prs.yml`, which also
  holds each card's title, one-line summary and size.

More pictures can go further down a page as normal Markdown:

```markdown
![Caption]({{ '/assets/images/pr-18/second.png' | relative_url }})
```

## Opening a PR with this text

Each file in `pr-text/` starts with two comments: the PR title, and the
branch to open it from. The body follows upstream's PR template
(Description, then Checklist), so it can go straight into
`--body-file`. Delete the comment lines and fill in each `#___` with the PR
number of the one it depends on.

**Stacked PRs** are opened from their `pr/` branch. GitHub then also shows
the commits of the PRs below, which the "Depends on other PRs" section
explains:

```sh
gh pr create --repo toeverything/AFFiNE --base canary \
  --head spmp:pr/18-reusable-blocks \
  --title "feat(editor): reusable blocks: note and database references" \
  --body-file pr-text/pr-18.md
```

**Independent PRs** (00, 06, 17, 31, 40, 50, 51) are opened from a
`standalone/` branch that has only that PR's commit on top of `canary`, so
the PR shows nothing else:

```sh
git fetch upstream canary
git switch -c standalone/06-connector-hover-initiation upstream/canary
git cherry-pick pr/06-connector-hover-initiation     # pr/00: its first commit, pr/00~3
git push -u origin standalone/06-connector-hover-initiation
```

pr/40's commit conflicts with `canary` in `packages/backend/server/package.json`;
keep both sides and run `yarn install` to update `yarn.lock`.

The "Merge conflict" sections were checked on 2026-11-10. Once the stack is
rebased onto the latest `canary`, delete them.

## Local preview (optional)

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000/affine-pr-docs/
```
