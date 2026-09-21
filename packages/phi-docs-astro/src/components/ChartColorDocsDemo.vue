<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Chart, ChartPalette } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { BarChart, HeatmapChart, LineChart, PieChart } from "echarts/charts";
import {
  AriaComponent,
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { PhiChartOption } from "@dicehub/phi/components/chart";

type DemoVariant =
  | "categorical"
  | "categorical-bar"
  | "categorical-cvd"
  | "categorical-donut"
  | "categorical-line"
  | "semantic"
  | "sequential"
  | "sequential-heatmap"
  | "systems";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "systems",
  },
);

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  BarChart,
  CanvasRenderer,
  GridComponent,
  HeatmapChart,
  LegendComponent,
  LineChart,
  PieChart,
  TooltipComponent,
  VisualMapComponent,
]);

const semanticNames = ["Attention", "Warning", "Success", "Neutral", "Disabled", "Skeleton"] as const;
const categoricalIndices = [0, 1, 2, 3, 4, 5];
const colorSystemRows = [
  {
    system: "Semantic",
    when: "Data has inherent polarity - good/bad, pass/fail, blocked/allowed",
    task: "Evaluate",
    examples: "Error rates, health, severity, status",
  },
  {
    system: "Categorical",
    when: "Nominal categories with no inherent order or polarity",
    task: "Identify",
    examples: "Countries, URLs, services, versions",
  },
  {
    system: "Sequential",
    when: "Single metric varying in magnitude - more = darker",
    task: "Read magnitude",
    examples: "Heatmaps, density, histograms",
  },
];
const barLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const cacheData = {
  Hit: [18200, 19400, 21000, 20500, 22100, 16800, 15200],
  Miss: [4200, 4800, 5100, 4900, 5300, 3900, 3600],
  Revalidated: [2800, 3100, 3300, 3200, 3500, 2600, 2400],
  Expired: [1100, 1200, 1300, 1250, 1400, 1050, 950],
  Unknown: [900, 1000, 1100, 1050, 1150, 850, 780],
};
const countrySlices = [
  { name: "United States", value: 2000 },
  { name: "United Kingdom", value: 1500 },
  { name: "Germany", value: 1000 },
  { name: "France", value: 500 },
  { name: "Japan", value: 300 },
  { name: "Canada", value: 250 },
];
const regions = ["US", "EU", "APAC", "LATAM", "MEA", "Other"];
const regionBaselines = [4820, 3610, 2190, 1120, 640, 870];
const lineStyles: Record<string, "solid" | "dashed" | "dotted"> = {
  US: "dashed",
  EU: "solid",
  APAC: "dashed",
  LATAM: "solid",
  MEA: "dotted",
  Other: "solid",
};
const heatmapHours = ["00:00", "06:00", "12:00", "18:00"];
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapValues = [
  [4, 12, 24, 36],
  [6, 14, 26, 38],
  [8, 16, 28, 40],
  [10, 18, 30, 42],
  [12, 20, 32, 44],
  [14, 22, 34, 46],
  [16, 24, 36, 48],
];
const lineStart = Date.UTC(2026, 0, 1, 0, 0, 0);
const lineTimestamps = Array.from({ length: 28 }, (_, index) => lineStart + index * 6 * 60 * 60 * 1000);

const isDarkMode = ref(false);
let observer: MutationObserver | undefined;

