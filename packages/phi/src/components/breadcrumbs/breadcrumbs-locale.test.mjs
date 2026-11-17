import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { compileScript, parse } from "vue/compiler-sfc";
import * as breadcrumbs from "./breadcrumbs.ts";
import * as locale from "../../utils/locale-provider.ts";
import * as button from "../button/button.ts";
import * as slotContent from "../../utils/slot-content.ts";

const load = async (filename, modules) => {
  const source = await readFile(new URL(filename, import.meta.url), "utf8");
  const { descriptor, errors } = parse(source, { filename });
  assert.deepEqual(errors, []);
  const script = compileScript(descriptor, { id: filename, inlineTemplate: true });
  const { outputText } = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("require", "exports", outputText)((name) => {
    assert.ok(Object.hasOwn(modules, name), `Unexpected import: ${name}`);
    return modules[name];
  }, exports);
  return exports.default;
};
// Check the real Button's tooltip input; browser tests cover the popup itself.
const Tooltip = vue.defineComponent({
  props: ["content"],
  setup: (props, { slots }) => () => vue.h("div", { "data-tooltip": props.content }, slots.default?.()),
});
const Button = await load("../button/Button.vue", {
  vue, "./button": button, "../../utils/slot-content": slotContent,
  "../tooltip/Tooltip.vue": { default: Tooltip },
});
const Breadcrumbs = await load("./Breadcrumbs.vue", {
  vue, "./breadcrumbs": breadcrumbs, "../../utils/locale-provider": locale,
});
const Clipboard = await load("./BreadcrumbsClipboard.vue", {
  vue, "../button": { Button }, "../../utils/locale-provider": locale,
});
const trail = (props = {}, copyProps = {}) => vue.h(Breadcrumbs, props, {
  default: () => [vue.h("span", "Settings"), vue.h(Clipboard, { text: "/settings", ...copyProps })],
});
const provider = (translations, child) => vue.h(locale.LocaleProvider, { translations }, { default: child });
const render = (component) => renderToString(vue.createSSRApp({ render: () => component }));
const french = { breadcrumbs: { label: "Fil d’Ariane", copy: "Copier", copyTooltip: "Cliquer pour copier", copied: "Copié" } };

test("keeps English defaults without a provider and with legacy label-only translations", async () => {
  for (const component of [trail(), provider({ label: { optional: "(facultatif)", tooltip: "Aide" } }, () => trail())]) {
    const html = await render(component);
    assert.match(html, /<nav[^>]*aria-label="breadcrumb"/);
    assert.match(html, /<button[^>]*aria-label="Copy"/);
    assert.match(html, /data-tooltip="Click to copy"/);
  }
});

test("translates the landmark, clipboard button, and tooltip", async () => {
  const html = await render(provider(french, () => trail()));
  assert.match(html, /<nav[^>]*aria-label="Fil d’Ariane"/);
  assert.match(html, /<button[^>]*aria-label="Copier"/);
  assert.match(html, /data-tooltip="Cliquer pour copier"/);
});

test("explicit landmark labels override translations and preserve empty values", async () => {
  for (const label of ["Page path", ""]) {
    const html = await render(provider(french, () => trail({ "aria-label": label, "data-consumer": "trail" })));
    const nav = html.match(/<nav[^>]*>/)[0];
    // Vue SSR serializes an empty string as a bare attribute.
    assert.ok(nav.includes(label ? `aria-label="${label}"` : "aria-label>"), nav);
    assert.match(nav, /data-consumer="trail"/);
  }
});

test("partial nested providers inherit unspecified breadcrumb text", async () => {
  const html = await render(provider(french, () => provider({ breadcrumbs: { copyTooltip: "Copier ce lien" } }, () => trail())));
  assert.match(html, /<nav[^>]*aria-label="Fil d’Ariane"/);
  assert.match(html, /<button[^>]*aria-label="Copier"/);
  assert.match(html, /data-tooltip="Copier ce lien"/);
  const outside = await render(trail());
  assert.match(outside, /aria-label="breadcrumb"/);
});

test("clipboard attributes keep consumer label and tooltip overrides", async () => {
  const html = await render(provider(french, () => trail({}, { "aria-label": "Copy address", title: "Copy this address" })));
  assert.match(html, /<button[^>]*aria-label="Copy address"/);
  assert.match(html, /data-tooltip="Copy this address"/);
});
