<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type * as echarts from "echarts/core";
import type { BarSeriesOption, LineSeriesOption } from "echarts/charts";
import type { SeriesOption, SetOptionOpts } from "echarts";
import Chart from "./Chart.vue";
import { ChartPalette } from "./Color";
import TimeseriesChartLoader from "./TimeseriesChartLoader.vue";
import TimeseriesMarkerTooltip from "./TimeseriesMarkerTooltip.vue";
import {
  buildTimeseriesMarkerAnnotations,
  clusterTimeseriesMarkers,
  getApproximateMarkerClusterInterval,
  getTimeseriesMarkerFromEvent,
  type TimeseriesMarker,
  type TimeseriesMarkerCluster,
} from "./timeseries-markers";
import {
  buildTimeseriesThresholdAnnotations,
  getThresholdValueExtent,
  type TimeseriesThreshold,
} from "./timeseries-thresholds";
import {
  getMarkerTooltipPosition,
  getTimestamps,
  getTooltipRowsAtTimestamp,
  formatTimeseriesTooltip,
  type MarkerTooltipState,
} from "./timeseries-tooltip";
import { useTimeseriesTooltipOutsideGuard } from "./use-timeseries-tooltip-guard";
import type { ChartEvents, PhiChartOption, TimeseriesData } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    echarts: typeof echarts;
    type?: "line" | "bar";
    data: TimeseriesData[];
    markers?: TimeseriesMarker[];
    thresholds?: TimeseriesThreshold[];
    xAxisName?: string;
    xAxisTickCount?: number;
    xAxisTickFormat?: (value: number) => string;
    yAxisTickFormat?: (value: number) => string;
    yAxisTickLabelFormat?: (value: number) => string;
    yAxisName?: string;
    yAxisTickCount?: number;
    yAxisMinInterval?: number;
    tooltipValueFormat?: (value: number) => string;
    tooltipTimestampFormat?: (timestamp: number) => string;
    tooltipFooter?: string;
    tooltipMode?: "all" | "single";
    tooltipMaxItems?: number;
    tooltipFollowCursor?: "both" | "x";
    tooltipBoundary?: "clipping-ancestors" | Element | Element[];
    incomplete?: { before?: number; after?: number };
    enableLegendSelection?: boolean;
    height?: number;
    isDarkMode?: boolean;
    gradient?: boolean;
    loading?: boolean;
    ariaDescription?: string;
    optionUpdateBehavior?: SetOptionOpts;
    onTimeRangeChange?: (from: number, to: number) => void;
  }>(),
  {
    enableLegendSelection: false,
    gradient: false,
    height: 350,
    isDarkMode: false,
    loading: false,
    tooltipFollowCursor: "both",
    tooltipMaxItems: 10,
    tooltipMode: "all",
    type: "line",
  },
);

const emit = defineEmits<{
  timeRangeChange: [from: number, to: number];
}>();

type ChartExpose = {
  dispatchAction: (action: Record<string, unknown>) => void;
  getChart: () => echarts.ECharts | null;
  resize: () => void;
};

