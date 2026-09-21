<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ChartLegend, ChartPalette, TimeseriesChart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { TimeseriesData, TimeseriesMarker, TimeseriesThreshold } from "@dicehub/phi/components/chart";

type DemoVariant =
  | "bar"
  | "basic"
  | "custom-axis"
  | "gradient"
  | "incomplete"
  | "legend-click"
  | "legend-highlight"
  | "loading-bar"
  | "loading-line"
  | "reference-markers"
  | "thresholds"
  | "time-range"
  | "tooltip-boundary"
  | "tooltip-cursor"
  | "tooltip-footer"
  | "tooltip-footer-empty"
  | "y-axis-min-interval";

type TimeseriesChartExpose = {
  dispatchAction: (action: Record<string, unknown>) => void;
};

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  BarChart,
  BrushComponent,
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  LineChart,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
]);

const isDarkMode = ref(false);
const selectedFollowCursor = ref<"both" | "x">("both");
const selectedRange = ref("");
const boundaryElement = ref<HTMLElement | null>(null);
const highlightChart = ref<TimeseriesChartExpose | null>(null);
const clickChart = ref<TimeseriesChartExpose | null>(null);
const hoveredSeries = ref<string | null>(null);
const hiddenSeries = ref<Record<string, boolean>>({});
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

watch(isDarkMode, () => {
  hiddenSeries.value = {};
});

