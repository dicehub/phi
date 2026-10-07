import assert from "node:assert/strict";
import { test } from "node:test";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { LocaleProvider, useLocale } from "./locale-provider.ts";

const Probe = defineComponent({
  setup() {
    const locale = useLocale();
    return () => h("span", `${locale.value.label.optional}|${locale.value.label.tooltip}`);
  },
});
const render = (component) => renderToString(createSSRApp({ render: () => component }));

test("uses English defaults without a provider", async () => {
  assert.equal(await render(h(Probe)), "<span>(optional)|More information</span>");
});
test("merges partial translations and preserves explicit empty text", async () => {
  const html = await render(h(LocaleProvider, { translations: { label: { optional: "" } } }, { default: () => h(Probe) }));
  assert.match(html, /<span>\|More information<\/span>/);
});
test("inherits untranslated text from a parent provider", async () => {
  const html = await render(h(LocaleProvider, { translations: { label: { optional: "(opcional)" } } }, {
    default: () => h(LocaleProvider, { translations: { label: { tooltip: "Ajuda" } } }, { default: () => h(Probe) }),
  }));
  assert.match(html, /<span>\(opcional\)\|Ajuda<\/span>/);
  assert.equal(await render(h(Probe)), "<span>(optional)|More information</span>");
});
