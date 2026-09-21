<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  useSlots,
  watch,
  type ComponentPublicInstance,
} from "vue";
import {
  DatePicker as ArkDatePicker,
  type DatePickerDateView,
  type DatePickerFocusChangeDetails,
  type DatePickerOpenChangeDetails,
  type DatePickerValueChangeDetails,
  type DatePickerViewChangeDetails,
  type DatePickerVisibleRangeChangeDetails,
  type DateValue,
} from "@ark-ui/vue/date-picker";
import DatePickerCalendar from "./DatePickerCalendar.vue";
import {
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerPositioner,
  DatePickerTrigger,
} from "./DatePickerParts";
import {
  dateToDateValue,
  dateValueToDate,
  dateValuesToSelected,
  isDatePickerMode,
  isRangeWithinDayLimits,
  resolveDatePickerRangeValue,
  resolveDatePickerTimeZone,
  selectedToDateValues,
  type DatePickerMode,
  type DatePickerProps,
  type DatePickerRangeValueState,
  type DatePickerSelected,
} from "./date-picker";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<DatePickerProps>(),
  {
    clearable: true,
    defaultOpen: undefined,
    disabled: undefined,
    fixedWeeks: undefined,
    inline: undefined,
    invalid: undefined,
    open: undefined,
    openOnClick: true,
    outsideDaySelectable: undefined,
    positioning: () => ({ placement: "bottom-start", gutter: 8 }),
    readOnly: undefined,
    required: undefined,
    showWeekNumbers: undefined,
    startOfWeek: 1,
  },
);

const emit = defineEmits<{
  change: [selected: DatePickerSelected, details: DatePickerValueChangeDetails];
  exitComplete: [];
  focusChange: [details: DatePickerFocusChangeDetails];
  openChange: [details: DatePickerOpenChangeDetails];
  "update:focusedValue": [focusedValue: DateValue];
  "update:modelValue": [value: DateValue[]];
  "update:open": [open: boolean];
  "update:selected": [selected: DatePickerSelected];
  "update:view": [view: DatePickerDateView];
  valueChange: [details: DatePickerValueChangeDetails];
  viewChange: [details: DatePickerViewChangeDetails];
  visibleRangeChange: [details: DatePickerVisibleRangeChangeDetails];
}>();

const slots = useSlots();
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasProp = (...names: string[]) =>
  names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
const hasModelValueProp = hasProp("modelValue", "model-value");
const hasSelectedProp = hasProp("selected");
const hasCloseOnSelectProp = hasProp("closeOnSelect", "close-on-select");
const hasOpenProp = hasProp("open");
const generatedId = useId();
const rootRef = shallowRef<HTMLElement | ComponentPublicInstance | null>(null);
const rootId = computed(() => props.id ?? `phi-date-picker-${generatedId}`);
const descriptionId = computed(() => (props.description ? `${rootId.value}-description` : undefined));
const errorId = computed(() => (props.error ? `${rootId.value}-error` : undefined));
const describedBy = computed(() => [descriptionId.value, errorId.value].filter(Boolean).join(" ") || undefined);
const hasCustomContent = computed(() => Boolean(slots.default));
const isInvalid = computed(() => Boolean(props.invalid || props.error));
const resolvedMode = computed<DatePickerMode>(() => {
  const mode = props.mode ?? props.selectionMode;
  return isDatePickerMode(mode) ? mode : "single";
});
const resolvedCloseOnSelect = computed(() => (hasCloseOnSelectProp ? props.closeOnSelect : resolvedMode.value === "single"));
const internalOpen = ref(Boolean(props.defaultOpen));
const resolvedOpen = computed(() => (hasOpenProp ? Boolean(props.open) : internalOpen.value));
const resolvedTimeZone = computed(() => resolveDatePickerTimeZone(props.timeZone));
const resolvedNumOfMonths = computed(() => props.numberOfMonths ?? props.numOfMonths ?? 1);
const resolvedMin = computed(() => props.min ?? (props.minDate ? dateToDateValue(props.minDate, resolvedTimeZone.value) : undefined));
const resolvedMax = computed(() => props.max ?? (props.maxDate ? dateToDateValue(props.maxDate, resolvedTimeZone.value) : undefined));
const resolvedIsDateUnavailable = computed(() => {
  if (props.isDateUnavailable) return props.isDateUnavailable;
  if (!props.isDateDisabled) return undefined;

  return (date: DateValue, locale: string) => props.isDateDisabled?.(dateValueToDate(date, resolvedTimeZone.value), locale) ?? false;
});

