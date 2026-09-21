<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { Select as ArkSelect } from "@ark-ui/vue/select";
import { createSelectId, isSelectItemDescriptor, stringifySelectLabel, type SelectCollectionItem } from "./select";
import { useSelectContext } from "./select-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    item?: SelectCollectionItem;
    label?: unknown;
    value: unknown;
  }>(),
  {
    disabled: false,
    item: undefined,
    label: undefined,
  },
);

const selectContext = useSelectContext();
const optionId = createSelectId("phi-select-option");
const optionLabel = computed(() => {
  if (props.label !== undefined) return props.label;
  return isSelectItemDescriptor(props.value) ? props.value.label : props.value;
});
const resolvedItem = computed(() => {
  if (props.item) return props.item;

  return selectContext?.createItem(
    {
      disabled: props.disabled,
      label: stringifySelectLabel(optionLabel.value),
      rawLabel: optionLabel.value,
      value: props.value,
    },
    optionId,
  ) ?? {
    disabled: props.disabled,
    label: stringifySelectLabel(optionLabel.value),
    rawLabel: optionLabel.value,
    value: props.value,
    valueKey: optionId,
  };
});

watch(
  resolvedItem,
  (item) => {
    if (!props.item) selectContext?.registerItem(optionId, item);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (!props.item) selectContext?.unregisterItem(optionId);
});
</script>

<template>
  <ArkSelect.Item
    v-bind="$attrs"
    class="phi-select-item"
    :item="resolvedItem"
    :data-disabled="resolvedItem.disabled ? '' : undefined"
    @click="selectContext?.selectItem(resolvedItem, $event)"
    @keydown.enter.prevent="selectContext?.selectItem(resolvedItem, $event)"
    @keydown.space.prevent="selectContext?.selectItem(resolvedItem, $event)"
  >
    <ArkSelect.ItemText class="phi-select-item-text">
      <slot>{{ resolvedItem.label }}</slot>
    </ArkSelect.ItemText>
    <ArkSelect.ItemIndicator class="phi-select-item-indicator">
      <span class="phi-select-check-icon" aria-hidden="true" />
    </ArkSelect.ItemIndicator>
  </ArkSelect.Item>
</template>

<style src="./select.css"></style>
