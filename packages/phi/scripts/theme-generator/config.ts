export type ThemeMode = "light" | "dark";

export type ThemeTokenValues = Record<ThemeMode, string>;

export type ThemeTokenGroup = "core" | "component";

export type ThemeTokenDefinition = ThemeTokenValues & {
  description: string;
  group?: ThemeTokenGroup;
  theme?: Readonly<Record<string, ThemeTokenValues>>;
};

export type ThemeConfig = {
  baseTheme: string;
  themes: readonly string[];
  modeSelectors: Record<ThemeMode, readonly string[]>;
  shared: Readonly<Record<string, string>>;
  text: Readonly<Record<string, ThemeTokenDefinition>>;
  color: Readonly<Record<string, ThemeTokenDefinition>>;
  legacyAliases: Readonly<Record<string, string>>;
};

type ThemeTokenOptions = Pick<ThemeTokenDefinition, "group" | "theme">;

const token = (
  light: string,
  dark: string,
  description: string,
  options: ThemeTokenOptions = {},
): ThemeTokenDefinition => ({ light, dark, description, ...options });

const same = (
  value: string,
  description: string,
  options: ThemeTokenOptions = {},
): ThemeTokenDefinition => token(value, value, description, options);

export const STATUS_TOKENS = {
  info: {
    color: { light: "oklch(0.685 0.169 237.323)", dark: "oklch(0.685 0.169 237.323)" },
    text: { light: "oklch(0.424 0.199 265.638)", dark: "oklch(0.707 0.165 254.624)" },
    tint: { light: "oklch(0.932 0.032 255.6 / 0.45)", dark: "oklch(0.38 0.145 265.5 / 0.22)" },
  },
  success: {
    color: { light: "oklch(0.596 0.145 163.225)", dark: "oklch(0.765 0.177 163.223)" },
    text: { light: "oklch(0.432 0.095 166.913)", dark: "oklch(0.905 0.093 164.15)" },
    tint: { light: "oklch(0.962 0.043 156.7 / 0.57)", dark: "oklch(0.393 0.096 152.3 / 0.2)" },
  },
  warning: {
    color: { light: "oklch(0.739 0.177 58.2)", dark: "oklch(0.645 0.168 50)" },
    text: { light: "oklch(0.597 0.144 57.5)", dark: "oklch(0.75 0.183 55.934)" },
    tint: { light: "oklch(0.931 0.107 94.6 / 0.2)", dark: "oklch(0.353 0.079 65 / 0.37)" },
  },
  danger: {
    color: { light: "oklch(0.637 0.237 25.331)", dark: "oklch(0.577 0.245 27.325)" },
    text: { light: "oklch(0.505 0.213 27.518)", dark: "oklch(0.704 0.191 22.216)" },
    tint: { light: "oklch(0.936 0.032 17.7 / 0.42)", dark: "oklch(0.429 0.176 28.7 / 0.17)" },
  },
} as const satisfies Record<string, Record<"color" | "text" | "tint", ThemeTokenValues>>;

export const AVAILABLE_THEMES = ["phi"] as const;

