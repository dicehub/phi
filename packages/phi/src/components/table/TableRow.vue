<script setup lang="ts">
import { computed } from "vue";
import { TABLE_DEFAULT_VARIANTS, isTableRowVariant, type TableRowVariant } from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    variant?: TableRowVariant;
  }>(),
  {
    className: undefined,
    variant: TABLE_DEFAULT_VARIANTS.variant,
  },
);

const resolvedVariant = computed(() =>
  isTableRowVariant(props.variant) ? props.variant : TABLE_DEFAULT_VARIANTS.variant,
);
</script>

<template>
  <tr
    v-bind="$attrs"
    class="phi-table-row"
    :class="[className, `phi-table-row--${resolvedVariant}`]"
    :data-variant="resolvedVariant"
    data-phi-component="Table"
    data-phi-part="row"
  >
    <slot />
  </tr>
</template>

<style src="./table.css"></style>
