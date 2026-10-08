import assert from "node:assert/strict";
import { test } from "node:test";
import { CalendarDate } from "@internationalized/date";
import {
  dateToDateValue,
  dateValuesToSelected,
  getRangeDayLength,
  isRangeWithinDayLimits,
  resolveDatePickerRangeValue,
  selectedToDateValues,
  shouldShowDatePickerDay,
} from "./date-picker.ts";

const valueKey = (value) => `${value.year}-${value.month}-${value.day}`;
const selectedKey = (value) => `${value.getUTCFullYear()}-${value.getUTCMonth() + 1}-${value.getUTCDate()}`;

test("outside-day defaults and overrides preserve one-month behavior across a year boundary", () => {
  const december = new CalendarDate(2026, 12, 1);
  const inside = new CalendarDate(2026, 12, 31);
  const outside = new CalendarDate(2027, 1, 1);
  assert.equal(shouldShowDatePickerDay(outside, december, 1), true);
  assert.equal(shouldShowDatePickerDay(outside, december, 2), false);
  assert.equal(shouldShowDatePickerDay(outside, december, 3, true), true);
  assert.equal(shouldShowDatePickerDay(outside, december, 1, false), false);
  assert.equal(shouldShowDatePickerDay(inside, december, 3, false), true);
});

test("converts Date aliases to DateValue arrays by mode", () => {
  const single = new Date(Date.UTC(2026, 4, 20));
  const multiple = [new Date(Date.UTC(2026, 4, 12)), new Date(Date.UTC(2026, 4, 14))];
  const range = {
    from: new Date(Date.UTC(2026, 4, 1)),
    to: new Date(Date.UTC(2026, 4, 4)),
  };

  assert.deepEqual(selectedToDateValues(single, "single", "UTC").map(valueKey), ["2026-5-20"]);
  assert.deepEqual(selectedToDateValues(multiple, "multiple", "UTC").map(valueKey), ["2026-5-12", "2026-5-14"]);
  assert.deepEqual(selectedToDateValues(range, "range", "UTC").map(valueKey), ["2026-5-1", "2026-5-4"]);
  assert.deepEqual(selectedToDateValues(single, "multiple", "UTC").map(valueKey), ["2026-5-20"]);
  assert.deepEqual(selectedToDateValues(single, "range", "UTC"), []);
});

test("converts DateValue arrays back to Date aliases by mode", () => {
  const may1 = new CalendarDate(2026, 5, 1);
  const may4 = new CalendarDate(2026, 5, 4);

  assert.equal(selectedKey(dateValuesToSelected([may1], "single", "UTC")), "2026-5-1");
  assert.deepEqual(dateValuesToSelected([may1, may4], "multiple", "UTC").map(selectedKey), ["2026-5-1", "2026-5-4"]);

  const range = dateValuesToSelected([may1, may4], "range", "UTC");
  assert.equal(selectedKey(range.from), "2026-5-1");
  assert.equal(selectedKey(range.to), "2026-5-4");
});

test("resolves two-click range selection without mutating pending state", () => {
  const may1 = new CalendarDate(2026, 5, 1);
  const may4 = new CalendarDate(2026, 5, 4);
  const may10 = new CalendarDate(2026, 5, 10);

  const firstClick = resolveDatePickerRangeValue([may1]);
  assert.deepEqual(firstClick.value.map(valueKey), ["2026-5-1"]);
  assert.equal(firstClick.pendingRangeStart, may1);

  const forwardRange = resolveDatePickerRangeValue([may4], firstClick.pendingRangeStart);
  assert.deepEqual(forwardRange.value.map(valueKey), ["2026-5-1", "2026-5-4"]);
  assert.equal(forwardRange.pendingRangeStart, undefined);

  const reverseRange = resolveDatePickerRangeValue([may1], may4);
  assert.deepEqual(reverseRange.value.map(valueKey), ["2026-5-1", "2026-5-4"]);
  assert.equal(reverseRange.pendingRangeStart, undefined);

  const sameDate = resolveDatePickerRangeValue([may1], may1);
  assert.deepEqual(sameDate.value.map(valueKey), ["2026-5-1"]);
  assert.equal(sameDate.pendingRangeStart, may1);

  const rejectedCandidate = resolveDatePickerRangeValue([may10], may1);
  assert.deepEqual(rejectedCandidate.value.map(valueKey), ["2026-5-1", "2026-5-10"]);
  assert.equal(rejectedCandidate.pendingRangeStart, undefined);

  const cleared = resolveDatePickerRangeValue([], may1);
  assert.deepEqual(cleared.value, []);
  assert.equal(cleared.pendingRangeStart, undefined);
});

test("checks range day limits", () => {
  const may1 = dateToDateValue(new Date(Date.UTC(2026, 4, 1)), "UTC");
  const may4 = dateToDateValue(new Date(Date.UTC(2026, 4, 4)), "UTC");
  const may10 = dateToDateValue(new Date(Date.UTC(2026, 4, 10)), "UTC");

  assert.equal(getRangeDayLength([may1, may4]), 3);
  assert.equal(isRangeWithinDayLimits([may1, may4], 2, 6), true);
  assert.equal(isRangeWithinDayLimits([may1, may4], 4, 6), false);
  assert.equal(isRangeWithinDayLimits([may1, may10], 2, 6), false);
  assert.equal(isRangeWithinDayLimits([may1], 2, 6), true);
});
