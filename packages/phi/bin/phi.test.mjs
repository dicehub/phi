import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CliError, runCli } from "./phi.js";

const TEMPLATE_VUE = `<template><header>Page header</header></template>\n`;

const makePackageRoot = () => {
  const packageRoot = mkdtempSync(join(tmpdir(), "phi-cli-package-"));
  const templateDir = join(packageRoot, "templates", "blocks", "page-header");
  mkdirSync(templateDir, { recursive: true });
  writeFileSync(join(templateDir, "PageHeader.vue"), TEMPLATE_VUE);
  writeFileSync(join(templateDir, "block.json"), "{}");
  return packageRoot;
};

const registry = {
  components: {
    Tabs: { importPath: "@dicehub/phi/components/tabs" },
  },
  blockTemplates: {
    PageHeader: {
      name: "PageHeader",
      type: "block",
      delivery: "copy",
      group: "blocks",
      description: "Page header block.",
      entryFile: "PageHeader.vue",
      files: [{ source: "templates/blocks/page-header/PageHeader.vue", target: "page-header/PageHeader.vue" }],
      dependencies: ["Tabs"],
    },
  },
};

const makeProject = (config = true) => {
  const cwd = mkdtempSync(join(tmpdir(), "phi-cli-project-"));
  if (config) {
    writeFileSync(join(cwd, "phi.json"), `${JSON.stringify({ schemaVersion: 1, blocksDir: "src/components/phi" }, null, 2)}\n`);
  }
  return cwd;
};

const run = (args, io) => runCli(args, { packageRoot: makePackageRoot(), ...io });

test("prints help for no arguments and for help", () => {
  const cwd = makeProject();
  for (const args of [[], ["help"]]) {
    const result = run(args, { cwd, registry });
    assert.equal(result.code, 0);
    assert.match(result.out, /phi init/);
    assert.match(result.out, /phi add <BlockName>/);
  }
});

test("rejects unknown commands and options", () => {
  const cwd = makeProject();
  assert.throws(() => run(["explode"], { cwd, registry }), /Unknown command: explode/);
  assert.throws(() => run(["blocks", "--wat"], { cwd, registry }), /Unknown option: --wat/);
  assert.throws(() => run(["init", "--blocks-dir"], { cwd, registry }), /Missing value for --blocks-dir/);
  assert.throws(() => run(["init", "--blocks-dir", "--force"], { cwd, registry }), /Missing value for --blocks-dir/);
  assert.throws(() => run(["help", "extra"], { cwd, registry }), /Unexpected arguments: extra/);
  assert.throws(() => run(["add", "PageHeader", "extra"], { cwd, registry }), /Unexpected arguments: extra/);
  assert.throws(() => run(["add", "PageHeader", "--blocks-dir", "blocks"], { cwd, registry }), /not supported by add/);
  assert.throws(() => run(["blocks", "--force"], { cwd, registry }), /not supported by blocks/);
});

test("init writes stable config and respects --force", () => {
  const cwd = makeProject(false);
  const result = run(["init"], { cwd, registry });
  assert.equal(result.code, 0);
  assert.equal(
    readFileSync(join(cwd, "phi.json"), "utf8"),
    '{\n  "schemaVersion": 1,\n  "blocksDir": "src/components/phi"\n}\n',
  );

  assert.throws(() => run(["init"], { cwd, registry }), /already exists/);
  const forced = run(["init", "--blocks-dir", "app/ui", "--force"], { cwd, registry });
  assert.equal(forced.code, 0);
  assert.equal(
    readFileSync(join(cwd, "phi.json"), "utf8"),
    '{\n  "schemaVersion": 1,\n  "blocksDir": "app/ui"\n}\n',
  );
});

