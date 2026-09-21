import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(packageRoot, "..", "..");
const fixtureRoot = resolve(
  packageRoot,
  "scripts",
  "fixtures",
  "package-consumer",
);
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
);
const workspaceJson = JSON.parse(
  readFileSync(resolve(workspaceRoot, "package.json"), "utf8"),
);
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const temporaryPrefix = resolve(tmpdir(), "phi-package-consumer-");
const temporaryRoot = mkdtempSync(temporaryPrefix);
const consumerTooling = [
  "@types/node",
  "@vitejs/plugin-vue",
  "typescript",
  "vite",
  "vue-tsc",
];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function commandLabel(command, args) {
  return [command, ...args].join(" ");
}

function run(command, args, options = {}) {
  const {
    capture = false,
    cwd = packageRoot,
    input,
    printCommand = true,
  } = options;

  if (printCommand) {
    console.log(`\n> ${commandLabel(command, args)}`);
  }

  const stdio = capture
    ? ["ignore", "pipe", "inherit"]
    : input === undefined
      ? "inherit"
      : ["pipe", "inherit", "inherit"];
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    input,
    stdio,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (capture && result.stdout) {
      process.stderr.write(result.stdout);
    }
    throw new Error(
      `${commandLabel(command, args)} exited with status ${result.status}.`,
    );
  }

  return result.stdout ?? "";
}

function runQuietly(command, args, cwd = packageRoot) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "ignore",
  });

  if (result.error) {
    throw result.error;
  }

  return result.status === 0;
}

function exportTarget(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && typeof value.import === "string") {
    return value.import;
  }

  return undefined;
}

function packageSpecifier(exportPath) {
  return exportPath === "."
    ? packageJson.name
    : `${packageJson.name}/${exportPath.slice(2)}`;
}

function collectEntrypoints() {
  const entrypoints = Object.entries(packageJson.exports).map(
    ([exportPath, value]) => ({
      exportPath,
      specifier: packageSpecifier(exportPath),
      target: exportTarget(value),
    }),
  );

  return {
    assets: entrypoints.filter(({ target }) =>
      target?.match(/\.(css|json)$/),
    ),
    modules: entrypoints.filter(({ target }) => target?.endsWith(".js")),
  };
}

function sideEffectImports(entrypoints) {
  return `${entrypoints
    .map(({ specifier }) => `import ${JSON.stringify(specifier)};`)
    .join("\n")}\n`;
}

function consumerManifest(tarballPath) {
  const devDependencies = packageJson.devDependencies;

  return {
    name: "phi-package-consumer",
    private: true,
    type: "module",
    packageManager: workspaceJson.packageManager,
    dependencies: {
      [packageJson.name]: `file:${tarballPath}`,
      echarts: devDependencies.echarts,
      vue: devDependencies.vue,
    },
    devDependencies: {
      "@types/node": devDependencies["@types/node"],
      "@vitejs/plugin-vue": devDependencies["@vitejs/plugin-vue"],
      typescript: devDependencies.typescript,
      vite: devDependencies.vite,
      "vue-tsc": devDependencies["vue-tsc"],
    },
  };
}

function prepareConsumer(consumerRoot, tarballPath) {
  cpSync(fixtureRoot, consumerRoot, { recursive: true });

  const { assets, modules } = collectEntrypoints();
  const browserModules = modules.filter(
    ({ exportPath }) => exportPath !== "./code/server",
  );
  const sourceRoot = resolve(consumerRoot, "src");

  writeFileSync(
    resolve(consumerRoot, "package.json"),
    `${JSON.stringify(consumerManifest(tarballPath), null, 2)}\n`,
  );
  writeFileSync(
    resolve(sourceRoot, "all-exports.ts"),
    sideEffectImports(modules),
  );
  writeFileSync(
    resolve(sourceRoot, "browser-exports.ts"),
    sideEffectImports(browserModules),
  );
  writeFileSync(
    resolve(sourceRoot, "package-assets.ts"),
    sideEffectImports(assets),
  );
  writeFileSync(
    resolve(consumerRoot, "runtime-imports.mjs"),
    `const specifiers = ${JSON.stringify(
      modules.map(({ specifier }) => specifier),
      null,
      2,
    )};\n\nfor (const specifier of specifiers) {\n  await import(specifier);\n}\n\nconsole.log(\`Imported \${specifiers.length} installed JavaScript entrypoints.\`);\n`,
  );

  return { assetCount: assets.length, moduleCount: modules.length };
}

