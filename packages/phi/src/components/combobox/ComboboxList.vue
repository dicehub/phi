<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { usePhiComboboxContext } from "./combobox-context";

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

const arkCombobox = useComboboxContext();
const phiCombobox = usePhiComboboxContext();
const activeCollection = computed(() => phiCombobox.collection.value ?? arkCombobox.value.collection);
const listItems = computed(() => props.items ?? activeCollection.value.items ?? []);
const renderableItems = computed(() => listItems.value.filter((item) => item !== undefined && item !== null));
const listProps = computed(() => arkCombobox.value.getListProps());
const itemToValue = (item: unknown) => activeCollection.value.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <div v-bind="{ ...listProps, ...$attrs }" class="phi-combobox-list">
    <template v-if="renderItems">
      <template v-for="item in renderableItems" :key="itemToValue(item)">
        <slot :item="item" />
      </template>
    </template>
    <slot v-else />
  </div>
</template>
