import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

// Block pages may advertise `phi add <Block>` only for blocks that the generated
// registry can actually install. The CLI reference page documents the commands;
// block pages document their own block.

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = resolve(docsRoot, "../../phi/src/registry/component-registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const installableBlocks = new Set(Object.keys(registry.blockTemplates ?? {}));

const collectFiles = (dir, extension) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(path, extension);
    return entry.name.endsWith(extension) ? [path] : [];
  });

const sources = [
  ...collectFiles(join(docsRoot, "pages", "docs"), ".astro"),
  ...collectFiles(join(docsRoot, "data"), ".ts"),
];

describe("block installation docs", () => {
  it("advertises only blocks that the registry can install", () => {
    const offenders = [];

    for (const path of sources) {
      const content = readFileSync(path, "utf8");

      for (const match of content.matchAll(/phi\s+add\s+([A-Z][A-Za-z0-9]*)/g)) {
        if (!installableBlocks.has(match[1])) {
          offenders.push(`${relative(docsRoot, path)}: ${match[1]}`);
        }
      }
    }

    assert.deepEqual(offenders, []);
  });

  it("ships at least one installable block", () => {
    assert.ok(installableBlocks.size > 0, "the registry must describe installable blocks");
  });

  it("keeps the installation guide aligned with the shipped CLI", () => {
    const installation = readFileSync(join(docsRoot, "pages", "docs", "installation.astro"), "utf8");

    assert.match(installation, /pnpm dlx @dicehub\/phi init/);
    assert.match(installation, /pnpm dlx @dicehub\/phi add PageHeader/);
    assert.doesNotMatch(installation, /CLI is not available|once the CLI ships/);
  });
});
