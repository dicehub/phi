import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import { defineComponent, h, type Component } from "vue";
import { provideDatePickerContent } from "./date-picker-context";

const ArkDatePickerParts = ArkDatePicker as unknown as Record<string, Component>;

const withClass = (name: string, component: Component, className: string, setupContext?: () => void) =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      setupContext?.();
      return () =>
        h(
          component,
          {
            ...attrs,
            class: [className, attrs.class],
          },
          slots,
        );
    },
  });

export const DatePickerLabel = withClass("DatePickerLabel", ArkDatePickerParts.Label, "phi-date-picker-label");
export const DatePickerControl = withClass("DatePickerControl", ArkDatePickerParts.Control, "phi-date-picker-control");
export const DatePickerInput = withClass("DatePickerInput", ArkDatePickerParts.Input, "phi-date-picker-input");
export const DatePickerTrigger = withClass("DatePickerTrigger", ArkDatePickerParts.Trigger, "phi-date-picker-trigger");
export const DatePickerClearTrigger = withClass(
  "DatePickerClearTrigger",
  ArkDatePickerParts.ClearTrigger,
  "phi-date-picker-clear-trigger",
);
export const DatePickerPositioner = withClass(
  "DatePickerPositioner",
  ArkDatePickerParts.Positioner,
  "phi-date-picker-positioner",
);
export const DatePickerContent = withClass("DatePickerContent", ArkDatePickerParts.Content, "phi-date-picker-content", provideDatePickerContent);
export const DatePickerView = withClass("DatePickerView", ArkDatePickerParts.View, "phi-date-picker-view");
export const DatePickerViewControl = withClass(
  "DatePickerViewControl",
  ArkDatePickerParts.ViewControl,
  "phi-date-picker-view-control",
);
export const DatePickerViewTrigger = withClass(
  "DatePickerViewTrigger",
  ArkDatePickerParts.ViewTrigger,
  "phi-date-picker-view-trigger",
);
export const DatePickerPrevTrigger = withClass(
  "DatePickerPrevTrigger",
  ArkDatePickerParts.PrevTrigger,
  "phi-date-picker-nav-trigger",
);
export const DatePickerNextTrigger = withClass(
  "DatePickerNextTrigger",
  ArkDatePickerParts.NextTrigger,
  "phi-date-picker-nav-trigger",
);
export const DatePickerTable = withClass("DatePickerTable", ArkDatePickerParts.Table, "phi-date-picker-table");
export const DatePickerTableHead = withClass(
  "DatePickerTableHead",
  ArkDatePickerParts.TableHead,
  "phi-date-picker-table-head",
);
export const DatePickerTableHeader = withClass(
  "DatePickerTableHeader",
  ArkDatePickerParts.TableHeader,
  "phi-date-picker-table-header",
);
export const DatePickerTableBody = withClass(
  "DatePickerTableBody",
  ArkDatePickerParts.TableBody,
  "phi-date-picker-table-body",
);
export const DatePickerTableRow = withClass("DatePickerTableRow", ArkDatePickerParts.TableRow, "phi-date-picker-table-row");
export const DatePickerTableCell = withClass(
  "DatePickerTableCell",
  ArkDatePickerParts.TableCell,
  "phi-date-picker-table-cell",
);
export const DatePickerTableCellTrigger = withClass(
  "DatePickerTableCellTrigger",
  ArkDatePickerParts.TableCellTrigger,
  "phi-date-picker-cell-trigger",
);
export const DatePickerValueText = withClass("DatePickerValueText", ArkDatePickerParts.ValueText, "phi-date-picker-value");
export const DatePickerRangeText = withClass(
  "DatePickerRangeText",
  ArkDatePickerParts.RangeText,
  "phi-date-picker-range-text",
);
export const DatePickerPresetTrigger = withClass(
  "DatePickerPresetTrigger",
  ArkDatePickerParts.PresetTrigger,
  "phi-date-picker-preset-trigger",
);
export const DatePickerMonthSelect = withClass(
  "DatePickerMonthSelect",
  ArkDatePickerParts.MonthSelect,
  "phi-date-picker-select",
);
export const DatePickerYearSelect = withClass(
  "DatePickerYearSelect",
  ArkDatePickerParts.YearSelect,
  "phi-date-picker-select",
);
export const DatePickerContext = ArkDatePickerParts.Context;
export const DatePickerRootProvider = ArkDatePickerParts.RootProvider;
