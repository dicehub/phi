import {
  AVAILABLE_THEMES,
  THEME_CONFIG,
  type ThemeTokenDefinition,
} from "../../../phi/scripts/theme-generator/config";

export type ColorToken = {
  name: string;
  light: string;
  dark: string;
  description: string;
  namespace: "color" | "text-color";
};

export type ColorTokenGroup = {
  id: string;
  title: string;
  tokens: ColorToken[];
};

export type ColorTableSection = {
  id: string;
  title: string;
  description?: string;
  rows: Array<{ token: string; purpose: string }>;
};

export const colorsSetupCode = `@import "@dicehub/phi/styles/tailwind";
@import "tailwindcss";

@source "../node_modules/@dicehub/phi/dist";`;

export const colorsUsageCode = `<template>
  <section class="bg-phi-base text-phi-default border border-phi-hairline">
    <button class="bg-phi-accent text-phi-accent-contrast hover:bg-phi-accent-hover">
      Save changes
    </button>
    <button class="bg-phi-control text-phi-default">Cancel</button>
  </section>
</template>`;

export const colorsIncorrectCode = `<template>
  <!-- Never use raw palette colors or dark: overrides. -->
  <section class="bg-white text-gray-950 dark:bg-gray-900 dark:text-white">
    <button class="bg-blue-600 hover:bg-blue-700">Save changes</button>
  </section>
</template>`;

export const colorsModeCode = `<html data-mode="light">
  <body><!-- Semantic utilities use their light values. --></body>
</html>

<html data-mode="dark">
  <body><!-- The same utilities now use their dark values. --></body>
</html>`;

export const colorsThemeCode = `<!-- After adding acme to the theme config -->
<html data-mode="dark" data-theme="acme">
  <body>
    <App />
  </body>
</html>`;

export const colorsGeneratorCode = `# Show every generated token and its purpose
pnpm --filter @dicehub/phi codegen:themes --list

# Generate the base theme and every configured override
pnpm --filter @dicehub/phi codegen:themes

# Preview or verify without writing files
pnpm --filter @dicehub/phi codegen:themes --dry-run
pnpm --filter @dicehub/phi check:themes`;

export const colorsNewThemeCode = `// In scripts/theme-generator/config.ts
export const AVAILABLE_THEMES = ["phi", "acme"] as const;

export const THEME_CONFIG = {
  baseTheme: "phi",
  themes: AVAILABLE_THEMES,
  color: {
    "phi-accent": token(
      "oklch(0.5772 0.2324 260)",
      "oklch(0.51948 0.2324 260)",
      "Primary accent background",
      {
        theme: {
          acme: {
            light: "oklch(0.55 0.16 175)",
            dark: "oklch(0.7 0.14 175)",
          },
        },
      },
    ),
  },
};`;

export const availableThemes = AVAILABLE_THEMES;

export const colorTableSections: ColorTableSection[] = [
  {
    id: "surface-hierarchy",
    title: "Surface Hierarchy",
    description: "Move from the outer canvas to nested surfaces. Do not select a token only because its current shade looks correct.",
    rows: [
      { token: "bg-phi-canvas", purpose: "Outermost page background." },
      { token: "bg-phi-base", purpose: "Default component background." },
      { token: "bg-phi-elevated", purpose: "Surface that sits above the base layer." },
      { token: "bg-phi-recessed", purpose: "Inset controls and grouped navigation." },
      { token: "bg-phi-tint", purpose: "Quiet table rows and hover states." },
      { token: "bg-phi-contrast", purpose: "High-contrast inverted surface." },
    ],
  },
  {
    id: "accent",
    title: "Accent",
    rows: [
      { token: "bg-phi-accent", purpose: "Primary action or selected state." },
      { token: "bg-phi-accent-hover", purpose: "Hover state for an accent surface." },
      { token: "text-phi-accent", purpose: "Accent-colored text on a neutral surface." },
      { token: "text-phi-accent-contrast", purpose: "Text and icons on an accent surface." },
    ],
  },
  {
    id: "semantic-status-colors",
    title: "Semantic Status Colors",
    description: "Each status has three roles: a solid indicator, a low-emphasis tint, and readable text.",
    rows: [
      { token: "bg-phi-info / fill-phi-info", purpose: "Information indicator or icon." },
      { token: "bg-phi-info-tint", purpose: "Information background." },
      { token: "text-phi-info", purpose: "Information text." },
      { token: "bg-phi-success / fill-phi-success", purpose: "Success indicator or icon." },
      { token: "bg-phi-success-tint", purpose: "Success background." },
      { token: "text-phi-success", purpose: "Success text." },
      { token: "bg-phi-warning / fill-phi-warning", purpose: "Warning indicator or icon." },
      { token: "bg-phi-warning-tint", purpose: "Warning background." },
      { token: "text-phi-warning", purpose: "Warning text." },
      { token: "bg-phi-danger / fill-phi-danger", purpose: "Error or destructive indicator." },
      { token: "bg-phi-danger-tint", purpose: "Error or destructive background." },
      { token: "text-phi-danger", purpose: "Error or destructive text." },
    ],
  },
  {
    id: "text-colors",
    title: "Text Colors",
    rows: [
      { token: "text-phi-default", purpose: "Primary body text." },
      { token: "text-phi-strong", purpose: "Headings and important labels." },
      { token: "text-phi-subtle", purpose: "Descriptions and secondary labels." },
      { token: "text-phi-inactive", purpose: "Disabled or inactive text." },
      { token: "text-phi-placeholder", purpose: "Input placeholder text." },
      { token: "text-phi-inverse", purpose: "Text on a high-contrast surface." },
      { token: "text-phi-link", purpose: "Link text." },
    ],
  },
  {
    id: "borders-and-rings",
    title: "Borders & Rings",
    rows: [
      { token: "border-phi-hairline / ring-phi-hairline", purpose: "Subtle edge between flat surfaces." },
      { token: "border-phi-line / ring-phi-line", purpose: "Defined edge used with an elevated surface." },
      { token: "ring-phi-focus", purpose: "Strong keyboard focus ring." },
      { token: "ring-phi-focus-soft", purpose: "Soft outer focus halo." },
    ],
  },
];

const toTokens = (
  namespace: ColorToken["namespace"],
  entries: Array<[string, ThemeTokenDefinition]>,
  group: "core" | "component",
): ColorToken[] => entries
  .filter(([, token]) => (token.group ?? "core") === group)
  .map(([name, token]) => ({
    name: `--${namespace}-${name}`,
    light: token.light,
    dark: token.dark,
    description: token.description,
    namespace,
  }));

const textEntries = Object.entries(THEME_CONFIG.text) as Array<[string, ThemeTokenDefinition]>;
const colorEntries = Object.entries(THEME_CONFIG.color) as Array<[string, ThemeTokenDefinition]>;

export const colorTokenGroups: ColorTokenGroup[] = [
  {
    id: "text-token-reference",
    title: "Text Colors",
    tokens: toTokens("text-color", textEntries, "core"),
  },
  {
    id: "color-token-reference",
    title: "Surface, State & Theme Colors",
    tokens: toTokens("color", colorEntries, "core"),
  },
  {
    id: "component-token-reference",
    title: "Component Colors",
    tokens: [
      ...toTokens("text-color", textEntries, "component"),
      ...toTokens("color", colorEntries, "component"),
    ],
  },
];

export const colorTokenCount = colorTokenGroups.reduce((count, group) => count + group.tokens.length, 0);
