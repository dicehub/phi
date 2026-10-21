import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as echarts from "echarts";
import ts from "typescript";
import * as vue from "vue";
import { compileScript, parse } from "vue/compiler-sfc";

// Exercise source components before the package build, with ECharts' real brush model.
const modules = new Map([["vue", vue]]);
const hiddenComponent = { render: () => null };
function loadSource(specifier) {
  if (modules.has(specifier)) return modules.get(specifier);
  if (["./TimeseriesChartLoader.vue", "./TimeseriesMarkerTooltip.vue"].includes(specifier)) {
    return { default: hiddenComponent };
  }
  const filename = specifier.endsWith(".vue") ? specifier : `${specifier}.ts`;
  let source = readFileSync(new URL(filename, import.meta.url), "utf8");
  if (filename.endsWith(".vue")) {
    const { descriptor, errors } = parse(source, { filename });
    assert.deepEqual(errors, []);
    source = compileScript(descriptor, { id: filename, inlineTemplate: true }).content;
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("require", "exports", outputText)(loadSource, exports);
  modules.set(specifier, exports);
  return exports;
}

const TimeseriesChart = loadSource("./TimeseriesChart.vue").default;
const renderer = vue.createRenderer({
  createElement: (tag) => ({ tag, children: [] }),
  createText: (text) => ({ text }),
  createComment: (text) => ({ text }),
  setText: (node, text) => { node.text = text; },
  setElementText: (node, text) => { node.text = text; },
  patchProp() {},
  parentNode: (node) => node.parent,
  nextSibling: () => null,
  insert(node, parent) { node.parent = parent; parent.children.push(node); },
  remove(node) {
    const siblings = node.parent?.children;
    if (siblings) siblings.splice(siblings.indexOf(node), 1);
  },
});

for (const [label, notMerge, markers] of [
  ["default merging without markers", false, []],
  ["notMerge without markers", true, []],
  ["notMerge with markers", true, [{ timestamp: 1_700_000_000_000, label: "Deployment" }]],
]) {
  for (const mutation of ["append", "replace timestamp"]) {
    test(`retains drag selection after ${mutation} with ${label}`, async (t) => {
      const originalObserver = Object.getOwnPropertyDescriptor(globalThis, "ResizeObserver");
      Object.defineProperty(globalThis, "ResizeObserver", {
        configurable: true,
        value: class { observe() {} disconnect() {} },
      });
      t.after(() => {
        if (originalObserver) Object.defineProperty(globalThis, "ResizeObserver", originalObserver);
        else delete globalThis.ResizeObserver;
      });
      let chart;
      const api = {
        ...echarts,
        init: () => (chart = echarts.init(null, undefined, {
          renderer: "svg", ssr: true, width: 600, height: 300,
        })),
      };
      const data = vue.ref([{
        name: "Requests", color: "#123456",
        data: [[1_700_000_000_000, 10], [1_700_000_100_000, 20]],
      }]);
      const app = renderer.createApp({
        render: () => vue.h(TimeseriesChart, {
          echarts: api,
          data: data.value,
          markers,
          optionUpdateBehavior: { notMerge, lazyUpdate: false },
          onTimeRangeChange() {},
        }),
      });
      app.mount({ children: [] });
      t.after(() => app.unmount());
      const flush = async () => { for (let i = 0; i < 4; i++) await vue.nextTick(); };
      const brushType = () => chart.getModel().getComponent("brush").brushOption.brushType;
      await flush();
      assert.equal(brushType(), "lineX");

      if (mutation === "append") data.value[0].data.push([1_700_000_200_000, 30]);
      else data.value[0].data[1][0] += 60_000;
      await flush();
      assert.deepEqual(chart.getOption().series[0].data, vue.toRaw(data.value[0].data));
      assert.equal(brushType(), "lineX", "data updates must retain drag selection");
    });
  }
}
