<script setup lang="ts">
import { computed, useSlots } from "vue";
import { usePaginationContext } from "./context";
import { PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS } from "./pagination";
import PaginationSelect from "./PaginationSelect.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    label?: string;
    options?: number[];
    value: number;
  }>(),
  {
    className: undefined,
    label: "Per page:",
    options: () => [...PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS],
  },
);

const emit = defineEmits<{
  change: [size: number];
  "update:value": [size: number];
}>();

const slots = useSlots();
const context = usePaginationContext();
const hasLabel = computed(() => props.label !== "" || Boolean(slots.label));

function handleChange(size: number) {
  emit("update:value", size);
  emit("change", size);
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-pagination__page-size"
    :class="className"
    data-slot="pagination-page-size"
  >
    <span v-if="hasLabel" class="phi-pagination__page-size-label">
      <slot name="label">{{ label }}</slot>
    </span>
    <PaginationSelect
      class-name="phi-pagination__select--size"
      :label="context.labels.value.pageSize"
      :model-value="value"
      :options="options"
      @change="handleChange"
    />
  </div>
</template>