const basicData = computed<TimeseriesData[]>(() => [
  {
    name: "Requests",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
  {
    name: "Errors",
    data: buildSeriesData(1, 50, 60_000, 0.3),
    color: ChartPalette.semantic("Attention", isDarkMode.value),
  },
]);

const customAxisData = computed<TimeseriesData[]>(() => [
  {
    name: "Requests",
    data: buildSeriesData(0, 50, 60_000, 1000),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
]);

const incompleteData = computed<TimeseriesData[]>(() => [
  {
    name: "Bandwidth",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.categorical(0, isDarkMode.value),
  },
]);

const rangeData = computed<TimeseriesData[]>(() => [
  {
    name: "CPU Usage",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.categorical(0, isDarkMode.value),
  },
]);

const discreteData = computed<TimeseriesData[]>(() => [
  {
    name: "Active jobs",
    data: Array.from({ length: 30 }, (_, index) => {
      const timestamp = chartStart + index * 60_000;
      const value = 2 + Math.round(Math.abs(Math.sin(index * 0.4)) * 3);

      return [timestamp, value] as [number, number];
    }),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
]);

const barData = computed<TimeseriesData[]>(() => [
  {
    name: "Requests where age > 10",
    data: buildSeriesData(0, 20, 3_600_000, 1),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
  {
    name: "Errors",
    data: buildSeriesData(1, 20, 3_600_000, 0.3),
    color: ChartPalette.semantic("Attention", isDarkMode.value),
  },
]);

const markerData = computed<TimeseriesData[]>(() => [
  {
    name: "Requests",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
  {
    name: "Errors",
    data: buildSeriesData(1, 50, 60_000, 0.3),
    color: ChartPalette.semantic("Attention", isDarkMode.value),
  },
]);

const markers = computed<TimeseriesMarker[]>(() => [
  {
    timestamp: markerData.value[0].data[15][0],
    label: "change a1b2c3d4",
    description: "Configuration change applied",
  },
  {
    timestamp: markerData.value[0].data[16][0],
    label: "change b2c3d4e5",
    description: "Routing rule updated",
  },
  {
    timestamp: markerData.value[0].data[17][0],
    label: "change c3d4e5f6",
    description: "Limit adjusted",
  },
  {
    timestamp: markerData.value[0].data[34][0],
    label: "change e5f6g7h8",
    description: "New version released",
    lineStyle: "dotted",
  },
]);

const thresholdData = computed<TimeseriesData[]>(() => [
  {
    name: "Memory used",
    data: buildSeriesData(0, 50, 60_000, 1),
    color: ChartPalette.semantic("Neutral", isDarkMode.value),
  },
]);

const thresholds = computed<TimeseriesThreshold[]>(() => [
  {
    value: 55,
    label: "Memory limit",
    color: ChartPalette.semantic("Attention", isDarkMode.value),
  },
]);

const latencyItems = computed(() => [
  { name: "P99", color: ChartPalette.semantic("Attention", isDarkMode.value), value: "124", unit: "ms", seed: 3, scale: 1 },
  { name: "P95", color: ChartPalette.semantic("Warning", isDarkMode.value), value: "76", unit: "ms", seed: 2, scale: 0.8 },
  { name: "P75", color: ChartPalette.semantic("Neutral", isDarkMode.value), value: "32", unit: "ms", seed: 1, scale: 0.6 },
  { name: "P50", color: ChartPalette.semantic("Neutral", isDarkMode.value), value: "10", unit: "ms", seed: 0, scale: 0.4 },
]);

const latencyData = computed<TimeseriesData[]>(() =>
  latencyItems.value.map((item) => ({
    name: item.name,
    data: buildSeriesData(item.seed, 50, 60_000, item.scale),
    color: item.color,
  })),
);

const incompleteAfter = computed(() => incompleteData.value[0]?.data.at(-5)?.[0]);

function buildSeriesData(seed = 0, points = 50, stepMs = 60_000, timeScale = 1): [number, number][] {
  return Array.from({ length: points }, (_, index) => {
    const timestamp = chartStart + index * stepMs;
    const trend = index * 0.15;
    const wave = Math.sin((index + seed) * 0.42) * 4;
    const ripple = Math.cos(index * 0.31 + seed) * 2;
    const value = Math.round((30 + seed * 15 + trend + wave + ripple) * 100) / 100;

    return [timestamp, value * timeScale];
  });
}

function formatTime(value: number) {
  const date = new Date(value);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}

function formatCompact(value: number) {
  if (value >= 1000) return `${value / 1000}k`;
  return value.toString();
}

function formatTooltipTimestamp(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(value);
}

function formatRequests(value: number) {
  return `${(value / 1000).toFixed(1)}k requests`;
}

function formatFixed(value: number) {
  return value.toFixed(2);
}

function handleTimeRangeChange(from: number, to: number) {
  selectedRange.value = `${formatDateTime(from)} - ${formatDateTime(to)}`;
}

function formatDateTime(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function highlightSeries(name: string) {
  hoveredSeries.value = name;
  highlightChart.value?.dispatchAction({ type: "highlight", seriesName: name });
}

function clearHighlight(name: string) {
  hoveredSeries.value = null;
  highlightChart.value?.dispatchAction({ type: "downplay", seriesName: name });
}

function toggleSeries(name: string) {
  const isIsolated = latencyItems.value.every((item) => (item.name === name ? !hiddenSeries.value[item.name] : hiddenSeries.value[item.name]));
  const nextHidden: Record<string, boolean> = {};

  for (const item of latencyItems.value) {
    const shouldHide = isIsolated ? false : item.name !== name;
    nextHidden[item.name] = shouldHide;
    clickChart.value?.dispatchAction({
      type: shouldHide ? "legendUnSelect" : "legendSelect",
      name: item.name,
    });
  }

  hiddenSeries.value = nextHidden;
}

const chartStart = Date.UTC(2026, 0, 1, 12, 0, 0);
</script>

<template>
  <div class="chart-timeseries-demo" :data-variant="props.variant">
    <TimeseriesChart
      v-if="variant === 'basic'"
      :data="basicData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'reference-markers'"
      :data="markerData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :markers="markers"
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'thresholds'"
      :data="thresholdData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :thresholds="thresholds"
      x-axis-name="Time (UTC)"
      y-axis-name="Memory (MB)"
    />

    <TimeseriesChart
      v-else-if="variant === 'custom-axis'"
      :data="customAxisData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="formatRequests"
      :tooltip-timestamp-format="formatTooltipTimestamp"
      :x-axis-tick-format="formatTime"
      :y-axis-tick-format="formatCompact"
      x-axis-name="Time (UTC)"
      y-axis-name="Requests"
    />

    <TimeseriesChart
      v-else-if="variant === 'gradient'"
      :data="basicData"
      :echarts="echarts"
      gradient
      :is-dark-mode="isDarkMode"
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'incomplete'"
      :data="incompleteData"
      :echarts="echarts"
      :incomplete="{ after: incompleteAfter }"
      :is-dark-mode="isDarkMode"
      x-axis-name="Time (UTC)"
      y-axis-name="Mbps"
    />

    <div v-else-if="variant === 'time-range'" class="chart-timeseries-demo__stack">
      <TimeseriesChart
        :data="rangeData"
        :echarts="echarts"
        :is-dark-mode="isDarkMode"
        :on-time-range-change="handleTimeRangeChange"
        x-axis-name="Time (UTC)"
        y-axis-name="%"
      />
      <p v-if="selectedRange" class="chart-timeseries-demo__selection">Selected range: {{ selectedRange }}</p>
    </div>

    <div v-else-if="variant === 'tooltip-cursor'" class="chart-timeseries-demo__stack">
      <div class="chart-timeseries-demo__segmented" role="group" aria-label="Tooltip follow cursor">
        <button type="button" :data-active="selectedFollowCursor === 'both' ? 'true' : undefined" @click="selectedFollowCursor = 'both'">
          Both axes
        </button>
        <button type="button" :data-active="selectedFollowCursor === 'x' ? 'true' : undefined" @click="selectedFollowCursor = 'x'">
          X-axis only
        </button>
      </div>
      <TimeseriesChart
        :data="latencyData.slice(0, 2)"
        :echarts="echarts"
        :is-dark-mode="isDarkMode"
        :tooltip-follow-cursor="selectedFollowCursor"
        x-axis-name="Time (UTC)"
        y-axis-name="Latency (ms)"
      />
    </div>

    <div v-else-if="variant === 'tooltip-boundary'" ref="boundaryElement" class="chart-timeseries-demo__boundary">
      <TimeseriesChart
        :data="basicData"
        :echarts="echarts"
        :height="280"
        :is-dark-mode="isDarkMode"
        :tooltip-boundary="boundaryElement ?? undefined"
        x-axis-name="Time (UTC)"
        y-axis-name="Count"
      />
    </div>

    <TimeseriesChart
      v-else-if="variant === 'tooltip-footer'"
      :data="markerData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :markers="markers"
      tooltip-footer='Percentiles use a "five-minute" rolling window.'
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'tooltip-footer-empty'"
      :data="markerData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :markers="markers"
      tooltip-footer=""
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'y-axis-min-interval'"
      :data="discreteData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :y-axis-min-interval="1"
      x-axis-name="Time (UTC)"
      y-axis-name="Active jobs"
    />

    <TimeseriesChart
      v-else-if="variant === 'bar'"
      :data="barData"
      :echarts="echarts"
      :is-dark-mode="isDarkMode"
      :tooltip-value-format="formatFixed"
      type="bar"
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <div v-else-if="variant === 'legend-highlight'" class="chart-timeseries-demo__panel">
      <div class="chart-timeseries-demo__legend-row">
        <ChartLegend.LargeItem
          v-for="item in latencyItems"
          :key="item.name"
          class="chart-timeseries-demo__legend-cell"
          :color="item.color"
          :inactive="hoveredSeries !== null && hoveredSeries !== item.name"
          :name="item.name"
          :unit="item.unit"
          :value="item.value"
          @pointerenter="highlightSeries(item.name)"
          @pointerleave="clearHighlight(item.name)"
        />
      </div>
      <TimeseriesChart
        ref="highlightChart"
        :data="latencyData"
        :echarts="echarts"
        :height="300"
        :is-dark-mode="isDarkMode"
        x-axis-name="Time (UTC)"
      />
    </div>

    <div v-else-if="variant === 'legend-click'" class="chart-timeseries-demo__panel">
      <div class="chart-timeseries-demo__legend-row">
        <ChartLegend.LargeItem
          v-for="item in latencyItems"
          :key="item.name"
          class="chart-timeseries-demo__legend-cell"
          :color="item.color"
          :inactive="hiddenSeries[item.name] ?? false"
          :name="item.name"
          :unit="item.unit"
          :value="item.value"
          @click="toggleSeries(item.name)"
        />
      </div>
      <TimeseriesChart
        ref="clickChart"
        :data="latencyData"
        :echarts="echarts"
        enable-legend-selection
        :height="300"
        :is-dark-mode="isDarkMode"
        x-axis-name="Time (UTC)"
      />
    </div>

    <TimeseriesChart
      v-else-if="variant === 'loading-line'"
      :data="[]"
      :echarts="echarts"
      :height="280"
      :is-dark-mode="isDarkMode"
      loading
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />

    <TimeseriesChart
      v-else-if="variant === 'loading-bar'"
      :data="[]"
      :echarts="echarts"
      :height="280"
      :is-dark-mode="isDarkMode"
      loading
      type="bar"
      x-axis-name="Time (UTC)"
      y-axis-name="Count"
    />
  </div>
</template>

<style src="./ChartTimeseriesDocsDemo.css"></style>
