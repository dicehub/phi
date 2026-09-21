<script setup lang="ts">
import { computed } from "vue";
import { LOADER_DEFAULT_SIZE, resolveLoaderSize, type LoaderSize } from "./loader";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    size?: LoaderSize | number;
  }>(),
  {
    ariaLabel: "Loading",
    size: LOADER_DEFAULT_SIZE,
  },
);

const resolvedSize = computed(() => resolveLoaderSize(props.size));
const sizeStyle = computed(() => ({
  height: `${resolvedSize.value}px`,
  width: `${resolvedSize.value}px`,
}));
</script>

<template>
  <svg
    v-bind="$attrs"
    class="phi-loader"
    :style="sizeStyle"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    role="status"
    :aria-label="ariaLabel"
  >
    <circle
      class="phi-loader__spinner"
      cx="12"
      cy="12"
      r="9.5"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dasharray"
        values="0 150;42 150;42 150"
        keyTimes="0;0.5;1"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dashoffset"
        values="0;-16;-59"
        keyTimes="0;0.5;1"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>
    <circle
      class="phi-loader__track"
      cx="12"
      cy="12"
      r="9.5"
      fill="none"
      opacity="0.1"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<style src="./loader.css"></style>
