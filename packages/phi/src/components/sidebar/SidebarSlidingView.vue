<script setup lang="ts">
import { computed } from "vue";
import { useSidebarSlidingViewContext } from "./sidebar-context";

const props = defineProps<{
  value: string;
}>();

const context = useSidebarSlidingViewContext();
const isActive = computed(() => context.activeKey.value === props.value);
</script>

<template>
  <div
    data-sidebar="sliding-view"
    :data-value="value"
    :aria-hidden="!isActive"
    :inert="!isActive ? true : undefined"
    :class="['phi-sidebar-sliding-view', { 'phi-sidebar-sliding-view--inactive': !isActive }]"
  >
    <slot />
  </div>
</template>