const chartRef = ref<ChartExpose | null>(null);
const hasTimeRangeCallback = computed(() => typeof props.onTimeRangeChange === "function");
const tooltipValueFormatter = computed(() => props.tooltipValueFormat ?? props.yAxisTickLabelFormat);
const markerColor = computed(() => ChartPalette.text("primary", props.isDarkMode));
const markerLabelBackgroundColor = computed(() => (props.isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"));
const markerTooltip = ref<MarkerTooltipState | null>(null);
const markerTooltipOpen = computed(() => markerTooltip.value !== null);
const chartContainerRef = useTimeseriesTooltipOutsideGuard(markerTooltipOpen, hideMarkerTooltip);
const activeMarkerKey = ref<string | null>(null);
const legendSelected = ref<Record<string, boolean> | null>(null);

const options = computed<PhiChartOption>(() => {
  const series: Array<LineSeriesOption | BarSeriesOption> = [];
  const axisTextColor = ChartPalette.text("primary", props.isDarkMode);
  const gridLineColor = colorWithOpacity(axisTextColor, 0.2);
  const incompleteBefore = props.incomplete?.before;
  const incompleteAfter = props.incomplete?.after;
  const seriesType =
    props.type === "bar"
      ? ({ type: "bar", stack: "total" } as const)
      : ({ type: "line", showSymbol: false } as const);
  const thresholdAnnotations = buildTimeseriesThresholdAnnotations(props.thresholds);
  const thresholdExtent = getThresholdValueExtent(props.thresholds);
  const markerClusters = clusterTimeseriesMarkers(
    props.markers,
    getApproximateMarkerClusterInterval(getTimestamps(props.data, props.markers), props.xAxisTickCount ?? 5),
  );
  const markerAnnotations = buildTimeseriesMarkerAnnotations(markerClusters, {
    color: markerColor.value,
    labelBackgroundColor: markerLabelBackgroundColor.value,
  });

  for (const item of props.data) {
    const incompleteBeforePoints =
      incompleteBefore && props.type === "line" ? item.data.filter((point) => point[0] <= incompleteBefore) : [];
    const incompleteAfterPoints =
      incompleteAfter && props.type === "line" ? item.data.filter((point) => point[0] >= incompleteAfter) : [];
    const completePoints =
      incompleteBeforePoints.length > 0 || incompleteAfterPoints.length > 0
        ? item.data.slice(
            Math.max(0, incompleteBeforePoints.length - 1),
            Math.max(0, item.data.length - incompleteAfterPoints.length + 1),
          )
        : item.data;
    const areaStyle =
      props.gradient && props.type === "line"
        ? {
            color: new props.echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorWithOpacity(item.color, 0.4) },
              { offset: 1, color: colorWithOpacity(item.color, 0) },
            ]),
          }
        : undefined;

    series.push({
      data: completePoints,
      color: item.color,
      name: item.name,
      emphasis: { focus: "series" },
      ...(areaStyle ? { areaStyle } : {}),
      ...seriesType,
    });

    const incompleteSeries = {
      color: item.color,
      name: item.name,
      type: "line" as const,
      lineStyle: { type: "dashed" as const },
      showSymbol: false,
      emphasis: { focus: "series" as const },
    };

    if (incompleteBeforePoints.length > 0) {
      series.push({ ...incompleteSeries, data: incompleteBeforePoints });
    }

    if (incompleteAfterPoints.length > 0) {
      series.push({ ...incompleteSeries, data: incompleteAfterPoints });
    }
  }

  if (markerAnnotations) {
    series.push({
      data: [],
      name: "Markers",
      type: props.type === "bar" ? "bar" : "line",
      animation: false,
      markLine: markerAnnotations.markLine,
    });
  }

  if (thresholdAnnotations) {
    series.push({
      data: [],
      name: "Thresholds",
      type: props.type === "bar" ? "bar" : "line",
      animation: false,
      markLine: thresholdAnnotations.markLine,
    });
  }

  return {
    aria: {
      enabled: true,
      ...(props.ariaDescription ? { label: { description: props.ariaDescription } } : {}),
    },
    brush: {
      xAxisIndex: "all",
      brushType: "lineX",
      brushMode: "single",
      outOfBrush: { colorAlpha: 0.3 },
      brushStyle: {
        borderWidth: 1,
        color: "rgba(120,140,180,0.3)",
        borderColor: "rgba(120,140,180,0.8)",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      confine: true,
      backgroundColor: "var(--phi-base)",
      borderColor: "var(--phi-line)",
      borderWidth: 1,
      padding: 8,
      textStyle: {
        color: "var(--phi-default)",
        fontSize: 12,
      },
      extraCssText:
        "border-radius:0.5rem;box-shadow:0 4px 6px -1px var(--color-phi-shadow-drop,rgba(15,23,42,0.1)),0 2px 4px -2px var(--color-phi-shadow-drop,rgba(15,23,42,0.1));",
      ...(props.tooltipFollowCursor === "x" || firstBoundaryElement(props.tooltipBoundary)
        ? {
            position(point: number[], _params: unknown, dom: unknown, _rect: unknown, size: { contentSize?: number[] }) {
              return resolveTooltipPosition(point, dom, size.contentSize);
            },
          }
        : {}),
      dangerousHtmlFormatter: (params) =>
        formatTimeseriesTooltip(params, {
          valueFormat: tooltipValueFormatter.value,
          timestampFormat: props.tooltipTimestampFormat,
          mode: props.tooltipMode,
          maxItems: props.tooltipMaxItems,
          footer: props.tooltipFooter,
        }),
    },
    backgroundColor: "transparent",
    toolbox: { show: false },
    ...(props.enableLegendSelection ? { legend: { show: false } } : {}),
    xAxis: {
      name: props.xAxisName,
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: { color: axisTextColor },
      type: "time",
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: axisTextColor,
        hideOverlap: true,
        ...(props.xAxisTickFormat ? { formatter: (value: number) => props.xAxisTickFormat?.(value) ?? "" } : {}),
      },
      splitNumber: props.xAxisTickCount ?? 5,
    },
    yAxis: {
      name: props.yAxisName,
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: { color: axisTextColor },
      type: "value",
      axisTick: { show: true },
      axisLabel: {
        color: axisTextColor,
        margin: 15,
        ...(props.yAxisTickFormat ? { formatter: (value: number) => props.yAxisTickFormat?.(value) ?? "" } : {}),
      },
      splitLine: {
        show: true,
        lineStyle: { color: gridLineColor, type: "dashed", width: 1 },
      },
      splitNumber: props.yAxisTickCount,
      ...(props.yAxisMinInterval !== undefined ? { minInterval: props.yAxisMinInterval } : {}),
      ...(thresholdExtent
        ? {
            min: (value: { min: number }) => Math.min(value.min, thresholdExtent.min),
            max: (value: { max: number }) => Math.max(value.max, thresholdExtent.max),
          }
        : {}),
    },
    grid: {
      left: props.yAxisName ? 30 : 24,
      right: 24,
      top: 24,
      bottom: props.xAxisName ? 30 : 24,
    },
    series: series as SeriesOption[],
  };
});

