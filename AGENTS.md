# AGENTS.md

Ros owns this repo.

## Goal

Build a Vue-first, product-agnostic UI library with accessible primitives and polished components.

Target packages:

- `@dicehub/phi`
- `@dicehub/phi-docs-astro`

## Current Phase

Early scaffold phase.

Work one small step at a time.
Stop after each small change for review.
Do not batch large setup work unless Ros asks.

## Locked Decisions

- package manager: `pnpm`
- workspace layout: `packages/*`
- docs stack: Astro + MDX + Vue
- primitive base: Ark UI
- no PrimeVue
- no Starlight
- no separate `packages/phi-playground` in v1
- core package stays product-agnostic
- no Dicehub-specific runtime/store/router API in core

## Repo Shape

- `packages/phi`
  - main library package
- `packages/phi-docs-astro`
  - docs site
  - demos
  - dev-time playground

## Working Rules

- prefer minimal diffs
- discuss architecture before broad scaffolding
- keep public component names generic: `Button`, `Dialog`, `Select`
- keep styling/token work inside `packages/phi`
- verify in small steps

## Verification

When touching the docs package, prefer:

- `pnpm --filter @dicehub/phi-docs-astro build`
- `pnpm --filter @dicehub/phi-docs-astro dev`

When adding more tooling later, keep it incremental.

## Notes

Root `docs/` is internal project documentation and is currently gitignored for now.
