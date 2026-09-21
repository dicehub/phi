<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import type * as echarts from "echarts/core";
import type { EChartsOption, SetOptionOpts } from "echarts";
import { CHART_DARK_COLORS, CHART_LIGHT_COLORS } from "./Color";
import type { ChartEvents, PhiChartOption, SafeTooltipOption } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    echarts: typeof echarts;
    options: PhiChartOption;
    optionUpdateBehavior?: SetOptionOpts;
    className?: string;
    isDarkMode?: boolean;
    aspectRatio?: number | string;
    height?: number;
    onEvents?: Partial<ChartEvents>;
  }>(),
  {
    className: undefined,
    isDarkMode: false,
    onEvents: undefined,
    optionUpdateBehavior: undefined,
  },
);

const elRef = ref<HTMLDivElement | null>(null);
const chart = shallowRef<ReturnType<typeof echarts.init> | null>(null);
const wrappers = new Map<string, (params: unknown) => void>();
let boundEvents = new Set<string>();
let resizeObserver: ResizeObserver | undefined;

const chartStyle = computed(() => {
  if (props.height !== undefined) {
    return { height: `${props.height}px` };
  }

  if (props.aspectRatio !== undefined) {
    return { aspectRatio: String(props.aspectRatio) };
  }

  return { height: "350px" };
});

function transformTooltip(tooltip: SafeTooltipOption) {
  const { dangerousHtmlFormatter, ...rest } = tooltip;

  return {
    ...rest,
    formatter: dangerousHtmlFormatter,
  };
}

function prepareChartOptions(options: PhiChartOption, isDarkMode?: boolean): EChartsOption {
  const withDefaults: EChartsOption = {
    backgroundColor: "transparent",
    color: isDarkMode ? CHART_DARK_COLORS : CHART_LIGHT_COLORS,
    ...options,
  };

  if (!withDefaults.tooltip) return withDefaults;

  return {
    ...withDefaults,
    tooltip: Array.isArray(withDefaults.tooltip)
      ? withDefaults.tooltip.map((tooltip) => transformTooltip(tooltip as SafeTooltipOption))
      : transformTooltip(withDefaults.tooltip as SafeTooltipOption),
  };
}

function applyOptions() {
  if (!chart.value) return;

  chart.value.setOption(prepareChartOptions(props.options, props.isDarkMode), {
    notMerge: false,
    lazyUpdate: true,
    ...props.optionUpdateBehavior,
  });
}

function bindEvents(nextEvents: Partial<ChartEvents> = {}) {
  if (!chart.value) return;

  const nextBound = new Set<string>();

  for (const [event, handler] of Object.entries(nextEvents)) {
    if (typeof handler !== "function") continue;

    nextBound.add(event);

    if (!wrappers.has(event)) {
      wrappers.set(event, (params: unknown) => {
        const current = props.onEvents as Record<string, ((params: unknown) => void) | undefined> | undefined;
        current?.[event]?.(params);
      });
    }

    if (!boundEvents.has(event)) {
      chart.value.on(event, wrappers.get(event) as (params: unknown) => void);
    }
  }

  for (const event of boundEvents) {
    if (nextBound.has(event)) continue;

    const wrapper = wrappers.get(event);
    if (wrapper) chart.value.off(event, wrapper);
  }

  boundEvents = nextBound;
}

function cleanupChart() {
  if (!chart.value) return;

  for (const event of boundEvents) {
    const wrapper = wrappers.get(event);
    if (wrapper) chart.value.off(event, wrapper);
  }

  boundEvents.clear();
  chart.value.dispose();
  chart.value = null;
}

async function initChart() {
  await nextTick();
  if (!elRef.value) return;

  cleanupChart();
  chart.value = props.echarts.init(elRef.value, props.isDarkMode ? "dark" : undefined);
  applyOptions();
  bindEvents(props.onEvents);
}

function resize() {
  chart.value?.resize();
}

function getChart() {
  return chart.value;
}

function dispatchAction(action: Parameters<NonNullable<typeof chart.value>["dispatchAction"]>[0]) {
  chart.value?.dispatchAction(action);
}

onMounted(() => {
  void initChart();

  if (elRef.value) {
    let didMeasure = false;
    resizeObserver = new ResizeObserver(() => {
      if (!didMeasure) {
        didMeasure = true;
        return;
      }

      resize();
    });
    resizeObserver.observe(elRef.value);
  }
});

watch(
  () => [props.echarts, props.isDarkMode],
  () => {
    void initChart();
  },
);

watch(
  () => props.options,
  () => applyOptions(),
  { deep: true },
);

watch(
  () => props.optionUpdateBehavior,
  () => applyOptions(),
  { deep: true },
);

watch(
  () => props.onEvents,
  (events) => bindEvents(events),
  { deep: true },
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  cleanupChart();
});

defineExpose({
  dispatchAction,
  getChart,
  resize,
});
</script>

<template>
  <div
    v-bind="$attrs"
    ref="elRef"
    class="phi-chart"
    :class="className"
    :style="chartStyle"
    data-phi-component="Chart"
    :role="options.aria?.enabled ? 'img' : undefined"
    :tabindex="options.aria?.enabled ? 0 : undefined"
  />
</template>

<style src="./chart.css"></style>
