<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import { SkeletonLine } from "../skeleton-line";
import type { ChartLegendItemProps } from "./chart-legend";

defineOptions({ inheritAttrs: false });

const props = defineProps<ChartLegendItemProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
  pointerenter: [event: PointerEvent];
  pointerleave: [event: PointerEvent];
}>();

const instance = getCurrentInstance();
const isClickable = computed(() => Boolean(instance?.vnode.props && "onClick" in instance.vnode.props));

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  event.currentTarget?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
</script>

<template>
  <div
    v-if="loading"
    v-bind="$attrs"
    aria-hidden="true"
    class="phi-chart-legend-large-item"
    :class="props.className"
    data-loading="true"
  >
    <div class="phi-chart-legend-large-item__header">
      <span class="phi-chart-legend__dot phi-chart-legend__dot--loading" />
      <SkeletonLine
        aria-hidden="true"
        class="phi-chart-legend__skeleton phi-chart-legend__skeleton--large-name"
        :max-width="100"
        :min-width="100"
      />
    </div>
    <SkeletonLine
      aria-hidden="true"
      class="phi-chart-legend__skeleton phi-chart-legend__skeleton--large-value"
      :max-width="100"
      :min-width="100"
    />
  </div>
  <div
    v-else
    v-bind="$attrs"
    class="phi-chart-legend-large-item"
    :class="props.className"
    :data-inactive="inactive ? 'true' : undefined"
    :data-clickable="isClickable ? 'true' : undefined"
    role="button"
    :tabindex="isClickable ? 0 : -1"
    @click="emit('click', $event)"
    @keydown="handleKeydown"
    @pointerenter="emit('pointerenter', $event)"
    @pointerleave="emit('pointerleave', $event)"
  >
    <div class="phi-chart-legend-large-item__header">
      <span class="phi-chart-legend__dot" :style="{ backgroundColor: color }" />
      <span class="phi-chart-legend__name">{{ name }}</span>
    </div>
    <div class="phi-chart-legend-large-item__metric">
      <span class="phi-chart-legend__value">{{ value }}</span>
      <span v-if="unit" class="phi-chart-legend__unit">{{ unit }}</span>
    </div>
  </div>
</template>

<style src="./chart.css"></style>
