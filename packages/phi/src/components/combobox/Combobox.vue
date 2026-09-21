<script setup lang="ts">
import { computed, getCurrentInstance, ref, shallowRef, useSlots, watch } from "vue";
import {
  Combobox,
  createListCollection,
  type ComboboxHighlightChangeDetails,
  type ComboboxInputValueChangeDetails,
  type ComboboxOpenChangeDetails,
  type ComboboxSelectionDetails,
  type ComboboxValueChangeDetails,
  type ListCollection,
} from "@ark-ui/vue/combobox";
import ComboboxContent from "./ComboboxContent.vue";
import ComboboxEmpty from "./ComboboxEmpty.vue";
import ComboboxItem from "./ComboboxItem.vue";
import ComboboxList from "./ComboboxList.vue";
import ComboboxTriggerInput from "./ComboboxTriggerInput.vue";
import {
  mergeComboboxPositioning,
  type ComboboxPositioningOptions,
} from "./combobox";
import { provideComboboxContext, type ComboboxSize } from "./combobox-context";

defineOptions({ inheritAttrs: false });

type PhiComboboxGlobal = typeof globalThis & {
  __phiComboboxId?: number;
};

const nextComboboxId = () => {
  const phiGlobal = globalThis as PhiComboboxGlobal;

  phiGlobal.__phiComboboxId = (phiGlobal.__phiComboboxId ?? 0) + 1;
  return `phi-combobox-${phiGlobal.__phiComboboxId}`;
};

const props = withDefaults(
  defineProps<{
    allowCustomValue?: boolean;
    closeOnSelect?: boolean;
    collection?: ListCollection<unknown>;
    defaultHighlightedValue?: string;
    defaultInputValue?: string;
    defaultOpen?: boolean;
    defaultValue?: string[];
    description?: string;
    disabled?: boolean;
    emptyText?: string;
    error?: string;
    filter?: false | ((item: unknown, inputValue: string) => boolean);
    highlightedValue?: string;
    id?: string;
    inputBehavior?: "autohighlight" | "autocomplete" | "none";
    inputValue?: string;
    invalid?: boolean;
    isItemDisabled?: (item: unknown) => boolean;
    itemToString?: (item: unknown) => string;
    itemToValue?: (item: unknown) => string;
    items?: unknown[];
    label?: string;
    modelValue?: string[];
    multiple?: boolean;
    name?: string;
    open?: boolean;
    openOnChange?: boolean | ((details: ComboboxInputValueChangeDetails) => boolean);
    openOnClick?: boolean;
    placeholder?: string;
    positioning?: ComboboxPositioningOptions;
    readOnly?: boolean;
    required?: boolean;
    selectionBehavior?: "clear" | "replace" | "preserve";
    showOnEmpty?: boolean;
    size?: ComboboxSize;
  }>(),
  {
    allowCustomValue: false,
    emptyText: "No results found.",
    inputBehavior: "none",
    items: () => [],
    openOnClick: true,
    positioning: () => ({ placement: "bottom-start", gutter: 4 }),
    showOnEmpty: true,
    size: "base",
  },
);

const emit = defineEmits<{
  focusOutside: [event: Event];
  highlightChange: [details: ComboboxHighlightChangeDetails<unknown>];
  inputValueChange: [details: ComboboxInputValueChangeDetails];
  interactOutside: [event: Event];
  openChange: [details: ComboboxOpenChangeDetails];
  pointerDownOutside: [event: Event];
  select: [details: ComboboxSelectionDetails];
  "update:highlightedValue": [value: string | null];
  "update:inputValue": [value: string];
  "update:modelValue": [value: string[]];
  "update:open": [value: boolean];
  valueChange: [details: ComboboxValueChangeDetails<unknown>];
}>();

const slots = useSlots();
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasProp = (...names: string[]) =>
  names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
const hasCloseOnSelectProp = hasProp("closeOnSelect", "close-on-select");
const hasFilterProp = hasProp("filter");
const hasOpenProp = hasProp("open");
const hasOpenOnChangeProp = hasProp("openOnChange", "open-on-change");
const generatedId = nextComboboxId();
const rootId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => (props.description ? `${rootId.value}-description` : undefined));
const errorId = computed(() => (props.error ? `${rootId.value}-error` : undefined));
const describedBy = computed(() => [descriptionId.value, errorId.value].filter(Boolean).join(" ") || undefined);
const isInvalid = computed(() => Boolean(props.invalid || props.error));

const isRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

const itemToString = (item: unknown) => {
  if (props.itemToString) return props.itemToString(item);
  if (isRecord(item) && "label" in item) return String(item.label ?? "");
  return String(item ?? "");
};

const itemToValue = (item: unknown) => {
  if (props.itemToValue) return props.itemToValue(item);
  if (isRecord(item) && "value" in item) return String(item.value ?? "");
  return itemToString(item);
};

const isItemDisabled = (item: unknown) => {
  if (props.isItemDisabled) return props.isItemDisabled(item);
  return isRecord(item) && item.disabled === true;
};

const baseCollection = computed(
  () =>
    props.collection ??
    createListCollection({
      items: props.items,
      itemToString,
      itemToValue,
      isItemDisabled,
    }),
);

const valueToInputValue = (value?: string[]) => {
  const firstValue = value?.[0];
  if (!firstValue) return "";
  return baseCollection.value.stringify(firstValue) ?? firstValue;
};

