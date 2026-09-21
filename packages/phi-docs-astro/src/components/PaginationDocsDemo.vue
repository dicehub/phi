<script setup lang="ts">
import { computed, ref } from "vue";
import { Pagination, type PaginationLabels, type PaginationInfoDetails } from "@dicehub/phi/components/pagination";

type DemoVariant =
  | "preview"
  | "usage"
  | "full"
  | "simple"
  | "unknown-total"
  | "mid-page"
  | "large-dataset"
  | "custom-text"
  | "page-size-selector"
  | "custom-page-size-options"
  | "custom-info"
  | "custom-layout"
  | "dropdown-page-selector"
  | "i18n";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const initialPage = {
  "mid-page": 5,
} satisfies Partial<Record<DemoVariant, number>>;
const initialPerPage = {
  "large-dataset": 25,
  "custom-text": 25,
  "page-size-selector": 25,
  "custom-info": 25,
  "custom-layout": 25,
  "dropdown-page-selector": 25,
} satisfies Partial<Record<DemoVariant, number>>;
const totalCountByVariant = {
  "large-dataset": 1250,
  "page-size-selector": 500,
  "custom-info": 100,
  "custom-layout": 500,
  "dropdown-page-selector": 500,
  "custom-page-size-options": 200,
} satisfies Partial<Record<DemoVariant, number>>;

const page = ref(initialPage[props.variant] ?? 1);
const perPage = ref(initialPerPage[props.variant] ?? 10);
const totalCount = computed(() => totalCountByVariant[props.variant] ?? 100);
const hasNextPage = computed(() => page.value < 3);
const labels: PaginationLabels = {
  firstPage: "Premiere page",
  previousPage: "Page precedente",
  nextPage: "Page suivante",
  lastPage: "Derniere page",
  pageNumber: "Numero de page",
  pageSize: "Taille de page",
};

function setPage(nextPage: number) {
  page.value = nextPage;
}

function setPageSize(size: number) {
  perPage.value = size;
  page.value = 1;
}

function renderCustomText({ perPage: pageSize }: PaginationInfoDetails) {
  return `Page ${page.value} - showing ${pageSize} per page`;
}

function renderUnknownTotalText() {
  return `Page ${page.value}`;
}
</script>

<template>
  <div class="pagination-demo">
    <Pagination
      v-if="variant === 'simple'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
      controls="simple"
    />

    <Pagination
      v-else-if="variant === 'unknown-total'"
      :page="page"
      :set-page="setPage"
      :has-next-page="hasNextPage"
      :text="renderUnknownTotalText"
    />

    <Pagination
      v-else-if="variant === 'custom-text'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
      :text="renderCustomText"
    />

    <Pagination
      v-else-if="variant === 'page-size-selector'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize :value="perPage" @change="setPageSize" />
      <Pagination.Controls />
    </Pagination>

    <Pagination
      v-else-if="variant === 'custom-page-size-options'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize :value="perPage" :options="[10, 20, 50]" @change="setPageSize" />
      <Pagination.Controls />
    </Pagination>

    <Pagination
      v-else-if="variant === 'custom-info'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
    >
      <Pagination.Info v-slot="{ page: currentPage, totalCount: count }">
        Page {{ currentPage }} of {{ Math.ceil((count ?? 1) / perPage) }}
      </Pagination.Info>
      <Pagination.Controls />
    </Pagination>

    <Pagination
      v-else-if="variant === 'custom-layout'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
      class-name="pagination-demo__custom-layout"
    >
      <Pagination.Info />
      <div class="pagination-demo__right">
        <Pagination.Controls />
        <Pagination.Separator />
        <Pagination.PageSize :value="perPage" @change="setPageSize" />
      </div>
    </Pagination>

    <Pagination
      v-else-if="variant === 'dropdown-page-selector'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
    >
      <Pagination.Info />
      <Pagination.Separator />
      <Pagination.PageSize :value="perPage" @change="setPageSize" />
      <Pagination.Controls page-selector="dropdown" />
    </Pagination>

    <Pagination
      v-else-if="variant === 'i18n'"
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
      :labels="labels"
    >
      <Pagination.Info v-slot="{ pageShowingRange, totalCount: count }">
        Affichage de <span class="pagination-demo__number">{{ pageShowingRange }}</span> sur
        <span class="pagination-demo__number">{{ count }}</span>
      </Pagination.Info>
      <Pagination.Controls />
    </Pagination>

    <Pagination
      v-else
      :page="page"
      :set-page="setPage"
      :per-page="perPage"
      :total-count="totalCount"
      :controls="variant === 'full' ? 'full' : undefined"
    />
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.pagination-demo :deep(.phi-pagination) {
  max-width: 100%;
}

.pagination-demo__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-demo :deep(.pagination-demo__custom-layout) {
  justify-content: space-between;
}

.pagination-demo__number {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
