#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import {
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG_FILE = "phi.json";
const DEFAULT_BLOCKS_DIR = "src/components/phi";
const TEMPLATES_PREFIX = "templates/blocks/";

const HELP = `phi — Phi block installer

Usage:
  phi help
  phi init [--blocks-dir <relative-path>] [--force]
  phi blocks
  phi add <BlockName> [--force]

Commands:
  help     Print this help.
  init     Create phi.json with the block install directory.
  blocks   List installable blocks.
  add      Copy a block's source files into your project.

phi.json:
  { "schemaVersion": 1, "blocksDir": "src/components/phi" }
`;

export class CliError extends Error {}

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Relative POSIX paths only. Blocks absolute paths, Windows separators and
// drive letters, UNC paths, control characters, and dot segments.
const isSafeRelativePath = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  !/^[\\/]/.test(value) &&
  !/^[A-Za-z]:/.test(value) &&
  !value.includes("\\") &&
  !/[\u0000-\u001F\u007F]/.test(value) &&
  value.split("/").every((segment) => segment !== "." && segment !== ".." && segment !== "");

const toPosix = (value) => value.split(sep).join("/");

const isMissingError = (error) => error instanceof Error && "code" in error && error.code === "ENOENT";

const safeUnlink = (path) => {
  try {
    unlinkSync(path);
  } catch (error) {
    if (!isMissingError(error)) throw error;
  }
};

const createTemporaryFile = (destination, contents) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const temporary = join(
      dirname(destination),
      `.${basename(destination)}.${process.pid}.${randomBytes(8).toString("hex")}.phi-tmp`,
    );
    let descriptor;

    try {
      descriptor = openSync(temporary, "wx", 0o666);
      writeFileSync(descriptor, contents);
      closeSync(descriptor);
      descriptor = undefined;
      return temporary;
    } catch (error) {
      if (descriptor !== undefined) {
        try {
          closeSync(descriptor);
        } finally {
          safeUnlink(temporary);
        }
      }
      if (error instanceof Error && "code" in error && error.code === "EEXIST") continue;
      throw error;
    }
  }

  throw new CliError(`Cannot create a temporary file beside ${basename(destination)}.`);
};

const createBackupPath = (destination) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const backup = join(
      dirname(destination),
      `.${basename(destination)}.${process.pid}.${randomBytes(8).toString("hex")}.phi-backup`,
    );
    if (!existsSync(backup)) return backup;
  }

  throw new CliError(`Cannot reserve a backup path beside ${basename(destination)}.`);
};

const readConfig = (projectRoot) => {
  const configPath = join(projectRoot, CONFIG_FILE);
  if (!existsSync(configPath)) {
    throw new CliError(`Missing ${CONFIG_FILE}. Run \`phi init\` first.`);
  }
  if (!lstatSync(configPath).isFile()) {
    throw new CliError(`${CONFIG_FILE} is not a regular file.`);
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(configPath, "utf8"));
  } catch {
    throw new CliError(`${CONFIG_FILE} is not valid JSON.`);
  }

  if (!isPlainObject(parsed)) {
    throw new CliError(`${CONFIG_FILE} must contain a JSON object.`);
  }
  const keys = Object.keys(parsed).sort();
  if (keys.join(",") !== "blocksDir,schemaVersion") {
    throw new CliError(`${CONFIG_FILE} supports exactly schemaVersion and blocksDir.`);
  }
  if (parsed.schemaVersion !== 1) {
    throw new CliError(`${CONFIG_FILE} has an unsupported schemaVersion.`);
  }
  if (!isSafeRelativePath(parsed.blocksDir)) {
    throw new CliError(`${CONFIG_FILE} has an unsafe blocksDir path.`);
  }

  return { blocksDir: parsed.blocksDir };
};

// Resolves a project-relative destination and proves it stays inside the
// project: the nearest existing ancestor must resolve inside the project
// root, and no existing path segment may be a symlink.
const resolveProjectPath = (projectRoot, relativePath) => {
  if (!isSafeRelativePath(relativePath)) {
    throw new CliError(`Unsafe path: ${relativePath}`);
  }

  const absolute = resolve(projectRoot, relativePath);
  if (absolute !== projectRoot && !absolute.startsWith(projectRoot + sep)) {
    throw new CliError(`Path escapes the project: ${relativePath}`);
  }

  let ancestor = absolute;
  while (!existsSync(ancestor)) {
    const parent = dirname(ancestor);
    if (parent === ancestor) throw new CliError(`Cannot anchor path: ${relativePath}`);
    ancestor = parent;
  }
  const realAncestor = realpathSync(ancestor);
  if (realAncestor !== projectRoot && !realAncestor.startsWith(projectRoot + sep)) {
    throw new CliError(`Path escapes the project through a link: ${relativePath}`);
  }

  let cursor = projectRoot;
  const rel = relative(projectRoot, absolute);
  if (rel !== "") {
    for (const segment of rel.split(sep)) {
      cursor = join(cursor, segment);
      try {
        if (lstatSync(cursor).isSymbolicLink()) {
          throw new CliError(`Refusing to follow a symlink: ${toPosix(rel)}`);
        }
      } catch (error) {
        if (error instanceof CliError) throw error;
        if (error.code !== "ENOENT") throw error;
      }
    }
  }

  return absolute;
};