function dependencyPath(name) {
  return resolve(packageRoot, "node_modules", ...name.split("/"));
}

function linkDependency(consumerRoot, name) {
  const sourcePath = dependencyPath(name);
  ensure(
    existsSync(sourcePath),
    `Declared consumer dependency is not installed in the workspace: ${name}`,
  );

  const targetPath = resolve(consumerRoot, "node_modules", ...name.split("/"));
  mkdirSync(dirname(targetPath), { recursive: true });
  symlinkSync(realpathSync(sourcePath), targetPath, "junction");
}

function installTarball(consumerRoot, tarballPath) {
  const unpackRoot = resolve(temporaryRoot, "unpacked");
  const installedPackageRoot = resolve(
    consumerRoot,
    "node_modules",
    ...packageJson.name.split("/"),
  );
  mkdirSync(unpackRoot, { recursive: true });
  mkdirSync(dirname(installedPackageRoot), { recursive: true });

  run("tar", ["-xzf", tarballPath, "-C", unpackRoot]);
  renameSync(resolve(unpackRoot, "package"), installedPackageRoot);

  const installedManifest = JSON.parse(
    readFileSync(resolve(installedPackageRoot, "package.json"), "utf8"),
  );
  ensure(
    installedManifest.name === packageJson.name &&
      installedManifest.version === packageJson.version,
    "Installed tarball metadata does not match the source package.",
  );

  const declaredDependencies = new Set([
    ...Object.keys(installedManifest.dependencies ?? {}),
    ...Object.keys(installedManifest.peerDependencies ?? {}),
    ...consumerTooling,
  ]);
  for (const dependency of declaredDependencies) {
    linkDependency(consumerRoot, dependency);
  }

  console.log(
    `Installed the tarball with ${declaredDependencies.size} declared dependencies and consumer tools.`,
  );

  return installedPackageRoot;
}

async function validateInstalledCli(consumerRoot, installedPackageRoot) {
  const cliProject = resolve(consumerRoot, "cli-project");
  const cliPath = resolve(installedPackageRoot, "bin", "phi.js");
  const registry = JSON.parse(
    readFileSync(resolve(installedPackageRoot, "dist", "registry", "component-registry.json"), "utf8"),
  );
  const cliModule = await import(pathToFileURL(cliPath).href);
  mkdirSync(cliProject, { recursive: true });

  const runInstalledCli = (args) => {
    console.log(`\n> ${cliPath} ${args.join(" ")}`);
    return cliModule.runCli(args, {
      cwd: cliProject,
      packageRoot: installedPackageRoot,
      registry,
    }).out;
  };
  const help = runInstalledCli(["help"]);
  ensure(help.includes("phi add <BlockName>"), "Installed CLI help is incomplete.");

  runInstalledCli(["init", "--blocks-dir", "src/components/phi"]);
  ensure(
    readFileSync(resolve(cliProject, "phi.json"), "utf8") ===
      '{\n  "schemaVersion": 1,\n  "blocksDir": "src/components/phi"\n}\n',
    "Installed CLI wrote an unexpected phi.json.",
  );

  const blocks = runInstalledCli(["blocks"])
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.trim().split(/\s+/, 1)[0]);
  ensure(
    JSON.stringify(blocks) === JSON.stringify(["PageHeader", "ResourceListPage"]),
    `Installed CLI returned an unexpected block list: ${blocks.join(", ")}`,
  );

  runInstalledCli(["add", "PageHeader"]);
  runInstalledCli(["add", "ResourceListPage"]);

  const pageHeaderPath = resolve(cliProject, "src", "components", "phi", "page-header", "PageHeader.vue");
  const resourceListPath = resolve(
    cliProject,
    "src",
    "components",
    "phi",
    "resource-list-page",
    "ResourceListPage.vue",
  );
  for (const templatePath of [pageHeaderPath, resourceListPath]) {
    ensure(existsSync(templatePath), `Installed CLI did not copy ${templatePath}.`);
    ensure(!readFileSync(templatePath, "utf8").includes("Kumo"), `Copied template contains Kumo: ${templatePath}`);
  }
  ensure(
    readFileSync(pageHeaderPath, "utf8").includes('@dicehub/phi/components/tabs'),
    "Copied PageHeader does not use its final Phi import.",
  );

  const consumerBlocksRoot = resolve(consumerRoot, "src", "components", "phi");
  cpSync(resolve(cliProject, "src", "components", "phi"), consumerBlocksRoot, { recursive: true });
  writeFileSync(
    resolve(consumerRoot, "src", "copied-blocks.ts"),
    [
      'import PageHeader from "./components/phi/page-header/PageHeader.vue";',
      'import ResourceListPage from "./components/phi/resource-list-page/ResourceListPage.vue";',
      "void PageHeader;",
      "void ResourceListPage;",
      "",
    ].join("\n"),
  );
  appendFileSync(resolve(consumerRoot, "src", "main.ts"), '\nimport "./copied-blocks";\n');
}

