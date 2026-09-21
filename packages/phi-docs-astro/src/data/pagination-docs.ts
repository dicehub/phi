export const paginationBarrelCode = `import { Pagination } from "@dicehub/phi";`;

export const paginationGranularCode = `import { Pagination } from "@dicehub/phi/components/pagination";`;

export const paginationPreviewCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);

function setPage(nextPage: number) {
  page.value = nextPage;
}
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" />
</template>`;

export const paginationUsageCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);

function setPage(nextPage: number) {
  page.value = nextPage;
}
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" />
</template>`;

const fullControlsCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" controls="full" />
</template>`;

const simpleControlsCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" controls="simple" />
</template>`;

const unknownTotalCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const hasNextPage = computed(() => page.value < 3);
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination
    :page="page"
    :set-page="setPage"
    :has-next-page="hasNextPage"
    :text="() => \`Page \${page}\`"
  />
</template>`;

const midPageCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(5);
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" />
</template>`;

const largeDatasetCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="25" :total-count="1250" />
</template>`;

const customTextCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination, type PaginationInfoDetails } from "@dicehub/phi/components/pagination";

const page = ref(1);
const setPage = (nextPage: number) => { page.value = nextPage; };
const text = ({ perPage }: PaginationInfoDetails) => \`Page \${page.value} - showing \${perPage} per page\`;
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="25" :total-count="100" :text="text" />
</template>`;

const pageSizeSelectorCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const perPage = ref(25);
const setPage = (nextPage: number) => { page.value = nextPage; };
const setPageSize = (size: number) => {
  perPage.value = size;
  page.value = 1;
};
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="perPage" :total-count="500">
    <Pagination.Info />
    <Pagination.Separator />
    <Pagination.PageSize :value="perPage" @change="setPageSize" />
    <Pagination.Controls />
  </Pagination>
</template>`;

const customPageSizeOptionsCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const perPage = ref(10);
const setPage = (nextPage: number) => { page.value = nextPage; };
const setPageSize = (size: number) => {
  perPage.value = size;
  page.value = 1;
};
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="perPage" :total-count="200">
    <Pagination.Info />
    <Pagination.Separator />
    <Pagination.PageSize :value="perPage" :options="[10, 20, 50]" @change="setPageSize" />
    <Pagination.Controls />
  </Pagination>
</template>`;

const customInfoCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const perPage = 25;
const setPage = (nextPage: number) => { page.value = nextPage; };
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="perPage" :total-count="100">
    <Pagination.Info v-slot="{ page: currentPage, totalCount }">
      Page {{ currentPage }} of {{ Math.ceil((totalCount ?? 1) / perPage) }}
    </Pagination.Info>
    <Pagination.Controls />
  </Pagination>
</template>`;

const customLayoutCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const perPage = ref(25);
const setPage = (nextPage: number) => { page.value = nextPage; };
const setPageSize = (size: number) => {
  perPage.value = size;
  page.value = 1;
};
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="perPage" :total-count="500" class-name="custom-pagination">
    <Pagination.Info />
    <div class="custom-pagination__right">
      <Pagination.Controls />
      <Pagination.Separator />
      <Pagination.PageSize :value="perPage" @change="setPageSize" />
    </div>
  </Pagination>
</template>`;

const dropdownPageSelectorCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@dicehub/phi/components/pagination";

const page = ref(1);
const perPage = ref(25);
const setPage = (nextPage: number) => { page.value = nextPage; };
const setPageSize = (size: number) => {
  perPage.value = size;
  page.value = 1;
};
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="perPage" :total-count="500">
    <Pagination.Info />
    <Pagination.Separator />
    <Pagination.PageSize :value="perPage" @change="setPageSize" />
    <Pagination.Controls page-selector="dropdown" />
  </Pagination>
</template>`;

export const paginationI18nCode = `<script setup lang="ts">
import { ref } from "vue";
import { Pagination, type PaginationLabels } from "@dicehub/phi/components/pagination";

const page = ref(1);
const setPage = (nextPage: number) => { page.value = nextPage; };
const labels: PaginationLabels = {
  firstPage: "Premiere page",
  previousPage: "Page precedente",
  nextPage: "Page suivante",
  lastPage: "Derniere page",
  pageNumber: "Numero de page",
  pageSize: "Taille de page",
};
</script>

<template>
  <Pagination :page="page" :set-page="setPage" :per-page="10" :total-count="100" :labels="labels">
    <Pagination.Info v-slot="{ pageShowingRange, totalCount }">
      Affichage de <span class="tabular-nums">{{ pageShowingRange }}</span> sur
      <span class="tabular-nums">{{ totalCount }}</span>
    </Pagination.Info>
    <Pagination.Controls />
  </Pagination>
