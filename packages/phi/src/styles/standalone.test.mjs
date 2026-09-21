import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const standalonePath = resolve(sourceRoot, "styles", "standalone.css");

function findCssFiles(directory) {
  const cssFiles = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      cssFiles.push(...findCssFiles(entryPath));
    } else if (entry.name.endsWith(".css")) {
      cssFiles.push(entryPath);
    }
  }

  return cssFiles;
}

function collectImportedCss(filePath, imported = new Set()) {
  const source = readFileSync(filePath, "utf8");
  const imports = source.matchAll(/@import\s+["']([^"']+\.css)["']\s*;/g);

  for (const [, specifier] of imports) {
    if (!specifier.startsWith(".")) {
      continue;
    }

    const importedPath = resolve(dirname(filePath), specifier);
    if (!imported.has(importedPath)) {
      imported.add(importedPath);
      collectImportedCss(importedPath, imported);
    }
  }

  return imported;
}

test("standalone styles include every authored package stylesheet", () => {
  const authoredStyles = ["components", "blocks", "code"].flatMap((directory) =>
    findCssFiles(resolve(sourceRoot, directory)),
  );
  const importedStyles = collectImportedCss(standalonePath);
  const missingStyles = authoredStyles
    .filter((filePath) => !importedStyles.has(filePath))
    .map((filePath) => relative(sourceRoot, filePath))
    .sort();

  assert.deepEqual(missingStyles, []);
});
