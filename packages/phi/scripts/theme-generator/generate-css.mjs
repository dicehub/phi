const GENERATED_HEADER = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 *
 * Edit scripts/theme-generator/config.ts and run:
 * pnpm --filter @dicehub/phi codegen:themes
 */`;

const MODES = ["light", "dark"];
const THEME_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

const validateValues = (label, values) => {
  for (const mode of MODES) {
    if (typeof values?.[mode] !== "string" || values[mode].length === 0) {
      throw new Error(`${label} is missing a ${mode} value.`);
    }
  }
};

const validateTokenGroup = (namespace, tokens, themeNames, baseTheme, overrideCounts) => {
  for (const [name, definition] of Object.entries(tokens ?? {})) {
    if (!name.startsWith("phi-")) {
      throw new Error(`Invalid ${namespace} token name: ${name}`);
    }

    validateValues(name, definition);

    for (const [theme, values] of Object.entries(definition.theme ?? {})) {
      if (theme === baseTheme) {
        throw new Error(`${name} repeats the base theme ${baseTheme}. Use its light and dark values instead.`);
      }
      if (!themeNames.has(theme)) {
        throw new Error(`${name} uses unconfigured theme ${theme}.`);
      }
      validateValues(`${name} theme ${theme}`, values);
      overrideCounts.set(theme, (overrideCounts.get(theme) ?? 0) + 1);
    }

    if (typeof definition.description !== "string" || definition.description.length === 0) {
      throw new Error(`${name} is missing a description.`);
    }
  }
};

export function validateThemeConfig(config) {
  if (!Array.isArray(config.themes) || config.themes.length === 0) {
    throw new Error("Theme config must define at least one theme.");
  }

  const themeNames = new Set(config.themes);
  if (themeNames.size !== config.themes.length) throw new Error("Theme names must be unique.");
  for (const theme of themeNames) {
    if (!THEME_NAME_PATTERN.test(theme)) throw new Error(`Invalid theme name: ${theme}`);
  }
  if (!themeNames.has(config.baseTheme)) {
    throw new Error(`Base theme ${config.baseTheme} is not included in the configured themes.`);
  }

  for (const mode of MODES) {
    if (!Array.isArray(config.modeSelectors?.[mode]) || config.modeSelectors[mode].length === 0) {
      throw new Error(`Theme config is missing ${mode} mode selectors.`);
    }
  }

  const overrideCounts = new Map();
  validateTokenGroup("text", config.text, themeNames, config.baseTheme, overrideCounts);
  validateTokenGroup("color", config.color, themeNames, config.baseTheme, overrideCounts);

  for (const theme of themeNames) {
    if (theme !== config.baseTheme && !overrideCounts.has(theme)) {
      throw new Error(`Theme ${theme} does not override any tokens.`);
    }
  }

  for (const [name, value] of Object.entries(config.legacyAliases ?? {})) {
    if (!name.startsWith("--phi-")) throw new Error(`Invalid legacy alias name: ${name}`);
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`${name} is missing an alias value.`);
    }
  }
}

const renderThemeBlock = (namespace, entries) => {
  const lines = ["@theme {"];

  for (const [name, definition] of entries) {
    lines.push(`  --${namespace}-${name}: light-dark(${definition.light}, ${definition.dark});`);
  }

  lines.push("}");
  return lines;
};

const renderTokenDeclarations = (namespace, entries, mode) =>
  entries.map(([name, definition]) => `  --${namespace}-${name}: ${definition[mode]};`);

const renderThemeDeclarations = (namespace, entries, theme, mode) => entries.flatMap(([name, definition]) => {
  const values = definition.theme?.[theme];
  if (!values) return [];

  const value = mode ? values[mode] : `light-dark(${values.light}, ${values.dark})`;
  return [`  --${namespace}-${name}: ${value};`];
});

const renderThemeModeSelectors = (theme, modeSelectors, includeDefault = false) => {
  const themeSelector = `[data-theme="${theme}"]`;
  const modeSelector = `:is(${modeSelectors.join(", ")})`;

  return [
    ...(includeDefault ? [themeSelector] : []),
    `${modeSelector} ${themeSelector}`,
    `${themeSelector}${modeSelector}`,
    `${themeSelector} ${modeSelector}`,
  ];
};

const renderPlainDeclarations = (entries, indentation = "  ") =>
  entries.map(([name, value]) => `${indentation}${name}: ${value};`);

export function generateThemeCSS(config) {
  validateThemeConfig(config);

  const textEntries = Object.entries(config.text);
  const colorEntries = Object.entries(config.color);
  const aliasEntries = Object.entries(config.legacyAliases);
  const lines = [
    GENERATED_HEADER,
    "",
    ":root {",
    ...renderPlainDeclarations(Object.entries(config.shared)),
    "}",
  ];

  for (const mode of MODES) {
    lines.push(
      "",
      `${config.modeSelectors[mode].join(",\n")} {`,
      `  color-scheme: ${mode};`,
      ...renderTokenDeclarations("text-color", textEntries, mode),
      ...renderTokenDeclarations("color", colorEntries, mode),
      "}",
    );
  }

  for (const theme of config.themes) {
    if (theme === config.baseTheme) continue;
    lines.push(
      "",
      `[data-theme="${theme}"] {`,
      ...renderThemeDeclarations("text-color", textEntries, theme),
      ...renderThemeDeclarations("color", colorEntries, theme),
      "}",
    );

    // Explicit values prevent transient unresolved light-dark() values while
    // browsers recalculate styles after theme or mode DOM mutations.
    for (const mode of MODES) {
      lines.push(
        "",
        `${renderThemeModeSelectors(theme, config.modeSelectors[mode], mode === "light").join(",\n")} {`,
        ...renderThemeDeclarations("text-color", textEntries, theme, mode),
        ...renderThemeDeclarations("color", colorEntries, theme, mode),
        "}",
      );
    }
  }

  lines.push(
    "",
    ":root,",
    "[data-mode],",
    "[data-phi-theme]:not([data-mode]),",
    "[data-theme] {",
    ...renderPlainDeclarations(aliasEntries),
    "}",
  );

  return `${lines.join("\n")}\n`;
}

export function generateTailwindCSS(config) {
  validateThemeConfig(config);

  const textTheme = renderThemeBlock("text-color", Object.entries(config.text));
  const colorTheme = renderThemeBlock("color", Object.entries(config.color));

  return `${[
    GENERATED_HEADER,
    "",
    '@import "./theme-phi.css";',
    "",
    "@layer theme {",
    ...textTheme.map((line) => `  ${line}`),
    "",
    ...colorTheme.map((line) => `  ${line}`),
    "}",
  ].join("\n")}\n`;
}
