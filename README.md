# affine-pr-docs

Source for <https://spmp.github.io/affine-pr-docs/>: one page per pull
request in the [spmp/AFFiNE](https://github.com/spmp/AFFiNE) PR stack.

- `index.md`: the stack overview.
- `prs/`: one page per PR (the long explanation, with screenshots).
- `pr-text/`: the short PR descriptions to paste into GitHub. Each one links
  to its page. Not published on the site.
- `assets/images/pr-NN/`: screenshots and recordings for PR `NN`.

## Adding images

Put the file in `assets/images/pr-NN/` and reference it from the page:

```markdown
![Caption]({{ '/assets/images/pr-18/note-ref-cross-page.png' | relative_url }})
```

Each page has `<!-- IMAGE: ... -->` comments marking where screenshots would
help. Short screen recordings work too, as `.mp4` in a `<video>` tag or as GIF.

## Opening a PR with this text

```sh
gh pr create --repo toeverything/AFFiNE --base canary \
  --head spmp:pr/18-reusable-blocks \
  --title "feat(editor): reusable blocks: note and database references" \
  --body-file pr-text/pr-18.md
```

## Local preview (optional)

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000/affine-pr-docs/
```
