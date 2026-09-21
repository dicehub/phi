<script setup lang="ts">
import { computed, toRef } from "vue";
import { provideSwitchGroupContext } from "./switch-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    controlFirst?: boolean;
    description?: string;
    disabled?: boolean;
    error?: string;
    legend?: string;
  }>(),
  {
    className: undefined,
    controlFirst: true,
    description: undefined,
    disabled: undefined,
    error: undefined,
    legend: undefined,
  },
);

provideSwitchGroupContext({
  controlFirst: toRef(props, "controlFirst"),
  disabled: computed(() => props.disabled),
});
</script>

<template>
  <fieldset
    v-bind="$attrs"
    class="phi-switch-group"
    :class="[className, { 'phi-switch-group--disabled': disabled, 'phi-switch-group--invalid': Boolean(error) }]"
    :disabled="disabled"
    :aria-invalid="error ? 'true' : undefined"
    data-phi-component="Switch"
    data-phi-part="group"
  >
    <legend v-if="legend" class="phi-switch-group__legend">{{ legend }}</legend>
    <div class="phi-switch-group__items">
      <slot />
    </div>
    <p v-if="error" class="phi-switch-group__error">{{ error }}</p>
    <p v-else-if="description || $slots.description" class="phi-switch-group__description">
      <slot name="description">{{ description }}</slot>
    </p>
  </fieldset>
</template>

<style src="./switch.css"></style>
