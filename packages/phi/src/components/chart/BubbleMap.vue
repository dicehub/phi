<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, watch } from "vue";
import type * as echarts from "echarts/core";
import Chart from "./Chart.vue";
import { ChartPalette } from "./Color";
import { DEFAULT_BOUNDING_COORDS, getMapName, MAX_MAP_ZOOM_FACTOR, projectedMapAspect, resolveMapProjection } from "./map-utils";
import { defaultValueFormat, escapeHtml } from "./tooltip-utils";
import type { ChartEvents, MapAccessor, MapGeoJson, MapProjection, MapStyle, PhiChartOption } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    echarts: typeof echarts;
    geoJson: MapGeoJson;
    mapName?: string;
    data: T[];
    lng: MapAccessor<T, number>;
    lat: MapAccessor<T, number>;
    value: MapAccessor<T, number>;
    name?: MapAccessor<T, string>;
    minRadius?: number;
    maxRadius?: number;
    bubbleSize?: (value: number) => number;
    bubbleColor?: MapStyle<T, string>;
    bubbleBorderColor?: MapStyle<T, string>;
    bubbleBorderWidth?: MapStyle<T, number>;
    center?: [number, number];
    zoom?: number;
    roam?: boolean;
    projection?: MapProjection | null;
    showTooltip?: boolean;
    valueFormat?: (value: number) => string;
    tooltipFormatter?: (row: T) => string;
    onBubbleHover?: (row: T | undefined) => void;
    onBubbleClick?: (row: T) => void;
    aspectRatio?: number | string;
    height?: number;
    className?: string;
    isDarkMode?: boolean;
  }>(),
  {
    bubbleBorderColor: "transparent",
    bubbleBorderWidth: 0,
    isDarkMode: false,
    maxRadius: 26,
    minRadius: 6,
    roam: false,
    showTooltip: true,
    valueFormat: defaultValueFormat,
    zoom: 1.25,
  },
);

const emit = defineEmits<{
  bubbleClick: [row: T];
  bubbleHover: [row: T | undefined];
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
  const values = props.data.map((row) => resolve(row, props.value));
  const vmin = values.length ? Math.min(...values) : 0;
  const vmax = values.length ? Math.max(...values) : 1;
  const radiusFor = (value: number) => {
    if (props.bubbleSize) return props.bubbleSize(value);
    if (vmax <= vmin) return props.maxRadius;

    const t = Math.sqrt((value - vmin) / (vmax - vmin));

    return props.minRadius + t * (props.maxRadius - props.minRadius);
  };

  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 500,
    geo: {
      map: mapName.value,
      nameProperty: "name",
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
      silent: true,
      itemStyle: {
        areaColor: palette.area,
        borderColor: palette.area,
        borderWidth: 0.5,
      },
      emphasis: { disabled: true },
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
            const point = params as { name?: string; value?: number[]; data?: { datum?: T } };
            const row = point.data?.datum;

            if (props.tooltipFormatter && row !== undefined) return props.tooltipFormatter(row);

            const name = point.name ? `<strong>${escapeHtml(point.name)}</strong>` : "";
            const value =
              point.value?.[2] !== undefined
                ? `<span style="color:var(--phi-subtle)">${escapeHtml(props.valueFormat(point.value[2]))}</span>`
                : "";

            return `<div style="display:flex;flex-direction:column;gap:2px;">${name}${value}</div>`;
          },
        }
      : undefined,
    series: [
      {
        type: "scatter",
        coordinateSystem: "geo",
        data: props.data.map((row) => {
          const value = resolve(row, props.value);

          return {
            name: props.name ? resolve(row, props.name) : undefined,
            value: [resolve(row, props.lng), resolve(row, props.lat), value],
            symbolSize: radiusFor(value),
            itemStyle: {
              color: props.bubbleColor ? resolveStyle(row, props.bubbleColor) : palette.bubble,
              borderColor: resolveStyle(row, props.bubbleBorderColor),
              borderWidth: resolveStyle(row, props.bubbleBorderWidth),
            },
            datum: row,
          };
        }),
        itemStyle: { opacity: 0.8 },
        emphasis: { scale: 1.2, itemStyle: { opacity: 1 } },
        z: 3,
      },
    ],
  };
});

const events = computed<Partial<ChartEvents>>(() => ({
  ...(props.onBubbleHover
    ? {
        mouseover: (params) => {
          const row = (params.data as { datum?: T } | undefined)?.datum;
          if (row === undefined) return;

          props.onBubbleHover?.(row);
          emit("bubbleHover", row);
        },
        mouseout: () => {
          props.onBubbleHover?.(undefined);
          emit("bubbleHover", undefined);
        },
        globalout: () => {
          props.onBubbleHover?.(undefined);
          emit("bubbleHover", undefined);
        },
      }
    : {}),
  ...(props.onBubbleClick
    ? {
        click: (params) => {
          const row = (params.data as { datum?: T } | undefined)?.datum;
          if (row === undefined) return;

          props.onBubbleClick?.(row);
          emit("bubbleClick", row);
        },
      }
    : {}),
}));

function resolve<Row, Value>(row: Row, accessor: MapAccessor<Row, Value>): Value {
  return typeof accessor === "function" ? accessor(row) : (row[accessor] as Value);
}

function resolveStyle<Row, Value>(row: Row, style: MapStyle<Row, Value>): Value {
  return typeof style === "function" ? (style as (row: Row) => Value)(row) : style;
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
    data-phi-component="BubbleMap"
  />
</template>
