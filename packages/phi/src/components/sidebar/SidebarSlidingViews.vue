<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import { provideSidebarSlidingViewContext } from "./sidebar-context";

const props = withDefaults(
  defineProps<{
    activeKey: string;
    direction?: "left" | "right";
  }>(),
  {
    direction: "left",
  },
);

const slots = useSlots();
const activeKey = ref(props.activeKey);

watch(
  () => props.activeKey,
  (nextActiveKey) => {
    activeKey.value = nextActiveKey;
  },
);

const activeIndex = computed(() => {
  const children = slots.default?.() ?? [];
  const index = children.findIndex((child) => (child.props as { value?: string } | null)?.value === props.activeKey);
  return index >= 0 ? index : 0;
});

const transform = computed(() => `translateX(-${activeIndex.value * 100}%)`);

provideSidebarSlidingViewContext({ activeKey });
</script>

<template>
  <div data-sidebar="sliding-views" class="phi-sidebar-sliding-views" :data-direction="direction">
    <div class="phi-sidebar-sliding-views__track" :style="{ transform }">
      <slot />
    </div>
  </div>
</template>
