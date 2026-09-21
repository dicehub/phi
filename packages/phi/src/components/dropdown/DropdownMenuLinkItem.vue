<script setup lang="ts">
import { computed, type Component } from "vue";
import { Menu } from "@ark-ui/vue/menu";
import { resolveDropdownMenuItemVariant, type DropdownMenuItemVariant } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    href: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    inset?: boolean;
    rel?: string;
    target?: string;
    value?: string;
    valueText?: string;
    variant?: DropdownMenuItemVariant;
  }>(),
  {
    disabled: false,
    iconProps: () => ({}),
  },
);

const resolvedVariant = computed(() => resolveDropdownMenuItemVariant(props.variant));
const resolvedRel = computed(() => props.rel ?? (props.target === "_blank" ? "noreferrer" : undefined));
const itemValue = computed(() => props.value ?? props.href);
const itemClass = computed(() => [
  `phi-dropdown-item--${resolvedVariant.value}`,
  {
    "phi-dropdown-item--inset": props.inset,
  },
]);
</script>

<template>
  <Menu.Item
    :disabled="disabled"
    :value="itemValue"
    :value-text="valueText"
    as-child
  >
    <a
      class="phi-dropdown-item phi-dropdown-link-item"
      :class="itemClass"
      :href="href"
      :rel="resolvedRel"
      :target="target"
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
    </a>
  </Menu.Item>
</template>
