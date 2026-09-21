<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs, watch } from "vue";
import {
  Select as ArkSelect,
  createListCollection,
  type SelectFocusOutsideEvent,
  type SelectHighlightChangeDetails,
  type SelectInteractOutsideEvent,
  type SelectOpenChangeDetails,
  type SelectPointerDownOutsideEvent,
} from "@ark-ui/vue/select";
import { Label } from "../label";
import SelectOption from "./SelectOption.vue";
import { provideSelectContext } from "./select-context";
import {
  areSelectValuesEqual,
  createSelectId,
  createSelectValueKey,
  isSelectItemDescriptor,
  resolveSelectSize,
  selectVariants,
  stringifySelectLabel,
  type SelectCollectionItem,
  type SelectError,
  type SelectItemEqual,
  type SelectItems,
  type SelectSize,
  type SelectValueChangeDetails,
} from "./select";

defineOptions({ inheritAttrs: false });

const slots = defineSlots<{
  default?: (props: { collection: unknown; items: SelectCollectionItem[] }) => unknown;
  description?: () => unknown;
  error?: () => unknown;
  label?: () => unknown;
  trigger?: (props: { empty: boolean; items: SelectCollectionItem[]; label: string; open: boolean; value: unknown }) => unknown;
  value?: (props: { empty: boolean; items: SelectCollectionItem[]; value: unknown }) => unknown;
}>();

const props = withDefaults(
  defineProps<{
    autoComplete?: string;
    closeOnSelect?: boolean;
    defaultHighlightedValue?: string;
    defaultOpen?: boolean;
    defaultValue?: unknown;
    description?: string;
    disabled?: boolean;
    error?: SelectError;
    highlightedValue?: string;
    hideLabel?: boolean;
    id?: string;
    invalid?: boolean;
    isItemEqualToValue?: SelectItemEqual;
    items?: SelectItems;
    label?: string;
    labelTooltip?: string;
    loading?: boolean;
    modelValue?: unknown;
    multiple?: boolean;
    name?: string;
    open?: boolean;
    placeholder?: string;
    positioning?: Record<string, unknown>;
    readOnly?: boolean;
    renderValue?: (value: unknown) => string;
    required?: boolean;
    size?: SelectSize;
    value?: unknown;
  }>(),
  {
    disabled: false,
    loading: false,
    multiple: false,
    readOnly: false,
    required: undefined,
    size: "base",
  },
);

const emit = defineEmits<{
  exitComplete: [];
  focusOutside: [event: SelectFocusOutsideEvent];
  highlightChange: [details: SelectHighlightChangeDetails<SelectCollectionItem>];
  interactOutside: [event: SelectInteractOutsideEvent];
  openChange: [details: SelectOpenChangeDetails];
  pointerDownOutside: [event: SelectPointerDownOutsideEvent];
  select: [details: unknown];
  "update:highlightedValue": [value: string | null];
  "update:modelValue": [value: unknown];
  "update:open": [open: boolean];
  valueChange: [value: unknown, details: SelectValueChangeDetails];
}>();

const instance = getCurrentInstance();
const attrs = useAttrs();
const generatedId = createSelectId();
const rootId = computed(() => props.id ?? generatedId);
const arkRootId = computed(() => `select:${rootId.value}`);
const triggerId = computed(() => `${arkRootId.value}:trigger`);
const contentId = computed(() => `${arkRootId.value}:content`);
const labelId = computed(() => `${arkRootId.value}:label`);
const descriptionId = computed(() => (props.description ? `${rootId.value}-description` : undefined));
const errorMessage = computed(() => {
  if (!props.error) return undefined;
  if (typeof props.error === "string") return props.error;
  if (props.error.match === false) return undefined;
  return stringifySelectLabel(props.error.message);
});
const errorId = computed(() => (errorMessage.value ? `${rootId.value}-error` : undefined));
const isInvalid = computed(() => Boolean(props.invalid || errorMessage.value));
const resolvedSize = computed(() => resolveSelectSize(props.size));
const showOptional = computed(() => props.required === false);
const hasField = computed(() =>
  Boolean((props.label || slots.label) && !props.hideLabel) ||
  Boolean(props.description || slots.description || errorMessage.value || slots.error),
);
const registeredItems = ref(new Map<string, SelectCollectionItem>());
const internalValue = ref<unknown>(
  props.defaultValue ?? (props.multiple ? [] : null),
);
const internalOpen = ref(props.defaultOpen ?? false);

