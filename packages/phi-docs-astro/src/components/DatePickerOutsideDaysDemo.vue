<script setup lang="ts">
import { ref } from "vue";
import { DatePicker, dateToDateValue, type DatePickerDateRange } from "@dicehub/phi/components/date-picker";
import { PrimitiveLocaleProvider } from "@dicehub/phi/primitives";

const months = ref(2);
const showOutsideDays = ref<boolean | undefined>();
const calendarOverride = ref<boolean | undefined>();
const explicitContent = ref(false);
const selectOutside = ref(false);
const showWeekNumbers = ref(false);
const showSelects = ref(false);
const rtl = ref(false);
const selected = ref<DatePickerDateRange>({ from: new Date(2026, 8, 29), to: new Date(2026, 9, 3) });
const focused = dateToDateValue(new Date(2026, 8, 1));
const status = () => [selected.value.from, selected.value.to].map(value => value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : 'none').join(' to ');
</script>

<template>
  <div class="date-picker-outside-demo">
    <PrimitiveLocaleProvider :locale="rtl ? 'ar-EG' : 'en-US'">
    <DatePicker id="docs-date-picker-outside" v-model:selected="selected" mode="range" inline
      :default-focused-value="focused" :number-of-months="months" :show-outside-days="showOutsideDays"
      :show-week-numbers="showWeekNumbers"
      :outside-day-selectable="selectOutside"
      :is-date-disabled="date => date.getMonth() === 9 && date.getDate() === 10">
      <div v-if="showSelects" class="phi-date-picker-selects">
        <DatePicker.MonthSelect aria-label="Calendar month" />
        <DatePicker.YearSelect aria-label="Calendar year" />
      </div>
      <DatePicker.Content v-if="explicitContent">
        <DatePicker.Calendar :show-outside-days="calendarOverride" />
        <DatePicker id="docs-date-picker-nested" inline :default-focused-value="focused" outside-day-selectable />
      </DatePicker.Content>
      <DatePicker.Calendar v-else :show-outside-days="calendarOverride" />
    </DatePicker>
    </PrimitiveLocaleProvider>
    <output aria-label="Selected dates">{{ status() }}</output>
    <div class="date-picker-outside-demo__actions">
      <button type="button" @click="months = 1">One month</button>
      <button type="button" @click="months = 2">Two months</button>
      <button type="button" @click="months = 3">Three months</button>
    </div>
    <div class="date-picker-outside-demo__actions">
      <button type="button" @click="showOutsideDays = undefined">Default outside days</button>
      <button type="button" @click="showOutsideDays = true">Show outside days</button>
      <button type="button" @click="showOutsideDays = false">Hide outside days</button>
    </div>
    <div class="date-picker-outside-demo__actions">
      <button type="button" @click="calendarOverride = true">Calendar shows outside days</button>
      <button type="button" @click="calendarOverride = undefined">Calendar inherits root</button>
      <button type="button" @click="explicitContent = !explicitContent">Toggle explicit content</button>
      <button type="button" @click="selectOutside = true">Enable outside date selection</button>
    </div>
    <div class="date-picker-outside-demo__actions">
      <button type="button" @click="showWeekNumbers = !showWeekNumbers">Toggle week numbers</button>
      <button type="button" @click="showSelects = !showSelects">Toggle month and year controls</button>
      <button type="button" @click="rtl = !rtl">Toggle right-to-left</button>
      <button type="button" @click="selected = { from: new Date(2026, 8, 29), to: new Date(2026, 8, 29) }">Select one-day range</button>
    </div>
  </div>
</template>

<style scoped>
.date-picker-outside-demo { display: grid; max-width: 100%; justify-items: center; gap: 0.75rem; }
.date-picker-outside-demo__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.date-picker-outside-demo output { color: var(--phi-subtle); font-size: 0.75rem; }
.date-picker-outside-demo button { padding: 0.375rem 0.625rem; border: 1px solid var(--phi-line); border-radius: 0.375rem; background: var(--phi-base); color: var(--phi-default); font: inherit; cursor: pointer; }
</style>