const internalInputValue = ref(
  props.inputValue ??
    props.defaultInputValue ??
    (props.multiple ? "" : valueToInputValue(props.modelValue ?? props.defaultValue)),
);
const internalFilterValue = ref(props.inputValue ?? props.defaultInputValue ?? "");
const contentPositioning = shallowRef<ComboboxPositioningOptions>();

const matchesInputValue = (item: unknown, inputValue: string) => {
  const query = inputValue.trim().toLowerCase();
  if (!query && !props.showOnEmpty) return false;
  if (!query) return true;
  if (hasFilterProp && props.filter === false) return true;
  if (typeof props.filter === "function") return props.filter(item, inputValue);
  return itemToString(item).toLowerCase().includes(query);
};

const activeCollection = computed(() => {
  if (hasFilterProp && props.filter === false) return baseCollection.value;
  return baseCollection.value.filter((_, __, item) => matchesInputValue(item, internalFilterValue.value));
});

const resolvedCloseOnSelect = computed(() =>
  hasCloseOnSelectProp ? props.closeOnSelect : !props.multiple,
);
const resolvedDefaultInputValue = computed(
  () => props.defaultInputValue ?? (props.multiple ? "" : valueToInputValue(props.modelValue ?? props.defaultValue)),
);
const resolvedInputValue = computed(() => props.inputValue ?? internalInputValue.value);
const resolvedOpen = computed(() => (hasOpenProp ? props.open : undefined));
const resolvedOpenOnChange = computed(() => (hasOpenOnChangeProp ? props.openOnChange : undefined));
const resolvedPositioning = computed(() =>
  mergeComboboxPositioning(props.positioning, contentPositioning.value),
);
const resolvedSelectionBehavior = computed(() => props.selectionBehavior ?? (props.multiple ? "clear" : "replace"));
const hasCustomContent = computed(() => Boolean(slots.default));

provideComboboxContext({
  clearContentPositioning: () => {
    contentPositioning.value = undefined;
  },
  collection: activeCollection,
  describedBy,
  filterValue: internalFilterValue,
  invalid: isInvalid,
  setContentPositioning: (positioning) => {
    contentPositioning.value = positioning;
  },
  setFilterValue: (value) => {
    internalFilterValue.value = value;
  },
  size: computed(() => props.size),
});

const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
  internalInputValue.value = details.inputValue;
  internalFilterValue.value =
    details.reason === "input-change" || details.reason === "script" || details.reason === undefined
      ? details.inputValue
      : "";
  emit("inputValueChange", details);
};

watch(
  () => props.inputValue,
  (value) => {
    if (value !== undefined) {
      internalInputValue.value = value;
      internalFilterValue.value = value;
    }
  },
);

watch(
  () => props.modelValue,
  (value) => {
    if (props.inputValue === undefined && !props.multiple && value) {
      internalInputValue.value = valueToInputValue(value);
      internalFilterValue.value = "";
    }
  },
);
</script>

<template>
  <Combobox.Root
    v-bind="$attrs"
    class="phi-combobox"
    :class="[`phi-combobox--${size}`, { 'phi-combobox--invalid': isInvalid }]"
    :allow-custom-value="allowCustomValue"
    :close-on-select="resolvedCloseOnSelect"
    :collection="activeCollection"
    :default-highlighted-value="defaultHighlightedValue"
    :default-input-value="resolvedDefaultInputValue"
    :default-open="defaultOpen"
    :default-value="defaultValue"
    :disabled="disabled"
    :highlighted-value="highlightedValue"
    :id="rootId"
    :input-behavior="inputBehavior"
    :input-value="resolvedInputValue"
    :invalid="isInvalid"
    :model-value="modelValue"
    :multiple="multiple"
    :name="name"
    :open="resolvedOpen"
    :open-on-change="resolvedOpenOnChange"
    :open-on-click="openOnClick"
    :placeholder="placeholder"
    :positioning="resolvedPositioning"
    :read-only="readOnly"
    :required="required"
    :selection-behavior="resolvedSelectionBehavior"
    :data-invalid="isInvalid ? '' : undefined"
    @focus-outside="(event) => emit('focusOutside', event)"
    @highlight-change="(details) => emit('highlightChange', details)"
    @input-value-change="handleInputValueChange"
    @interact-outside="(event) => emit('interactOutside', event)"
    @open-change="(details) => emit('openChange', details)"
    @pointer-down-outside="(event) => emit('pointerDownOutside', event)"
    @select="(details) => emit('select', details)"
    @update:highlighted-value="(value) => emit('update:highlightedValue', value)"
    @update:input-value="(value) => emit('update:inputValue', value)"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @update:open="(value) => emit('update:open', value)"
    @value-change="(details) => emit('valueChange', details)"
  >
    <Combobox.Label v-if="label" class="phi-combobox-label">
      {{ label }}<span v-if="required" class="phi-combobox-required" aria-hidden="true">*</span>
    </Combobox.Label>

    <slot v-if="hasCustomContent" :collection="activeCollection" :items="activeCollection.items" />
    <template v-else>
      <ComboboxTriggerInput :placeholder="placeholder" />
      <ComboboxContent>
        <ComboboxEmpty>{{ emptyText }}</ComboboxEmpty>
        <ComboboxList>
          <template #default="{ item }">
            <ComboboxItem :item="item">{{ itemToString(item) }}</ComboboxItem>
          </template>
        </ComboboxList>
      </ComboboxContent>
    </template>

    <p v-if="description" :id="descriptionId" class="phi-combobox-description">{{ description }}</p>
    <p v-if="error" :id="errorId" class="phi-combobox-error">{{ error }}</p>
  </Combobox.Root>
</template>

<style src="./combobox.css"></style>
