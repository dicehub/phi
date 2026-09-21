import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { findColorIssues, semanticTokenSets } from "../../scripts/check-semantic-colors.mjs";
import { loadThemeConfig } from "../../scripts/theme-generator/load-config.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const configPath = resolve(packageRoot, "scripts/theme-generator/config.ts");
const { THEME_CONFIG } = await loadThemeConfig(configPath);
const tokens = semanticTokenSets(THEME_CONFIG);

test("accepts semantic utility roles", () => {
  const source = 'class="bg-phi-base border-phi-hairline fill-phi-danger text-phi-default"';
  assert.deepEqual(findColorIssues(source, tokens), []);
});

test("rejects primitive colors and dark variants", () => {
  const source = 'class="bg-blue-500 dark:text-white"';
  assert.deepEqual(findColorIssues(source, tokens).map(({ type }) => type), [
    "dark-variant",
    "primitive",
    "primitive",
  ]);
});

test("rejects semantic tokens used in the wrong namespace", () => {
  const source = 'class="bg-phi-default text-phi-base"';
  assert.deepEqual(findColorIssues(source, tokens).map(({ type }) => type), [
    "unknown-token",
    "unknown-token",
  ]);
});
