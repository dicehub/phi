import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  CHART_LOADER_BARS,
  CHART_LOADER_SAMPLES,
  CHART_LOADER_WIDTH,
  buildChartLoaderBars,
  buildChartLoaderPaths,
} from "./timeseries-loader.ts";
import { isPointOutsideRect } from "./chart-boundary.ts";
import { escapeHtml } from "./tooltip-utils.ts";

test("appends an escaped, optional tooltip footer below the rows and hidden count", async () => {
  const [tooltip, marker] = await Promise.all([
    readFile(new URL("./timeseries-tooltip.ts", import.meta.url), "utf8"),
    readFile(new URL("./TimeseriesMarkerTooltip.vue", import.meta.url), "utf8"),
  ]);

  assert.match(tooltip, /footer\?: string;/);
  assert.match(
    tooltip,
    /const footer = options\.footer\s+\? `<div class="phi-chart-tooltip__footer" style="margin-top:0\.25rem;color:var\(--phi-subtle\);">\$\{escapeHtml\(options\.footer\)\}<\/div>`\s+: "";/,
  );
  assert.match(marker, /footer\?: string;/);
  assert.match(marker, /<div v-if="footer" class="phi-chart-marker-tooltip__footer">\s+\{\{ footer \}\}\s+<\/div>/);

  assert.equal(escapeHtml('<b>"5m"</b> & co'), "&lt;b&gt;&quot;5m&quot;&lt;/b&gt; &amp; co");
});

test("escapes the tooltip timestamp title and applies the custom formatter", async () => {
  const [chart, marker, tooltip] = await Promise.all([
    readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8"),
    readFile(new URL("./TimeseriesMarkerTooltip.vue", import.meta.url), "utf8"),
    readFile(new URL("./timeseries-tooltip.ts", import.meta.url), "utf8"),
  ]);

  assert.match(chart, /tooltipTimestampFormat\?: \(timestamp: number\) => string;/);
  assert.match(chart, /timestampFormat: props\.tooltipTimestampFormat,/);
  assert.match(chart, /:timestamp-format="tooltipTimestampFormat"/);
  assert.match(
    tooltip,
    /const formattedTitle =\s+typeof timestamp === "number"\s+\? \(options\.timestampFormat\?\.\(timestamp\) \?\? defaultTooltipTimestampFormat\.format\(timestamp\)\)\s+: "";/,
  );
  assert.match(
    tooltip,
    /<div style="margin-bottom:0\.25rem;font-weight:600;">\$\{escapeHtml\(formattedTitle\)\}<\/div>/,
  );
  assert.match(marker, /return props\.timestampFormat\?\.\(value\) \?\? defaultTooltipTimestampFormat\.format\(value\);/);
});

test("passes the y-axis minimum interval and tooltip footer through ECharts options", async () => {
  const [chart, marker, tooltip] = await Promise.all([
    readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8"),
    readFile(new URL("./TimeseriesMarkerTooltip.vue", import.meta.url), "utf8"),
    readFile(new URL("./timeseries-tooltip.ts", import.meta.url), "utf8"),
  ]);

  assert.match(chart, /yAxisMinInterval\?: number;/);
  assert.match(
    chart,
    /splitNumber: props\.yAxisTickCount,\s+\.\.\.\(props\.yAxisMinInterval !== undefined \? \{ minInterval: props\.yAxisMinInterval \} : \{\}\),/,
  );
  assert.match(chart, /footer: props\.tooltipFooter,/);
  assert.match(chart, /:footer="tooltipFooter"/);
  assert.match(
    tooltip,
    /const footer = options\.footer\s+\? `<div class="phi-chart-tooltip__footer" style="margin-top:0\.25rem;color:var\(--phi-subtle\);">\$\{escapeHtml\(options\.footer\)\}<\/div>`\s+: "";/,
  );
  assert.match(marker, /footer\?: string;/);
  assert.match(marker, /<div v-if="footer" class="phi-chart-marker-tooltip__footer">\s+\{\{ footer \}\}\s+<\/div>/);
});