</template>`;

export const paginationExamples = [
  {
    id: "full-controls-default",
    title: "Full Controls (Default)",
    variant: "full",
    description: "The default pagination includes first, previous, page input, next, and last buttons.",
    code: fullControlsCode,
  },
  {
    id: "simple-controls",
    title: "Simple Controls",
    variant: "simple",
    description: 'Use controls="simple" for a minimal pagination with only previous and next buttons.',
    code: simpleControlsCode,
  },
  {
    id: "unknown-totals",
    title: "Unknown Totals",
    variant: "unknown-total",
    description: "Use `hasNextPage` for cursor-based APIs that report whether another result set exists but do not report a total. Pagination then shows sequential controls only.",
    code: unknownTotalCode,
  },
  {
    id: "mid-page-state",
    title: "Mid-Page State",
    variant: "mid-page",
    description: "Pagination in the middle of a dataset with all navigation enabled.",
    code: midPageCode,
  },
  {
    id: "large-dataset",
    title: "Large Dataset",
    variant: "large-dataset",
    description: "Pagination handles large datasets with many pages.",
    code: largeDatasetCode,
  },
  {
    id: "custom-text",
    title: "Custom Text",
    variant: "custom-text",
    description: "You can set custom pagination text.",
    code: customTextCode,
  },
] as const;

export const paginationCompoundExamples = [
  {
    id: "page-size-selector",
    title: "Page Size Selector",
    variant: "page-size-selector",
    description: "Add a dropdown to let users select the number of items per page.",
    code: pageSizeSelectorCode,
  },
  {
    id: "custom-page-size-options",
    title: "Custom Page Size Options",
    variant: "custom-page-size-options",
    description: "Customize the available page size options. Defaults to [25, 50, 100, 250].",
    code: customPageSizeOptionsCode,
  },
  {
    id: "custom-info-text",
    title: "Custom Info Text",
    variant: "custom-info",
    description: "Use a scoped slot to customize the info text.",
    code: customInfoCode,
  },
  {
    id: "custom-layout",
    title: "Custom Layout",
    variant: "custom-layout",
    description: "Arrange components in any order. Here the page size selector is on the right.",
    code: customLayoutCode,
  },
  {
    id: "dropdown-page-selector",
    title: "Dropdown Page Selector",
    variant: "dropdown-page-selector",
    description: 'Use page-selector="dropdown" on Pagination.Controls to render a dropdown select instead of a text input.',
    code: dropdownPageSelectorCode,
  },
] as const;

export const paginationRootProps = [
  { name: "setPage", type: "(page: number) => void", defaultValue: "-", description: "Callback for controlled page changes." },
  { name: "v-model:page", type: "number", defaultValue: "-", description: "Vue page binding alternative to setPage." },
  { name: "@page-change", type: "(page: number) => void", defaultValue: "-", description: "Emitted when the current page changes." },
  { name: "page", type: "number", defaultValue: "1", description: "Current page number (1-indexed)." },
  { name: "perPage", type: "number", defaultValue: "-", description: "Number of items displayed per page." },
  { name: "totalCount", type: "number", defaultValue: "-", description: "Total number of items across all pages." },
  { name: "hasNextPage", type: "boolean", defaultValue: "-", description: "Whether another page exists when totalCount is unknown. Unknown totals use sequential controls only." },
  { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the container." },
  { name: "labels", type: "PaginationLabels", defaultValue: "-", description: "Labels for aria labels. Visible text is customized through text or scoped slots." },
  { name: "controls", type: '"full" | "simple"', defaultValue: '"full"', description: "Legacy default controls variant when no compound children are provided." },
  { name: "text", type: "(details: PaginationInfoDetails) => VNodeChild", defaultValue: "-", description: "Legacy custom info text renderer." },
] as const;

export const paginationCompoundApi = [
  { component: "Pagination.Info", prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the info text." },
  { component: "Pagination.Info", prop: "default slot", type: "PaginationInfoDetails", defaultValue: "-", description: "Scoped slot for custom info text." },
  { component: "Pagination.PageSize", prop: "value*", type: "number", defaultValue: "-", description: "Current page size value." },
  { component: "Pagination.PageSize", prop: "v-model:value", type: "number", defaultValue: "-", description: "Vue binding for the current page size value." },
  { component: "Pagination.PageSize", prop: "@change", type: "(size: number) => void", defaultValue: "-", description: "Emitted when the page size changes." },
  { component: "Pagination.PageSize", prop: "options", type: "number[]", defaultValue: "[25, 50, 100, 250]", description: "Available page size options." },
  { component: "Pagination.PageSize", prop: "label", type: "string", defaultValue: '"Per page:"', description: "Label text shown before the selector." },
  { component: "Pagination.PageSize", prop: "label slot", type: "-", defaultValue: "-", description: "Custom label content shown before the selector." },
  { component: "Pagination.PageSize", prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the page size wrapper." },
  { component: "Pagination.Controls", prop: "controls", type: '"full" | "simple"', defaultValue: '"full"', description: "Controls variant." },
  { component: "Pagination.Controls", prop: "pageSelector", type: '"input" | "dropdown"', defaultValue: '"input"', description: "How the page selector is rendered in full mode." },
  { component: "Pagination.Controls", prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the controls wrapper." },
  { component: "Pagination.Separator", prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the separator." },
] as const;