// ECharts clears the active global cursor when setOption replaces options with notMerge.
const brushResetKey = computed(() =>
  props.optionUpdateBehavior?.notMerge ? options.value : undefined,
);

const events = computed<Partial<ChartEvents>>(() => {
  const handlers: Partial<ChartEvents> = {
    mouseover: (params) => {
      const marker = getTimeseriesMarkerFromEvent(params);
      if (marker) showMarkerTooltip(marker);
    },
    mouseout: (params) => {
      if (getTimeseriesMarkerFromEvent(params)) hideMarkerTooltip();
    },
    globalout: () => hideMarkerTooltip(),
    legendselectchanged: (params) => {
      legendSelected.value = params.selected;
    },
    legendselected: (params) => {
      legendSelected.value = params.selected;
    },
    legendunselected: (params) => {
      legendSelected.value = params.selected;
    },
  };

  if (hasTimeRangeCallback.value) {
    handlers.brushend = (params) => {
      const range = params.areas[0]?.coordRange;
      if (!Array.isArray(range) || typeof range[0] !== "number" || typeof range[1] !== "number") return;

      props.onTimeRangeChange?.(range[0], range[1]);
      emit("timeRangeChange", range[0], range[1]);
      chartRef.value?.dispatchAction({ type: "brush", areas: [] });
    };
  }

  return handlers;
});

onMounted(() => {
  void nextTick(syncBrushMode);
});

watch(
  () => [props.onTimeRangeChange, props.loading, brushResetKey.value],
  () => {
    void nextTick(syncBrushMode);
  },
);

watch(
  () => [props.enableLegendSelection, props.isDarkMode],
  () => {
    legendSelected.value = null;
    hideMarkerTooltip();
  },
);

watch(
  () => [props.markers, props.loading],
  () => hideMarkerTooltip(),
);

onBeforeUnmount(() => {
  if (!hasTimeRangeCallback.value) return;

  chartRef.value?.dispatchAction({
    type: "takeGlobalCursor",
    key: "brush",
    brushOption: { brushType: false },
  });
});

