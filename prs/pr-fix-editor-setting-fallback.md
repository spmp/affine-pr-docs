---
title: fix/editor-setting-fallback
nav_order: 1
permalink: /pr-fix-editor-setting-fallback/
---

# fix/editor-setting-fallback: Keep customised editor settings
{: .no_toc }

Branch `fix/editor-setting-fallback` · base `canary` · 2 files, +71 −8 · 249 files against canary
{: .fs-3 .text-grey-dk-000 }

{% include pr-hero.html id="fix-editor-setting-fallback" %}

## Why

Customised editor settings could be lost after an upgrade. When a settings
schema gains a new required field, the persisted value no longer validates.
`EditorSetting.watchAll()` then reset the **whole** entry to its default. For
example, adding `cornerRadius` to the connector settings would throw away the
user's connector colour, stroke and mode, not just fill in the new field.

## What changes

Stored settings are merged onto the schema's defaults before they are
validated. Only the missing field gets its default; everything else the user
set is kept. The entry falls back to the full default only if the merged value
still fails to validate, such as corrupt data.

This was the upstream-candidate part of the former `pr/00`. It is now its own
branch at the bottom of the stack (see the [Fix register](../process/fix-register/));
the fork tooling that shared `pr/00` with it moved to this site's
[Process](../process/) section.

## How it works

The parse-with-fallback logic moves out of `watchAll()` into
`parseSettingWithFallback()` in
`packages/frontend/core/src/modules/editor-setting/entities/editor-setting.ts`.
This is the same merge-over-defaults pattern already used in
`blocksuite/affine/shared/src/services/edit-props-store.ts`.

## Testing

`parse-setting-with-fallback.spec.ts` covers four cases:

- a valid value is returned unchanged
- a newly required field is backfilled and the other fields are kept
- a non-object value falls back to the default
- an undefined value falls back to the default

## Changes

Changes since the PR was first offered, newest first (see the
[definition of done](../process/#definition-of-done)).

- None yet.

## Open items

- Canary check (does the test fail on plain `canary`?), then open the upstream
  issue and PR.
