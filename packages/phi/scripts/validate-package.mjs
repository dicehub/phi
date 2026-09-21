import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(packageRoot, "..", "..");
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
);

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function collectExportTargets(value, targets = new Set()) {
  if (typeof value === "string") {
    targets.add(value);
    return targets;
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      collectExportTargets(nestedValue, targets);
    }
  }

  return targets;
}

function packagePath(target) {
  ensure(target.startsWith("./"), `Export target must be relative: ${target}`);
  return target.slice(2);
}

async function createPackReport() {
  let output = "";
  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    output += chunk;
  }

  ensure(output.trim(), "pnpm pack --dry-run returned no package report.");
  const parsedReport = JSON.parse(output);
  return Array.isArray(parsedReport) ? parsedReport[0] : parsedReport;
}

async function validatePackage() {
  const report = await createPackReport();
  ensure(
    report.name === packageJson.name,
    "Pack report has the wrong package name.",
  );
  ensure(
    report.version === packageJson.version,
    "Pack report has the wrong package version.",
  );
  ensure(Array.isArray(report.files), "Pack report does not contain a file list.");

  const packedFiles = new Set(report.files.map(({ path }) => path));
  const requiredFiles = new Set([
    "package.json",
    "README.md",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "CHANGELOG.md",
  ]);

  const cliBin = "bin/phi.js";
  const templateFile = /^templates\/blocks\/[a-z0-9-]+\/(?:block\.json|[A-Za-z0-9_.-]+\.vue)$/;
  const isAllowedPath = (filePath) =>
    requiredFiles.has(filePath) ||
    filePath.startsWith("dist/") ||
    filePath === cliBin ||
    templateFile.test(filePath);

  ensure(packageJson.bin?.phi === `./${cliBin}`, "package.json must map the phi bin to ./bin/phi.js.");
  ensure(packageJson.engines?.node === ">=22.12.0", "package.json must require node >=22.12.0.");
  ensure(packedFiles.has(cliBin), "Package is missing the phi CLI executable.");
  const cliContents = readFileSync(resolve(packageRoot, cliBin), "utf8");
  ensure(cliContents.startsWith("#!/usr/bin/env node"), "phi CLI is missing its shebang.");
  ensure(
    Boolean(statSync(resolve(packageRoot, cliBin)).mode & 0o111),
    "phi CLI must be executable.",
  );

  for (const requiredFile of requiredFiles) {
    ensure(packedFiles.has(requiredFile), `Package is missing ${requiredFile}.`);
  }

  const packageLicense = readFileSync(resolve(packageRoot, "LICENSE"), "utf8");
  const workspaceLicense = readFileSync(resolve(workspaceRoot, "LICENSE"), "utf8");
  ensure(packageLicense === workspaceLicense, "Root and package LICENSE files do not match.");
  ensure(
    packageLicense.includes("Copyright (c) 2026 dicehub GmbH"),
    "Phi LICENSE does not identify dicehub GmbH as the rights holder.",
  );
  ensure(
    !packageLicense.includes("Cloudflare"),
    "Third-party attribution must not replace Phi's project license.",
  );

  const thirdPartyNotices = readFileSync(
    resolve(packageRoot, "THIRD_PARTY_NOTICES.md"),
    "utf8",
  );
  for (const marker of [
    "AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY",
    "## Cloudflare Kumo",
    "Copyright (c) 2026 Cloudflare, Inc.",
    "`@ark-ui/vue@",
    "Copyright (c) 2024 Chakra UI",
  ]) {
    ensure(
      thirdPartyNotices.includes(marker),
      `Third-party notices are missing: ${marker}`,
    );
  }

  for (const filePath of packedFiles) {
    ensure(isAllowedPath(filePath), `Package contains unexpected file: ${filePath}`);
    ensure(!filePath.endsWith(".map"), `Package contains source map: ${filePath}`);
    ensure(
      !filePath.endsWith(".vue") || templateFile.test(filePath),
      `Package contains Vue source outside block templates: ${filePath}`,
    );
    ensure(
      !/(^|\/)(__tests__|tests?)(\/|$)/.test(filePath) &&
        !/\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath),
      `Package contains test code: ${filePath}`,
    );

    if (/^dist\/.*\.(?:css|d\.ts|js)$/.test(filePath) || filePath === cliBin || templateFile.test(filePath)) {
      const contents = readFileSync(resolve(packageRoot, filePath), "utf8");
      ensure(
        !/(?:KUMO_|\bKumo|data-kumo-|(?:bg|border|ring|text)-kumo-)/.test(contents),
        `Published artifact contains a Kumo-branded API or runtime identifier: ${filePath}`,
      );
      if (filePath.endsWith(".js")) {
        ensure(
          !contents.includes("sourceMappingURL="),
          `Published JavaScript references an excluded source map: ${filePath}`,
        );
      }
    }
  }

  const exportTargets = collectExportTargets(packageJson.exports);
  for (const target of [packageJson.main, packageJson.module, packageJson.types]) {
    exportTargets.add(target);
  }

  for (const target of exportTargets) {
    const filePath = packagePath(target);
    ensure(
      existsSync(resolve(packageRoot, filePath)),
      `Export is missing: ${target}`,
    );
    ensure(packedFiles.has(filePath), `Export is not packed: ${target}`);
  }

  const runtimeExports = [
    ["@dicehub/phi", "Button"],
    ["@dicehub/phi", "BannerAction"],
    ["@dicehub/phi/components/banner", "Banner"],
    ["@dicehub/phi/components/banner", "BannerAction"],
    ["@dicehub/phi/components/button", "Button"],
    ["@dicehub/phi/blocks", "DeleteResource"],
    ["@dicehub/phi/blocks/delete-resource", "DeleteResource"],
    ["@dicehub/phi/registry", "componentRegistry"],
  ];

  for (const [specifier, exportName] of runtimeExports) {
    const module = await import(specifier);
    ensure(exportName in module, `${specifier} does not export ${exportName}.`);
  }

  const bannerModule = await import("@dicehub/phi/components/banner");
  ensure(
    bannerModule.Banner.Action === bannerModule.BannerAction,
    "Banner.Action does not reference the published BannerAction component.",
  );

  for (const specifier of [
    "@dicehub/phi/styles",
    "@dicehub/phi/styles/theme",
    "@dicehub/phi/styles/standalone",
  ]) {
    const resolvedPath = fileURLToPath(import.meta.resolve(specifier));
    const filePath = relative(packageRoot, resolvedPath).split(sep).join("/");
    ensure(
      packedFiles.has(filePath),
      `${specifier} does not resolve to a packed file.`,
    );
  }

  const themePath = fileURLToPath(
    import.meta.resolve("@dicehub/phi/styles/theme"),
  );
  const themeCss = readFileSync(themePath, "utf8");
  for (const marker of [
    "AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY",
    "--phi-info-text:",
    "--phi-warning-text:",
    "--phi-danger-text:",
    "--phi-success-text:",
  ]) {
    ensure(
      themeCss.includes(marker),
      `Published theme is missing generated marker: ${marker}`,
    );
  }

  const registryModule = await import("@dicehub/phi/registry");
  const registry = registryModule.componentRegistry;
  ensure(registry.schemaVersion === 1, "Registry has an unsupported schema version.");
  ensure(registry.components.Button, "Registry is missing Button.");
  ensure(registry.components.Banner?.parts?.includes("Action"), "Registry is missing Banner.Action.");
  ensure(registryModule.getRegistryComponent("__proto__") === undefined, "Component lookup accepts inherited keys.");
  ensure(
    registryModule.getRegistryBlockTemplate("constructor") === undefined,
    "Block template lookup accepts inherited keys.",
  );
  ensure(registry.components.BannerAction, "Registry is missing BannerAction.");
  ensure(registry.components.BubbleMap, "Registry is missing chart barrel exports.");
  ensure(registry.components.CommandPalette?.parts?.includes("ResultItem"), "Registry is missing compound parts.");
  ensure(registry.components.DeleteResource?.type === "block", "Registry is missing block metadata.");

  for (const template of Object.values(registry.blockTemplates ?? {})) {
    ensure(template.delivery === "copy", `Block template ${template.name} must use copy delivery.`);
    for (const file of template.files) {
      ensure(
        packedFiles.has(file.source),
        `Block template ${template.name} source is not packed: ${file.source}`,
      );
    }
  }

  const registryJsonSpecifier = "@dicehub/phi/registry/component-registry.json";
  const registryJsonPath = fileURLToPath(import.meta.resolve(registryJsonSpecifier));
  const registryJsonFile = relative(packageRoot, registryJsonPath).split(sep).join("/");
  ensure(packedFiles.has(registryJsonFile), `${registryJsonSpecifier} does not resolve to a packed file.`);
  const registryJson = JSON.parse(readFileSync(registryJsonPath, "utf8"));
  ensure(
    JSON.stringify(registryJson) === JSON.stringify(registry),
    "Published JSON registry does not match the runtime registry.",
  );

  console.log(
    `Validated ${packedFiles.size} packed files and ${exportTargets.size} export targets.`,
  );
}

validatePackage().catch((error) => {
  console.error(`Package validation failed: ${error.message}`);
  process.exitCode = 1;
});
