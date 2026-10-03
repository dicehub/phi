import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { compileScript, parse } from "vue/compiler-sfc";
import * as checkbox from "./checkbox.ts";
import * as context from "./checkbox-context.ts";
import * as choiceGroup from "../../utils/choice-group.ts";

const modules = { vue, "./checkbox": checkbox, "./checkbox-context": context, "../../utils/choice-group": choiceGroup };
const loadComponent = async (filename) => {
  const source = await readFile(new URL(filename, import.meta.url), "utf8");
  const { descriptor } = parse(source, { filename });
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

modules["./CheckboxLegend.vue"] = { default: await loadComponent("./CheckboxLegend.vue") };
const [Group, Item] = await Promise.all([
  loadComponent("./CheckboxGroup.vue"),
  loadComponent("./CheckboxItem.vue"),
]);
const render = (groupProps, itemProps, slots) => renderToString(vue.createSSRApp({
  render: () => vue.h(Group, groupProps, {
    default: () => vue.h(Item, { label: "Email", value: "email", ...itemProps }, slots),
  }),
}));

test("card items inherit group appearance and selection with descriptions", async () => {
  const html = await render({ appearance: "card", defaultValue: ["email"], name: "products" }, {
    description: "Email updates",
  });
  assert.match(html, /phi-checkbox--joined/);
  assert.match(html, /phi-checkbox--label-first/);
  assert.match(html, /data-state="checked"/);
  assert.match(html, /name="products"/);
  assert.match(html, /phi-checkbox__description[^>]*>(?:<!--.*?-->)*Email updates/);
});

test("items override group appearance and keep appearance-specific control order", async () => {
  const plain = await render({ appearance: "card" }, { appearance: "default", description: "Hidden description" });
  assert.doesNotMatch(plain, /phi-checkbox--joined|phi-checkbox--label-first|Hidden description/);

  const separateCard = await render({}, { appearance: "card" });
  assert.match(separateCard, /phi-checkbox--appearance-card/);
  assert.match(separateCard, /phi-checkbox--label-first/);
  assert.doesNotMatch(separateCard, /phi-checkbox--joined/);
});

test("explicit control order takes precedence over appearance defaults", async () => {
  const controlFirst = await render({ appearance: "card", controlFirst: true }, {});
  assert.doesNotMatch(controlFirst, /phi-checkbox--label-first/);

  const itemOverride = await render({ appearance: "card", controlFirst: true }, { controlFirst: false });
  assert.match(itemOverride, /phi-checkbox--label-first/);
  const defaultItem = await render({}, {});
  assert.doesNotMatch(defaultItem, /phi-checkbox--label-first/);
});

test("card items retain disabled and mixed states and rich description slots", async () => {
  const html = await render({ appearance: "card", disabled: true }, { indeterminate: true }, {
    description: () => vue.h("strong", "Partly selected"),
  });
  assert.match(html, /phi-checkbox--disabled/);
  assert.match(html, /<input[^>]*disabled/);
  assert.match(html, /aria-checked="mixed"/);
  assert.match(html, /data-state="indeterminate"/);
  assert.match(html, /<strong>Partly selected<\/strong>/);
});