test("init rejects unsafe blocksDir values", () => {
  const cwd = makeProject(false);
  for (const value of ["../outside", "/abs/path", "C:/win/path", "a\\\\b", ".", "a//b"]) {
    assert.throws(() => run(["init", "--blocks-dir", value], { cwd, registry }), /Unsafe --blocks-dir/);
  }
  assert.equal(existsSync(join(cwd, "phi.json")), false);
});

test("init --force refuses a symlinked config without changing its target", () => {
  const cwd = makeProject(false);
  const outside = join(cwd, "outside.json");
  writeFileSync(outside, "unchanged\n");
  symlinkSync(outside, join(cwd, "phi.json"));

  assert.throws(() => run(["init", "--force"], { cwd, registry }), /symlink/);
  assert.equal(readFileSync(outside, "utf8"), "unchanged\n");
});

test("blocks lists templates without requiring a config", () => {
  const cwd = makeProject(false);
  const result = run(["blocks"], { cwd, registry });
  assert.match(result.out, /PageHeader/);
  assert.match(result.out, /Page header block\./);

  const empty = run(["blocks"], { cwd, registry: {} });
  assert.match(empty.out, /No installable blocks/);
});

test("add requires a valid config", () => {
  assert.throws(() => run(["add", "PageHeader"], { cwd: makeProject(false), registry }), /Missing phi\.json/);

  const malformed = makeProject(false);
  writeFileSync(join(malformed, "phi.json"), "{ nope");
  assert.throws(() => run(["add", "PageHeader"], { cwd: malformed, registry }), /not valid JSON/);

  const extraKey = makeProject(false);
  writeFileSync(join(extraKey, "phi.json"), JSON.stringify({ schemaVersion: 1, blocksDir: "x", extra: 1 }));
  assert.throws(() => run(["add", "PageHeader"], { cwd: extraKey, registry }), /exactly schemaVersion and blocksDir/);

  const badVersion = makeProject(false);
  writeFileSync(join(badVersion, "phi.json"), JSON.stringify({ schemaVersion: 2, blocksDir: "x" }));
  assert.throws(() => run(["add", "PageHeader"], { cwd: badVersion, registry }), /unsupported schemaVersion/);
});

test("add rejects unknown and wrong-case block names", () => {
  const cwd = makeProject();
  assert.throws(() => run(["add"], { cwd, registry }), /Missing block name/);
  assert.throws(() => run(["add", "pageheader"], { cwd, registry }), /Invalid block name/);
  assert.throws(() => run(["add", "Nope"], { cwd, registry }), /Unknown block: Nope/);
  assert.throws(() => run(["add", "Bad\nName"], { cwd, registry }), /Invalid block name/);
});

test("add installs template files and reports imports", () => {
  const cwd = makeProject();
  const result = run(["add", "PageHeader"], { cwd, registry });
  assert.equal(result.code, 0);
  assert.equal(
    readFileSync(join(cwd, "src", "components", "phi", "page-header", "PageHeader.vue"), "utf8"),
    TEMPLATE_VUE,
  );
  assert.match(result.out, /src\/components\/phi\/page-header\/PageHeader\.vue/);
  assert.match(result.out, /@dicehub\/phi\/components\/tabs/);
});

test("add aborts on collision without --force and writes nothing", () => {
  const cwd = makeProject();
  const twoFileRegistry = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [
          { source: "templates/blocks/page-header/PageHeader.vue", target: "page-header/PageHeader.vue" },
          { source: "templates/blocks/page-header/block.json", target: "page-header/block.json" },
        ],
      },
    },
  };

  const existingDir = join(cwd, "src", "components", "phi", "page-header");
  mkdirSync(existingDir, { recursive: true });
  writeFileSync(join(existingDir, "block.json"), "original");

  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: twoFileRegistry }), /Refusing to overwrite/);
  assert.equal(existsSync(join(existingDir, "PageHeader.vue")), false);
  assert.equal(readFileSync(join(existingDir, "block.json"), "utf8"), "original");
});

