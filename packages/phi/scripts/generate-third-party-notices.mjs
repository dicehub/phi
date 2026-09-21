import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(packageRoot, "..", "..");
const distRoot = resolve(packageRoot, "dist");
const kumoLicensePath = resolve(workspaceRoot, "third-party", "kumo", "LICENSE");
const outputPaths = [
  resolve(workspaceRoot, "THIRD_PARTY_NOTICES.md"),
  resolve(packageRoot, "THIRD_PARTY_NOTICES.md"),
];
const checkOnly = process.argv.includes("--check");
const noticeFilePattern = /^(?:licen[cs]e|copying|notice)(?:$|[-.].*)/i;

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeText(value) {
  return `${value.replaceAll("\r\n", "\n").trim()}\n`;
}

function walkFiles(root, predicate, files = []) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const entryPath = resolve(root, entry.name);
    if (entry.isDirectory()) walkFiles(entryPath, predicate, files);
    if (entry.isFile() && predicate(entry.name)) files.push(entryPath);
  }
  return files;
}

function packageRootForSource(sourcePath) {
  let current = dirname(sourcePath);

  while (current !== dirname(current)) {
    if (
      current.includes(`${sep}node_modules${sep}`) &&
      existsSync(resolve(current, "package.json"))
    ) {
      const packageJson = JSON.parse(readFileSync(resolve(current, "package.json"), "utf8"));
      if (packageJson.name && packageJson.version) return current;
    }
    current = dirname(current);
  }

  return undefined;
}

function repositoryUrl(packageJson) {
  const repository =
    typeof packageJson.repository === "string"
      ? packageJson.repository
      : packageJson.repository?.url;
  const source = repository ?? packageJson.homepage;
  if (!source) return undefined;

  return source
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "");
}

function packageNotices(packageRootPath) {
  const noticePaths = readdirSync(packageRootPath)
    .filter((name) => noticeFilePattern.test(name))
    .map((name) => resolve(packageRootPath, name))
    .filter((filePath) => statSync(filePath).isFile())
    .sort((left, right) => left.localeCompare(right));

  return noticePaths.map((filePath) => ({
    name: filePath.slice(packageRootPath.length + 1),
    text: normalizeText(readFileSync(filePath, "utf8")),
  }));
}

function bundledPackages() {
  ensure(existsSync(distRoot), "Build output is missing; run the Phi build first.");
  const sourceMaps = walkFiles(distRoot, (name) => name.endsWith(".js.map"));
  ensure(sourceMaps.length > 0, "No JavaScript source maps found in the Phi build.");

  const packages = new Map();

  for (const sourceMapPath of sourceMaps) {
    const sourceMap = JSON.parse(readFileSync(sourceMapPath, "utf8"));
    for (const source of sourceMap.sources ?? []) {
      if (typeof source !== "string" || source.startsWith("\0") || source.includes("://")) continue;
      const sourcePath = resolve(dirname(sourceMapPath), source.split("?")[0]);
      const dependencyRoot = packageRootForSource(sourcePath);
      if (!dependencyRoot) continue;

      const packageJson = JSON.parse(readFileSync(resolve(dependencyRoot, "package.json"), "utf8"));
      const key = `${packageJson.name}@${packageJson.version}`;
      if (packages.has(key)) continue;

      const notices = packageNotices(dependencyRoot);
      ensure(notices.length > 0, `${key} is bundled but has no packaged license or notice file.`);
      packages.set(key, {
        key,
        license: packageJson.license ?? "UNKNOWN",
        notices,
        repository: repositoryUrl(packageJson),
      });
    }
  }

  return [...packages.values()].sort((left, right) => left.key.localeCompare(right.key));
}

function groupedPackages(packages) {
  const groups = new Map();

  for (const packageInfo of packages) {
    const signature = JSON.stringify({
      license: packageInfo.license,
      notices: packageInfo.notices,
    });
    const group = groups.get(signature) ?? {
      license: packageInfo.license,
      notices: packageInfo.notices,
      packages: [],
    };
    group.packages.push(packageInfo);
    groups.set(signature, group);
  }

  return [...groups.values()].sort((left, right) =>
    left.packages[0].key.localeCompare(right.packages[0].key),
  );
}

function fencedText(value) {
  return `\`\`\`text\n${value}\`\`\`\n`;
}

function renderNotice() {
  ensure(existsSync(kumoLicensePath), "Canonical Kumo license is missing.");
  const packages = bundledPackages();
  const groups = groupedPackages(packages);
  const lines = [
    "<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->",
    "",
    "# Third-Party Notices",
    "",
    "This distribution includes third-party material. Phi itself is licensed under the MIT license in `LICENSE`.",
    "Regenerate this file with `pnpm --filter @dicehub/phi codegen:licenses` after building the package.",
    "",
    "## Cloudflare Kumo",
    "",
    "Phi is an independent Vue project, not a Kumo fork. Portions of its variant metadata and styling definitions",
    "were adapted from [Cloudflare Kumo](https://github.com/cloudflare/kumo) and are used under the following",
    "MIT license:",
    "",
    fencedText(normalizeText(readFileSync(kumoLicensePath, "utf8"))).trimEnd(),
    "",
    "## Bundled dependencies",
    "",
    `The built package contains code from ${packages.length} dependency packages. Packages with identical license`,
    "and notice texts are grouped without changing those texts.",
    "",
  ];

  for (const group of groups) {
    lines.push(`### ${group.packages.map(({ key }) => `\`${key}\``).join(", ")}`, "");
    lines.push(`Declared license: \`${group.license}\``, "");

    for (const packageInfo of group.packages) {
      if (packageInfo.repository) {
        lines.push(`- \`${packageInfo.key}\`: <${packageInfo.repository}>`);
      }
    }
    lines.push("");

    for (const notice of group.notices) {
      lines.push(`#### ${notice.name}`, "", fencedText(notice.text).trimEnd(), "");
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

function generate() {
  const expected = renderNotice();

  for (const outputPath of outputPaths) {
    if (checkOnly) {
      ensure(existsSync(outputPath), `${outputPath} is missing.`);
      ensure(readFileSync(outputPath, "utf8") === expected, `${outputPath} is stale.`);
    } else {
      writeFileSync(outputPath, expected);
    }
  }

  console.log(
    checkOnly
      ? "Third-party notices are current."
      : "Generated root and package third-party notices.",
  );
}

try {
  generate();
} catch (error) {
  console.error(`Third-party notice generation failed: ${error.message}`);
  process.exitCode = 1;
}