function syncBrushMode() {
  const brushOption = hasTimeRangeCallback.value
    ? {
        brushType: "lineX" as const,
        brushMode: "single" as const,
      }
    : {
        brushType: false,
      };

  chartRef.value?.dispatchAction({
    type: "takeGlobalCursor",
    key: "brush",
    brushOption,
  });
}

function dispatchAction(action: Record<string, unknown>) {
  chartRef.value?.dispatchAction(action);
}

function getChart() {
  return chartRef.value?.getChart() ?? null;
}

function resize() {
  chartRef.value?.resize();
  hideMarkerTooltip();
}

function showMarkerTooltip(marker: TimeseriesMarkerCluster) {
  const markerKey = `${marker.timestamp}-${marker.label ?? ""}-${marker.markers.length}`;
  const position = getMarkerTooltipPosition(chartRef.value?.getChart(), marker.timestamp);

  if (activeMarkerKey.value !== markerKey) {
    chartRef.value?.dispatchAction({ type: "hideTip" });
    chartRef.value?.dispatchAction({ type: "updateAxisPointer", currTrigger: "leave" });
  }

  activeMarkerKey.value = markerKey;
  const { rows, hiddenCount } = getTooltipRowsAtTimestamp(props.data, marker.timestamp, legendSelected.value, props.tooltipMaxItems);

  markerTooltip.value = {
    timestamp: marker.timestamp,
    color: marker.color ?? markerColor.value,
    markers: marker.markers,
    rows,
    hiddenCount,
    ...position,
  };
}

function hideMarkerTooltip() {
  activeMarkerKey.value = null;
  markerTooltip.value = null;
}

function colorWithOpacity(hex: string, opacity: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function firstBoundaryElement(boundary: typeof props.tooltipBoundary) {
  if (typeof Element === "undefined" || !boundary || boundary === "clipping-ancestors") return undefined;

  const boundaries = Array.isArray(boundary) ? boundary : [boundary];
  return boundaries.find((item): item is Element => item instanceof Element);
}

function resolveTooltipPosition(point: number[], dom: unknown, contentSize?: number[]) {
  const boundary = firstBoundaryElement(props.tooltipBoundary);
  const chartDom = chartRef.value?.getChart()?.getDom();
  let x = point[0] + 12;
  let y = props.tooltipFollowCursor === "x" ? 16 : point[1] + 12;

  if (!boundary || !chartDom) return [x, y];

  const chartRect = chartDom.getBoundingClientRect();
  const boundaryRect = boundary.getBoundingClientRect();
  const tooltipEl = typeof HTMLElement === "undefined" ? undefined : dom instanceof HTMLElement ? dom : undefined;
  const width = contentSize?.[0] ?? tooltipEl?.offsetWidth ?? 0;
  const height = contentSize?.[1] ?? tooltipEl?.offsetHeight ?? 0;
  const padding = 8;
  const minX = boundaryRect.left - chartRect.left + padding;
  const maxX = boundaryRect.right - chartRect.left - width - padding;
  const minY = boundaryRect.top - chartRect.top + padding;
  const maxY = boundaryRect.bottom - chartRect.top - height - padding;

  return [clamp(x, minX, maxX), clamp(y, minY, maxY)];
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;

  return Math.max(min, Math.min(max, value));
}

defineExpose({
  dispatchAction,
  getChart,
  resize,
});
</script>

<template>
  <div
    v-bind="$attrs"
    ref="chartContainerRef"
    :aria-busy="loading || undefined"
    class="phi-chart"
    data-phi-component="TimeseriesChart"
  >
    <TimeseriesChartLoader
      v-if="loading"
      :height="height"
      :is-dark-mode="isDarkMode"
      :type="type"
    />
    <Chart
      v-else
      ref="chartRef"
      :echarts="echarts"
      :height="height"
      :is-dark-mode="isDarkMode"
      :on-events="events"
      :option-update-behavior="optionUpdateBehavior"
      :options="options"
    />
    <TimeseriesMarkerTooltip
      v-if="markerTooltip"
      :state="markerTooltip"
      :value-format="tooltipValueFormatter"
      :timestamp-format="tooltipTimestampFormat"
      :footer="tooltipFooter"
    />
  </div>
</template>

<style src="./chart.css"></style>
