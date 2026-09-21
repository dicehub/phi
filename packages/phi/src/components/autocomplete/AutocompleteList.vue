<script setup lang="ts">
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import { useAutocompleteContext } from "./autocomplete-context";

defineOptions({ inheritAttrs: false });

defineSlots<{
  default(props: { item?: unknown }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    items?: unknown[];
    renderItems?: boolean;
  }>(),
  {
    renderItems: true,
  },
);

const combobox = useComboboxContext();
const autocomplete = useAutocompleteContext();

const shouldRenderItems = computed(() => props.renderItems);
const activeCollection = computed(() => autocomplete?.collection.value ?? combobox.value.collection);
const listItems = computed(() => props.items ?? activeCollection.value.items ?? []);
const renderableItems = computed(() => listItems.value.filter((item) => item !== undefined && item !== null));
const listProps = computed(() => combobox.value.getListProps());
const itemToValue = (item: unknown) => activeCollection.value.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <div v-bind="{ ...listProps, ...$attrs }" class="phi-autocomplete-list">
    <template v-if="shouldRenderItems">
      <template v-for="item in renderableItems" :key="itemToValue(item)">
        <slot :item="item" />
      </template>
    </template>
    <slot v-else />
  </div>
</template>
