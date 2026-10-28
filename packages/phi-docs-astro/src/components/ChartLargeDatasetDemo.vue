<script setup lang="ts">
import { computed, markRaw, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { ChartPalette, TimeseriesChart, type TimeseriesData, type TimeseriesMarker } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  AriaComponent, AxisPointerComponent, BrushComponent, GridComponent,
  LegendComponent, MarkLineComponent, ToolboxComponent, TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart, AriaComponent, AxisPointerComponent, BrushComponent, GridComponent,
  LegendComponent, MarkLineComponent, ToolboxComponent, TooltipComponent, CanvasRenderer,
]);

const large = ref(false);
const hideLabelOverlap = ref<boolean | undefined>(undefined);
const labelSummary = ref("");
const marked = ref(false);
const chart = ref<InstanceType<typeof TimeseriesChart> | null>(null);
const data = computed<TimeseriesData[]>(() => [{
  name: "Requests",
  color: ChartPalette.semantic("Neutral"),
  data: markRaw(Array.from({ length: large.value ? 200_000 : 50 }, (_, index): [number, number] => [
    Date.UTC(2026, 0, 1) + index * 1_000,
    20 + Math.sin(index / 100) * 10,
  ])),
}]);
const markers = computed<TimeseriesMarker[]>(() => marked.value
  ? [{ timestamp: data.value[0].data[100_000]?.[0] ?? data.value[0].data[25][0], label: "Deployment" }]
  : []);
const summary = ref("");
function readSummary() {
  const option = chart.value?.getChart()?.getOption();
  const series = option?.series as Array<{ name?: string; data?: unknown[]; markLine?: { data?: unknown[] } }> | undefined;
  const axes = option?.xAxis as Array<{ axisLabel?: { hideOverlap?: boolean } }> | undefined;
  labelSummary.value = String(axes?.[0]?.axisLabel?.hideOverlap);
  summary.value = `${series?.find((item) => item.name === 'Requests')?.data?.length ?? 0} points, ${series?.find((item) => item.name === 'Markers')?.markLine?.data?.length ?? 0} markers`;
}
</script>

<template>
  <div data-large-dataset-demo>
    <div class="chart-large-demo__controls">
      <Button @click="large = true">Load 200,000 points</Button>
      <Button :aria-pressed="marked" @click="marked = !marked">Toggle marker</Button>
      <Button :aria-pressed="hideLabelOverlap ?? true" @click="hideLabelOverlap = !(hideLabelOverlap ?? true)">Hide overlapping labels</Button>
      <span v-if="labelSummary">Hide overlapping labels: <span data-label-summary>{{ labelSummary }}</span></span>
      <Button @click="readSummary">Read chart summary</Button>
      <output aria-live="polite">{{ summary }}</output>
    </div>
    <TimeseriesChart ref="chart" :echarts="echarts" :data="data" :markers="markers" :height="280" :x-axis-hide-label-overlap="hideLabelOverlap"
      :option-update-behavior="{ replaceMerge: ['series'] }" />
  </div>
</template>

<style scoped>
.chart-large-demo__controls { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
</style>
