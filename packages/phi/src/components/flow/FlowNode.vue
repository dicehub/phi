<script setup lang="ts">
import { computed, useId } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    id?: string;
    unstyled?: boolean;
  }>(),
  {
    disabled: false,
    unstyled: false,
  },
);

const generatedId = `phi-flow-node-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const nodeId = computed(() => props.id ?? generatedId);
</script>

<template>
  <li
    v-bind="$attrs"
    class="phi-flow-node"
    :class="{
      'phi-flow-node--disabled': disabled,
      'phi-flow-node--unstyled': unstyled,
    }"
    data-flow-item
    data-flow-type="node"
    :data-flow-disabled="disabled ? 'true' : undefined"
    :data-flow-id="nodeId"
    :data-node-id="nodeId"
  >
    <slot />
  </li>
</template>

<style src="./flow.css"></style>
