import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { compileScript, parse } from "vue/compiler-sfc";
import * as banner from "./banner.ts";
import * as bannerContext from "./banner-context.ts";
import * as button from "../button/button.ts";
import * as slotContent from "../../utils/slot-content.ts";

const tooltip = vue.defineComponent({ setup: (_, { slots }) => () => slots.default?.() });
const loadComponent = async (filename, modules) => {
  const source = await readFile(new URL(filename, import.meta.url), "utf8");
  const { descriptor, errors } = parse(source, { filename });
  assert.deepEqual(errors, [], `Invalid Vue component: ${filename}`);
  const script = compileScript(descriptor, { id: filename, inlineTemplate: true });
  const { outputText } = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("require", "exports", outputText)((specifier) => {
    assert.ok(Object.hasOwn(modules, specifier), `Unexpected component import: ${specifier}`);
    return modules[specifier];
  }, exports);
  return exports.default;
};
const buttonModules = {
  vue,
  "./button": button,
  "../../utils/slot-content": slotContent,
  "../tooltip/Tooltip.vue": { default: tooltip },
};
const [Button, LinkButton] = await Promise.all([
  loadComponent("../button/Button.vue", buttonModules),
  loadComponent("../button/LinkButton.vue", buttonModules),
]);
const BannerAction = await loadComponent("./BannerAction.vue", {
  vue,
  "./banner": banner,
  "./banner-context": bannerContext,
  "../button/Button.vue": { default: Button },
  "../button/LinkButton.vue": { default: LinkButton },
});
const render = (props = {}, size = "sm") => renderToString(vue.createSSRApp({
  setup() {
    bannerContext.provideBannerContext({
      actionSize: vue.computed(() => size),
      variant: vue.computed(() => "alert"),
    });
    return () => vue.h(BannerAction, props, () => "Manage payments");
  },
}));

test("href renders a native link with banner classes, size, and external attributes", async () => {
  const html = await render({ href: "/billing", external: true, variant: "secondary", class: "custom", "data-request": "billing" }, "xs");
  assert.match(html, /^<a /);
  assert.match(html, /href="\/billing"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /data-request="billing"/);
  assert.match(html, /phi-banner-action--secondary/);
  assert.match(html, /phi-button--outline/);
  assert.match(html, /phi-button--xs/);
  assert.match(html, /custom/);
  assert.doesNotMatch(html, /<button| type=/);
});

test("an empty href is still a link while actions without href remain buttons", async () => {
  assert.match(await render({ href: "" }), /^<a [^>]*href(?:=""|(?=[ >]))/);
  assert.match(await render({ type: "submit" }), /^<button [^>]*type="submit"/);
});

test("disabled link actions drop navigation attributes", async () => {
  const html = await render({ href: "/billing", external: true, disabled: true, target: "_blank", rel: "nofollow", download: "bill.pdf", "aria-label": "Open billing" });
  assert.match(html, /^<button /);
  assert.match(html, / disabled(?:[ >])/);
  assert.match(html, /aria-label="Open billing"/);
  assert.doesNotMatch(html, /<a |href=|target=|rel=|download=/);
});

test("loading link actions preserve the spinner and cannot navigate", async () => {
  const html = await render({ href: "/billing", loading: true, target: "_blank", rel: "nofollow", download: "bill.pdf", "data-request": "billing" });
  assert.match(html, /^<button /);
  assert.match(html, / disabled(?:[ >])/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /phi-button__spinner/);
  assert.match(html, /data-request="billing"/);
  assert.doesNotMatch(html, /<a |href=|target=|rel=|download=/);
});
