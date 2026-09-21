<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Chart } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { PhiChartOption } from "@dicehub/phi/components/chart";

type DemoVariant = "custom-tooltip" | "pie";
type TooltipParams = {
  name?: unknown;
  value?: unknown;
  percent?: unknown;
};

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "pie",
  },
);

echarts.use([CanvasRenderer, PieChart, TooltipComponent]);

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

const pieData = [
  { value: 101, name: "Series A" },
  { value: 202, name: "Series B" },
  { value: 303, name: "Series C" },
  { value: 404, name: "Series D" },
  { value: 505, name: "Series E" },
];

const tooltipData = [
  { value: 101, name: "Series A" },
  { value: 202, name: "Series B" },
  { value: 150, name: "<img src=x onerror=alert('XSS')>" },
  { value: 303, name: "Series C" },
  { value: 404, name: "Series D" },
];

const pieOptions = computed<PhiChartOption>(() => ({
  animation: true,
  animationDuration: 2000,
  tooltip: {
    show: true,
  },
  series: [
    {
      type: "pie",
      data: pieData,
    },
  ],
}));

const customTooltipOptions = computed<PhiChartOption>(() => ({
  tooltip: {
    trigger: "item",
    dangerousHtmlFormatter(params: unknown) {
      const item = params as TooltipParams;
      const rawPercent = Number(item.percent ?? 0);
      const percent = Number.isFinite(rawPercent) ? Math.round(rawPercent) : 0;
      const safeName = echarts.format.encodeHTML(String(item.name ?? ""));
      const safeValue = echarts.format.encodeHTML(String(item.value ?? ""));
      const safePercent = echarts.format.encodeHTML(String(percent));

      return `
        <div style="padding: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${safeName}</div>
          <div>Value: <strong>${safeValue}</strong></div>
          <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">
            ${safePercent}% of total
          </div>
        </div>
      `;
    },
  },
  series: [
    {
      type: "pie",
      data: tooltipData,
    },
  ],
}));
</script>

<template>
  <div class="chart-custom-demo" :data-variant="props.variant">
    <Chart
      :echarts="echarts"
      :height="400"
      :is-dark-mode="isDarkMode"
      :options="props.variant === 'custom-tooltip' ? customTooltipOptions : pieOptions"
    />
  </div>
</template>

<style scoped>
.chart-custom-demo {
  width: 100%;
  min-width: 0;
}
</style>