const writePlanAtomically = (projectRoot, plan) => {
  const staged = [];
  const committed = [];

  try {
    for (const entry of plan) {
      resolveProjectPath(projectRoot, toPosix(relative(projectRoot, entry.destination)));
      mkdirSync(dirname(entry.destination), { recursive: true });
      resolveProjectPath(projectRoot, toPosix(relative(projectRoot, entry.destination)));

      let existing = false;
      try {
        const stats = lstatSync(entry.destination);
        if (!stats.isFile()) {
          throw new CliError(`Refusing to replace a non-regular file: ${entry.target}`);
        }
        existing = true;
      } catch (error) {
        if (!isMissingError(error)) throw error;
      }

      staged.push({
        ...entry,
        existing,
        temporary: createTemporaryFile(entry.destination, entry.contents),
      });
    }

    for (const entry of staged) {
      let backup;
      if (entry.existing) {
        backup = createBackupPath(entry.destination);
        renameSync(entry.destination, backup);
      }

      try {
        renameSync(entry.temporary, entry.destination);
      } catch (error) {
        if (backup) renameSync(backup, entry.destination);
        throw error;
      }
      committed.push({ ...entry, backup });
    }
  } catch (error) {
    for (const entry of committed.reverse()) {
      safeUnlink(entry.destination);
      if (entry.backup) renameSync(entry.backup, entry.destination);
    }
    for (const entry of staged) safeUnlink(entry.temporary);
    if (error instanceof CliError) throw error;
    throw new CliError(`File installation failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  for (const { backup } of committed) {
    if (backup) safeUnlink(backup);
  }
};

const readTemplateFile = (packageRoot, templatesRootReal, source) => {
  if (!isSafeRelativePath(source) || !source.startsWith(TEMPLATES_PREFIX)) {
    throw new CliError(`Unsafe template source in the registry: ${source}`);
  }
  const absolute = resolve(packageRoot, source);
  let stats;
  try {
    stats = lstatSync(absolute);
  } catch {
    throw new CliError(`Template file is missing from the package: ${source}`);
  }
  if (!stats.isFile()) {
    throw new CliError(`Template source is not a regular file: ${source}`);
  }
  if (!realpathSync(absolute).startsWith(templatesRootReal + sep)) {
    throw new CliError(`Template source escapes the package templates: ${source}`);
  }
  return readFileSync(absolute);
};

const getBlockTemplate = (registry, name) => {
  const templates = isPlainObject(registry?.blockTemplates) ? registry.blockTemplates : {};
  const template = Object.hasOwn(templates, name) ? templates[name] : undefined;
  if (!template) return undefined;
  if (
    !isPlainObject(template) ||
    template.name !== name ||
    template.delivery !== "copy" ||
    typeof template.entryFile !== "string" ||
    !Array.isArray(template.files) ||
    template.files.length === 0 ||
    !Array.isArray(template.dependencies)
  ) {
    throw new CliError(`Registry entry for ${name} is malformed.`);
  }
  return template;
};

const commandHelp = () => ({ code: 0, out: HELP });

const commandInit = ({ flags, projectRoot }) => {
  const blocksDir = flags.blocksDir ?? DEFAULT_BLOCKS_DIR;
  if (!isSafeRelativePath(blocksDir)) {
    throw new CliError(`Unsafe --blocks-dir path: ${blocksDir}`);
  }

  const configPath = resolveProjectPath(projectRoot, CONFIG_FILE);
  if (existsSync(configPath) && !flags.force) {
    throw new CliError(`${CONFIG_FILE} already exists. Pass --force to overwrite it.`);
  }

  if (existsSync(configPath) && !lstatSync(configPath).isFile()) {
    throw new CliError(`${CONFIG_FILE} is not a regular file.`);
  }

  const contents = `${JSON.stringify({ schemaVersion: 1, blocksDir }, null, 2)}\n`;
  writePlanAtomically(projectRoot, [
    { contents, destination: configPath, target: CONFIG_FILE },
  ]);
  return { code: 0, out: `Created ${CONFIG_FILE} with blocksDir "${blocksDir}".\n` };
};

const commandBlocks = ({ registry }) => {
  const templates = isPlainObject(registry?.blockTemplates) ? registry.blockTemplates : {};
  const names = Object.keys(templates).sort((left, right) => left.localeCompare(right));
  if (names.length === 0) {
    return { code: 0, out: "No installable blocks are available in this version of @dicehub/phi.\n" };
  }
  const lines = names.map((name) => `${name}  ${templates[name].description ?? ""}`.trimEnd());
  return { code: 0, out: `Installable blocks:\n${lines.join("\n")}\n` };
};

const commandAdd = ({ name, flags, projectRoot, registry, packageRoot }) => {
  if (!name) throw new CliError("Missing block name. Usage: phi add <BlockName>");
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new CliError("Invalid block name. Run `phi blocks` to list installable blocks.");
  }
  const template = getBlockTemplate(registry, name);
  if (!template) {
    throw new CliError(`Unknown block: ${name}. Run \`phi blocks\` to list installable blocks.`);
  }

  const { blocksDir } = readConfig(projectRoot);
  const templatesRootReal = realpathSync(join(packageRoot, "templates"));

  // Preflight: validate every source and destination before any write.
  const plan = template.files.map((file) => {
    if (!isPlainObject(file)) throw new CliError(`Registry entry for ${name} is malformed.`);
    if (!isSafeRelativePath(file.target)) throw new CliError(`Unsafe path: ${file.target}`);
    const contents = readTemplateFile(packageRoot, templatesRootReal, file.source);
    const destination = resolveProjectPath(projectRoot, join(blocksDir, file.target));
    return { contents, destination, target: toPosix(join(blocksDir, file.target)) };
  });

  const collisions = plan.filter(({ destination }) => {
    try {
      lstatSync(destination);
      return true;
    } catch {
      return false;
    }
  });
  if (collisions.length > 0 && !flags.force) {
    const list = collisions.map(({ target }) => `  ${target}`).join("\n");
    throw new CliError(`Refusing to overwrite existing files:\n${list}\nPass --force to replace them.`);
  }

  writePlanAtomically(projectRoot, plan);

  const installed = plan.map(({ target }) => `  ${target}`).join("\n");
  const imports = template.dependencies
    .map((dependency) => {
      const components = registry?.components;
      return isPlainObject(components) && Object.hasOwn(components, dependency)
        ? components[dependency]?.importPath
        : undefined;
    })
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
  const importLines = imports.length
    ? `\nRequired Phi imports:\n${imports.map((path) => `  ${path}`).join("\n")}`
    : "";
  return { code: 0, out: `Installed ${name}:\n${installed}\n${importLines}\n` };
};

