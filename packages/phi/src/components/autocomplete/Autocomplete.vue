<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import {
  Combobox,
  createListCollection,
  type ComboboxInputValueChangeDetails,
  type ListCollection,
} from "@ark-ui/vue/combobox";
import AutocompleteContent from "./AutocompleteContent.vue";
import AutocompleteEmpty from "./AutocompleteEmpty.vue";
import AutocompleteInputGroup from "./AutocompleteInputGroup.vue";
import AutocompleteItem from "./AutocompleteItem.vue";
import AutocompleteLabel from "./AutocompleteLabel.vue";
import AutocompleteList from "./AutocompleteList.vue";
import { provideAutocompleteContext } from "./autocomplete-context";

defineOptions({ inheritAttrs: false });

type AutocompleteSize = "xs" | "sm" | "base" | "lg";
const props = withDefaults(
  defineProps<{
    allowCustomValue?: boolean;
    ariaDescribedby?: string;
    ariaLabel?: string;
    clearable?: boolean;
    closeOnSelect?: boolean;
    collection?: ListCollection<unknown>;
    defaultInputValue?: string;
    emptyText?: string;
    filter?: false | ((item: unknown, inputValue: string) => boolean);
    inputValue?: string;
    itemToString?: (item: unknown) => string;
    itemToValue?: (item: unknown) => string;
    items?: unknown[];
    label?: string;
    placeholder?: string;
    positioning?: Record<string, unknown>;
    showOnEmpty?: boolean;
    showTrigger?: boolean;
    size?: AutocompleteSize;
  }>(),
  {
    allowCustomValue: true,
    clearable: false,
    closeOnSelect: true,
    emptyText: "No suggestions.",
    filter: undefined,
    positioning: () => ({ placement: "bottom-start", gutter: 4 }),
    showOnEmpty: false,
    showTrigger: false,
    size: "base",
  },
);

const slots = useSlots();
const internalInputValue = ref(props.inputValue ?? props.defaultInputValue ?? "");

const isRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

const defaultItemToString = (item: unknown) => {
  if (props.itemToString) {
    return props.itemToString(item);
  }

  if (isRecord(item) && "label" in item) {
    return String(item.label ?? "");
  }

  return String(item ?? "");
};

const defaultItemToValue = (item: unknown) => {
  if (props.itemToValue) {
    return props.itemToValue(item);
  }

  if (isRecord(item) && "value" in item) {
    return String(item.value ?? "");
  }

  return defaultItemToString(item);
};

const matchesInputValue = (item: unknown, inputValue: string) => {
  if (!inputValue && !props.showOnEmpty) {
    return false;
  }

  if (props.filter === false) {
    return true;
  }

  if (typeof props.filter === "function") {
    return props.filter(item, inputValue);
  }

  return defaultItemToString(item).toLowerCase().includes(inputValue.trim().toLowerCase());
};

const defaultCollection = computed(() =>
  createListCollection({
    items: (props.items ?? []).filter((item) => matchesInputValue(item, internalInputValue.value)),
    itemToString: defaultItemToString,
    itemToValue: defaultItemToValue,
  }),
);

const activeCollection = computed(() => props.collection ?? defaultCollection.value);
const hasCustomContent = computed(() => Boolean(slots.default));

provideAutocompleteContext({
  collection: activeCollection,
});

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  internalInputValue.value = details.inputValue;
};

watch(
  () => props.inputValue,
  (value) => {
    if (value !== undefined) {
      internalInputValue.value = value;
    }
  },
);
</script>

<template>
  <Combobox.Root
    class="phi-autocomplete"
    :allow-custom-value="allowCustomValue"
    :close-on-select="closeOnSelect"
    :collection="activeCollection"
    :default-input-value="defaultInputValue"
    :input-value="inputValue"
    :positioning="positioning"
    v-bind="$attrs"
    @input-value-change="handleInputValueChange"
  >
    <slot v-if="hasCustomContent" :collection="activeCollection" :items="activeCollection.items" />
    <template v-else>
      <AutocompleteLabel v-if="label">{{ label }}</AutocompleteLabel>
      <AutocompleteInputGroup
        :aria-describedby="ariaDescribedby"
        :aria-label="ariaLabel"
        :clearable="clearable"
        :placeholder="placeholder"
        :show-trigger="showTrigger"
        :size="size"
      />
      <AutocompleteContent>
        <AutocompleteEmpty>{{ emptyText }}</AutocompleteEmpty>
        <AutocompleteList>
          <template #default="{ item }">
            <AutocompleteItem :item="item">
              <slot name="item" :item="item">
                {{ defaultItemToString(item) }}
              </slot>
            </AutocompleteItem>
          </template>
        </AutocompleteList>
      </AutocompleteContent>
    </template>
  </Combobox.Root>
</template>

<style src="./autocomplete.css"></style>
