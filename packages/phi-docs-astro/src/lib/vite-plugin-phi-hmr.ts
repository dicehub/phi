import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const phiRoot = resolve(__dirname, "../../../phi");
const phiSrc = resolve(phiRoot, "src");

const aliases: Record<string, string> = {
  "@dicehub/phi": resolve(phiSrc, "index.ts"),
  "@dicehub/phi/blocks": resolve(phiSrc, "blocks/index.ts"),
  "@dicehub/phi/code": resolve(phiSrc, "code/index.ts"),
  "@dicehub/phi/code/server": resolve(phiSrc, "code/server.ts"),
  "@dicehub/phi/primitives": resolve(phiSrc, "primitives/index.ts"),
  "@dicehub/phi/registry": resolve(phiSrc, "registry/index.ts"),
  "@dicehub/phi/styles": resolve(phiSrc, "styles/index.css"),
  "@dicehub/phi/styles/standalone": resolve(phiSrc, "styles/standalone.css"),
  "@dicehub/phi/styles/tailwind": resolve(phiSrc, "styles/tailwind.css"),
  "@dicehub/phi/styles/theme": resolve(phiSrc, "styles/theme-phi.css"),
  "@dicehub/phi/styles/theme-phi": resolve(phiSrc, "styles/theme-phi.css"),
  "@dicehub/phi/utils": resolve(phiSrc, "utils/index.ts"),
};

export function phiHmrPlugin() {
  return {
    name: "vite-plugin-phi-hmr",
    enforce: "pre" as const,

    resolveId(source: string) {
      if (aliases[source]) return aliases[source];

      if (source.startsWith("@dicehub/phi/components/")) {
        const name = source.replace("@dicehub/phi/components/", "");
        return resolve(phiSrc, `components/${name}/index.ts`);
      }

      if (source.startsWith("@dicehub/phi/blocks/")) {
        const name = source.replace("@dicehub/phi/blocks/", "");
        return resolve(phiSrc, `blocks/${name}/index.ts`);
      }

      if (source.startsWith("@dicehub/phi/primitives/")) {
        const name = source.replace("@dicehub/phi/primitives/", "");
        return resolve(phiSrc, `primitives/${name}.ts`);
      }

      return undefined;
    },

    configResolved(config: { server: { fs: { allow: string[] } } }) {
      config.server.fs.allow.push(phiRoot);
    },
  };
}
