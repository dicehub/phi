<script setup lang="ts">
import { computed, useId } from "vue";
import { ChartPalette } from "./Color";
import {
  CHART_LOADER_WIDTH,
  buildChartLoaderBars,
  buildChartLoaderPaths,
} from "./timeseries-loader";

const props = withDefaults(
  defineProps<{
    height: number;
    isDarkMode?: boolean;
    type?: "line" | "bar";
  }>(),
  {
    isDarkMode: false,
    type: "line",
  },
);

const loaderId = `phi-chart-loader-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const fillId = `${loaderId}-fill`;
const shineId = `${loaderId}-shine`;
const clipId = `${loaderId}-clip`;
const color = computed(() => ChartPalette.semantic("Skeleton", props.isDarkMode));
const strokeOpacity = computed(() => (props.isDarkMode ? 0.36 : 0.6));
const fillOpacity = computed(() => (props.isDarkMode ? 0.07 : 0.1));
const shineOpacity = computed(() => (props.isDarkMode ? 0.16 : 0.24));
const barFillOpacity = computed(() => (props.isDarkMode ? 0.12 : 0.16));
const bars = computed(() => buildChartLoaderBars(props.height));
const paths = computed(() => buildChartLoaderPaths(props.height));
const loaderStyle = computed(() => ({ height: `${props.height}px` }));
</script>

<template>
  <div
    aria-label="Loading chart"
    class="phi-chart-loader"
    :data-chart-loader="type"
    role="status"
    :style="loaderStyle"
  >
    <svg
      aria-hidden="true"
      class="phi-chart-loader__svg"
      :height="height"
      preserveAspectRatio="none"
      :viewBox="`0 0 ${CHART_LOADER_WIDTH} ${height}`"
    >
      <defs>
        <linearGradient :id="fillId" x1="0" x2="0" y1="0" y2="1">
          <stop :stop-color="color" :stop-opacity="fillOpacity" offset="0%" />
          <stop :stop-color="color" offset="100%" stop-opacity="0" />
        </linearGradient>
        <linearGradient :id="shineId" x1="0" x2="1" y1="0" y2="0">
          <stop :stop-color="color" offset="0%" stop-opacity="0" />
          <stop :stop-color="color" :stop-opacity="shineOpacity" offset="50%" />
          <stop :stop-color="color" offset="100%" stop-opacity="0" />
        </linearGradient>
        <clipPath :id="clipId">
          <template v-if="type === 'bar'">
            <rect
              v-for="(bar, index) in bars"
              :key="index"
              :height="bar.height"
              :width="bar.width"
              :x="bar.x"
              :y="bar.y"
            />
          </template>
          <path v-else :d="paths.area" />
        </clipPath>
      </defs>

      <template v-if="type === 'bar'">
        <rect
          v-for="(bar, index) in bars"
          :key="index"
          :fill="color"
          :fill-opacity="barFillOpacity"
          :height="bar.height"
          stroke="none"
          :width="bar.width"
          :x="bar.x"
          :y="bar.y"
        />
      </template>
      <template v-else>
        <path :d="paths.area" :fill="`url(#${fillId})`" stroke="none" />
        <path
          :d="paths.line"
          fill="none"
          :stroke="color"
          :stroke-opacity="strokeOpacity"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />
      </template>

      <g :clip-path="`url(#${clipId})`">
        <rect
          class="phi-chart-loader__shimmer"
          :fill="`url(#${shineId})`"
          :height="height"
          :width="CHART_LOADER_WIDTH"
          x="0"
          y="0"
        />
      </g>
    </svg>
  </div>
</template>

<style src="./chart.css"></style>