const getInitialValue = () => {
  if (hasModelValueProp) return props.modelValue ?? [];
  if (hasSelectedProp) return selectedToDateValues(props.selected, resolvedMode.value, resolvedTimeZone.value);
  if (props.defaultValue) return props.defaultValue;
  return selectedToDateValues(props.defaultSelected, resolvedMode.value, resolvedTimeZone.value);
};

const selectedValues = shallowRef<DateValue[]>(getInitialValue());
const pendingRangeStart = shallowRef<DateValue | undefined>();
const preservePendingFromModelSync = shallowRef(false);
const preservePendingFromSelectedSync = shallowRef(false);

const resolveValueState = (value: DateValue[]): DatePickerRangeValueState => {
  if (resolvedMode.value !== "range") {
    return { value, pendingRangeStart: undefined };
  }

  return resolveDatePickerRangeValue(value, pendingRangeStart.value);
};

const withValueChangeDetails = (details: DatePickerValueChangeDetails, value: DateValue[]) => {
  return value === details.value
    ? details
    : {
        ...details,
        value,
        valueAsString: value.map((date) => date.toString()),
      };
};

watch(
  () => props.modelValue,
  (value) => {
    if (hasModelValueProp) {
      selectedValues.value = value ?? [];
      if (preservePendingFromModelSync.value) {
        preservePendingFromModelSync.value = false;
      } else {
        pendingRangeStart.value = undefined;
      }
    }
  },
);

watch(
  () => props.selected,
  (value) => {
    if (!hasModelValueProp && hasSelectedProp) {
      selectedValues.value = selectedToDateValues(value, resolvedMode.value, resolvedTimeZone.value);
      if (preservePendingFromSelectedSync.value) {
        preservePendingFromSelectedSync.value = false;
      } else {
        pendingRangeStart.value = undefined;
      }
    }
  },
);

const isAllowedValue = (value: DateValue[]) =>
  (resolvedMode.value !== "multiple" || props.maxSelectedDates === undefined || value.length <= props.maxSelectedDates) &&
  (resolvedMode.value !== "range" || isRangeWithinDayLimits(value, props.rangeMinDays, props.rangeMaxDays));

const preservePendingForOwnControlledSync = () => {
  preservePendingFromModelSync.value = hasModelValueProp;
  preservePendingFromSelectedSync.value = hasSelectedProp;

  void nextTick(() => {
    preservePendingFromModelSync.value = false;
    preservePendingFromSelectedSync.value = false;
  });
};

const handleValueChange = (details: DatePickerValueChangeDetails) => {
  const nextState = resolveValueState(details.value);
  if (!isAllowedValue(nextState.value)) return;

  pendingRangeStart.value = nextState.pendingRangeStart;
  selectedValues.value = nextState.value;
  const nextDetails = withValueChangeDetails(details, nextState.value);
  const selected = dateValuesToSelected(nextState.value, resolvedMode.value, resolvedTimeZone.value);

  preservePendingForOwnControlledSync();
  emit("update:modelValue", nextState.value);
  emit("update:selected", selected);
  emit("valueChange", nextDetails);
  emit("change", selected, nextDetails);
  props.onChange?.(selected, nextDetails);
};

const syncInternalOpen = (openValue: boolean) => {
  if (!hasOpenProp) internalOpen.value = openValue;
};

const getRootElement = () => {
  const root = rootRef.value;
  if (root instanceof HTMLElement) return root;
  return root?.$el instanceof HTMLElement ? root.$el : undefined;
};

