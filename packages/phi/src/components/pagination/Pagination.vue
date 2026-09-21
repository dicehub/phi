<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import PaginationControls from "./PaginationControls.vue";
import PaginationRenderContent from "./PaginationRenderContent";
import {
  getPaginationMaxPage,
  getPaginationShowingRange,
  PAGINATION_DEFAULT_LABELS,
  type PaginationControlsVariant,
  type PaginationLabels,
  type PaginationTextRenderer,
} from "./pagination";
import { providePaginationContext } from "./context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    controls?: PaginationControlsVariant;
    hasNextPage?: boolean;
    labels?: PaginationLabels;
    page?: number;
    perPage?: number;
    setPage?: (page: number) => void;
    text?: PaginationTextRenderer;
    totalCount?: number;
  }>(),
  {
    className: undefined,
    controls: "full",
    labels: () => ({}),
    page: 1,
    setPage: undefined,
    text: undefined,
  },
);

const emit = defineEmits<{
  pageChange: [page: number];
  "update:page": [page: number];
}>();

const slots = useSlots();
const editingPage = ref(props.page);
const hasCustomLayout = computed(() => Boolean(slots.default));
const currentHasNextPage = computed(() => props.hasNextPage);
const resolvedLabels = computed(() => ({ ...PAGINATION_DEFAULT_LABELS, ...props.labels }));
const currentPage = computed(() => props.page);
const currentPerPage = computed(() => props.perPage);
const currentTotalCount = computed(() => props.totalCount);
const maxPage = computed(() => getPaginationMaxPage(props.totalCount, props.perPage));
const pageShowingRange = computed(() => getPaginationShowingRange(props.page, props.perPage, props.totalCount));
const shouldShowDefaultInfo = computed(() => Boolean(props.totalCount && props.totalCount > 0));
const legacyText = computed(() =>
  props.text?.({
    page: props.page,
    perPage: props.perPage,
    totalCount: props.totalCount,
    pageShowingRange: pageShowingRange.value,
  }),
);

function updatePage(page: number) {
  props.setPage?.(page);
  emit("update:page", page);
  emit("pageChange", page);
}

watch(
  () => props.page,
  (page) => {
    editingPage.value = page;
  },
);

providePaginationContext({
  editingPage,
  hasNextPage: currentHasNextPage,
  labels: resolvedLabels,
  maxPage,
  page: currentPage,
  pageShowingRange,
  perPage: currentPerPage,
  setEditingPage: (page: number) => {
    editingPage.value = page;
  },
  setPage: updatePage,
  totalCount: currentTotalCount,
});
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-pagination"
    :class="className"
    data-phi-component="Pagination"
    data-slot="pagination"
  >
    <slot v-if="hasCustomLayout" />
    <template v-else>
      <div
        aria-atomic="true"
        aria-live="polite"
        class="phi-pagination__info phi-pagination__info--grow"
        data-slot="pagination-info"
      >
        <PaginationRenderContent v-if="legacyText !== undefined" :content="legacyText" />
        <template v-else-if="shouldShowDefaultInfo">
          Showing <span class="phi-pagination__number">{{ pageShowingRange }}</span> of
          <span class="phi-pagination__number">{{ totalCount }}</span>
        </template>
      </div>
      <PaginationControls :controls="controls" />
    </template>
  </div>
</template>

<style src="./pagination.css"></style>
