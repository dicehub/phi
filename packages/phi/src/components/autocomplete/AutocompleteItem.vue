<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  item?: unknown;
  value?: unknown;
}>();

const resolvedItem = computed(() => props.item ?? props.value);
const hasResolvedItem = computed(() => resolvedItem.value !== undefined && resolvedItem.value !== null);
</script>

<template>
  <Combobox.Item v-if="hasResolvedItem" class="phi-autocomplete-item" :item="resolvedItem" v-bind="$attrs">
    <Combobox.ItemText class="phi-autocomplete-item-text">
      <slot />
    </Combobox.ItemText>
  </Combobox.Item>
</template>