export const THEME_CONFIG = {
  baseTheme: "phi",
  themes: AVAILABLE_THEMES,
  modeSelectors: {
    light: [":root", '[data-mode="light"]', '[data-phi-theme="light"]:not([data-mode])'],
    dark: ['[data-mode="dark"]', '[data-phi-theme="dark"]:not([data-mode])'],
  },
  shared: {
    "--phi-font-sans": 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    "--phi-font-mono": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  text: {
    "phi-default": token("oklch(0.205 0 0)", "oklch(0.97 0 0)", "Primary body text"),
    "phi-inverse": token("oklch(0.97 0 0)", "oklch(0.205 0 0)", "Text on high-contrast surfaces"),
    "phi-strong": token("oklch(0.145 0 0)", "oklch(0.985 0 0)", "Headings and important labels"),
    "phi-subtle": token("oklch(0.556 0 0)", "oklch(0.708 0 0)", "Descriptions and secondary labels"),
    "phi-inactive": token("oklch(0.87 0 0)", "oklch(0.439 0 0)", "Disabled or inactive text"),
    "phi-placeholder": token("oklch(0.708 0 0)", "oklch(0.556 0 0)", "Input placeholder text"),
    "phi-accent": token("oklch(0.488 0.243 264.376)", "oklch(0.707 0.165 254.624)", "Accent-colored text"),
    "phi-accent-contrast": same("rgb(255, 255, 255)", "Text and icons on accent backgrounds"),
    "phi-link": token("oklch(0.424 0.199 265.638)", "oklch(0.707 0.165 254.624)", "Link text"),
    "phi-info": token(STATUS_TOKENS.info.text.light, STATUS_TOKENS.info.text.dark, "Informational text"),
    "phi-success": token(STATUS_TOKENS.success.text.light, STATUS_TOKENS.success.text.dark, "Success text"),
    "phi-warning": token(STATUS_TOKENS.warning.text.light, STATUS_TOKENS.warning.text.dark, "Warning text"),
    "phi-danger": token(STATUS_TOKENS.danger.text.light, STATUS_TOKENS.danger.text.dark, "Error or destructive text"),
    "phi-badge-orange-subtle": token("oklch(0.47 0.157 37.304)", "oklch(0.901 0.076 70.697)", "Subtle orange badge text", { group: "component" }),
    "phi-badge-teal-subtle": token("oklch(0.437 0.078 188.216)", "oklch(0.91 0.096 180.426)", "Subtle teal badge text", { group: "component" }),
    "phi-badge-neutral-subtle": token("oklch(0.269 0 0)", "oklch(0.922 0 0)", "Subtle neutral badge text", { group: "component" }),
    "phi-badge-inverted": token("rgb(255, 255, 255)", "rgb(0, 0, 0)", "Text on inverted badge backgrounds", { group: "component" }),
  },
  color: {
    "phi-canvas": token("oklch(0.9875 0 0)", "oklch(0.1 0 0)", "Outermost page canvas"),
    "phi-elevated": token("oklch(0.98 0 0)", "oklch(0.12 0 0)", "Slightly elevated surface"),
    "phi-recessed": token("oklch(0.96 0 0)", "oklch(0.15 0 0)", "Recessed surface"),
    "phi-base": token("rgb(255, 255, 255)", "oklch(0.17 0 0)", "Default component surface"),
    "phi-tint": token("oklch(0.97 0 0)", "oklch(0.269 0 0)", "Subtle tinted surface"),
    "phi-contrast": token("oklch(0.085 0 0)", "oklch(0.985 0 0)", "High-contrast inverted surface"),
    "phi-overlay": token("oklch(0.975 0 0)", "oklch(0.269 0 0)", "Transient overlay fill"),
    "phi-control": token("rgb(255, 255, 255)", "oklch(0.205 0 0)", "Form control and secondary action surface"),
    "phi-interact": token("oklch(0.87 0 0)", "oklch(0.371 0 0)", "Strong interactive state"),
    "phi-fill": token("oklch(0.922 0 0)", "oklch(0.269 0 0)", "Neutral filled state"),
    "phi-fill-hover": token("oklch(0.965 0 0)", "oklch(0.371 0 0)", "Neutral hover fill"),
    "phi-accent": token("oklch(0.5772 0.2324 260)", "oklch(0.51948 0.2324 260)", "Primary accent background"),
    "phi-accent-hover": same("oklch(0.488 0.243 264.376)", "Accent background hover state"),
    "phi-line": token("oklch(0.145 0 0 / 0.1)", "oklch(0.32 0 0)", "Defined surface edge"),
    "phi-hairline": token("oklch(0.935 0 0)", "oklch(0.269 0 0)", "Subtle flat-surface edge"),
    "phi-focus": token("oklch(0.15 0 0)", "oklch(0.935 0 0)", "Focus ring"),
    "phi-focus-soft": token("oklch(0.15 0 0 / 0.16)", "oklch(0.935 0 0 / 0.2)", "Soft focus halo"),
    "phi-shadow-edge": token("oklch(0 0 0 / 0.12)", "oklch(1 0 0 / 0.1)", "Shadow edge"),
    "phi-shadow-drop": token("oklch(0 0 0 / 0.08)", "oklch(0 0 0 / 0.3)", "Drop shadow color"),
    "phi-arrow-edge": token(
      "oklch(0.145 0 0 / 0.1)",
      "transparent",
      "Arrow border edge fill for popover and tooltip arrows",
    ),
    "phi-arrow-stroke": token(
      "transparent",
      "oklch(0.32 0 0)",
      "Arrow border stroke fill for popover and tooltip arrows",
    ),
    "phi-info-tint": token(STATUS_TOKENS.info.tint.light, STATUS_TOKENS.info.tint.dark, "Informational background tint"),
    "phi-info": token(STATUS_TOKENS.info.color.light, STATUS_TOKENS.info.color.dark, "Informational indicator"),
    "phi-success-tint": token(STATUS_TOKENS.success.tint.light, STATUS_TOKENS.success.tint.dark, "Success background tint"),
    "phi-success": token(STATUS_TOKENS.success.color.light, STATUS_TOKENS.success.color.dark, "Success indicator"),
    "phi-warning-tint": token(STATUS_TOKENS.warning.tint.light, STATUS_TOKENS.warning.tint.dark, "Warning background tint"),
    "phi-warning": token(STATUS_TOKENS.warning.color.light, STATUS_TOKENS.warning.color.dark, "Warning indicator"),
    "phi-danger-tint": token(STATUS_TOKENS.danger.tint.light, STATUS_TOKENS.danger.tint.dark, "Error background tint"),
    "phi-danger": token(STATUS_TOKENS.danger.color.light, STATUS_TOKENS.danger.color.dark, "Error or destructive indicator"),
    "phi-danger-hover": token("oklch(0.577 0.245 27.325)", "oklch(0.505 0.213 27.518)", "Destructive hover state"),
    "phi-badge-inverted": token("oklch(0.145 0 0)", "rgb(255, 255, 255)", "Inverted badge fill", { group: "component" }),
    "phi-badge-red": token("oklch(0.577 0.245 27.325)", "oklch(0.505 0.213 27.518)", "Red badge fill", { group: "component" }),
    "phi-badge-orange": same("oklch(0.815 0.197 76)", "Orange badge fill", { group: "component" }),
    "phi-badge-green": token("oklch(0.596 0.145 163.225)", "oklch(0.508 0.118 165.612)", "Green badge fill", { group: "component" }),
    "phi-badge-teal": token("oklch(0.549 0.096 184.565)", "oklch(0.511 0.096 186.391)", "Teal badge fill", { group: "component" }),
    "phi-badge-teal-subtle": token("oklch(0.95 0.052 180.801)", "oklch(0.378 0.077 180.426)", "Subtle teal badge fill", { group: "component" }),
    "phi-badge-blue": token("oklch(0.546 0.245 262.881)", "oklch(0.488 0.243 264.376)", "Blue badge fill", { group: "component" }),
    "phi-badge-purple": token("oklch(0.558 0.288 302.321)", "oklch(0.496 0.265 301.924)", "Purple badge fill", { group: "component" }),
    "phi-badge-neutral": token("oklch(0.556 0 0)", "oklch(0.439 0 0)", "Neutral badge fill", { group: "component" }),
    "phi-banner-info": token("oklch(0.932 0.032 255.585 / 0.7)", "oklch(0.379 0.146 265.522 / 0.5)", "Information banner fill", { group: "component" }),
    "phi-banner-warning": token("oklch(0.973 0.071 103.193)", "oklch(0.554 0.135 66.442 / 0.5)", "Warning banner fill", { group: "component" }),
    "phi-banner-danger": token(STATUS_TOKENS.danger.tint.light, STATUS_TOKENS.danger.tint.dark, "Error banner fill", { group: "component" }),
  },
  legacyAliases: {
    "--phi-canvas": "var(--color-phi-canvas)",
    "--phi-elevated": "var(--color-phi-elevated)",
    "--phi-recessed": "var(--color-phi-recessed)",
    "--phi-base": "var(--color-phi-base)",
    "--phi-control": "var(--color-phi-control)",
    "--phi-tint": "var(--color-phi-tint)",
    "--phi-contrast": "var(--color-phi-contrast)",
    "--phi-overlay": "var(--color-phi-overlay)",
    "--phi-interact": "var(--color-phi-interact)",
    "--phi-fill": "var(--color-phi-fill)",
    "--phi-fill-hover": "var(--color-phi-fill-hover)",
    "--phi-default": "var(--text-color-phi-default)",
    "--phi-strong": "var(--text-color-phi-strong)",
    "--phi-subtle": "var(--text-color-phi-subtle)",
    "--phi-muted": "var(--text-color-phi-placeholder)",
    "--phi-inactive": "var(--text-color-phi-inactive)",
    "--phi-hairline": "var(--color-phi-hairline)",
    "--phi-line": "var(--color-phi-line)",
    "--phi-shadow": "0 1px 2px var(--color-phi-shadow-drop)",
    "--phi-popover-shadow": "0 8px 24px -6px var(--color-phi-shadow-drop), 0 0 0 1px var(--color-phi-shadow-edge)",
    "--phi-arrow-edge": "var(--color-phi-arrow-edge)",
    "--phi-arrow-stroke": "var(--color-phi-arrow-stroke)",
    "--phi-accent": "var(--color-phi-accent)",
    "--phi-accent-hover": "var(--color-phi-accent-hover)",
    "--phi-accent-contrast": "var(--text-color-phi-accent-contrast)",
    "--phi-focus": "var(--color-phi-focus)",
    "--phi-focus-soft": "var(--color-phi-focus-soft)",
    "--phi-info": "var(--color-phi-info)",
    "--phi-info-text": "var(--text-color-phi-info)",
    "--phi-info-tint": "var(--color-phi-info-tint)",
    "--phi-success": "var(--color-phi-success)",
    "--phi-success-text": "var(--text-color-phi-success)",
    "--phi-success-tint": "var(--color-phi-success-tint)",
    "--phi-warning": "var(--color-phi-warning)",
    "--phi-warning-text": "var(--text-color-phi-warning)",
    "--phi-warning-tint": "var(--color-phi-warning-tint)",
    "--phi-danger": "var(--color-phi-danger)",
    "--phi-danger-text": "var(--text-color-phi-danger)",
    "--phi-danger-hover": "var(--color-phi-danger-hover)",
    "--phi-danger-tint": "var(--color-phi-danger-tint)",
    "--phi-badge-inverted": "var(--color-phi-badge-inverted)",
    "--phi-badge-inverted-contrast": "var(--text-color-phi-badge-inverted)",
    "--phi-badge-red": "var(--color-phi-badge-red)",
    "--phi-badge-orange": "var(--color-phi-badge-orange)",
    "--phi-badge-green": "var(--color-phi-badge-green)",
    "--phi-badge-teal": "var(--color-phi-badge-teal)",
    "--phi-badge-teal-subtle": "var(--color-phi-badge-teal-subtle)",
    "--phi-badge-teal-subtle-text": "var(--text-color-phi-badge-teal-subtle)",
    "--phi-badge-blue": "var(--color-phi-badge-blue)",
    "--phi-badge-purple": "var(--color-phi-badge-purple)",
    "--phi-badge-neutral": "var(--color-phi-badge-neutral)",
    "--phi-banner-info-bg": "var(--color-phi-info-tint)",
    "--phi-banner-info-border": "color-mix(in oklch, var(--color-phi-info) 45%, transparent)",
    "--phi-banner-info-text": "var(--text-color-phi-info)",
    "--phi-banner-alert-bg": "var(--color-phi-warning-tint)",
    "--phi-banner-alert-border": "color-mix(in oklch, var(--color-phi-warning) 45%, transparent)",
    "--phi-banner-alert-text": "var(--text-color-phi-warning)",
    "--phi-banner-error-bg": "var(--color-phi-danger-tint)",
    "--phi-banner-error-border": "color-mix(in oklch, var(--color-phi-danger) 45%, transparent)",
    "--phi-banner-error-text": "var(--text-color-phi-danger)",
  },
} as const satisfies ThemeConfig;
