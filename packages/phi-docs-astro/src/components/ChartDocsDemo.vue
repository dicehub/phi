<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Chart, ChartLegend, ChartPalette, BubbleMap, SankeyChart, TimeseriesChart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { BarChart, LineChart, MapChart, PieChart, SankeyChart as EChartsSankeyChart, ScatterChart } from "echarts/charts";
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { sankeyLinks, sankeyNodes, simpleWorldGeoJson } from "../data/chart-docs";
import type { PhiChartOption, TimeseriesData } from "@dicehub/phi/components/chart";

type DemoVariant =
  | "colors"
  | "custom-pie"
  | "custom-tooltip"
  | "legend-large"
  | "legend-small"
  | "map"
  | "overview-pie"
  | "overview-timeseries"
  | "sankey"
  | "timeseries-bar"
  | "timeseries-basic"
  | "timeseries-gradient"
  | "timeseries-incomplete"
  | "timeseries-loading";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "overview-timeseries",
  },
);

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  BarChart,
  BrushComponent,
  CanvasRenderer,
  EChartsSankeyChart,
  GeoComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  MapChart,
  PieChart,
  ScatterChart,
  ToolboxComponent,
  TooltipComponent,
]);

const isDarkMode = ref(false);
let observer: MutationObserver | undefined;

