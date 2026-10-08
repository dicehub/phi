<script setup lang="ts">
import { computed, ref } from "vue";
import DatePickerOutsideDaysDemo from "./DatePickerOutsideDaysDemo.vue";
import {
  DatePicker,
  dateToDateValue,
  type DatePickerDateRange,
} from "@dicehub/phi/components/date-picker";

type DemoVariant =
  | "hero"
  | "usage"
  | "single"
  | "multiple"
  | "range"
  | "outside-days"
  | "range-constraints"
  | "popup"
  | "popup-range"
  | "presets"
  | "disabled-dates"
  | "usage-limits"
  | "full-popup";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const variant = computed(() => props.variant);
const makeDate = (year: number, month: number, day: number) => new Date(year, month - 1, day);
const makeValue = (year: number, month: number, day: number) => dateToDateValue(makeDate(year, month, day));
const focusMay = makeValue(2026, 5, 1);
const focusJune = makeValue(2026, 6, 1);
const firstWeek = [makeValue(2026, 6, 1), makeValue(2026, 6, 7)];
const nextWeek = [makeValue(2026, 6, 15), makeValue(2026, 6, 19)];
const presetRanges = [
  { label: "Today", value: [makeValue(2026, 6, 4), makeValue(2026, 6, 4)] },
  { label: "Last 7 days", value: [makeValue(2026, 5, 29), makeValue(2026, 6, 4)] },
  { label: "Last 30 days", value: [makeValue(2026, 5, 6), makeValue(2026, 6, 4)] },
  { label: "This month", value: firstWeek },
];

const heroSelected = ref(makeDate(2026, 5, 20));
const usageSelected = ref<Date | undefined>();
const singleSelected = ref(makeDate(2026, 5, 20));
const multipleSelected = ref([makeDate(2026, 5, 12), makeDate(2026, 5, 14)]);
const rangeSelected = ref<DatePickerDateRange>({ from: makeDate(2026, 5, 12), to: makeDate(2026, 5, 16) });
const constrainedRange = ref<DatePickerDateRange>({ from: makeDate(2026, 5, 12), to: makeDate(2026, 5, 16) });
const popupSelected = ref<Date | undefined>();
const popupRangeSelected = ref<DatePickerDateRange | undefined>();
const presetSelected = ref<DatePickerDateRange | undefined>();
const disabledSelected = ref<Date[]>([]);
const limitSelected = ref<Date[]>([]);
const fullPopupSelected = ref<DatePickerDateRange>({ from: makeDate(2026, 6, 10), to: makeDate(2026, 6, 14) });
const usageLimitMax = 5;
const unavailableUsageDays = [5, 12, 18, 25];

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatDate = (date?: Date) => (date ? formatter.format(date) : "None");
const formatDates = (dates: Date[]) => (dates.length ? dates.map(formatDate).join(", ") : "None");
const formatRange = (range?: DatePickerDateRange) =>
  range?.from || range?.to ? `${formatDate(range.from)} - ${formatDate(range.to)}` : "None";
const formatRangeButton = (range?: DatePickerDateRange) => {
  if (!range?.from) return "Select dates";
  if (!range.to) return formatDate(range.from);
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};
const isUsageDateUnavailable = (date: Date) =>
  date.getMonth() === 5 && unavailableUsageDays.includes(date.getDate());
const formatUsageLimitStatus = (dates: Date[]) =>
  `${dates.length}/${usageLimitMax} days selected. Grayed dates are unavailable.`;
const rangeStatus = computed(() => formatRange(constrainedRange.value));
const popupLabel = computed(() => (popupSelected.value ? formatDate(popupSelected.value) : "Pick a date"));
const popupRangeLabel = computed(() => formatRangeButton(popupRangeSelected.value));
const presetLabel = computed(() => formatRangeButton(presetSelected.value));
const fullPopupLabel = computed(() => formatRangeButton(fullPopupSelected.value));
const disabledStatus = computed(() => formatUsageLimitStatus(disabledSelected.value));
const usageLimitStatus = computed(() => formatUsageLimitStatus(limitSelected.value));
const pickerId = computed(() => `date-picker-demo-${variant.value}`);
const popoverPositioning = { placement: "bottom", gutter: 8 } as const;
</script>