const closeFromOutsidePointer = () => {
  if (!resolvedOpen.value || props.inline) return;

  syncInternalOpen(false);
  emit("update:open", false);
  emit("openChange", { open: false } as DatePickerOpenChangeDetails);
};

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (!resolvedOpen.value || props.inline) return;

  const target = event.target;
  if (target instanceof HTMLElement && target.matches('[data-scope="date-picker"][data-part="content"]')) {
    closeFromOutsidePointer();
    return;
  }

  const rootElement = getRootElement();
  const eventPath = event.composedPath();
  if (rootElement && eventPath.includes(rootElement)) return;

  closeFromOutsidePointer();
};

const handleOpenChange = (details: DatePickerOpenChangeDetails) => {
  syncInternalOpen(details.open);
  emit("openChange", details);
};

const handleUpdateOpen = (openValue: boolean) => {
  syncInternalOpen(openValue);
  emit("update:open", openValue);
};

onMounted(() => {
  document.addEventListener("pointerdown", handleDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
});
</script>

<template>
  <ArkDatePicker.Root
    ref="rootRef"
    v-bind="$attrs"
    class="phi-date-picker"
    :class="{
      'phi-date-picker--inline': inline,
      'phi-date-picker--invalid': isInvalid,
      'phi-date-picker--disabled': disabled,
    }"
    :aria-describedby="describedBy"
    :close-on-select="resolvedCloseOnSelect"
    :create-calendar="createCalendar"
    :default-focused-value="defaultFocusedValue"
    :default-open="hasOpenProp ? undefined : defaultOpen"
    :default-view="defaultView"
    :disabled="disabled"
    :fixed-weeks="fixedWeeks"
    :focused-value="focusedValue"
    :format="format"
    :id="rootId"
    :ids="ids"
    :inline="inline"
    :invalid="isInvalid"
    :is-date-unavailable="resolvedIsDateUnavailable"
    :locale="locale"
    :max="resolvedMax"
    :max-view="maxView"
    :min="resolvedMin"
    :min-view="minView"
    :model-value="selectedValues"
    :name="name"
    :num-of-months="resolvedNumOfMonths"
    :open="resolvedOpen"
    :open-on-click="openOnClick"
    :outside-day-selectable="outsideDaySelectable"
    :parse="parse"
    :placeholder="placeholder"
    :positioning="positioning"
    :read-only="readOnly"
    :required="required"
    :selection-mode="resolvedMode"
    :show-week-numbers="showWeekNumbers"
    :start-of-week="startOfWeek"
    :time-zone="resolvedTimeZone"
    :translations="translations"
    :view="view"
    :data-invalid="isInvalid ? '' : undefined"
    @exit-complete="() => emit('exitComplete')"
    @focus-change="(details) => emit('focusChange', details)"
    @open-change="handleOpenChange"
    @update:focused-value="(focusedValue) => emit('update:focusedValue', focusedValue)"
    @update:open="handleUpdateOpen"
    @update:view="(viewValue) => emit('update:view', viewValue)"
    @value-change="handleValueChange"
    @view-change="(details) => emit('viewChange', details)"
    @visible-range-change="(details) => emit('visibleRangeChange', details)"
  >
    <DatePickerLabel v-if="label">
      {{ label }}<span v-if="required" class="phi-date-picker-required" aria-hidden="true">*</span>
    </DatePickerLabel>

    <slot v-if="hasCustomContent" />
    <template v-else-if="inline">
      <DatePickerCalendar />
    </template>
    <template v-else>
      <DatePickerControl>
        <DatePickerInput :placeholder="placeholder" />
        <DatePickerClearTrigger v-if="clearable" aria-label="Clear date">
          <span class="phi-date-picker-clear-icon" aria-hidden="true" />
        </DatePickerClearTrigger>
        <DatePickerTrigger aria-label="Open calendar">
          <span class="phi-date-picker-calendar-icon" aria-hidden="true" />
        </DatePickerTrigger>
      </DatePickerControl>
      <DatePickerPositioner>
        <DatePickerContent>
          <DatePickerCalendar />
        </DatePickerContent>
      </DatePickerPositioner>
    </template>

    <p v-if="description" :id="descriptionId" class="phi-date-picker-description">{{ description }}</p>
    <p v-if="error" :id="errorId" class="phi-date-picker-error">{{ error }}</p>
  </ArkDatePicker.Root>
</template>

<style src="./date-picker.css"></style>
