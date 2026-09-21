import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownPages } from "./src/lib/astro-markdown-pages";
import { phiHmrPlugin } from "./src/lib/vite-plugin-phi-hmr";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const isDev = process.argv.includes("dev");
const phiStyles = resolve(__dirname, "../phi/src/styles");

export default defineConfig({
  site: "https://phi-ui.dh.fo",
  integrations: [mdx(), vue(), markdownPages()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [...(isDev ? [phiHmrPlugin()] : []), tailwindcss()],
    optimizeDeps: {
      include: [
        "@ark-ui/vue/collection",
        "@ark-ui/vue/collapsible",
        "@ark-ui/vue/combobox",
        "@ark-ui/vue/date-picker",
        "@ark-ui/vue/dialog",
        "@ark-ui/vue/menu",
        "@ark-ui/vue/popover",
        "@ark-ui/vue/select",
        "@ark-ui/vue/tabs",
        "@ark-ui/vue/tooltip",
        "@phosphor-icons/vue",
        "echarts/charts",
        "echarts/components",
        "echarts/core",
        "echarts/renderers",
      ],
    },
    resolve: {
      dedupe: ["vue"],
      alias: {
        "@dicehub/phi/styles/tailwind": resolve(phiStyles, "tailwind.css"),
        ...(isDev
          ? {
              "@dicehub/phi/styles/standalone": resolve(phiStyles, "standalone.css"),
              "@dicehub/phi/styles/theme-phi": resolve(phiStyles, "theme-phi.css"),
              "@dicehub/phi/styles/theme": resolve(phiStyles, "theme-phi.css"),
              "@dicehub/phi/styles": resolve(phiStyles, "index.css"),
            }
          : {}),
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
      defaultColor: false,
    },
  },
});