<template>
  <div class="date-picker-demo" :class="`date-picker-demo--${variant}`">
    <DatePickerOutsideDaysDemo v-if="variant === 'outside-days'" />
    <template v-else-if="variant === 'hero'">
      <DatePicker
        :id="pickerId"
        v-model:selected="heroSelected"
        :default-focused-value="focusMay"
        inline
      />
      <p class="date-picker-demo__status">Selected: {{ formatDate(heroSelected) }}</p>
    </template>

    <template v-else-if="variant === 'single'">
      <DatePicker
        :id="pickerId"
        v-model:selected="singleSelected"
        :default-focused-value="focusMay"
        inline
      />
      <p class="date-picker-demo__status">Selected: {{ formatDate(singleSelected) }}</p>
    </template>

    <template v-else-if="variant === 'usage'">
      <DatePicker
        :id="pickerId"
        v-model:selected="usageSelected"
        :default-focused-value="focusJune"
        placeholder="Pick a date"
      />
      <p class="date-picker-demo__status">Selected: {{ formatDate(usageSelected) }}</p>
    </template>

    <template v-else-if="variant === 'multiple'">
      <DatePicker
        :id="pickerId"
        v-model:selected="multipleSelected"
        :default-focused-value="focusMay"
        mode="multiple"
        inline
      />
      <p class="date-picker-demo__status">Selected: {{ formatDates(multipleSelected) }}</p>
    </template>

    <template v-else-if="variant === 'range'">
      <DatePicker
        :id="pickerId"
        v-model:selected="rangeSelected"
        :default-focused-value="focusMay"
        mode="range"
        :number-of-months="2"
        inline
      />
      <p class="date-picker-demo__status">Selected: {{ formatRange(rangeSelected) }}</p>
    </template>

    <template v-else-if="variant === 'range-constraints'">
      <DatePicker
        :id="pickerId"
        v-model:selected="constrainedRange"
        :default-focused-value="focusMay"
        mode="range"
        :range-min-days="2"
        :range-max-days="6"
        inline
      />
      <p class="date-picker-demo__status">Selected: {{ rangeStatus }}</p>
    </template>

    <template v-else-if="variant === 'popup'">
      <DatePicker
        :id="pickerId"
        class="date-picker-demo__popover-picker"
        v-model:selected="popupSelected"
        :default-focused-value="focusJune"
        :positioning="popoverPositioning"
      >
        <DatePicker.Control class="date-picker-demo__popover-control">
          <DatePicker.Trigger class="date-picker-demo__popover-trigger">
            <span class="phi-date-picker-calendar-icon" aria-hidden="true" />
            {{ popupLabel }}
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.Calendar />
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker>
      <p class="date-picker-demo__status">Selected: {{ formatDate(popupSelected) }}</p>
    </template>

    <template v-else-if="variant === 'popup-range'">
      <DatePicker
        :id="pickerId"
        class="date-picker-demo__popover-picker"
        v-model:selected="popupRangeSelected"
        :default-focused-value="focusJune"
        mode="range"
        :number-of-months="2"
        :positioning="popoverPositioning"
      >
        <DatePicker.Control class="date-picker-demo__popover-control">
          <DatePicker.Trigger class="date-picker-demo__popover-trigger">
            <span class="phi-date-picker-calendar-icon" aria-hidden="true" />
            {{ popupRangeLabel }}
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.Calendar />
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker>
      <p class="date-picker-demo__status">Selected: {{ formatRange(popupRangeSelected) }}</p>
    </template>

    <template v-else-if="variant === 'presets'">
      <DatePicker
        :id="pickerId"
        class="date-picker-demo__popover-picker"
        v-model:selected="presetSelected"
        :default-focused-value="focusJune"
        mode="range"
        :number-of-months="2"
        :positioning="popoverPositioning"
      >
        <DatePicker.Control class="date-picker-demo__popover-control">
          <DatePicker.Trigger class="date-picker-demo__popover-trigger">
            <span class="phi-date-picker-calendar-icon" aria-hidden="true" />
            {{ presetLabel }}
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content class="date-picker-demo__preset-popover">
            <div class="date-picker-demo__preset-list">
              <DatePicker.PresetTrigger
                v-for="preset in presetRanges"
                :key="preset.label"
                :value="preset.value"
              >
                {{ preset.label }}
              </DatePicker.PresetTrigger>
            </div>
            <div class="date-picker-demo__calendar-pane">
              <DatePicker.Calendar />
            </div>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker>
      <p class="date-picker-demo__status">Selected: {{ formatRange(presetSelected) }}</p>
    </template>

    <template v-else-if="variant === 'disabled-dates'">
      <DatePicker
        :id="pickerId"
        v-model:selected="disabledSelected"
        :default-focused-value="focusJune"
        mode="multiple"
        :max-selected-dates="usageLimitMax"
        :is-date-disabled="isUsageDateUnavailable"
        fixed-weeks
        inline
      />
      <p class="date-picker-demo__status">{{ disabledStatus }}</p>
    </template>

    <template v-else-if="variant === 'usage-limits'">
      <DatePicker
        :id="pickerId"
        v-model:selected="limitSelected"
        :default-focused-value="focusJune"
        mode="multiple"
        :max-selected-dates="usageLimitMax"
        :is-date-disabled="isUsageDateUnavailable"
        fixed-weeks
        inline
      />
      <p class="date-picker-demo__status">{{ usageLimitStatus }}</p>
    </template>

    <template v-else>
      <DatePicker
        :id="pickerId"
        class="date-picker-demo__popover-picker"
        v-model:selected="fullPopupSelected"
        :default-focused-value="focusJune"
        mode="range"
        :number-of-months="2"
        :positioning="popoverPositioning"
      >
        <DatePicker.Control class="date-picker-demo__popover-control">
          <DatePicker.Trigger class="date-picker-demo__popover-trigger">
            <span class="phi-date-picker-calendar-icon" aria-hidden="true" />
            {{ fullPopupLabel }}
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content class="date-picker-demo__preset-popover">
            <div class="date-picker-demo__preset-list">
              <DatePicker.PresetTrigger :value="nextWeek">Next week</DatePicker.PresetTrigger>
            </div>
            <div class="date-picker-demo__calendar-pane">
              <DatePicker.Calendar />
            </div>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker>
      <p class="date-picker-demo__status">Selected: {{ formatRange(fullPopupSelected) }}</p>
    </template>
  </div>
