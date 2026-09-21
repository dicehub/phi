import type { VNodeChild } from "vue";

export const PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250] as const;

export const PAGINATION_CONTROL_VARIANTS = {
  full: "Full pagination controls with first, previous, page input, next, and last buttons",
  simple: "Simple pagination controls with only previous and next buttons",
} as const;

export type PaginationControlsVariant = keyof typeof PAGINATION_CONTROL_VARIANTS;
export type PaginationPageSelector = "input" | "dropdown";

export type PaginationLabels = {
  navigation?: string;
  firstPage?: string;
  previousPage?: string;
  nextPage?: string;
  lastPage?: string;
  pageNumber?: string;
  pageSize?: string;
};

export const PAGINATION_DEFAULT_LABELS = {
  navigation: "Pagination",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  pageNumber: "Page number",
  pageSize: "Page size",
} satisfies Required<PaginationLabels>;

export type PaginationInfoDetails = {
  page: number;
  perPage?: number;
  totalCount?: number;
  pageShowingRange: string;
};

export type PaginationTextRenderer = (details: PaginationInfoDetails) => VNodeChild;

export function clampPaginationPage(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getPaginationMaxPage(totalCount?: number, perPage?: number) {
  return Math.ceil((totalCount ?? 1) / (perPage ?? 1));
}

export function getPaginationShowingRange(page: number, perPage?: number, totalCount?: number) {
  let lower = page * (perPage ?? 1) - (perPage ?? 0) + 1;
  let upper = Math.min(page * (perPage ?? 0), totalCount ?? 0);

  if (Number.isNaN(lower)) lower = 0;
  if (Number.isNaN(upper)) upper = 0;

  return `${lower}-${upper}`;
}