test("add --force replaces only declared files", () => {
  const cwd = makeProject();
  run(["add", "PageHeader"], { cwd, registry });

  const keepPath = join(cwd, "src", "components", "phi", "page-header", "notes.txt");
  writeFileSync(keepPath, "keep me");
  writeFileSync(join(cwd, "src", "components", "phi", "page-header", "PageHeader.vue"), "customized");

  const result = run(["add", "PageHeader", "--force"], { cwd, registry });
  assert.equal(result.code, 0);
  assert.equal(
    readFileSync(join(cwd, "src", "components", "phi", "page-header", "PageHeader.vue"), "utf8"),
    TEMPLATE_VUE,
  );
  assert.equal(readFileSync(keepPath, "utf8"), "keep me");
});

test("add preflights every destination and leaves no partial files", () => {
  const cwd = makeProject();
  const packageRoot = makePackageRoot();
  const twoFileRegistry = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [
          { source: "templates/blocks/page-header/PageHeader.vue", target: "page-header/PageHeader.vue" },
          { source: "templates/blocks/page-header/block.json", target: "page-header/block.json" },
        ],
      },
    },
  };
  const targetDir = join(cwd, "src", "components", "phi", "page-header");
  mkdirSync(join(targetDir, "block.json"), { recursive: true });

  assert.throws(
    () => runCli(["add", "PageHeader", "--force"], { cwd, packageRoot, registry: twoFileRegistry }),
    /non-regular file/,
  );
  assert.equal(existsSync(join(targetDir, "PageHeader.vue")), false);
  assert.deepEqual(readdirSync(targetDir), ["block.json"]);
});

test("add refuses symlinked path segments and destinations", () => {
  const cwd = makeProject();
  const realDir = join(cwd, "real");
  mkdirSync(realDir);
  symlinkSync(realDir, join(cwd, "src"));

  assert.throws(() => run(["add", "PageHeader"], { cwd, registry }), /symlink/);
});

test("add refuses a symlink at the final destination even with --force", () => {
  const cwd = makeProject();
  const dir = join(cwd, "src", "components", "phi", "page-header");
  mkdirSync(dir, { recursive: true });
  const outside = join(cwd, "outside.vue");
  writeFileSync(outside, "outside");
  symlinkSync(outside, join(dir, "PageHeader.vue"));

  assert.throws(() => run(["add", "PageHeader", "--force"], { cwd, registry }), /symlink/);
  assert.equal(readFileSync(outside, "utf8"), "outside");
});

test("add rejects traversal in registry sources and targets", () => {
  const cwd = makeProject();
  const evilSource = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [{ source: "templates/blocks/../phi.js", target: "page-header/x.vue" }],
      },
    },
  };
  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: evilSource }), /Unsafe template source/);

  const evilTarget = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [{ source: "templates/blocks/page-header/PageHeader.vue", target: "../escape.vue" }],
      },
    },
  };
  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: evilTarget }), /Unsafe path/);

  const outsideSource = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [{ source: "bin/phi.js", target: "page-header/x.vue" }],
      },
    },
  };
  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: outsideSource }), /Unsafe template source/);
});

test("add rejects a malformed registry entry", () => {
  const cwd = makeProject();
  const broken = { blockTemplates: { PageHeader: { name: "Other" } } };
  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: broken }), /malformed/);
});

test("add surfaces missing packaged sources", () => {
  const cwd = makeProject();
  const missing = {
    ...registry,
    blockTemplates: {
      PageHeader: {
        ...registry.blockTemplates.PageHeader,
        files: [{ source: "templates/blocks/page-header/Missing.vue", target: "page-header/Missing.vue" }],
      },
    },
  };
  assert.throws(() => run(["add", "PageHeader"], { cwd, registry: missing }), /missing from the package/);
});

test("CliError is the only expected error type", () => {
  const cwd = makeProject();
  try {
    run(["add", "Nope"], { cwd, registry });
    assert.unreachable();
  } catch (error) {
    assert.ok(error instanceof CliError);
  }
});
