import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateTailwindCSS, generateThemeCSS } from "./generate-css.mjs";
import { loadThemeConfig } from "./load-config.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "../..");
const configPath = resolve(scriptDir, "config.ts");
const checkOnly = process.argv.includes("--check");
const dryRun = process.argv.includes("--dry-run");
const listOnly = process.argv.includes("--list");
const { THEME_CONFIG } = await loadThemeConfig(configPath);
const outputs = [
  {
    name: "theme-phi.css",
    path: resolve(packageRoot, "src/styles/theme-phi.css"),
    value: generateThemeCSS(THEME_CONFIG),
  },
  {
    name: "tailwind.css",
    path: resolve(packageRoot, "src/styles/tailwind.css"),
    value: generateTailwindCSS(THEME_CONFIG),
  },
];
const tokenCount = Object.keys(THEME_CONFIG.text).length + Object.keys(THEME_CONFIG.color).length;

if (listOnly) {
  console.log(`themes: ${THEME_CONFIG.themes.map((theme) => theme === THEME_CONFIG.baseTheme ? `${theme} (base)` : theme).join(", ")}`);
  for (const [namespace, tokens] of [["text", THEME_CONFIG.text], ["color", THEME_CONFIG.color]]) {
    console.log(`${namespace} (${Object.keys(tokens).length})`);
    for (const [name, definition] of Object.entries(tokens)) {
      console.log(`  ${name}: ${definition.description}`);
      for (const [theme, values] of Object.entries(definition.theme ?? {})) {
        console.log(`    ${theme}: light ${values.light}; dark ${values.dark}`);
      }
    }
  }
} else if (dryRun) {
  for (const output of outputs) {
    process.stdout.write(`/* ${output.name} */\n${output.value}`);
  }
} else if (checkOnly) {
  const staleOutputs = outputs
    .filter((output) => readFileSync(output.path, "utf8") !== output.value)
    .map((output) => output.name);

  if (staleOutputs.length > 0) {
    throw new Error(`${staleOutputs.join(", ")} stale. Run \`pnpm --filter @dicehub/phi codegen:themes\`.`);
  }
  console.log(`Validated ${tokenCount} generated theme tokens.`);
} else {
  for (const output of outputs) writeFileSync(output.path, output.value);
  console.log(`Generated ${tokenCount} theme tokens.`);
}