const attrsForTrigger = computed(() => attrs);
const isPropProvided = (name: string) => {
  const props = instance?.vnode.props ?? {};
  return Object.prototype.hasOwnProperty.call(props, name);
};
const controlledRootProps = computed(() => ({
  ...(props.highlightedValue !== undefined ? { highlightedValue: props.highlightedValue } : {}),
}));
const isValueControlled = computed(() => props.modelValue !== undefined || props.value !== undefined);
const isOpenControlled = computed(() => isPropProvided("open"));
const resolvedCloseOnSelect = computed(() =>
  isPropProvided("closeOnSelect") || isPropProvided("close-on-select") ? props.closeOnSelect !== false : !props.multiple,
);
const resolvedOpen = computed(() => (isOpenControlled.value ? props.open === true : internalOpen.value));
const selectedRawValue = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue;
  if (props.value !== undefined) return props.value;
  return internalValue.value;
});

const normalizeItems = (items?: SelectItems): SelectCollectionItem[] => {
  if (!items) return [];

  if (Array.isArray(items)) {
    return items.map((item, index) => {
      const fallbackKey = `item-${index}`;
      return {
        disabled: item.disabled,
        label: stringifySelectLabel(item.label),
        rawLabel: item.label,
        value: item.value,
        valueKey: createSelectValueKey(item.value, fallbackKey),
      };
    });
  }

  return Object.entries(items)
    .filter(([, entry]) => entry !== null)
    .map(([key, entry]) => {
      const descriptor = isSelectItemDescriptor(entry);
      const label = descriptor ? entry.label : entry;

      return {
        disabled: descriptor ? entry.disabled : undefined,
        label: stringifySelectLabel(label),
        rawLabel: label,
        value: key,
        valueKey: key,
      };
    });
};

const propItems = computed(() => normalizeItems(props.items));
const slotItems = computed(() => Array.from(registeredItems.value.values()));
const allItems = computed(() => {
  const byKey = new Map<string, SelectCollectionItem>();

  for (const item of [...propItems.value, ...slotItems.value]) {
    byKey.set(item.valueKey, item);
  }

  return Array.from(byKey.values());
});
const collection = computed(() =>
  createListCollection({
    items: allItems.value,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.valueKey,
    isItemDisabled: (item) => item.disabled === true,
  }),
);

const valuesEqual = (itemValue: unknown, value: unknown) =>
  props.isItemEqualToValue?.(itemValue, value) ?? areSelectValuesEqual(itemValue, value);

const findItemForValue = (value: unknown) => allItems.value.find((item) => valuesEqual(item.value, value));
const toSelectedKeys = (value: unknown): string[] => {
  const values = props.multiple ? (Array.isArray(value) ? value : []) : [value];

  return values
    .filter((itemValue) => itemValue !== null && itemValue !== undefined && itemValue !== "")
    .map((itemValue) => findItemForValue(itemValue)?.valueKey ?? createSelectValueKey(itemValue, String(itemValue)))
    .filter(Boolean);
};
const selectedKeys = computed(() => toSelectedKeys(selectedRawValue.value));
const selectedItems = computed(() =>
  selectedKeys.value
    .map((key) => allItems.value.find((item) => item.valueKey === key))
    .filter((item): item is SelectCollectionItem => Boolean(item)),
);
const effectivePositioning = computed(() => {
  if (props.positioning) return props.positioning;

  return {
    placement: "bottom-start",
    gutter: 4,
  };
});
const selectedValue = computed(() =>
  props.multiple ? selectedItems.value.map((item) => item.value) : (selectedItems.value[0]?.value ?? null),
);
const isEmpty = computed(() => selectedKeys.value.length === 0);
const displayText = computed(() => {
  if (props.renderValue && !isEmpty.value) return props.renderValue(selectedValue.value);
  if (isEmpty.value) return props.placeholder ?? "";
  return selectedItems.value.map((item) => item.label).join(", ");
});
const describedBy = computed(() => [errorId.value, !errorMessage.value ? descriptionId.value : undefined].filter(Boolean).join(" ") || undefined);
const triggerClass = computed(() => [
  selectVariants({ size: resolvedSize.value }),
  {
    "phi-select-trigger--invalid": isInvalid.value,
    "phi-select-trigger--loading": props.loading,
  },
]);

