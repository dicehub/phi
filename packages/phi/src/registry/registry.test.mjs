import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createComponentRegistry } from "../../scripts/component-registry/discovery.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const registry = createComponentRegistry({
  packageName: "@dicehub/phi",
  packageRoot,
  packageVersion: "test",
});

test("discovers Vue components, aliases, compound barrels, charts, and blocks", () => {
  const { components } = registry;

  assert.equal(components.Button.importPath, "@dicehub/phi/components/button");
  assert.deepEqual(components.Banner.parts, ["Action"]);
  assert.equal(components.BannerAction.sourceFile, "components/banner/BannerAction.vue");
  assert.equal(components.Textarea.sourceFile, "components/input/InputArea.vue");
  assert.equal(components.SidebarCollapsibleTrigger.sourceFile, "components/sidebar/SidebarCollapsibleTrigger.ts");
  assert.equal(components.SidebarLoading.sourceFile, "components/sidebar/SidebarLoading.vue");
  assert.ok(components.Sidebar.parts.includes("Loading"));
  assert.deepEqual(components.CommandPalette.parts, [
    "Root",
    "Dialog",
    "Empty",
    "Footer",
    "Group",
    "GroupLabel",
    "HighlightedText",
    "Input",
    "Item",
    "Items",
    "List",
    "Loading",
    "Panel",
    "ResultItem",
    "Results",
  ]);

  for (const chart of [
    "BubbleMap",
    "Chart",
    "ChartLegendLargeItem",
    "ChartLegendSmallItem",
    "ChoroplethMap",
    "SankeyChart",
    "TimeseriesChart",
  ]) {
    assert.equal(components[chart].group, "chart");
  }

  assert.equal(components.DeleteResource.type, "block");
  assert.equal(components.ChartLegend, undefined);
  assert.equal(components.ChartPalette, undefined);
});

test("generates deterministic search indexes with unique component names", () => {
  const names = Object.keys(registry.components);
  assert.deepEqual(registry.search.byName, [...names].sort((left, right) => left.localeCompare(right)));
  assert.equal(new Set(names).size, names.length);
  assert.ok(registry.search.byType.component.includes("Button"));
  assert.deepEqual(registry.search.byType.block, ["DeleteResource"]);
  assert.ok(registry.search.byGroup.chart.includes("TimeseriesChart"));
});

test("records installable block templates beside the component exports", () => {
  assert.deepEqual(Object.keys(registry.blockTemplates), ["PageHeader", "ResourceListPage"]);
  assert.deepEqual(registry.blockTemplates.ResourceListPage, {
    name: "ResourceListPage",
    type: "block",
    delivery: "copy",
    group: "blocks",
    description: "Layout block for resource list pages with an optional sticky sidebar.",
    entryFile: "ResourceListPage.vue",
    files: [
      { source: "templates/blocks/resource-list-page/ResourceListPage.vue", target: "resource-list-page/ResourceListPage.vue" },
    ],
    dependencies: [],
  });
  assert.deepEqual(registry.blockTemplates.PageHeader, {
    name: "PageHeader",
    type: "block",
    delivery: "copy",
    group: "blocks",
    description: "Page header combining breadcrumbs, an optional title and description, tabs, and actions.",
    entryFile: "PageHeader.vue",
    files: [{ source: "templates/blocks/page-header/PageHeader.vue", target: "page-header/PageHeader.vue" }],
    dependencies: ["Tabs"],
  });
  assert.equal(registry.components.PageHeader, undefined);
});
