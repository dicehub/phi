import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { compileScript, parse } from "vue/compiler-sfc";
import * as ark from "@ark-ui/vue/combobox";
import * as context from "./combobox-context.ts";
import * as aria from "./combobox-aria.ts";

function loadComponent(name) {
  const filename = fileURLToPath(new URL(name, import.meta.url));
  const { descriptor } = parse(readFileSync(filename, "utf8"), { filename });
  const script = compileScript(descriptor, {
    id: name,
    inlineTemplate: true,
    fs: { fileExists: existsSync, readFile: (path) => readFileSync(path, "utf8") },
  });
  const { outputText } = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const modules = {
    vue,
    "@ark-ui/vue/combobox": ark,
    "./combobox-context": context,
    "./combobox-aria": aria,
    "./ComboboxChip.vue": { default: { render: () => null } },
  };
  const exports = {};
  new Function("require", "exports", outputText)((specifier) => {
    assert.ok(Object.hasOwn(modules, specifier), `Unexpected component import: ${specifier}`);
    return modules[specifier];
  }, exports);
  return exports.default;
}

const TriggerValue = loadComponent("ComboboxTriggerValue.vue");
const TriggerMultiple = loadComponent("ComboboxTriggerMultipleWithInput.vue");

async function render(component, props, { description, label, selected = false, slot } = {}) {
  const collection = ark.createListCollection({ items: ["Apple", "Banana"] });
  return renderToString(vue.createSSRApp({
    setup() {
      context.provideComboboxContext({
        collection: vue.computed(() => collection),
        describedBy: vue.computed(() => description),
        invalid: vue.computed(() => false),
        size: vue.computed(() => "base"),
      });
      return () => vue.h(ark.Combobox.Root, {
        id: "aria-test",
        collection,
        multiple: component === TriggerMultiple,
        defaultValue: selected ? ["Apple"] : [],
      }, {
        default: () => [
          label && vue.h(ark.Combobox.Label, null, { default: () => label }),
          vue.h(component, props, slot ? { default: slot } : undefined),
        ],
      });
    },
  }));
}

const inputTag = (html) => html.match(/<input\b[^>]*class="phi-combobox-multi-input"[^>]*>/)?.[0];
const triggerTag = (html) => html.match(/<button\b[^>]*data-part="trigger"[^>]*>/)?.[0];

test("puts the multi-input name and descriptions on the input and keeps wrapper attributes", async () => {
  const html = await render(TriggerMultiple, {
    "aria-label": "Fruits",
    "aria-labelledby": "external-label",
    "aria-describedby": "custom-hint root-help custom-hint",
    class: "consumer-control",
    "data-consumer": "fruits",
  }, { description: "root-help root-error" });
  const input = inputTag(html);
  assert.ok(input);
  assert.match(input, /aria-label="Fruits"/);
  assert.match(input, /aria-labelledby="external-label"/);
  assert.match(input, /aria-describedby="custom-hint root-help root-error"/);
  assert.doesNotMatch(input, /consumer-control|data-consumer/);
  const control = html.match(/<div\b[^>]*data-part="control"[^>]*>/)?.[0];
  assert.ok(control);
  assert.match(control, /consumer-control/);
  assert.match(control, /data-consumer="fruits"/);
  assert.doesNotMatch(control, /aria-label|aria-describedby/);
});

test("keeps native label and generated description associations when ARIA props are undefined", async () => {
  const html = await render(TriggerMultiple, {
    "aria-label": undefined,
    "aria-labelledby": undefined,
    "aria-describedby": undefined,
  }, { label: "Fruit", description: "root-help" });
  assert.match(html, /<label[^>]*for="combobox:aria-test:input"/);
  assert.match(inputTag(html), /id="combobox:aria-test:input"/);
  assert.match(inputTag(html), /aria-describedby="root-help"/);
});

for (const asChild of [false, true]) {
  test(`retains value-trigger names and combined descriptions with asChild=${asChild}`, async () => {
    const html = await render(TriggerValue, {
      asChild,
      "aria-label": "Delivery fruit",
      "aria-labelledby": "delivery-label",
      "aria-describedby": "custom-hint root-help custom-hint",
    }, {
      description: "root-help root-error",
      selected: true,
      slot: ({ label }) => asChild ? vue.h("button", null, `Picked: ${label}`) : `Picked: ${label}`,
    });
    const trigger = triggerTag(html);
    assert.ok(trigger);
    assert.match(trigger, /aria-label="Delivery fruit"/);
    assert.match(trigger, /aria-labelledby="delivery-label"/);
    assert.match(trigger, /aria-describedby="custom-hint root-help root-error"/);
    assert.match(html, /Picked: Apple/);
  });
}

test("keeps caller descriptions without generated IDs and leaves an undefined name to Ark", async () => {
  const html = await render(TriggerValue, {
    "aria-label": undefined,
    "aria-describedby": "custom-hint",
    placeholder: "Choose a fruit",
  });
  assert.match(triggerTag(html), /aria-label="Toggle suggestions"/);
  assert.match(triggerTag(html), /aria-describedby="custom-hint"/);
  assert.match(html, /Choose a fruit/);
});
