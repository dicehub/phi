export const barrelCode = `import { DatePicker } from "@dicehub/phi";`;

export const granularCode = `import { DatePicker } from "@dicehub/phi/components/date-picker";`;

export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref(new Date(2026, 4, 20));
</script>

<template>
  <DatePicker v-model:selected="selected" inline />
</template>`;

export const usageCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref(new Date(2026, 5, 4));
</script>

<template>
  <DatePicker v-model:selected="selected" placeholder="Pick a date" />
</template>`;

export const singleCode = previewCode;

export const multipleCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref([
  new Date(2026, 4, 12),
  new Date(2026, 4, 14),
]);
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="multiple"
    inline
  />
</template>`;

export const rangeCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker, type DatePickerDateRange } from "@dicehub/phi/components/date-picker";

const selected = ref<DatePickerDateRange>({
  from: new Date(2026, 4, 12),
  to: new Date(2026, 4, 16),
});
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="range"
    :number-of-months="2"
    inline
  />
</template>`;

export const rangeConstraintsCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker, type DatePickerDateRange } from "@dicehub/phi/components/date-picker";

const selected = ref<DatePickerDateRange>({
  from: new Date(2026, 4, 12),
  to: new Date(2026, 4, 16),
});
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="range"
    :range-min-days="2"
    :range-max-days="6"
    inline
  />
</template>`;

export const popupCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref<Date>();
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    :positioning="{ placement: 'bottom', gutter: 8 }"
  >
    <DatePicker.Control>
      <DatePicker.Trigger>Pick a date</DatePicker.Trigger>
    </DatePicker.Control>
    <DatePicker.Positioner>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker>
</template>`;

export const popupRangeCode = `<script setup lang="ts">
import { ref } from "vue";
import { DatePicker, type DatePickerDateRange } from "@dicehub/phi/components/date-picker";

const selected = ref<DatePickerDateRange>();
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="range"
    :number-of-months="2"
    :positioning="{ placement: 'bottom', gutter: 8 }"
  >
    <DatePicker.Control>
      <DatePicker.Trigger>Select dates</DatePicker.Trigger>
    </DatePicker.Control>
    <DatePicker.Positioner>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker>
</template>`;

export const presetsCode = `<script setup lang="ts">
import { ref } from "vue";
import {
  DatePicker,
  dateToDateValue,
  type DatePickerDateRange,
} from "@dicehub/phi/components/date-picker";

const selected = ref<DatePickerDateRange>();
const firstWeek = [
  dateToDateValue(new Date(2026, 5, 1)),
  dateToDateValue(new Date(2026, 5, 7)),
];
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="range"
    :number-of-months="2"
    :positioning="{ placement: 'bottom', gutter: 8 }"
  >
    <DatePicker.Control>
      <DatePicker.Trigger>Select dates</DatePicker.Trigger>
    </DatePicker.Control>
    <DatePicker.Positioner>
      <DatePicker.Content class="date-picker-demo__preset-popover">
        <div class="date-picker-demo__preset-list">
          <DatePicker.PresetTrigger :value="firstWeek">
            This month
          </DatePicker.PresetTrigger>
        </div>
        <div class="date-picker-demo__calendar-pane">
          <DatePicker.Calendar />
        </div>
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker>
</template>`;

export const disabledDatesCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref<Date[]>([]);
const maxDays = 5;
const unavailableDays = [5, 12, 18, 25];
const isDateUnavailable = (date: Date) =>
  date.getMonth() === 5 && unavailableDays.includes(date.getDate());
