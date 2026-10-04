# @dicehub/phi

Phi is a Vue port of [Kumo](https://github.com/cloudflare/kumo), rebuilt on Ark UI.

This is a public beta. APIs can change before the stable release.

## Install

```bash
pnpm add @dicehub/phi@beta
```

## Usage

```ts
import { Button } from "@dicehub/phi";
import "@dicehub/phi/styles/standalone";
```

## Theme Generation

`src/styles/theme-phi.css` is generated from `scripts/theme-generator/config.ts`. Edit the config, then regenerate the CSS:

```bash
pnpm --filter @dicehub/phi codegen:themes
```

Do not edit the generated CSS directly. `pnpm --filter @dicehub/phi check:themes` verifies that it is current, and package `typecheck` runs the same drift check.

Status colors expose three roles: `--phi-{status}` for solid accents and icons, `--phi-{status}-text` for readable foregrounds, and `--phi-{status}-tint` for backgrounds.

## Package Validation

Run the release-facing package gate with:

```bash
pnpm --filter @dicehub/phi validate:package
```

The gate builds a real package tarball, validates its files and export map with Publint and Are The Types Wrong, then checks the installed result from an isolated Vue consumer. The consumer imports every JavaScript entrypoint, typechecks root and granular imports, and production-bundles all browser and asset entrypoints with Vite.

The fixture uses TypeScript's `Bundler` module resolution, matching Phi's supported Vite consumer setup. ATTW skips CSS/JSON entrypoints and Node-specific internal-resolution diagnostics; the consumer's `vue-tsc` and Vite checks cover those paths instead.

Published JavaScript stays readable and unminified so consumers can inspect it; application bundlers own final
minification and tree-shaking. Source maps are excluded from the package tarball.

## Licensing

Phi is available under the [MIT license](./LICENSE). Portions of its variant metadata and styling definitions were
adapted from [Cloudflare Kumo](https://github.com/cloudflare/kumo) under Kumo's MIT license. Ark UI and other
dependencies are bundled into the compiled package; their complete notices are included in
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

The notice inventory is generated from hidden Vite source maps that remain internal build metadata and are not
published:

```bash
pnpm --filter @dicehub/phi build
pnpm --filter @dicehub/phi check:licenses
```

## Component Registry

Phi publishes deterministic metadata for every public Vue component and block. The registry includes granular import paths, source groups, compound component parts, and search indexes.

```ts
import {
  componentRegistry,
  getRegistryComponent,
  type RegistryComponentName,
} from "@dicehub/phi/registry";

const button = getRegistryComponent("Button");
const componentName: RegistryComponentName = "TimeseriesChart";
```

The same data is available as JSON for tooling and agents:

```ts
import registry from "@dicehub/phi/registry/component-registry.json" with { type: "json" };
```

`@dicehub/phi/ai/component-registry.json` is an alias for the same generated file. Run `pnpm --filter @dicehub/phi codegen:registry` after changing public component exports; `typecheck` fails when generated output has drifted.

---

Phi is an independent project. It is not affiliated with or endorsed by Cloudflare, Inc.
