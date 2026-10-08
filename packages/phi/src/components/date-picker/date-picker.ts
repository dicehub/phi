import {
  fromDate,
  getLocalTimeZone,
  isSameMonth,
  toCalendarDate,
  type DateValue,
} from "@internationalized/date";
import type {
  DatePickerDateView,
  DatePickerRootProps,
  DatePickerValueChangeDetails,
} from "@ark-ui/vue/date-picker";
import type { PositioningOptions } from "@zag-js/popper";

export type DatePickerMode = "single" | "multiple" | "range";

export type DatePickerDateRange = {
  from?: Date;
  to?: Date;
};

export type DatePickerSelected = Date | Date[] | DatePickerDateRange | undefined;

export type DatePickerProps = {
  clearable?: boolean;
  closeOnSelect?: boolean;
  createCalendar?: DatePickerRootProps["createCalendar"];
  defaultFocusedValue?: DateValue;
  defaultOpen?: boolean;
  defaultSelected?: DatePickerSelected;
  defaultValue?: DateValue[];
  defaultView?: DatePickerDateView;
  description?: string;
  disabled?: boolean;
  error?: string;
  fixedWeeks?: boolean;
  focusedValue?: DateValue;
  format?: DatePickerRootProps["format"];
  id?: string;
  ids?: DatePickerRootProps["ids"];
  inline?: boolean;
  invalid?: boolean;
  isDateDisabled?: (date: Date, locale: string) => boolean;
  isDateUnavailable?: DatePickerRootProps["isDateUnavailable"];
  label?: string;
  locale?: string;
  max?: DateValue;
  maxDate?: Date;
  maxSelectedDates?: number;
  maxView?: DatePickerDateView;
  min?: DateValue;
  minDate?: Date;
  minView?: DatePickerDateView;
  mode?: DatePickerMode;
  modelValue?: DateValue[];
  name?: string;
  numOfMonths?: number;
  numberOfMonths?: number;
  onChange?: (selected: DatePickerSelected, details: DatePickerValueChangeDetails) => void;
  open?: boolean;
  openOnClick?: boolean;
  outsideDaySelectable?: boolean;
  parse?: DatePickerRootProps["parse"];
  placeholder?: string;
  positioning?: PositioningOptions;
  rangeMaxDays?: number;
  rangeMinDays?: number;
  readOnly?: boolean;
  required?: boolean;
  selected?: DatePickerSelected;
  selectionMode?: DatePickerMode;
  showOutsideDays?: boolean;
  showWeekNumbers?: boolean;
  startOfWeek?: number;
  timeZone?: string;
  translations?: DatePickerRootProps["translations"];
  view?: DatePickerDateView;
};

export const DATE_PICKER_MODES: DatePickerMode[] = ["single", "multiple", "range"];

export const isDatePickerMode = (value: unknown): value is DatePickerMode =>
  typeof value === "string" && DATE_PICKER_MODES.includes(value as DatePickerMode);

export const shouldShowDatePickerDay = (day: DateValue, month: DateValue, numberOfMonths: number, showOutsideDays?: boolean) =>
  (showOutsideDays ?? numberOfMonths === 1) || isSameMonth(day, month);

export const resolveDatePickerTimeZone = (timeZone?: string) => timeZone ?? getLocalTimeZone();

export const dateToDateValue = (date: Date, timeZone = resolveDatePickerTimeZone()) =>
  toCalendarDate(fromDate(date, timeZone));

export const dateValueToDate = (date: DateValue, timeZone = resolveDatePickerTimeZone()) =>
  toCalendarDate(date).toDate(timeZone);

const isDateRange = (value: unknown): value is DatePickerDateRange =>
  typeof value === "object" && value !== null && ("from" in value || "to" in value);

export const selectedToDateValues = (
  selected: DatePickerSelected,
  mode: DatePickerMode,
  timeZone = resolveDatePickerTimeZone(),
): DateValue[] => {
  if (!selected) return [];

  if (mode === "multiple") {
    return Array.isArray(selected)
      ? selected.filter((date): date is Date => date instanceof Date).map((date) => dateToDateValue(date, timeZone))
      : selected instanceof Date
        ? [dateToDateValue(selected, timeZone)]
        : [];
  }

  if (mode === "range") {
    if (!isDateRange(selected)) return [];
    return [selected.from, selected.to]
      .filter((date): date is Date => date instanceof Date)
      .map((date) => dateToDateValue(date, timeZone));
  }

  return selected instanceof Date ? [dateToDateValue(selected, timeZone)] : [];
};

export const dateValuesToSelected = (
  values: DateValue[],
  mode: DatePickerMode,
  timeZone = resolveDatePickerTimeZone(),
): DatePickerSelected => {
  if (mode === "multiple") {
    return values.map((value) => dateValueToDate(value, timeZone));
  }

  if (mode === "range") {
    if (values.length === 0) return undefined;
    return {
      from: values[0] ? dateValueToDate(values[0], timeZone) : undefined,
      to: values[1] ? dateValueToDate(values[1], timeZone) : undefined,
    };
  }

  return values[0] ? dateValueToDate(values[0], timeZone) : undefined;
};

const dayNumber = (value: DateValue) => Date.UTC(value.year, value.month - 1, value.day);
const compareDateValues = (left: DateValue, right: DateValue) => left.compare(right);
const isSameDateValue = (left: DateValue, right: DateValue) => compareDateValues(left, right) === 0;
const orderRangeValues = (start: DateValue, end: DateValue) =>
  compareDateValues(start, end) <= 0 ? [start, end] : [end, start];

export type DatePickerRangeValueState = {
  pendingRangeStart?: DateValue;
  value: DateValue[];
};

export const resolveDatePickerRangeValue = (
  value: DateValue[],
  pendingRangeStart?: DateValue,
): DatePickerRangeValueState => {
  if (value.length === 0) {
    return { value, pendingRangeStart: undefined };
  }

  if (value.length >= 2) {
    return { value, pendingRangeStart: undefined };
  }

  const nextValue = value[0];
  if (!nextValue) return { value, pendingRangeStart };

  if (pendingRangeStart && !isSameDateValue(pendingRangeStart, nextValue)) {
    return {
      value: orderRangeValues(pendingRangeStart, nextValue),
      pendingRangeStart: undefined,
    };
  }

  return { value, pendingRangeStart: nextValue };
};

export const getRangeDayLength = (values: DateValue[]) => {
  if (values.length < 2 || !values[0] || !values[1]) return undefined;

  return Math.abs(dayNumber(values[1]) - dayNumber(values[0])) / 86_400_000;
};

export const isRangeWithinDayLimits = (
  values: DateValue[],
  minDays?: number,
  maxDays?: number,
) => {
  const length = getRangeDayLength(values);
  if (length === undefined) return true;
  if (minDays !== undefined && length < minDays) return false;
  if (maxDays !== undefined && length > maxDays) return false;
  return true;
};

export type { DateValue };