export const runCli = (args, io) => {
  const { cwd, registry, packageRoot } = io;
  const projectRoot = realpathSync(cwd);

  const positional = [];
  const flags = { force: false, blocksDir: undefined };
  const seenFlags = new Set();
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      flags.force = true;
      seenFlags.add("--force");
    } else if (arg === "--blocks-dir") {
      const value = args[index + 1];
      if (value === undefined || value.startsWith("--")) throw new CliError("Missing value for --blocks-dir.");
      flags.blocksDir = value;
      seenFlags.add("--blocks-dir");
      index += 1;
    } else if (arg.startsWith("--")) {
      throw new CliError(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  const [command, ...rest] = positional;
  const run =
    command === undefined || command === "help"
      ? commandHelp
      : command === "init"
        ? commandInit
        : command === "blocks"
          ? commandBlocks
          : command === "add"
            ? commandAdd
            : null;

  if (!run) throw new CliError(`Unknown command: ${command}. Run \`phi help\`.`);
  if (command === "add" && rest.length > 1) {
    throw new CliError(`Unexpected arguments: ${rest.slice(1).join(" ")}`);
  }
  if (command !== "add" && rest.length > 0) {
    throw new CliError(`Unexpected arguments: ${rest.join(" ")}`);
  }

  const allowedFlags = new Set(command === "init" ? ["--force", "--blocks-dir"] : command === "add" ? ["--force"] : []);
  for (const flag of seenFlags) {
    if (!allowedFlags.has(flag)) throw new CliError(`${flag} is not supported by ${command ?? "help"}.`);
  }

  return run({ name: rest[0], flags, projectRoot, registry, packageRoot });
};

const loadRegistry = (packageRoot) => {
  const registryPath = join(packageRoot, "dist", "registry", "component-registry.json");
  try {
    return JSON.parse(readFileSync(registryPath, "utf8"));
  } catch {
    throw new CliError("Cannot read the packaged component registry. Reinstall @dicehub/phi.");
  }
};

const invokedAsScript = (() => {
  const scriptPath = process.argv[1];
  if (!scriptPath) return false;
  try {
    return realpathSync(scriptPath) === fileURLToPath(import.meta.url);
  } catch {
    return resolve(scriptPath) === fileURLToPath(import.meta.url);
  }
})();

if (invokedAsScript) {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  try {
    const result = runCli(process.argv.slice(2), {
      cwd: process.cwd(),
      registry: loadRegistry(packageRoot),
      packageRoot,
    });
    process.stdout.write(result.out);
    process.exitCode = result.code;
  } catch (error) {
    if (error instanceof CliError) {
      process.stderr.write(`phi: ${error.message}\n`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
