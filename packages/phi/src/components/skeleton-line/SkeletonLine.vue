<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  PHI_SKELETON_LINE_DEFAULT_VARIANTS,
  PHI_SKELETON_LINE_VARIANTS,
  SKELETON_LINE_DEFAULT_MAX_DELAY,
  SKELETON_LINE_DEFAULT_MAX_DURATION,
  SKELETON_LINE_DEFAULT_MAX_WIDTH,
  SKELETON_LINE_DEFAULT_MIN_DELAY,
  SKELETON_LINE_DEFAULT_MIN_DURATION,
  SKELETON_LINE_DEFAULT_MIN_WIDTH,
  randomSkeletonLineFloat,
  randomSkeletonLineInteger,
  resolveSkeletonLineBlockHeight,
  type SkeletonLineBlockHeight,
  type SkeletonLineVariant,
} from "./skeleton-line";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    blockHeight?: SkeletonLineBlockHeight;
    className?: string;
    maxDelay?: number;
    maxDuration?: number;
    maxWidth?: number;
    minDelay?: number;
    minDuration?: number;
    minWidth?: number;
    variant?: SkeletonLineVariant;
  }>(),
  {
    blockHeight: undefined,
    className: undefined,
    maxDelay: SKELETON_LINE_DEFAULT_MAX_DELAY,
    maxDuration: SKELETON_LINE_DEFAULT_MAX_DURATION,
    maxWidth: SKELETON_LINE_DEFAULT_MAX_WIDTH,
    minDelay: SKELETON_LINE_DEFAULT_MIN_DELAY,
    minDuration: SKELETON_LINE_DEFAULT_MIN_DURATION,
    minWidth: SKELETON_LINE_DEFAULT_MIN_WIDTH,
    variant: PHI_SKELETON_LINE_DEFAULT_VARIANTS.variant,
  },
);

const width = ref(SKELETON_LINE_DEFAULT_MAX_WIDTH);
const duration = ref(SKELETON_LINE_DEFAULT_MIN_DURATION.toFixed(2));
const delay = ref(SKELETON_LINE_DEFAULT_MIN_DELAY.toFixed(2));

watch(
  () => [props.minWidth, props.maxWidth, props.minDuration, props.maxDuration, props.minDelay, props.maxDelay] as const,
  () => {
    width.value = randomSkeletonLineInteger({ min: props.minWidth, max: props.maxWidth });
    duration.value = randomSkeletonLineFloat({ min: props.minDuration, max: props.maxDuration });
    delay.value = randomSkeletonLineFloat({ min: props.minDelay, max: props.maxDelay });
  },
  { immediate: true },
);

const lineStyle = computed<Record<string, string>>(() => ({
  "--skeleton-width": `${width.value}%`,
  "--shimmer-duration": `${duration.value}s`,
  "--shimmer-delay": `${delay.value}s`,
}));

const hasBlockHeight = computed(() => props.blockHeight !== undefined);
const resolvedVariant = computed(() => props.variant === "sketch" ? "sketch" : "default");
const rootClasses = computed(() => PHI_SKELETON_LINE_VARIANTS.variant[resolvedVariant.value].classes);
const blockStyle = computed(() => ({
  height: props.blockHeight === undefined ? undefined : resolveSkeletonLineBlockHeight(props.blockHeight),
}));
</script>

<template>
  <div
    v-if="hasBlockHeight"
    class="phi-skeleton-line__block"
    :style="blockStyle"
    data-phi-part="block"
  >
    <div
      v-bind="$attrs"
      :class="[rootClasses, className]"
      :style="lineStyle"
      data-phi-component="SkeletonLine"
      :data-variant="resolvedVariant"
    >
      <template v-if="resolvedVariant === 'sketch'">
        <div class="phi-skeleton-line__fill" />
        <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--top" />
        <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--bottom" />
        <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--left" />
        <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--right" />
        <div class="phi-skeleton-line__outline" />
      </template>
    </div>
  </div>
  <div
    v-else
    v-bind="$attrs"
    :class="[rootClasses, className]"
    :style="lineStyle"
    data-phi-component="SkeletonLine"
    :data-variant="resolvedVariant"
  >
    <template v-if="resolvedVariant === 'sketch'">
      <div class="phi-skeleton-line__fill" />
      <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--top" />
      <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--bottom" />
      <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--left" />
      <div class="phi-skeleton-line__stroke phi-skeleton-line__stroke--right" />
      <div class="phi-skeleton-line__outline" />
    </template>
  </div>
</template>

<style src="./skeleton-line.css"></style>