test("reactivates brush-to-zoom after notMerge option updates", async () => {
  const source = await readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8");

  assert.match(
    source,
    /const brushResetKey = computed\(\(\) =>\s+props\.optionUpdateBehavior\?\.notMerge \? options\.value : undefined,/,
  );
  assert.match(
    source,
    /watch\(\s+\(\) => \[props\.onTimeRangeChange, props\.loading, brushResetKey\.value\],\s+\(\) => \{\s+void nextTick\(syncBrushMode\);\s+\},\s+\);/,
  );
});

test("uses mode-aware muted colors for timeseries axes and gridlines", async () => {
  const source = await readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8");

  assert.match(source, /const axisTextColor = ChartPalette\.text\("primary", props\.isDarkMode\);/);
  assert.match(source, /const gridLineColor = colorWithOpacity\(axisTextColor, 0\.2\);/);
  assert.equal(source.match(/nameTextStyle: \{ color: axisTextColor \}/g)?.length, 2);
  assert.equal(source.match(/color: axisTextColor/g)?.length, 4);
  assert.match(source, /lineStyle: \{ color: gridLineColor, type: "dashed", width: 1 \}/);
});

test("builds deterministic line and bar loading silhouettes", () => {
  const height = 350;
  const bars = buildChartLoaderBars(height);
  const paths = buildChartLoaderPaths(height);

  assert.equal(bars.length, CHART_LOADER_BARS);
  assert.ok(bars.every((bar) => bar.x >= 0 && bar.x + bar.width <= CHART_LOADER_WIDTH));
  assert.ok(bars.every((bar) => bar.height >= height * 0.15 && bar.height <= height * 0.85));
  assert.equal(paths.line.split(" ").length, CHART_LOADER_SAMPLES + 1);
  assert.match(paths.line, /^M0\.00,/);
  assert.match(paths.area, new RegExp(`L${CHART_LOADER_WIDTH},${height} L0,${height} Z$`));
});

test("exposes an accessible, type-aware, reduced-motion loading state", async () => {
  const [chart, loader, css] = await Promise.all([
    readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8"),
    readFile(new URL("./TimeseriesChartLoader.vue", import.meta.url), "utf8"),
    readFile(new URL("./chart.css", import.meta.url), "utf8"),
  ]);

  assert.match(chart, /:aria-busy="loading \|\| undefined"/);
  assert.match(chart, /<TimeseriesChartLoader/);
  assert.match(chart, /:type="type"/);
  assert.match(loader, /aria-label="Loading chart"/);
  assert.match(loader, /role="status"/);
  assert.match(loader, /:data-chart-loader="type"/);
  assert.match(loader, /v-if="type === 'bar'"/);
  assert.match(loader, /ChartPalette\.semantic\("Skeleton", props\.isDarkMode\)/);
  assert.match(css, /\.phi-chart-loader__shimmer \{[^}]*animation: phi-chart-shimmer 1\.8s ease-in-out infinite/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.phi-chart-loader__shimmer \{\s*animation: none;/);
});

test("closes a stuck marker tooltip when the pointer leaves the chart", async () => {
  const rect = { bottom: 120, left: 10, right: 110, top: 20 };

  assert.equal(isPointOutsideRect(10, 20, rect), false);
  assert.equal(isPointOutsideRect(110, 120, rect), false);
  assert.equal(isPointOutsideRect(9, 50, rect), true);
  assert.equal(isPointOutsideRect(50, 121, rect), true);

  const [chart, guard] = await Promise.all([
    readFile(new URL("./TimeseriesChart.vue", import.meta.url), "utf8"),
    readFile(new URL("./use-timeseries-tooltip-guard.ts", import.meta.url), "utf8"),
  ]);

  assert.match(chart, /useTimeseriesTooltipOutsideGuard\(markerTooltipOpen, hideMarkerTooltip\)/);
  assert.match(chart, /ref="chartContainerRef"/);
  assert.match(guard, /window\.addEventListener\("mousemove", closeWhenOutsideChart\)/);
  assert.match(guard, /window\.removeEventListener\("mousemove", closeWhenOutsideChart\)/);
  assert.equal(guard.match(/typeof window === "undefined"/g)?.length, 2);
  assert.match(guard, /onBeforeUnmount\(removeOutsideListener\)/);
});
