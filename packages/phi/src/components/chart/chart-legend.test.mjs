import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("renders non-interactive loading variants for both chart legend sizes", async () => {
  const [large, small, props, index, css] = await Promise.all([
    readFile(new URL("./ChartLegendLargeItem.vue", import.meta.url), "utf8"),
    readFile(new URL("./ChartLegendSmallItem.vue", import.meta.url), "utf8"),
    readFile(new URL("./chart-legend.ts", import.meta.url), "utf8"),
    readFile(new URL("./index.ts", import.meta.url), "utf8"),
    readFile(new URL("./chart.css", import.meta.url), "utf8"),
  ]);

  for (const component of [large, small]) {
    assert.match(component, /defineProps<ChartLegendItemProps>/);
    assert.match(component, /v-if="loading"/);
    assert.match(component, /aria-hidden="true"/);
    assert.match(component, /data-loading="true"/);
    assert.equal(component.match(/<SkeletonLine/g)?.length, 2);
  }

  assert.match(props, /loading: true/);
  assert.match(props, /loading\?: boolean/);
  assert.match(props, /Partial<ChartLegendItemContentProps>/);
  assert.match(index, /export type \{ ChartLegendItemContentProps, ChartLegendItemProps \}/);
  assert.match(css, /\.phi-chart-legend-small-item \{[^}]*height: 1rem/);
  assert.match(css, /\.phi-chart-legend__dot--loading/);
  assert.match(css, /\.phi-chart-legend-large-item \.phi-chart-legend__skeleton--large-value \{[^}]*height: 1\.25rem/);
  assert.match(css, /\.phi-chart-legend-small-item \.phi-chart-legend__skeleton--small-value \{[^}]*width: 3ch/);
});
