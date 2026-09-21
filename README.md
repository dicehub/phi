# Phi

Phi is a Vue port of [Kumo](https://github.com/cloudflare/kumo), rebuilt on Ark UI.

Phi provides accessible Vue components, styling tokens, and reusable interface blocks. The first public release will
be `0.5.0-beta.0`. The package is not yet available from npm.

## Install

After the first beta release:

```bash
pnpm add @dicehub/phi
```

## Quick start

```vue
<script setup lang="ts">
import { Button } from "@dicehub/phi";
import "@dicehub/phi/styles/standalone";
</script>

<template>
  <Button>Save</Button>
</template>
```

## Packages

- `@dicehub/phi`: Vue components, primitives, styles, blocks, and CLI
- `@dicehub/phi-docs-astro`: documentation, examples, and browser tests

## Documentation

The component documentation is in `packages/phi-docs-astro`. Public documentation will be available before the
first beta release.

## Development

This repository uses pnpm:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Run the complete package validation before a release:

```bash
pnpm --filter @dicehub/phi validate:package
```

## Source and support

The public source mirror and issue tracker will be available at [github.com/dicehub/phi](https://github.com/dicehub/phi).

Use the [documentation source](./packages/phi-docs-astro) for API details and examples. Report reproducible bugs
and request features in [GitHub issues](https://github.com/dicehub/phi/issues). Support has no guaranteed response
time. Report suspected vulnerabilities privately as described in the [security policy](./SECURITY.md).

See [CONTRIBUTING.md](./CONTRIBUTING.md) before you submit a change.

## License and attribution

Phi is available under the [MIT license](./LICENSE). Portions of its variant metadata and styling definitions were
adapted from [Cloudflare Kumo](https://github.com/cloudflare/kumo) under Kumo's MIT license. Third-party notices are
in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

Phi is an independent project. It is not affiliated with or endorsed by Cloudflare, Inc.