function validateAttw(tarballPath) {
  const configPath = resolve(packageRoot, ".attw.json");
  const args = [
    "exec",
    "attw",
    tarballPath,
    "--config-path",
    configPath,
  ];

  console.log("\n> Checking ESM and TypeScript resolution with ATTW");
  if (runQuietly(pnpmCommand, [...args, "--quiet"])) {
    console.log("ATTW package resolution checks passed.");
    return;
  }

  run(pnpmCommand, [...args, "--no-color", "--no-emoji"]);
}

function cleanup() {
  const resolvedRoot = resolve(temporaryRoot);
  ensure(
    resolvedRoot.startsWith(`${temporaryPrefix}`),
    `Refusing to clean unexpected temporary path: ${resolvedRoot}`,
  );
  rmSync(resolvedRoot, { force: true, recursive: true });
}

async function validatePackageConsumer() {
  const tarballRoot = resolve(temporaryRoot, "tarball");
  const consumerRoot = resolve(temporaryRoot, "consumer");
  mkdirSync(tarballRoot, { recursive: true });

  try {
    const tarballName = `${packageJson.name
      .replace(/^@/, "")
      .replaceAll("/", "-")}-${packageJson.version}.tgz`;
    const tarballPath = resolve(tarballRoot, tarballName);
    run(pnpmCommand, ["pack", "--out", tarballPath], { capture: true });
    ensure(existsSync(tarballPath), `Packed tarball is missing: ${tarballPath}`);
    ensure(
      tarballPath.startsWith(`${tarballRoot}${sep}`),
      `Packed tarball escaped its temporary directory: ${tarballPath}`,
    );

    run(pnpmCommand, ["exec", "publint", tarballPath, "--strict"]);
    validateAttw(tarballPath);

    const counts = prepareConsumer(consumerRoot, tarballPath);
    const installedPackageRoot = installTarball(consumerRoot, tarballPath);
    await validateInstalledCli(consumerRoot, installedPackageRoot);
    run(process.execPath, [resolve(consumerRoot, "runtime-imports.mjs")], {
      cwd: consumerRoot,
    });
    run(resolve(packageRoot, "node_modules", ".bin", "vue-tsc"), ["--noEmit"], {
      cwd: consumerRoot,
    });
    run(resolve(packageRoot, "node_modules", ".bin", "vite"), ["build"], {
      cwd: consumerRoot,
    });

    console.log(
      `Validated the installed package through ${counts.moduleCount} JavaScript entrypoints and ${counts.assetCount} asset entrypoints.`,
    );
  } finally {
    cleanup();
  }
}

validatePackageConsumer().catch((error) => {
  console.error(`Package consumer validation failed: ${error.message}`);
  process.exitCode = 1;
});