const footer = computed(
  () => \`\${selected.value.length}/\${maxDays} days selected. Grayed dates are unavailable.\`,
);
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="multiple"
    :max-selected-dates="maxDays"
    :is-date-disabled="isDateUnavailable"
    fixed-weeks
    inline
  />
  <p>{{ footer }}</p>
</template>`;

export const usageLimitsCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { DatePicker } from "@dicehub/phi/components/date-picker";

const selected = ref<Date[]>([]);
const maxDays = 5;
const unavailableDays = [5, 12, 18, 25];
const isDateUnavailable = (date: Date) =>
  date.getMonth() === 5 && unavailableDays.includes(date.getDate());
const footer = computed(
  () => \`\${selected.value.length}/\${maxDays} days selected. Grayed dates are unavailable.\`,
);
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="multiple"
    :max-selected-dates="maxDays"
    :is-date-disabled="isDateUnavailable"
    fixed-weeks
    inline
  />
  <p>{{ footer }}</p>
</template>`;

export const fullPopupCode = `<script setup lang="ts">
import { ref } from "vue";
import {
  DatePicker,
  dateToDateValue,
  type DatePickerDateRange,
} from "@dicehub/phi/components/date-picker";

const selected = ref<DatePickerDateRange>({
  from: new Date(2026, 5, 10),
  to: new Date(2026, 5, 14),
});

const nextWeek = [
  dateToDateValue(new Date(2026, 5, 15)),
  dateToDateValue(new Date(2026, 5, 19)),
];
</script>

<template>
  <DatePicker
    v-model:selected="selected"
    mode="range"
    :number-of-months="2"
    :positioning="{ placement: 'bottom', gutter: 8 }"
  >
    <DatePicker.Control>
      <DatePicker.Trigger>Select dates</DatePicker.Trigger>
    </DatePicker.Control>
    <DatePicker.Positioner>
      <DatePicker.Content class="date-picker-demo__preset-popover">
        <div class="date-picker-demo__preset-list">
          <DatePicker.PresetTrigger :value="nextWeek">
            Next week
          </DatePicker.PresetTrigger>
        </div>
        <div class="date-picker-demo__calendar-pane">
          <DatePicker.Calendar />
        </div>
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker>
</template>`;

export const subComponents = [
  { component: "DatePicker.Root", description: "Root wrapper around Ark UI DatePicker.Root with Phi styling and Date aliases." },
  { component: "DatePicker.Control", description: "Input control wrapper for popup date pickers." },
  { component: "DatePicker.Input", description: "Date input. Use index 0 and 1 for range start and end inputs." },
  { component: "DatePicker.Trigger", description: "Button that opens the calendar popup." },
  { component: "DatePicker.Content", description: "Positioned popup content surface." },
  { component: "DatePicker.Calendar", description: "Day-calendar renderer with month navigation." },
  { component: "DatePicker.PresetTrigger", description: "Applies a preset date or date range." },
  { component: "DatePicker.ValueText", description: "Displays selected date text from Ark state." },
  { component: "DatePicker.RangeText", description: "Displays the current visible calendar range." },
];

export const apiGroups = [
  {
    id: "date-picker-root-api",
    title: "DatePicker.Root",
    props: [
      { name: "modelValue", type: "DateValue[]", defaultValue: "-", description: "Ark-native controlled value. Use v-model for DateValue arrays." },
      { name: "selected", type: "Date | Date[] | { from?: Date; to?: Date }", defaultValue: "-", description: "Date-based controlled value alias. Use v-model:selected." },
      { name: "selectionMode / mode", type: '"single" | "multiple" | "range"', defaultValue: '"single"', description: "Selection behavior. `mode` is an alias for `selectionMode`." },
      { name: "numOfMonths / numberOfMonths", type: "number", defaultValue: "1", description: "Number of calendar months to display." },
      { name: "min / max", type: "DateValue", defaultValue: "-", description: "Ark-native date boundaries." },
      { name: "minDate / maxDate", type: "Date", defaultValue: "-", description: "Date-object aliases for date boundaries." },
      { name: "rangeMinDays / rangeMaxDays", type: "number", defaultValue: "-", description: "Rejects completed ranges outside day-length limits." },
      { name: "isDateUnavailable", type: "(date: DateValue, locale: string) => boolean", defaultValue: "-", description: "Ark-native unavailable date predicate." },
      { name: "isDateDisabled", type: "(date: Date, locale: string) => boolean", defaultValue: "-", description: "Date-object alias for unavailable dates." },
      { name: "inline", type: "boolean", defaultValue: "false", description: "Renders the calendar inline instead of in a popup." },
      { name: "startOfWeek", type: "number", defaultValue: "1", description: "First day of the week. Defaults to Monday." },
      { name: "placeholder", type: "string", defaultValue: "-", description: "Placeholder shown by the default input." },
    ],
  },
  {
    id: "date-picker-calendar-api",
    title: "DatePicker.Calendar",
    props: [
      { name: "-", type: "-", defaultValue: "-", description: "No custom props. Calendar reads DatePicker root state." },
    ],
  },
  {
    id: "date-picker-content-api",
    title: "DatePicker.Content",
    props: [
      { name: "class", type: "string", defaultValue: "-", description: "Use class or style to customize popup width and layout." },
    ],
  },
];
