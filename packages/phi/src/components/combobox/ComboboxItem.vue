<script setup lang="ts">
import { computed } from "vue";
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  item?: unknown;
  value?: unknown;
}>();

const resolvedItem = computed(() => props.item ?? props.value);
const hasResolvedItem = computed(() => resolvedItem.value !== undefined && resolvedItem.value !== null);
</script>

<template>
  <Combobox.Item v-if="hasResolvedItem" v-bind="$attrs" class="phi-combobox-item" :item="resolvedItem">
    <Combobox.ItemText class="phi-combobox-item-text">
      <slot />
    </Combobox.ItemText>
    <Combobox.ItemIndicator class="phi-combobox-item-indicator">
      <span class="phi-combobox-check-icon" aria-hidden="true"></span>
    </Combobox.ItemIndicator>
  </Combobox.Item>
</template>
