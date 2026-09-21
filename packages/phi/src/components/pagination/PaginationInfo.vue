<script setup lang="ts">
import { computed, useSlots } from "vue";
import { getPaginationInfoDetails, usePaginationContext } from "./context";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    className?: string;
  }>(),
  {
    className: undefined,
  },
);

const slots = useSlots();
const context = usePaginationContext();
const details = computed(() => getPaginationInfoDetails(context));
const shouldShowDefaultInfo = computed(() => Boolean(details.value.totalCount && details.value.totalCount > 0));
const hasCustomInfo = computed(() => Boolean(slots.default));
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-pagination__info"
    :class="className"
    data-slot="pagination-info"
  >
    <slot v-if="hasCustomInfo" v-bind="details" />
    <template v-else-if="shouldShowDefaultInfo">
      Showing <span class="phi-pagination__number">{{ details.pageShowingRange }}</span> of
      <span class="phi-pagination__number">{{ details.totalCount }}</span>
    </template>
  </div>
</template>
