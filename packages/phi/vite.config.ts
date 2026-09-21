import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import dts from "unplugin-dts/vite";
import { defineConfig, type Plugin } from "vite";

const source = (...parts: string[]) => resolve(__dirname, "src", ...parts);

const componentEntries = Object.fromEntries(
  readdirSync(source("components"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [`components/${entry.name}`, source("components", entry.name, "index.ts")]),
);

const libraryEntries = {
  index: source("index.ts"),
  ...componentEntries,
  blocks: source("blocks", "index.ts"),
  "blocks/delete-resource": source("blocks", "delete-resource", "index.ts"),
  primitives: source("primitives", "index.ts"),
  "primitives/dialog": source("primitives", "dialog.ts"),
  "primitives/field": source("primitives", "field.ts"),
  "primitives/select": source("primitives", "select.ts"),
  "primitives/tabs": source("primitives", "tabs.ts"),
  "primitives/tooltip": source("primitives", "tooltip.ts"),
  code: source("code", "index.ts"),
  "code/server": source("code", "server.ts"),
  utils: source("utils", "index.ts"),
  registry: source("registry", "index.ts"),
  "styles/index": source("styles", "index.css"),
  "styles/standalone": source("styles", "standalone.css"),
};

const preparePublishedArtifacts = (): Plugin => ({
  name: "phi-prepare-published-artifacts",
  closeBundle() {
    const stylesDir = resolve(__dirname, "dist", "styles");
    mkdirSync(stylesDir, { recursive: true });

    for (const file of ["tailwind.css", "theme-phi.css"]) {
      copyFileSync(source("styles", file), resolve(stylesDir, file));
    }

    const registryDir = resolve(__dirname, "dist", "registry");
    mkdirSync(registryDir, { recursive: true });
    copyFileSync(
      source("registry", "component-registry.json"),
      resolve(registryDir, "component-registry.json"),
    );

    for (const [entryName, entryPath] of Object.entries(libraryEntries)) {
      if (entryName === "index" || basename(entryPath) !== "index.ts") {
        continue;
      }

      const nestedEntryName = basename(entryName);
      writeFileSync(
        resolve(__dirname, "dist", `${entryName}.d.ts`),
        `export * from "./${nestedEntryName}/index.js";\n`,
      );
    }
  },
});

export default defineConfig({
  plugins: [
    vue(),
    dts({
      afterDiagnostic(diagnostics) {
        if (diagnostics.length > 0) {
          throw new Error(`Declaration generation failed with ${diagnostics.length} TypeScript diagnostic(s).`);
        }
      },
      entryRoot: "src",
      exclude: ["src/**/*.test.*"],
      include: ["src"],
      processor: "vue",
      tsconfigPath: "./tsconfig.json",
    }),
    preparePublishedArtifacts(),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: libraryEntries,
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    minify: false,
    rollupOptions: {
      external: (id) => id === "vue" || id.startsWith("vue/") || id === "echarts" || id.startsWith("echarts/"),
    },
    // Hidden maps support third-party notice discovery without adding broken
    // sourceMappingURL references to the published JavaScript. npm excludes them.
    sourcemap: "hidden",
  },
});