</template>

<style scoped>
.date-picker-demo {
  display: grid;
  width: min(100%, 42rem);
  justify-items: center;
  gap: 0.75rem;
}

.date-picker-demo :deep(.phi-date-picker) {
  max-width: 38rem;
}

.date-picker-demo :deep(.phi-date-picker.date-picker-demo__popover-picker) {
  width: max-content;
}

.date-picker-demo :deep(.phi-date-picker-control) {
  width: min(100%, 22rem);
}

.date-picker-demo :deep(.phi-date-picker-control.date-picker-demo__popover-control) {
  width: max-content;
  min-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.date-picker-demo :deep(.phi-date-picker-control.date-picker-demo__popover-control:focus-within) {
  border-color: transparent;
  box-shadow: none;
}

.date-picker-demo__status {
  margin: 0;
  color: var(--docs-subtle, #6c7480);
  font-size: 0.8125rem;
  line-height: 1.4;
  text-align: center;
}

.date-picker-demo__popover-trigger {
  width: max-content;
  height: 2.25rem;
  flex: 0 0 auto;
  min-height: 2.25rem;
  gap: 0.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--phi-line, #e3e6eb);
  box-shadow: none;
  color: var(--phi-default, #17191f);
}

.date-picker-demo__preset-popover {
  display: flex;
  gap: 0;
  padding: 0 !important;
}

.date-picker-demo__preset-list {
  display: flex;
  min-width: 8.5rem;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-right: 1px solid var(--phi-line, #e3e6eb);
}

.date-picker-demo__preset-list :deep(.phi-date-picker-preset-trigger) {
  justify-content: flex-start;
  border: 0;
  background: transparent;
}

.date-picker-demo__calendar-pane {
  padding: 0.75rem;
}
</style>