watch(
  () => props.defaultValue,
  (value) => {
    if (!isValueControlled.value && value !== undefined) {
      internalValue.value = value;
    }
  },
);

const emitSelection = (items: SelectCollectionItem[], valueKeys: string[], event?: Event) => {
  const nextValue = props.multiple ? items.map((item) => item.value) : (items[0]?.value ?? null);
  const nextDetails: SelectValueChangeDetails = {
    event,
    items,
    value: nextValue,
    valueKeys,
  };

  if (!isValueControlled.value) {
    internalValue.value = nextValue;
  }

  emit("update:modelValue", nextValue);
  emit("valueChange", nextValue, nextDetails);
};

const setOpen = (open: boolean) => {
  if (open && (props.disabled || props.loading || props.readOnly)) return;

  if (!isOpenControlled.value) {
    internalOpen.value = open;
  }

  emit("update:open", open);
  emit("openChange", { open, value: selectedKeys.value } as SelectOpenChangeDetails);
};

const toggleOpen = () => {
  setOpen(!resolvedOpen.value);
};

const handleOpenChange = (details: SelectOpenChangeDetails) => {
  if (!isOpenControlled.value) {
    internalOpen.value = details.open;
  }

  emit("openChange", details);
  emit("update:open", details.open);
};

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading || props.readOnly) return;
  if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
    event.preventDefault();
    setOpen(true);
  } else if (event.key === "Escape") {
    setOpen(false);
  }
};

const selectItem = (item: SelectCollectionItem, event?: Event) => {
  if (item.disabled || props.disabled || props.loading || props.readOnly) return;

  const items = props.multiple
    ? selectedItems.value.some((selected) => selected.valueKey === item.valueKey)
      ? selectedItems.value.filter((selected) => selected.valueKey !== item.valueKey)
      : [...selectedItems.value, item]
    : [item];

  emitSelection(items, items.map((selected) => selected.valueKey), event);

  if (resolvedCloseOnSelect.value) {
    setOpen(false);
  }
};

provideSelectContext({
  createItem: (registration, fallbackKey) => ({
    ...registration,
    valueKey: registration.valueKey ?? createSelectValueKey(registration.value, fallbackKey),
  }),
  registerItem: (id, item) => {
    registeredItems.value = new Map(registeredItems.value).set(id, item);
  },
  selectItem,
  unregisterItem: (id) => {
    const nextItems = new Map(registeredItems.value);
    nextItems.delete(id);
    registeredItems.value = nextItems;
  },
  size: resolvedSize,
});

const handleValueChange = (details: { value: string[]; event?: Event }) => {
  const items = details.value
    .map((key) => allItems.value.find((item) => item.valueKey === key))
    .filter((item): item is SelectCollectionItem => Boolean(item));
  emitSelection(items, details.value, details.event);
};
</script>