onMounted(() => {
  const syncMode = () => {
    isDarkMode.value = document.documentElement.dataset.mode === "dark";
  };

  syncMode();
  observer = new MutationObserver(syncMode);
  observer.observe(document.documentElement, { attributeFilter: ["data-mode"] });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const semanticRows = computed(() =>
  semanticNames.map((name) => ({
    label: name,
    color: ChartPalette.semantic(name, isDarkMode.value),
  })),
);
const categoricalRows = computed(() =>
  categoricalIndices.map((index) => ({
    label: String(index),
    color: ChartPalette.categorical(index, isDarkMode.value),
  })),
);
const cvdRows = computed(() =>
  categoricalRows.value.map((row) => ({
    ...row,
    color: simulateCvdHex(row.color),
  })),
);
const sequentialRows = computed(() =>
  ChartPalette.sequential("blues", isDarkMode.value).map((color, index) => ({
    label: `Step ${index + 1}`,
    color,
  })),
);
const activeTokenRows = computed(() => {
  if (props.variant === "semantic") return semanticRows.value;
  if (props.variant === "categorical") return categoricalRows.value;
  if (props.variant === "categorical-cvd") return cvdRows.value;
  if (props.variant === "sequential") return sequentialRows.value;

  return [];
});
const semanticBarOptions = computed<PhiChartOption>(() => ({
  backgroundColor: "transparent",
  grid: { left: 56, right: 16, top: 40, bottom: 40 },
  legend: { top: 4, left: 0, itemWidth: 10, itemHeight: 10, icon: "circle", textStyle: { fontSize: 11 } },
  tooltip: { trigger: "axis", confine: true },
  xAxis: { type: "category", data: barLabels, axisLine: { show: false }, axisTick: { show: false } },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { type: "dashed", opacity: 0.5 } },
  },
  series: [
    semanticBarSeries("Hit", "Success"),
    semanticBarSeries("Miss", "Attention"),
    semanticBarSeries("Revalidated", "Neutral"),
    semanticBarSeries("Expired", "Warning"),
    semanticBarSeries("Unknown", "Disabled"),
  ],
}));
const donutOptions = computed<PhiChartOption>(() => ({
  backgroundColor: "transparent",
  color: categoricalRows.value.map((row) => row.color),
  tooltip: { trigger: "item", confine: true },
  series: [
    {
      type: "pie",
      radius: ["42%", "70%"],
      data: countrySlices,
      label: { show: true, formatter: "{b}" },
    },
  ],
}));
const lineOptions = computed<PhiChartOption>(() => ({
  backgroundColor: "transparent",
  legend: { top: 4, left: 0, itemWidth: 10, itemHeight: 10, icon: "circle", textStyle: { fontSize: 11 } },
  grid: { left: 56, right: 16, top: 40, bottom: 40 },
  tooltip: { trigger: "axis", confine: true },
  xAxis: { type: "time", name: "Time (UTC)", axisLine: { show: false }, axisTick: { show: false } },
  yAxis: {
    type: "value",
    name: "Requests",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { type: "dashed", opacity: 0.5 } },
  },
  series: regions.map((name, seriesIndex) => ({
    name,
    type: "line",
    data: lineTimestamps.map((timestamp, pointIndex) => [
      timestamp,
      Math.max(0, Math.round(regionBaselines[seriesIndex] * (0.9 + 0.28 * Math.sin(pointIndex * 0.42 + seriesIndex)))),
    ]),
    color: ChartPalette.categorical(seriesIndex, isDarkMode.value),
    showSymbol: false,
    lineStyle: { width: 2, type: lineStyles[name] ?? "solid" },
  })),
}));
const heatmapOptions = computed<PhiChartOption>(() => {
  const scale = ChartPalette.sequential("blues", isDarkMode.value);
  const maxValue = Math.max(...heatmapValues.flatMap((row) => row));
  const stepSize = Math.max(1, Math.ceil((maxValue + 1) / scale.length));

  return {
    backgroundColor: "transparent",
    grid: { left: 72, right: 24, top: 20, bottom: 70 },
    tooltip: {
      confine: true,
      position: "top",
      dangerousHtmlFormatter(params: unknown) {
        const point = (params as { data?: [number, number, number] }).data;
        if (!point) return "";
        const [hourIndex, dayIndex, value] = point;
        return `${heatmapDays[dayIndex]} ${heatmapHours[hourIndex]}<br/>Request density: ${value}`;
      },
    },
    xAxis: { type: "category", data: heatmapHours, splitArea: { show: true }, axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: "category", data: heatmapDays, splitArea: { show: true }, axisLine: { show: false }, axisTick: { show: false } },
    visualMap: {
      type: "piecewise",
      show: true,
      dimension: 2,
      orient: "horizontal",
      left: "center",
      bottom: 16,
      itemWidth: 16,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
      pieces: scale.map((color, index) => ({
        min: index * stepSize,
        max: index === scale.length - 1 ? maxValue : (index + 1) * stepSize - 1,
        color,
      })),
    },
    series: [
      {
        type: "heatmap",
        data: heatmapDays.flatMap((_, dayIndex) =>
          heatmapHours.map((__, hourIndex) => [hourIndex, dayIndex, heatmapValues[dayIndex][hourIndex]]),
        ),
        label: { show: false },
        itemStyle: { borderColor: isDarkMode.value ? "#1F2937" : "#bcd8fa", borderWidth: 0.5 },
      },
    ],
  };
});

function semanticBarSeries(name: keyof typeof cacheData, semanticName: (typeof semanticNames)[number]) {
  return {
    name,
    data: cacheData[name],
    color: ChartPalette.semantic(semanticName, isDarkMode.value),
    type: "bar" as const,
    stack: "total" as const,
    barWidth: 28,
  };
}

