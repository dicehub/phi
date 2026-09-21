<script setup lang="ts">
import { SkeletonLine } from "../skeleton-line";
import { SIDEBAR_LOADING_GROUPS } from "./sidebar-loading";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Loading",
  },
);
</script>

<template>
  <div
    v-bind="$attrs"
    data-sidebar="loading"
    role="status"
    :aria-label="label"
    class="phi-sidebar-loading"
  >
    <div
      v-for="(widths, groupIndex) in SIDEBAR_LOADING_GROUPS"
      :key="groupIndex"
      class="phi-sidebar-loading__group"
    >
      <div class="phi-sidebar-loading__group-label">
        <SkeletonLine :min-width="100" :max-width="100" aria-hidden="true" />
      </div>

      <div
        v-for="(width, itemIndex) in widths"
        :key="itemIndex"
        class="phi-sidebar-loading__row"
      >
        <div class="phi-sidebar-loading__icon">
          <SkeletonLine :min-width="100" :max-width="100" aria-hidden="true" />
        </div>
        <div
          class="phi-sidebar-loading__text"
          :style="{ '--phi-sidebar-loading-label-width': width }"
        >
          <SkeletonLine :min-width="100" :max-width="100" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./sidebar-loading.css"></style>
