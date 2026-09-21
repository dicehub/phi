import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const BLOCKS_GROUP = "blocks";
const MANIFEST_KEYS = new Set(["name", "description", "entryFile", "dependencies"]);

const toPosix = (value) => value.split(sep).join("/");

const kebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const fail = (slug, reason) => {
  throw new Error(`Invalid block template "${slug}": ${reason}`);
};

// Relative POSIX paths only. Blocks absolute paths, Windows separators and
// drive letters, control characters, and any dot segment.
const isSafeRelativePath = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  !/^[\\/]/.test(value) &&
  !/^[A-Za-z]:/.test(value) &&
  !value.includes("\\") &&
  !/[\u0000-\u001F\u007F]/.test(value) &&
  !value.split("/").some((segment) => segment === "." || segment === ".." || segment === "");

const listTemplateFiles = (dir, root, slug) => {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) fail(slug, `symlinks are not allowed: ${toPosix(relative(root, path))}`);
    if (entry.isDirectory()) {
      files.push(...listTemplateFiles(path, root, slug));
      continue;
    }
    if (!entry.isFile()) fail(slug, `non-regular file: ${toPosix(relative(root, path))}`);
    if (!realpathSync(path).startsWith(realpathSync(root) + sep)) {
      fail(slug, `file escapes the template directory: ${toPosix(relative(root, path))}`);
    }
    files.push(path);
  }

  return files;
};

const readManifest = (manifestPath, slug) => {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    fail(slug, "block.json is not valid JSON");
  }

  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    fail(slug, "block.json must be a JSON object");
  }

  const keys = Object.keys(manifest);
  for (const key of keys) {
    if (!MANIFEST_KEYS.has(key)) fail(slug, `unsupported block.json key: ${key}`);
  }

  const { name, description, entryFile, dependencies = [] } = manifest;

  if (typeof name !== "string" || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    fail(slug, "name must be a PascalCase string");
  }
  if (kebabCase(name) !== slug) {
    fail(slug, `directory "${slug}" does not match the kebab-case form of "${name}"`);
  }
  if (typeof description !== "string" || description.trim() === "") {
    fail(slug, "description must be a non-empty string");
  }
  if (!isSafeRelativePath(entryFile) || !entryFile.endsWith(".vue")) {
    fail(slug, "entryFile must be a safe relative path to a Vue file");
  }
  if (!Array.isArray(dependencies) || dependencies.some((dependency) => typeof dependency !== "string")) {
    fail(slug, "dependencies must be an array of component names");
  }

  return { name, description: description.trim(), entryFile, dependencies };
};

export const discoverBlockTemplates = ({ packageRoot, componentNames }) => {
  const templatesRoot = join(packageRoot, "templates", "blocks");
  if (!existsSync(templatesRoot)) return [];
  if (!statSync(templatesRoot).isDirectory()) {
    throw new Error("Invalid block templates: templates/blocks is not a directory");
  }

  const slugs = readdirSync(templatesRoot, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      if (!entry.isDirectory()) {
        throw new Error(`Invalid block templates: ${entry.name} is not a directory`);
      }
      return entry.name;
    });

  const templates = [];
  const seenNames = new Set();
  const seenTargets = new Map();

  for (const slug of slugs) {
    const templateDir = join(templatesRoot, slug);
    const manifestPath = join(templateDir, "block.json");
    if (!existsSync(manifestPath)) fail(slug, "missing block.json");

    const manifest = readManifest(manifestPath, slug);
    if (seenNames.has(manifest.name)) fail(slug, `duplicate block name: ${manifest.name}`);
    seenNames.add(manifest.name);

    const sources = listTemplateFiles(templateDir, templateDir, slug)
      .map((path) => toPosix(relative(templateDir, path)))
      .filter((path) => path !== "block.json")
      .sort((left, right) => left.localeCompare(right));

    if (sources.length === 0) fail(slug, "template has no files");
    if (!sources.includes(manifest.entryFile)) {
      fail(slug, `entryFile is not part of the template: ${manifest.entryFile}`);
    }

    const files = sources.map((source) => {
      const target = `${slug}/${source}`;
      const key = target.toLowerCase();
      const owner = seenTargets.get(key);
      if (owner && owner !== target) fail(slug, `target collides with ${owner}: ${target}`);
      if (owner === target) fail(slug, `duplicate target: ${target}`);
      seenTargets.set(key, target);
      return { source: `templates/blocks/${slug}/${source}`, target };
    });

    const dependencies = [...new Set(manifest.dependencies)].sort((left, right) => left.localeCompare(right));
    for (const dependency of dependencies) {
      if (!componentNames.has(dependency)) {
        fail(slug, `unknown component dependency: ${dependency}`);
      }
    }

    templates.push({
      name: manifest.name,
      type: "block",
      delivery: "copy",
      group: BLOCKS_GROUP,
      description: manifest.description,
      entryFile: manifest.entryFile,
      files,
      dependencies,
    });
  }

  return templates.sort((left, right) => left.name.localeCompare(right.name));
};

export const blockTemplatesToRecord = (templates) =>
  Object.fromEntries(templates.map((template) => [template.name, template]));
