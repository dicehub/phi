# @dicehub/phi

Phi is a Vue port of [Kumo](https://github.com/cloudflare/kumo), rebuilt on Ark UI.

Read the [documentation](https://phi-ui.com) for API guides and examples.

## Install

```bash
pnpm add @dicehub/phi
```

## Usage

```ts
import { Button } from "@dicehub/phi";
import "@dicehub/phi/styles/standalone";
```

Phi's published declarations support TypeScript with `skipLibCheck: false` and
`moduleResolution: "Bundler"`.

## DatePicker outside days

Multi-month calendars hide dates outside each month, so date buttons and range
highlights appear once. Single-month calendars keep outside dates visible.
Set `show-outside-days` to choose a value explicitly. `DatePicker.Calendar`
inherits the root setting and can override it with its own `show-outside-days`.

```vue
<DatePicker mode="range" :number-of-months="2" inline />
<DatePicker :number-of-months="2" show-outside-days inline />
```

## Segmented Radio

Use `appearance="segmented"` on `Radio.Group` for short, mutually exclusive
options. The group uses one horizontal row with native radio controls and
keyboard focus. Item appearance overrides do not change a segmented group.
`RadioItemAppearance` permits only `default` and `card`.

```vue
<Radio.Group v-model="theme" appearance="segmented" legend="Theme">
  <Radio.Item label="Light" value="light" />
  <Radio.Item label="Dark" value="dark" />
</Radio.Group>
```

## Slider

Import `Slider` from the root package or `@dicehub/phi/components/slider`.

Values follow the grid anchored at `min`, in positive `step` increments. A `max`
between steps stops at the last complete step. Fractional `minStepsBetweenThumbs`
counts round up to a complete step; the limits must fit every thumb gap.
Use `v-model` with a number for one thumb or an array for a range. `defaultValue`
supports uncontrolled use. `sm` and `base` sizes include value badges and limit
labels. `format` and `locale` use `Intl.NumberFormat`.
Default IDs use Vue's SSR-compatible `useId`. When a page contains separate Vue
apps or Astro islands, give each Slider a distinct `id`.

```vue
<Slider v-model="volume" label="Volume" />
<Slider v-model="priceRange" label="Price range"
  :get-aria-label="index => index === 0 ? 'Minimum price' : 'Maximum price'" />
```

## Label translations

Import `LocaleProvider` from the root package or `@dicehub/phi/utils`.
It translates generated optional markers and tooltip names in Label and the
form components without adding a wrapper element. Defaults remain English.
Changes to `translations` update mounted controls. Nested providers inherit
text that they do not override.

```vue
<LocaleProvider :translations="{ label: { optional: '(opcional)', tooltip: 'Mais informações' } }">
  <Input label="Nome" :required="false" label-tooltip="Ajuda" />
</LocaleProvider>
```

Individual Labels support `optional-label`, an `optionalLabel` slot for rich
content, and `tooltip-aria-label`. These overrides take precedence over the
provider. The provider translates built-in copy; it does not set the locale or
direction of Ark UI controls.

## Charts

Install ECharts only when you use charts:

```bash
pnpm add echarts@^6.0.0
```

```ts
import { Chart, TimeseriesChart, type PhiChartOption } from "@dicehub/phi/components/chart";
```

Chart components, palettes, legends, and chart types use this dedicated module.
If you imported them from `@dicehub/phi`, change that import to
`@dicehub/phi/components/chart`. This keeps ECharts optional for other components.

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

The gate builds a real package tarball and validates its files and export map with Publint and Are The Types Wrong. It checks two isolated Vue consumers with `skipLibCheck: false`: one without optional ECharts and one with all peers installed. Together they import every JavaScript entrypoint, check root and granular imports, and production-bundle all browser and asset entrypoints with Vite.

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
