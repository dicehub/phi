<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    icon?: Component;
    iconProps?: Record<string, unknown>;
    inset?: boolean;
  }>(),
  {
    iconProps: () => ({}),
  },
);

const triggerClass = computed(() => ({
  "phi-dropdown-item--inset": props.inset,
}));
</script>

<template>
  <Menu.TriggerItem
    class="phi-dropdown-item phi-dropdown-sub-trigger"
    :class="triggerClass"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      class="phi-dropdown-item__icon"
      v-bind="iconProps"
      aria-hidden="true"
    />
    <slot />
    <svg class="phi-dropdown-sub-trigger__caret" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m6 3.75 4.25 4.25L6 12.25" />
    </svg>
  </Menu.TriggerItem>
</template>
