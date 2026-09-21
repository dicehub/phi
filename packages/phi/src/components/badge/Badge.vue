<script setup lang="ts">
import { computed, type Component } from "vue";
import { BADGE_DEFAULT_VARIANT, isBadgeVariant, type BadgeVariant } from "./badge";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    icon?: Component;
    iconProps?: Record<string, unknown>;
    variant?: BadgeVariant;
  }>(),
  {
    iconProps: () => ({}),
    variant: BADGE_DEFAULT_VARIANT,
  },
);

const resolvedVariant = computed(() => (isBadgeVariant(props.variant) ? props.variant : BADGE_DEFAULT_VARIANT));
</script>

<template>
  <span
    v-bind="$attrs"
    data-phi-component="Badge"
    class="phi-badge"
    :class="[`phi-badge--${resolvedVariant}`, { 'phi-badge--with-icon': icon }]"
  >
    <span v-if="icon" class="phi-badge__icon" aria-hidden="true">
      <component :is="icon" class="phi-badge__icon-node" v-bind="iconProps" />
    </span>
    <slot />
  </span>
</template>

<style src="./badge.css" scoped></style>
