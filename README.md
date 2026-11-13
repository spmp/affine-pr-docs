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

Every PR is opened from its generated branch (`pr/NN-…` or `fix/…`), made by
`tools/stack-publish` from the fork's `working/*` stack. Each is one commit on
`canary`, or on only the PRs it really needs (see `tools/stack.yml`), so the
PR shows its own change plus the minimum below it:

```sh
gh pr create --repo toeverything/AFFiNE --base canary \
  --head spmp:pr/18-reusable-blocks \
  --title "feat(editor): reusable blocks: note and database references" \
  --body-file pr-text/pr-18.md
```

Opening and editing PRs on upstream needs Jasper's own GitHub account (see
`process/setup.md`). Pushing a generated branch updates its open PR in place.

## Process and tools

How the fork is worked on is in `process/` (published as the site's Process
section). The stack's tools are in `tools/` (see `tools/README.md`); the fix
inbox is `inbox/FIXES.md`. Neither folder is published.

## Local preview (optional)

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000/affine-pr-docs/
```
