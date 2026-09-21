import type { CheckboxCheckedState } from "../checkbox";

export const TABLE_VARIANTS = {
  layout: {
    auto: {
      description: "Auto table layout - columns resize based on content",
    },
    fixed: {
      description: "Fixed table layout - columns have equal width, controlled via colgroup",
    },
  },
  variant: {
    default: {
      description: "Default row variant with an alternating elevated surface",
    },
    selected: {
      description: "Selected row variant with a semantic tint background",
    },
  },
  sticky: {
    left: {
      description: "Pin column to the left edge of the scroll container",
    },
    right: {
      description: "Pin column to the right edge of the scroll container",
    },
  },
} as const;

export const TABLE_DEFAULT_VARIANTS = {
  layout: "auto",
  variant: "default",
} as const;

export type TableLayout = keyof typeof TABLE_VARIANTS.layout;
export type TableRowVariant = keyof typeof TABLE_VARIANTS.variant;
export type TableStickyColumn = keyof typeof TABLE_VARIANTS.sticky;

export type TableCheckboxChangeDetails = {
  checked: boolean;
  eventDetails?: {
    checked: CheckboxCheckedState;
  };
};

export const isTableLayout = (value: unknown): value is TableLayout =>
  typeof value === "string" && value in TABLE_VARIANTS.layout;

export const isTableRowVariant = (value: unknown): value is TableRowVariant =>
  typeof value === "string" && value in TABLE_VARIANTS.variant;

export const isTableStickyColumn = (value: unknown): value is TableStickyColumn =>
  typeof value === "string" && value in TABLE_VARIANTS.sticky;
