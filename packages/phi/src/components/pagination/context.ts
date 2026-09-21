import { inject, provide, type ComputedRef, type Ref } from "vue";
import type { PaginationInfoDetails, PaginationLabels } from "./pagination";

export type PaginationContext = {
  editingPage: Ref<number>;
  hasNextPage: ComputedRef<boolean | undefined>;
  labels: ComputedRef<Required<PaginationLabels>>;
  maxPage: ComputedRef<number>;
  page: ComputedRef<number>;
  pageShowingRange: ComputedRef<string>;
  perPage: ComputedRef<number | undefined>;
  setEditingPage: (page: number) => void;
  setPage: (page: number) => void;
  totalCount: ComputedRef<number | undefined>;
};

const paginationContextKey = Symbol("phi-pagination");

export function providePaginationContext(context: PaginationContext) {
  provide(paginationContextKey, context);
}

export function usePaginationContext() {
  const context = inject<PaginationContext>(paginationContextKey);

  if (!context) {
    throw new Error("Pagination compound components must be used within a Pagination component");
  }

  return context;
}

export function getPaginationInfoDetails(context: PaginationContext): PaginationInfoDetails {
  return {
    page: context.page.value,
    perPage: context.perPage.value,
    totalCount: context.totalCount.value,
    pageShowingRange: context.pageShowingRange.value,
  };
}
