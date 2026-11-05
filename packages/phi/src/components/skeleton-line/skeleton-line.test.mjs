import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { compileScript, parse } from "vue/compiler-sfc";
import * as skeletonLine from "./skeleton-line.ts";

const filename = "SkeletonLine.vue";
const source = await readFile(new URL(filename, import.meta.url), "utf8");
const { descriptor } = parse(source, { filename });
const script = compileScript(descriptor, { id: filename, inlineTemplate: true });
const { outputText } = ts.transpileModule(script.content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const modules = { vue, "./skeleton-line": skeletonLine };
const exports = {};
new Function("require", "exports", outputText)((specifier) => {
  assert.ok(Object.hasOwn(modules, specifier), `Unexpected component import: ${specifier}`);
  return modules[specifier];
}, exports);
const render = (props = {}) => renderToString(vue.createSSRApp({
  render: () => vue.h(exports.default, props),
}));

test("keeps the default line without sketch layers", async () => {
  const html = await render();
  assert.match(html, /class="phi-skeleton-line"/);
  assert.doesNotMatch(html, /phi-skeleton-line__(?:fill|stroke|outline)/);
  assert.doesNotMatch(html, /phi-skeleton-line__block/);
});

test("renders a sketch fill, four strokes, and outline with custom width and timing", async () => {
  const html = await render({ variant: "sketch", minWidth: 40, maxWidth: 40, minDuration: 2, maxDuration: 2, minDelay: 0.25, maxDelay: 0.25 });
  assert.match(html, /data-variant="sketch"/);
  assert.match(html, /--skeleton-width:40%;/);
  assert.match(html, /--shimmer-duration:2\.00s;/);
  assert.match(html, /--shimmer-delay:0\.25s;/);
  assert.equal(html.match(/class="phi-skeleton-line__fill"/g)?.length, 1);
  assert.equal(html.match(/class="phi-skeleton-line__stroke /g)?.length, 4);
  assert.equal(html.match(/class="phi-skeleton-line__outline"/g)?.length, 1);
});

test("keeps classes and attributes on the sketch line inside its block", async () => {
  for (const [blockHeight, expectedHeight] of [[28, "28px"], ["2rem", "2rem"]]) {
    const html = await render({ variant: "sketch", blockHeight, className: "h-9 w-32", "data-request": "pending" });
    assert.match(html, new RegExp(`class="phi-skeleton-line__block" style="height:${expectedHeight};"`));
    assert.match(html, /<div data-request="pending" class="phi-skeleton-line phi-skeleton-line--sketch h-9 w-32"/);
    assert.match(html, /data-variant="sketch"/);
  }
});

test("uses the default line for an unsupported runtime variant", async () => {
  const html = await render({ variant: "unknown" });
  assert.match(html, /data-variant="default"/);
  assert.doesNotMatch(html, /phi-skeleton-line--sketch/);
});
