<script setup lang="ts">
import { computed } from "vue";
import { DatePicker as ArkDatePicker, type DateValue, type UseDatePickerReturn } from "@ark-ui/vue/date-picker";
import { shouldShowDatePickerDay } from "./date-picker";
import { useDatePickerContent, useDatePickerOutsideDays } from "./date-picker-context";
import {
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
} from "./DatePickerParts";

const props = withDefaults(defineProps<{ showOutsideDays?: boolean }>(), { showOutsideDays: undefined });
const rootOutsideDays = useDatePickerOutsideDays();
const hasContent = useDatePickerContent();
const outsideDays = computed(() => props.showOutsideDays ?? rootOutsideDays?.value);
const showDay = (day: DateValue, month: DateValue, count: number) => shouldShowDatePickerDay(day, month, count, outsideDays.value);
const syncClickedDay = (event: MouseEvent, datePicker: UseDatePickerReturn["value"], day: DateValue) => {
  // Ark processes selection first; focus can then change the visible month.
  if (event.defaultPrevented || (event.currentTarget as HTMLElement).getAttribute("aria-disabled") === "true") return;
  datePicker.setFocusedValue(day);
};
const monthOffset = (monthIndex: number) => ({ months: monthIndex });
const formatMonthTitle = (datePicker: { format: (value: DateValue, opts?: Intl.DateTimeFormatOptions) => string }, value: DateValue) =>
  datePicker.format(value, { month: "long", year: "numeric" });
const weekdayLabels: Record<string, string> = {
  Friday: "Fr",
  Monday: "Mo",
  Saturday: "Sa",
  Sunday: "Su",
  Thursday: "Th",
  Tuesday: "Tu",
  Wednesday: "We",
};
const formatWeekdayLabel = (day: { long: string; short: string }) => weekdayLabels[day.long] ?? day.short.slice(0, 2);
</script>

<template>
  <ArkDatePicker.Context v-slot="datePicker">
    <div v-bind="datePicker.inline && !hasContent ? datePicker.getContentProps() : {}" class="phi-date-picker-calendar">
      <DatePickerView view="day">
        <div class="phi-date-picker-nav">
          <DatePickerPrevTrigger aria-label="Previous month">
            <span class="phi-date-picker-chevron phi-date-picker-chevron--left" aria-hidden="true" />
          </DatePickerPrevTrigger>
          <DatePickerNextTrigger aria-label="Next month">
            <span class="phi-date-picker-chevron phi-date-picker-chevron--right" aria-hidden="true" />
          </DatePickerNextTrigger>
        </div>

        <div class="phi-date-picker-months" :data-month-count="datePicker.numOfMonths">
          <section
            v-for="monthIndex in datePicker.numOfMonths"
            :key="monthIndex"
            class="phi-date-picker-month"
          >
            <div class="phi-date-picker-month-title" role="status" aria-live="polite">
              {{ formatMonthTitle(datePicker, datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange.start) }}
            </div>
            <DatePickerTable view="day">
              <DatePickerTableHead>
                <DatePickerTableRow>
                  <DatePickerTableHeader v-if="datePicker.showWeekNumbers" class="phi-date-picker-week-number-header">
                    wk
                  </DatePickerTableHeader>
                  <DatePickerTableHeader
                    v-for="day in datePicker.weekDays"
                    :key="day.short"
                    :aria-label="day.long"
                  >
                    {{ formatWeekdayLabel(day) }}
                  </DatePickerTableHeader>
                </DatePickerTableRow>
              </DatePickerTableHead>
              <DatePickerTableBody>
                <DatePickerTableRow
                  v-for="(week, weekIndex) in datePicker.getOffset(monthOffset(monthIndex - 1)).weeks"
                  :key="week.map((day) => day.toString()).join('-')"
                >
                  <ArkDatePicker.WeekNumberCell
                    v-if="datePicker.showWeekNumbers"
                    :week-index="weekIndex"
                    :week="week"
                    class="phi-date-picker-week-number-cell"
                  />
                  <DatePickerTableCell
                    v-for="day in week"
                    :key="day.toString()"
                    :value="day"
                    :visible-range="datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange"
                    :data-hidden="showDay(day, datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange.start, datePicker.numOfMonths) ? undefined : ''"
                    :aria-hidden="showDay(day, datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange.start, datePicker.numOfMonths) ? undefined : true"
                  >
                    <DatePickerTableCellTrigger
                      v-if="showDay(day, datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange.start, datePicker.numOfMonths)"
                      @click="syncClickedDay($event, datePicker, day)"
                    >
                      {{ day.day }}
                    </DatePickerTableCellTrigger>
                  </DatePickerTableCell>
                </DatePickerTableRow>
              </DatePickerTableBody>
            </DatePickerTable>
          </section>
        </div>
      </DatePickerView>
    </div>
  </ArkDatePicker.Context>
</template>

<style src="./date-picker.css"></style>
