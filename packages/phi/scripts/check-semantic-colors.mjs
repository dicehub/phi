import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadThemeConfig } from "./theme-generator/load-config.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(packageRoot, "src");
const configPath = resolve(packageRoot, "scripts/theme-generator/config.ts");
const sourceExtensions = new Set([".css", ".js", ".mjs", ".ts", ".tsx", ".vue"]);
const primitiveFamilies = new Set([
  "amber", "black", "blue", "cyan", "emerald", "fuchsia", "gray", "green",
  "indigo", "lime", "neutral", "orange", "pink", "purple", "red", "rose",
  "sky", "slate", "stone", "teal", "violet", "white", "yellow", "zinc",
]);
const tokenPattern = /\b((?:[a-z-]+:)*(bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-([a-z][a-z0-9-]*(?:\/\d{1,3})?))/gi;

export function semanticTokenSets(config) {
  return {
    color: new Set(Object.keys(config.color)),
    text: new Set(Object.keys(config.text)),
  };
}

export function findColorIssues(source, tokens) {
  const issues = [];
  const darkPattern = /\bdark:[a-z]+[-\w]*/gi;
  let match;

  while ((match = darkPattern.exec(source))) {
    issues.push({ index: match.index, token: match[0], type: "dark-variant" });
  }

  tokenPattern.lastIndex = 0;
  while ((match = tokenPattern.exec(source))) {
    const [, fullToken, prefix, rawName] = match;
    const name = rawName.replace(/\/\d{1,3}$/, "");
    const family = name.replace(/-\d{1,3}$/, "");

    if (primitiveFamilies.has(family)) {
      issues.push({ index: match.index, token: fullToken, type: "primitive" });
      continue;
    }

    if (!name.startsWith("phi-")) continue;
    const namespace = prefix.toLowerCase() === "text" ? tokens.text : tokens.color;
    if (!namespace.has(name)) {
      issues.push({ index: match.index, token: fullToken, type: "unknown-token" });
    }
  }

  return issues;
}

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(path));
    else if (sourceExtensions.has(extname(entry.name)) && !entry.name.includes(".test.")) files.push(path);
  }

  return files;
}

const lineAt = (source, index) => source.slice(0, index).split("\n").length;

async function run() {
  const { THEME_CONFIG } = await loadThemeConfig(configPath);
  const tokens = semanticTokenSets(THEME_CONFIG);
  const files = await collectSourceFiles(sourceRoot);
  const failures = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const issue of findColorIssues(source, tokens)) {
      failures.push(`${file.slice(packageRoot.length + 1)}:${lineAt(source, issue.index)} ${issue.type}: ${issue.token}`);
    }
  }

  if (failures.length > 0) {
    console.error("Use Phi semantic colors. Raw colors, dark: variants, and unknown Phi tokens are not allowed.\n");
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(`Semantic color check passed for ${files.length} source files.`);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) await run();
