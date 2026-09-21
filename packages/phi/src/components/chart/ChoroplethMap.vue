<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, watch } from "vue";
import type * as echarts from "echarts/core";
import Chart from "./Chart.vue";
import { ChartPalette } from "./Color";
import { DEFAULT_BOUNDING_COORDS, getMapName, MAX_MAP_ZOOM_FACTOR, projectedMapAspect, resolveMapProjection } from "./map-utils";
import { defaultValueFormat, escapeHtml } from "./tooltip-utils";
import type { ChartEvents, MapAccessor, MapGeoJson, MapProjection, PhiChartOption } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    echarts: typeof echarts;
    geoJson: MapGeoJson;
    mapName?: string;
    data: T[];
    name: MapAccessor<T, string>;
    value: MapAccessor<T, number>;
    nameProperty?: string;
    colorRange?: string[];
    min?: number;
    max?: number;
    noDataColor?: string;
    showLegend?: boolean;
    showTooltip?: boolean;
    valueFormat?: (value: number) => string;
    tooltipFormatter?: (row: T) => string;
    onRegionHover?: (row: T | undefined) => void;
    onRegionClick?: (row: T) => void;
    center?: [number, number];
    zoom?: number;
    roam?: boolean;
    projection?: MapProjection | null;
    aspectRatio?: number | string;
    height?: number;
    className?: string;
    isDarkMode?: boolean;
  }>(),
  {
    isDarkMode: false,
    nameProperty: "name",
    roam: false,
    showLegend: false,
    showTooltip: true,
    valueFormat: defaultValueFormat,
    zoom: 1.25,
  },
);

const emit = defineEmits<{
  regionClick: [row: T];
  regionHover: [row: T | undefined];
}>();

const mapName = computed(() => getMapName(props.geoJson, props.mapName));
const resolvedProjection = computed(() => resolveMapProjection(props.projection));
const resolvedAspectRatio = computed(() => {
  if (props.height !== undefined) return undefined;

  return props.aspectRatio ?? projectedMapAspect(resolvedProjection.value);
});

watch(
  () => [props.echarts, mapName.value, props.geoJson] as const,
  () => {
    props.echarts.registerMap(mapName.value, props.geoJson as Parameters<typeof props.echarts.registerMap>[1]);
  },
  { immediate: true },
);

const options = computed<PhiChartOption>(() => {
  const palette = ChartPalette.mapColors(props.isDarkMode);
  const colors = props.colorRange ?? palette.scale;
  const noData = props.noDataColor ?? palette.area;
  const regions = props.data.map((row) => ({
    name: resolve(row, props.name),
    value: resolve(row, props.value),
    datum: row,
  }));
  const values = regions.map((region) => region.value);
  const vmin = values.length ? Math.min(...values) : 0;
  const vmax = values.length ? Math.max(...values) : 1;
  const resolvedMin = props.min ?? vmin;
  const resolvedMax = props.max ?? (vmax > vmin ? vmax : vmin + 1);

  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 500,
    animationDurationUpdate: 0,
    visualMap: {
      type: "continuous",
      show: props.showLegend,
      min: resolvedMin,
      max: resolvedMax,
      calculable: false,
      hoverLink: false,
      inRange: { color: colors },
      orient: "horizontal",
      text: ["High", "Low"],
      left: 0,
      bottom: 8,
      textStyle: {
        color: ChartPalette.text("primary", props.isDarkMode),
        fontSize: 11,
      },
    },
    tooltip: props.showTooltip
      ? {
          trigger: "item",
          triggerOn: "mousemove",
          backgroundColor: "var(--phi-base)",
          borderColor: "var(--phi-line)",
          borderWidth: 1,
          padding: 8,
          textStyle: {
            color: "var(--phi-default)",
            fontSize: 12,
          },
          extraCssText: "border-radius:0.5rem;box-shadow:0 8px 24px rgba(15,23,42,0.12);",
          dangerousHtmlFormatter(params: unknown) {
            const point = params as { name?: string; value?: number; data?: { datum?: T } };
            const row = point.data?.datum;
            if (row === undefined) return "";
            if (props.tooltipFormatter) return props.tooltipFormatter(row);

            const name = point.name ? `<strong>${escapeHtml(point.name)}</strong>` : "";
            const value =
              typeof point.value === "number" && !Number.isNaN(point.value)
                ? `<span style="color:var(--phi-subtle)">${escapeHtml(props.valueFormat(point.value))}</span>`
                : "";

            return `<div style="display:flex;flex-direction:column;gap:2px;">${name}${value}</div>`;
          },
        }
      : undefined,
    series: [
      {
        id: "regions",
        type: "map",
        map: mapName.value,
        nameProperty: props.nameProperty,
        roam: props.roam,
        ...(props.roam
          ? {
              scaleLimit: {
                min: Math.min(1, props.zoom),
                max: props.zoom * MAX_MAP_ZOOM_FACTOR,
              },
            }
          : {}),
        center: props.center,
        zoom: props.zoom,
        boundingCoords: DEFAULT_BOUNDING_COORDS,
        ...(resolvedProjection.value ? { projection: resolvedProjection.value } : { aspectScale: 1 }),
        data: regions,
        itemStyle: {
          areaColor: noData,
          borderColor: "transparent",
          borderWidth: 0,
        },
        label: { show: false },
        emphasis: {
          focus: "self",
          label: { show: false },
          itemStyle: { areaColor: "inherit" },
        },
        blur: {
          label: { show: false },
          itemStyle: { opacity: 0.45 },
        },
        select: { disabled: true },
        z: 1,
      },
    ],
  };
});

const events = computed<Partial<ChartEvents>>(() => ({
  ...(props.onRegionHover
    ? {
        mouseover: (params) => {
          const row = (params.data as { datum?: T } | undefined)?.datum;
          if (row === undefined) return;

          props.onRegionHover?.(row);
          emit("regionHover", row);
        },
        mouseout: () => {
          props.onRegionHover?.(undefined);
          emit("regionHover", undefined);
        },
        globalout: () => {
          props.onRegionHover?.(undefined);
          emit("regionHover", undefined);
        },
      }
    : {}),
  ...(props.onRegionClick
    ? {
        click: (params) => {
          const row = (params.data as { datum?: T } | undefined)?.datum;
          if (row === undefined) return;

          props.onRegionClick?.(row);
          emit("regionClick", row);
        },
      }
    : {}),
}));

function resolve<Row, Value>(row: Row, accessor: MapAccessor<Row, Value>): Value {
  return typeof accessor === "function" ? accessor(row) : (row[accessor] as Value);
}
</script>

<template>
  <Chart
    v-bind="$attrs"
    class="phi-chart-map"
    :class-name="className"
    :aspect-ratio="resolvedAspectRatio"
    :echarts="echarts"
    :height="height"
    :is-dark-mode="isDarkMode"
    :on-events="events"
    :options="options"
    data-phi-component="ChoroplethMap"
  />
</template>
