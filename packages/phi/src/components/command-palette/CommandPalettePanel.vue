<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import {
  Combobox,
  createListCollection,
  type ComboboxHighlightChangeDetails,
  type ComboboxInputValueChangeDetails,
  type ComboboxValueChangeDetails,
} from "@ark-ui/vue/combobox";
import {
  provideCommandPaletteContext,
  stringifyCommandPaletteItem,
  toCommandPaletteItemValue,
  type CommandPaletteHighlightDetails,
  type CommandPaletteSelectOptions,
} from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    defaultValue?: string;
    filter?: false | ((item: unknown, query: string) => boolean);
    getSelectableItems?: (items: unknown[]) => unknown[];
    itemToStringValue?: (item: unknown) => string;
    items?: unknown[];
    open?: boolean;
    value?: string;
  }>(),
  {
    items: () => [],
    open: true,
  },
);

const emit = defineEmits<{
  close: [];
  itemHighlighted: [item: unknown | undefined, details: CommandPaletteHighlightDetails];
  select: [item: unknown, options: CommandPaletteSelectOptions];
  "update:value": [value: string];
  valueChange: [value: string];
}>();

const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasValueProp = Object.prototype.hasOwnProperty.call(vnodeProps, "value");
const internalValue = ref(props.value ?? props.defaultValue ?? "");
const highlightedValue = ref<string | null>(null);
const highlightedItem = ref<unknown | undefined>();

const stringifyItem = (item: unknown) =>
  props.itemToStringValue ? props.itemToStringValue(item) : stringifyCommandPaletteItem(item);
const itemToValue = (item: unknown) => toCommandPaletteItemValue(item) || stringifyItem(item);
const isItemDisabled = (item: unknown) =>
  Boolean(item && typeof item === "object" && (item as { disabled?: unknown }).disabled === true);
const findItemIndex = (item: unknown) => selectableItems.value.findIndex((candidate) => candidate === item);
const findItemByValue = (value: string) => collection.value.findMany([value])[0];
const matchesQuery = (item: unknown, query: string) => {
  if (!query) return true;
  if (props.filter === false) return true;
  if (typeof props.filter === "function") return props.filter(item, query);

  return stringifyItem(item).toLowerCase().includes(query.toLowerCase());
};

const inputValue = computed(() => (hasValueProp ? props.value ?? "" : internalValue.value));
const open = computed(() => props.open);
const resolvedHighlightedValue = computed(() => highlightedValue.value ?? undefined);
const topLevelItems = computed(() => props.items ?? []);
const items = computed(() => {
  if (props.getSelectableItems) return topLevelItems.value;

  const baseItems = props.items ?? [];
  const query = inputValue.value.trim();

  if (props.filter === false || !query) return baseItems;

  return baseItems.filter((item) => matchesQuery(item, query));
});
const selectableItems = computed(() => {
  const baseItems = props.getSelectableItems?.(items.value) ?? items.value;
  const query = inputValue.value.trim();

  if (props.getSelectableItems || props.filter === false || !query) return baseItems;

  return baseItems.filter((item) => matchesQuery(item, query));
});
const collection = computed(() =>
  createListCollection({
    isItemDisabled,
    itemToString: stringifyItem,
    itemToValue,
    items: selectableItems.value,
  }),
);

const setInputValue = (value: string) => {
  if (!hasValueProp) internalValue.value = value;
  emit("update:value", value);
  emit("valueChange", value);
};

const selectItem = (item: unknown, options: CommandPaletteSelectOptions) => {
  if (isItemDisabled(item)) return;
  emit("select", item, options);
};

const selectHighlightedItem = (options: CommandPaletteSelectOptions) => {
  const item = highlightedItem.value;
  if (item !== undefined) selectItem(item, options);
};

const setHighlightedValue = (value: string | null) => {
  highlightedValue.value = value;
};

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  if (details.reason === "item-select") return;
  setInputValue(details.inputValue);
};

const handleHighlightChange = (details: ComboboxHighlightChangeDetails<unknown>) => {
  const item = details.highlightedItem ?? undefined;
  highlightedItem.value = item;
  highlightedValue.value = details.highlightedValue;
  emit("itemHighlighted", item, {
    index: item === undefined ? -1 : findItemIndex(item),
    reason: item === undefined ? "reset" : "keyboard",
  });
};

const handleValueChange = (details: ComboboxValueChangeDetails<unknown>) => {
  const item = details.items[0] ?? (details.value[0] ? findItemByValue(details.value[0]) : undefined);
  if (item !== undefined) selectItem(item, { newTab: false });
};

provideCommandPaletteContext({
  close: () => emit("close"),
  collection,
  inputValue,
  items,
  open,
  selectHighlightedItem,
  selectItem,
  selectableItems,
  setInputValue,
  stringifyItem,
});

watch(
  () => [selectableItems.value, open.value] as const,
  () => {
    if (!open.value) {
      highlightedItem.value = undefined;
      highlightedValue.value = null;
      return;
    }

    if (highlightedValue.value && selectableItems.value.some((item) => itemToValue(item) === highlightedValue.value)) {
      highlightedItem.value = findItemByValue(highlightedValue.value);
      return;
    }

    const firstItem = selectableItems.value[0];
    highlightedItem.value = firstItem;
    highlightedValue.value = firstItem === undefined ? null : itemToValue(firstItem);
  },
  { immediate: true },
);

watch(
  () => props.value,
  (value) => {
    if (hasValueProp) internalValue.value = value ?? "";
  },
);
</script>

<template>
  <Combobox.Root
    v-bind="$attrs"
    class="phi-command-palette-panel"
    :allow-custom-value="true"
    :auto-focus="false"
    :close-on-select="false"
    :collection="collection"
    :highlighted-value="resolvedHighlightedValue"
    input-behavior="autohighlight"
    :input-value="inputValue"
    :loop-focus="true"
    :open="open"
    :open-on-click="false"
    :open-on-key-press="true"
    selection-behavior="preserve"
    @highlight-change="handleHighlightChange"
    @input-value-change="handleInputValueChange"
    @update:highlighted-value="setHighlightedValue"
    @value-change="handleValueChange"
  >
    <slot :collection="collection" :items="items" :selectable-items="selectableItems" :value="inputValue" />
  </Combobox.Root>
</template>

<style src="./command-palette.css"></style>
