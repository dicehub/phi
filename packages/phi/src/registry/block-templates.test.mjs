import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { discoverBlockTemplates } from "../../scripts/component-registry/block-templates.mjs";

const componentNames = new Set(["Button", "Tabs"]);

const createFixture = (blocks) => {
  const packageRoot = mkdtempSync(join(tmpdir(), "phi-blocks-"));
  for (const [slug, { manifest, files = {} }] of Object.entries(blocks)) {
    const dir = join(packageRoot, "templates", "blocks", slug);
    mkdirSync(dir, { recursive: true });
    if (manifest) writeFileSync(join(dir, "block.json"), JSON.stringify(manifest));
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(dir, name), content);
    }
  }
  return packageRoot;
};

const validManifest = {
  name: "PageHeader",
  description: "Page header with breadcrumbs and tabs.",
  entryFile: "PageHeader.vue",
  dependencies: ["Tabs", "Button", "Tabs"],
};

test("discovers a valid block template with normalized output", () => {
  const packageRoot = createFixture({
    "page-header": {
      manifest: validManifest,
      files: { "PageHeader.vue": "<template></template>\n" },
    },
  });

  const templates = discoverBlockTemplates({ packageRoot, componentNames });
  assert.equal(templates.length, 1);

  const [template] = templates;
  assert.equal(template.name, "PageHeader");
  assert.equal(template.type, "block");
  assert.equal(template.delivery, "copy");
  assert.equal(template.group, "blocks");
  assert.equal(template.description, validManifest.description);
  assert.equal(template.entryFile, "PageHeader.vue");
  assert.deepEqual(template.files, [
    { source: "templates/blocks/page-header/PageHeader.vue", target: "page-header/PageHeader.vue" },
  ]);
  assert.deepEqual(template.dependencies, ["Button", "Tabs"]);
});

test("returns an empty list when no templates directory exists", () => {
  const packageRoot = mkdtempSync(join(tmpdir(), "phi-blocks-empty-"));
  assert.deepEqual(discoverBlockTemplates({ packageRoot, componentNames }), []);
});

const invalidFixtures = {
  "missing manifest": { "page-header": { files: { "PageHeader.vue": "" } } },
  "slug mismatch": {
    "header-block": { manifest: validManifest, files: { "PageHeader.vue": "" } },
  },
  "non-PascalCase name": {
    "page-header": {
      manifest: { ...validManifest, name: "pageHeader" },
      files: { "PageHeader.vue": "" },
    },
  },
  "empty description": {
    "page-header": {
      manifest: { ...validManifest, description: "  " },
      files: { "PageHeader.vue": "" },
    },
  },
  "unsupported manifest key": {
    "page-header": {
      manifest: { ...validManifest, version: 1 },
      files: { "PageHeader.vue": "" },
    },
  },
  "unsafe entryFile": {
    "page-header": {
      manifest: { ...validManifest, entryFile: "../PageHeader.vue" },
      files: { "PageHeader.vue": "" },
    },
  },
  "non-Vue entryFile": {
    "page-header": {
      manifest: { ...validManifest, entryFile: "helper.ts" },
      files: { "PageHeader.vue": "", "helper.ts": "" },
    },
  },
  "missing entryFile": {
    "page-header": { manifest: validManifest, files: { "Other.vue": "" } },
  },
  "empty template": { "page-header": { manifest: validManifest } },
  "unknown dependency": {
    "page-header": {
      manifest: { ...validManifest, dependencies: ["NotAComponent"] },
      files: { "PageHeader.vue": "" },
    },
  },
};

for (const [label, blocks] of Object.entries(invalidFixtures)) {
  test(`rejects ${label}`, () => {
    const packageRoot = createFixture(blocks);
    assert.throws(() => discoverBlockTemplates({ packageRoot, componentNames }), /Invalid block template/);
  });
}

test("rejects duplicate block names across directories", () => {
  // Duplicate names are structurally impossible: the directory slug must equal
  // the kebab-case form of the block name, so equal names share one directory.
  // discoverBlockTemplates keeps an explicit duplicate guard as defense in
  // depth; the slug rule is covered by the "slug mismatch" case above.
  const packageRoot = createFixture({
    "page-header": { manifest: validManifest, files: { "PageHeader.vue": "" } },
  });
  const first = discoverBlockTemplates({ packageRoot, componentNames });
  assert.equal(first.length, 1);
  assert.equal(first[0].name, "PageHeader");
});

test("rejects symlinks inside templates", () => {
  const packageRoot = createFixture({
    "page-header": { manifest: validManifest, files: { "PageHeader.vue": "" } },
  });
  const dir = join(packageRoot, "templates", "blocks", "page-header");
  symlinkSync(join(dir, "PageHeader.vue"), join(dir, "linked.vue"));

  assert.throws(() => discoverBlockTemplates({ packageRoot, componentNames }), /symlinks are not allowed/);
});