onMounted(() => {
  const syncMode = () => {
    isDarkMode.value = document.documentElement.dataset.mode === "dark";
  };

  syncMode();
  observer = new MutationObserver(syncMode);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-mode"],
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const basicSeries = computed<TimeseriesData[]>(() => [
  {
    name: "Requests",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.categorical(0, isDarkMode.value),
  },
  {
    name: "Errors",
    data: buildSeriesData(8, 18, 60_000, 2),
    color: ChartPalette.semantic("Attention", isDarkMode.value),
  },
]);

const throughputSeries = computed<TimeseriesData[]>(() => [
  {
    name: "Bandwidth",
    data: buildSeriesData(20, 70, 60_000, 3),
    color: ChartPalette.categorical(4, isDarkMode.value),
  },
]);

const barSeries = computed<TimeseriesData[]>(() => [
  {
    name: "Cached",
    data: buildSeriesData(30, 40, 60_000, 1),
    color: ChartPalette.categorical(0, isDarkMode.value),
  },
  {
    name: "Uncached",
    data: buildSeriesData(16, 30, 60_000, 4),
    color: ChartPalette.categorical(1, isDarkMode.value),
  },
]);

const customPieOptions = computed<PhiChartOption>(() => ({
  animation: true,
  animationDuration: 900,
  tooltip: { show: true },
  series: [
    {
      type: "pie",
      radius: ["45%", "72%"],
      center: ["50%", "52%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: isDarkMode.value ? "#14161b" : "#ffffff",
        borderWidth: 2,
      },
      data: [
        { name: "HTTP", value: 42, itemStyle: { color: ChartPalette.categorical(0, isDarkMode.value) } },
        { name: "DNS", value: 28, itemStyle: { color: ChartPalette.categorical(1, isDarkMode.value) } },
        { name: "Cache", value: 18, itemStyle: { color: ChartPalette.categorical(2, isDarkMode.value) } },
        { name: "Workers", value: 12, itemStyle: { color: ChartPalette.categorical(3, isDarkMode.value) } },
      ],
    },
  ],
}));

const customTooltipOptions = computed<PhiChartOption>(() => ({
  tooltip: {
    trigger: "item",
    dangerousHtmlFormatter(params: unknown) {
      const item = params as { name?: unknown; value?: unknown };
      const name = echarts.format.encodeHTML(String(item.name ?? ""));
      const value = echarts.format.encodeHTML(String(item.value ?? ""));

      return `<strong>${name}</strong><br /><span style="color:var(--phi-subtle)">${value}k requests</span>`;
    },
  },
  series: customPieOptions.value.series,
}));

const coloData = [
  { city: "San Francisco", lat: 37.77, lon: -122.42, requests: 1200 },
  { city: "London", lat: 51.5, lon: -0.12, requests: 1500 },
  { city: "Singapore", lat: 1.35, lon: 103.82, requests: 980 },
  { city: "Sydney", lat: -33.86, lon: 151.2, requests: 760 },
  { city: "Sao Paulo", lat: -23.55, lon: -46.63, requests: 690 },
];

const semanticColors = ["Attention", "Warning", "Success", "Neutral", "Disabled", "Skeleton"] as const;
const categoricalColors = computed(() => Array.from({ length: 6 }, (_, index) => ChartPalette.categorical(index, isDarkMode.value)));
const sequentialColors = computed(() => ChartPalette.sequential("blues", isDarkMode.value));
const incomplete = computed(() => ({
  before: start + 4 * 60_000,
  after: start + 26 * 60_000,
}));

function buildSeriesData(offset: number, scale: number, step: number, seed: number): [number, number][] {
  return Array.from({ length: 34 }, (_, index) => {
    const wave = Math.sin((index + seed) / 3) * scale * 0.24;
    const drift = Math.cos((index + seed) / 5) * scale * 0.12;
    return [start + index * step, Math.max(0, Math.round(offset + scale + wave + drift))];
  });
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function compactValue(value: number) {
  return `${value.toLocaleString()} req/s`;
}

const start = Date.UTC(2026, 0, 1, 12, 0, 0);
</script>

<template>
  <div class="chart-docs-demo" :data-variant="variant">
    <TimeseriesChart
      v-if="variant === 'overview-timeseries'"
      :data="basicSeries"
      :echarts="echarts"
      :height="220"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="compactValue"
      :x-axis-tick-format="formatTime"
    />

    <Chart
      v-else-if="variant === 'overview-pie' || variant === 'custom-pie'"
      :echarts="echarts"
      :height="variant === 'overview-pie' ? 220 : 400"
      :is-dark-mode="isDarkMode"
      :options="customPieOptions"
    />

    <Chart
      v-else-if="variant === 'custom-tooltip'"
      :echarts="echarts"
      :height="400"
      :is-dark-mode="isDarkMode"
      :options="customTooltipOptions"
    />

    <TimeseriesChart
      v-else-if="variant === 'timeseries-basic'"
      :data="basicSeries"
      :echarts="echarts"
      :height="350"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="compactValue"
      :x-axis-tick-format="formatTime"
      y-axis-name="Requests"
    />

    <TimeseriesChart
      v-else-if="variant === 'timeseries-gradient'"
      :data="throughputSeries"
      :echarts="echarts"
      gradient
      :height="350"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="compactValue"
      :x-axis-tick-format="formatTime"
      y-axis-name="Bandwidth"
    />

    <TimeseriesChart
      v-else-if="variant === 'timeseries-incomplete'"
      :data="throughputSeries"
      :echarts="echarts"
      :height="350"
      :incomplete="incomplete"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="compactValue"
      :x-axis-tick-format="formatTime"
    />

    <TimeseriesChart
      v-else-if="variant === 'timeseries-bar'"
      :data="barSeries"
      :echarts="echarts"
      :height="350"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="compactValue"
      :x-axis-tick-format="formatTime"
      type="bar"
    />

    <TimeseriesChart
      v-else-if="variant === 'timeseries-loading'"
      :data="basicSeries"
      :echarts="echarts"
      :height="260"
      :is-dark-mode="isDarkMode"
      loading
    />

    <BubbleMap
      v-else-if="variant === 'map'"
      :data="coloData"
      :echarts="echarts"
      :geo-json="simpleWorldGeoJson"
      :height="380"
      :is-dark-mode="isDarkMode"
      lat="lat"
      lng="lon"
      name="city"
      :value-format="(value) => `${value.toLocaleString()} requests`"
      value="requests"
    />

    <SankeyChart
      v-else-if="variant === 'sankey'"
      :echarts="echarts"
      :height="330"
      :is-dark-mode="isDarkMode"
      :links="sankeyLinks"
      :nodes="sankeyNodes"
    />

    <div v-else-if="variant === 'legend-large'" class="chart-docs-demo__legend-showcase">
      <div class="chart-docs-demo__legend chart-docs-demo__legend--large">
        <ChartLegend.LargeItem name="Requests" :color="ChartPalette.semantic('Neutral', isDarkMode)" value="1.2M" />
        <ChartLegend.LargeItem name="Errors" :color="ChartPalette.semantic('Attention', isDarkMode)" value="12.4k" inactive />
        <ChartLegend.LargeItem name="Latency" :color="ChartPalette.semantic('Warning', isDarkMode)" value="42" unit="ms" />
      </div>
      <div class="chart-docs-demo__legend-loading">
        <span>Loading state</span>
        <ChartLegend.LargeItem loading />
      </div>
    </div>

    <div v-else-if="variant === 'legend-small'" class="chart-docs-demo__legend-showcase">
      <div class="chart-docs-demo__legend">
        <ChartLegend.SmallItem name="Requests" :color="ChartPalette.semantic('Neutral', isDarkMode)" value="1.2M" />
        <ChartLegend.SmallItem name="Errors" :color="ChartPalette.semantic('Attention', isDarkMode)" value="12.4k" inactive />
        <ChartLegend.SmallItem name="Latency" :color="ChartPalette.semantic('Warning', isDarkMode)" value="42ms" />
      </div>
      <div class="chart-docs-demo__legend-loading">
        <span>Loading state</span>
        <ChartLegend.SmallItem loading />
      </div>
    </div>

    <div v-else class="chart-docs-demo__palette">
      <section>
        <span>Semantic</span>
        <div class="chart-docs-demo__swatches">
          <i
            v-for="name in semanticColors"
            :key="name"
            :title="name"
            :style="{ backgroundColor: ChartPalette.semantic(name, isDarkMode) }"
          />
        </div>
      </section>
      <section>
        <span>Categorical</span>
        <div class="chart-docs-demo__swatches">
          <i v-for="color in categoricalColors" :key="color" :style="{ backgroundColor: color }" />
        </div>
      </section>
      <section>
        <span>Sequential</span>
        <div class="chart-docs-demo__swatches">
          <i v-for="color in sequentialColors" :key="color" :style="{ backgroundColor: color }" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.chart-docs-demo {
  width: 100%;
  min-width: 0;
}

.chart-docs-demo__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem 1.5rem;
  min-height: 8rem;
}

.chart-docs-demo__legend--large {
  gap: 1.5rem;
}

.chart-docs-demo__legend-showcase {
  display: grid;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem;
}

.chart-docs-demo__legend-showcase .chart-docs-demo__legend {
  min-height: 4.5rem;
}

.chart-docs-demo__legend-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--docs-border);
}

.chart-docs-demo__legend-loading > span {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-weight: 600;
}

.chart-docs-demo__palette {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  padding: 0.5rem;
}

.chart-docs-demo__palette section {
  display: grid;
  gap: 0.625rem;
}

.chart-docs-demo__palette span {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-weight: 600;
}

.chart-docs-demo__swatches {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.5rem;
}

.chart-docs-demo__swatches i {
  min-height: 2.5rem;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 1px var(--docs-border);
}
</style>