function simulateCvdHex(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const simulated: [number, number, number] = [
    linearToSrgb(0.367 * lr + 0.861 * lg - 0.228 * lb),
    linearToSrgb(0.28 * lr + 0.673 * lg + 0.047 * lb),
    linearToSrgb(-0.012 * lr + 0.043 * lg + 0.969 * lb),
  ];

  return rgbToHex(simulated);
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)];
}

function rgbToHex(rgb: [number, number, number]) {
  return `#${rgb.map((channel) => clampChannel(channel).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function srgbToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number) {
  const value = Math.max(0, Math.min(1, channel));
  return (value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055) * 255;
}

function clampChannel(channel: number) {
  return Math.max(0, Math.min(255, Math.round(channel)));
}
</script>

<template>
  <div class="chart-color-demo" :data-variant="props.variant">
    <div v-if="variant === 'systems'" class="chart-color-demo__card">
      <table class="chart-color-demo__table chart-color-demo__table--systems">
        <thead>
          <tr>
            <th>System</th>
            <th>When to use</th>
            <th>User task</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in colorSystemRows" :key="row.system">
            <td>{{ row.system }}</td>
            <td>{{ row.when }}</td>
            <td>{{ row.task }}</td>
            <td>{{ row.examples }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="variant === 'semantic' || variant === 'categorical' || variant === 'categorical-cvd' || variant === 'sequential'"
      class="chart-color-demo__card"
    >
      <table class="chart-color-demo__table chart-color-demo__table--tokens">
        <thead>
          <tr>
            <th v-for="item in activeTokenRows" :key="item.label">{{ item.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="item in activeTokenRows" :key="item.label">
              <span class="chart-color-demo__token">
                <i :style="{ backgroundColor: item.color }"></i>
                <code>{{ item.color }}</code>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="variant === 'categorical-bar'" class="chart-color-demo__card">
      <div class="chart-color-demo__caption">Bar chart - cache status by day (semantic tokens)</div>
      <Chart :echarts="echarts" :height="260" :is-dark-mode="isDarkMode" :options="semanticBarOptions" />
    </div>

    <div v-else-if="variant === 'categorical-donut'" class="chart-color-demo__card">
      <div class="chart-color-demo__caption">Donut chart - traffic by country</div>
      <Chart :echarts="echarts" :height="300" :is-dark-mode="isDarkMode" :options="donutOptions" />
    </div>

    <div v-else-if="variant === 'categorical-line'" class="chart-color-demo__card">
      <div class="chart-color-demo__caption">Line chart - requests by region</div>
      <Chart :echarts="echarts" :height="260" :is-dark-mode="isDarkMode" :options="lineOptions" />
    </div>

    <div v-else class="chart-color-demo__card">
      <div class="chart-color-demo__caption">Heatmap - request density by day and hour (sequential scale)</div>
      <Chart :echarts="echarts" :height="300" :is-dark-mode="isDarkMode" :options="heatmapOptions" />
    </div>
  </div>
</template>

<style>
.chart-color-demo {
  width: 100%;
  min-width: 0;
}

.chart-color-demo__card {
  overflow: hidden;
  width: 100%;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-base);
}

.chart-color-demo__caption {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--docs-border);
  background: var(--docs-tint);
  color: var(--docs-subtle);
  font-size: 0.8125rem;
  font-weight: 500;
}

.chart-color-demo__table {
  width: 100%;
  min-width: 38rem;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--docs-default);
  font-size: 0.8125rem;
}

.chart-color-demo__table th,
.chart-color-demo__table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--docs-border);
  text-align: left;
  vertical-align: top;
}

.chart-color-demo__table tr:last-child td {
  border-bottom: 0;
}

.chart-color-demo__table th {
  background: var(--docs-tint);
  color: var(--docs-strong);
  font-weight: 600;
}

.chart-color-demo__table--systems th:nth-child(1),
.chart-color-demo__table--systems td:nth-child(1) {
  width: 14%;
}

.chart-color-demo__table--systems th:nth-child(2),
.chart-color-demo__table--systems td:nth-child(2) {
  width: 38%;
}

.chart-color-demo__table--systems th:nth-child(3),
.chart-color-demo__table--systems td:nth-child(3) {
  width: 16%;
}

.chart-color-demo__token {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.chart-color-demo__token i {
  width: 1.25rem;
  height: 1.25rem;
  flex: none;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.12);
}

.chart-color-demo__token code {
  color: var(--docs-default);
  font-size: 0.75rem;
}

@media (max-width: 48rem) {
  .chart-color-demo__card {
    overflow-x: auto;
  }
}
</style>
