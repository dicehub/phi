import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { generateTailwindCSS, generateThemeCSS, validateThemeConfig } from "../../scripts/theme-generator/generate-css.mjs";
import { loadThemeConfig } from "../../scripts/theme-generator/load-config.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const configPath = resolve(packageRoot, "scripts/theme-generator/config.ts");
const generatedPath = resolve(packageRoot, "src/styles/theme-phi.css");
const generatedTailwindPath = resolve(packageRoot, "src/styles/tailwind.css");
const { STATUS_TOKENS, THEME_CONFIG } = await loadThemeConfig(configPath);

const withAcmeTheme = () => ({
  ...THEME_CONFIG,
  themes: [...THEME_CONFIG.themes, "acme"],
  text: {
    ...THEME_CONFIG.text,
    "phi-link": {
      ...THEME_CONFIG.text["phi-link"],
      theme: {
        acme: { light: "oklch(0.44 0.12 175)", dark: "oklch(0.8 0.1 175)" },
      },
    },
  },
  color: {
    ...THEME_CONFIG.color,
    "phi-base": {
      ...THEME_CONFIG.color["phi-base"],
      theme: {
        acme: { light: "oklch(0.96 0.03 175)", dark: "oklch(0.2 0.03 175)" },
      },
    },
  },
});

test("keeps generated runtime and Tailwind CSS synchronized with the source config", () => {
  assert.equal(readFileSync(generatedPath, "utf8"), generateThemeCSS(THEME_CONFIG));
  assert.equal(readFileSync(generatedTailwindPath, "utf8"), generateTailwindCSS(THEME_CONFIG));
});

test("defines synchronized solid, text, and tint tokens for every status", () => {
  for (const [status, values] of Object.entries(STATUS_TOKENS)) {
    for (const mode of ["light", "dark"]) {
      assert.equal(THEME_CONFIG.color[`phi-${status}`][mode], values.color[mode]);
      assert.equal(THEME_CONFIG.text[`phi-${status}`][mode], values.text[mode]);
      assert.equal(THEME_CONFIG.color[`phi-${status}-tint`][mode], values.tint[mode]);
    }
  }
  assert.equal(STATUS_TOKENS.info.color.light, STATUS_TOKENS.info.color.dark);
  assert.match(STATUS_TOKENS.warning.tint.light, /\/ 0\.2\)$/);
  assert.match(STATUS_TOKENS.danger.tint.dark, /\/ 0\.17\)$/);
});

test("registers semantic Tailwind namespaces and explicit mode values", () => {
  const css = generateThemeCSS(THEME_CONFIG);
  const tailwindCss = generateTailwindCSS(THEME_CONFIG);

  assert.doesNotMatch(css, /@theme \{/);
  assert.match(css, /\[data-mode="dark"\],/);
  assert.match(css, /--text-color-phi-default: oklch\(/);
  assert.match(css, /--phi-base: var\(--color-phi-base\)/);
  assert.match(tailwindCss, /@import "\.\/theme-phi\.css";/);
  assert.match(tailwindCss, /@layer theme \{/);
  assert.match(tailwindCss, /@theme \{/);
  assert.match(tailwindCss, /--text-color-phi-default: light-dark\(/);
  assert.match(tailwindCss, /--color-phi-base: light-dark\(/);
});

test("generates only configured theme overrides and inherits all other base tokens", () => {
  const css = generateThemeCSS(withAcmeTheme());
  const themeSections = css
    .split("\n\n")
    .filter((section) => section.includes('[data-theme="acme"]'));
  const themeCss = themeSections.join("\n\n");

  assert.equal(themeSections.length, 3);
  assert.match(themeCss, /--color-phi-base: light-dark\(oklch\(0\.96 0\.03 175\), oklch\(0\.2 0\.03 175\)\);/);
  assert.match(themeCss, /--text-color-phi-link: light-dark\(oklch\(0\.44 0\.12 175\), oklch\(0\.8 0\.1 175\)\);/);
  assert.match(themeCss, /:is\(:root, \[data-mode="light"\], \[data-phi-theme="light"\]:not\(\[data-mode\]\)\) \[data-theme="acme"\]/);
  assert.match(themeCss, /\[data-theme="acme"\]:is\(\[data-mode="dark"\], \[data-phi-theme="dark"\]:not\(\[data-mode\]\)\)/);
  assert.match(themeCss, /\[data-theme="acme"\] :is\(\[data-mode="dark"\], \[data-phi-theme="dark"\]:not\(\[data-mode\]\)\)/);
  assert.match(themeCss, /--color-phi-base: oklch\(0\.96 0\.03 175\);/);
  assert.match(themeCss, /--color-phi-base: oklch\(0\.2 0\.03 175\);/);
  assert.match(themeCss, /--text-color-phi-link: oklch\(0\.44 0\.12 175\);/);
  assert.match(themeCss, /--text-color-phi-link: oklch\(0\.8 0\.1 175\);/);
  assert.doesNotMatch(themeCss, /--color-phi-canvas:/);
  assert.doesNotMatch(generateTailwindCSS(withAcmeTheme()), /0\.96 0\.03 175/);
});

test("rejects theme names without token overrides", () => {
  assert.throws(
    () => validateThemeConfig({ ...THEME_CONFIG, themes: [...THEME_CONFIG.themes, "empty"] }),
    /Theme empty does not override any tokens/,
  );
});

test("status-aware components use the correct semantic token roles", () => {
  const read = (path) => readFileSync(resolve(packageRoot, path), "utf8");
  const badge = read("src/components/badge/badge.css");
  const toast = read("src/components/toast/toast.css");
  const banner = read("src/components/banner/banner.css");
  const commandPalette = read("src/components/command-palette/command-palette.css");

  assert.match(badge, /--phi-danger-text/);
  assert.match(badge, /--phi-warning-text/);
  assert.match(toast, /--phi-info-text/);
  assert.match(toast, /--phi-danger-tint[^\n]+50%/);
  assert.match(banner, /--phi-banner-accent: var\(--phi-info/);
  assert.match(commandPalette, /--phi-warning[^\n]+50%/);
});