<template>
  <ArkSelect.Root
    v-bind="controlledRootProps"
    class="phi-select"
    :auto-complete="autoComplete"
    :close-on-select="resolvedCloseOnSelect"
    :collection="collection"
    :default-highlighted-value="defaultHighlightedValue"
    :default-open="defaultOpen"
    :disabled="disabled || loading"
    :id="rootId"
    :invalid="isInvalid"
    :model-value="selectedKeys"
    :multiple="multiple"
    :name="name"
    :open="resolvedOpen"
    :positioning="effectivePositioning"
    :read-only="readOnly"
    :required="required"
    :data-invalid="isInvalid ? '' : undefined"
    :data-disabled="disabled || loading ? '' : undefined"
    @exit-complete="emit('exitComplete')"
    @focus-outside="(event) => emit('focusOutside', event)"
    @highlight-change="(details) => emit('highlightChange', details)"
    @interact-outside="(event) => emit('interactOutside', event)"
    @open-change="handleOpenChange"
    @pointer-down-outside="(event) => emit('pointerDownOutside', event)"
    @select="(details) => emit('select', details)"
    @update:highlighted-value="(value) => emit('update:highlightedValue', value)"
    @value-change="handleValueChange"
  >
    <div class="phi-select-field" :class="{ 'phi-select-field--bare': !hasField }">
      <ArkSelect.Label
        v-if="label || slots.label"
        :id="labelId"
        class="phi-select-label"
        :class="{ 'phi-sr-only': hideLabel }"
      >
        <Label as-content :show-optional="showOptional" :tooltip="hideLabel ? undefined : labelTooltip">
          <slot name="label">{{ label }}</slot>
        </Label>
      </ArkSelect.Label>

      <ArkSelect.Control class="phi-select-control">
        <ArkSelect.Trigger
          v-if="slots.trigger"
          v-bind="attrsForTrigger"
          :id="triggerId"
          as-child
          :aria-labelledby="label || slots.label ? labelId : undefined"
          :aria-describedby="describedBy"
          :aria-invalid="isInvalid ? 'true' : undefined"
          :aria-required="required === true ? 'true' : 'false'"
        >
          <slot
            name="trigger"
            :empty="isEmpty"
            :items="selectedItems"
            :label="displayText"
            :open="resolvedOpen"
            :value="selectedValue"
          />
        </ArkSelect.Trigger>
        <button
          v-else
          v-bind="attrsForTrigger"
          :id="triggerId"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          :aria-controls="contentId"
          :aria-expanded="resolvedOpen ? 'true' : 'false'"
          :aria-labelledby="label || slots.label ? labelId : undefined"
          :aria-describedby="describedBy"
          :aria-invalid="isInvalid ? 'true' : undefined"
          :aria-required="required === true ? 'true' : 'false'"
          :disabled="disabled || loading"
          :class="triggerClass"
          :data-state="resolvedOpen ? 'open' : 'closed'"
          :data-invalid="isInvalid ? '' : undefined"
          :data-disabled="disabled || loading ? '' : undefined"
          @click="toggleOpen"
          @keydown="handleTriggerKeydown"
        >
          <span v-if="loading" class="phi-select-skeleton" aria-hidden="true" />
          <ArkSelect.ValueText
            v-else
            class="phi-select-value"
            :class="{ 'phi-select-value--placeholder': isEmpty }"
            :placeholder="placeholder"
          >
            <slot name="value" :value="selectedValue" :items="selectedItems" :empty="isEmpty">
              {{ displayText }}
            </slot>
          </ArkSelect.ValueText>
          <ArkSelect.Indicator class="phi-select-indicator" aria-hidden="true">
            <span class="phi-select-caret-icon" />
          </ArkSelect.Indicator>
        </button>
      </ArkSelect.Control>

      <p v-if="errorMessage || slots.error" :id="errorId" class="phi-select-error">
        <slot name="error">{{ errorMessage }}</slot>
      </p>
      <p v-else-if="description || slots.description" :id="descriptionId" class="phi-select-description">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>

    <ArkSelect.Positioner class="phi-select-positioner">
      <ArkSelect.Content class="phi-select-content">
        <ArkSelect.List class="phi-select-list">
          <slot v-if="slots.default" :items="allItems" :collection="collection" />
          <SelectOption
            v-for="item in propItems"
            v-else
            :key="item.valueKey"
            :value="item.value"
            :label="item.label"
            :disabled="item.disabled"
            :item="item"
          />
        </ArkSelect.List>
      </ArkSelect.Content>
    </ArkSelect.Positioner>

    <ArkSelect.HiddenSelect />
  </ArkSelect.Root>
</template>

<style src="./select.css"></style>
