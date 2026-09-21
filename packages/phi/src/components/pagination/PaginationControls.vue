<script setup lang="ts">
import { computed } from "vue";
import { InputGroup } from "../input-group";
import { clampPaginationPage, type PaginationControlsVariant, type PaginationPageSelector } from "./pagination";
import { usePaginationContext } from "./context";
import PaginationSelect from "./PaginationSelect.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    controls?: PaginationControlsVariant;
    pageSelector?: PaginationPageSelector;
  }>(),
  {
    className: undefined,
    controls: "full",
    pageSelector: "input",
  },
);

const context = usePaginationContext();
const pages = computed(() => Array.from({ length: context.maxPage.value }, (_, index) => index + 1));
const hasKnownTotal = computed(() => context.totalCount.value != null);
const isUnknownTotal = computed(() => !hasKnownTotal.value && context.hasNextPage.value !== undefined);
const showFullControls = computed(() => props.controls === "full" && !isUnknownTotal.value);
const isFirstPage = computed(() => context.page.value <= 1);
const isNextDisabled = computed(() =>
  hasKnownTotal.value
    ? context.page.value >= context.maxPage.value
    : context.hasNextPage.value !== true,
);

function goToPage(page: number) {
  const clamped = isUnknownTotal.value
    ? Math.max(page, 1)
    : clampPaginationPage(page, 1, context.maxPage.value);

  context.setPage(clamped);
  context.setEditingPage(clamped);
}

function handleInput(value: string) {
  context.setEditingPage(Number(value));
}

function commitInput() {
  goToPage(context.editingPage.value);
}

function handleSelect(page: number) {
  goToPage(page);
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-pagination__controls"
    :class="props.className"
    data-slot="pagination-controls"
  >
    <nav :aria-label="context.labels.value.navigation">
      <InputGroup class="phi-pagination__control-group">
        <InputGroup.Button
          v-if="showFullControls"
          :aria-label="context.labels.value.firstPage"
          :disabled="isFirstPage"
          variant="secondary"
          @click="goToPage(1)"
        >
          <svg viewBox="0 0 256 256" focusable="false" aria-hidden="true">
            <path d="M112.49,199.51a12,12,0,0,1-17,0l-64-64a12,12,0,0,1,0-17l64-64a12,12,0,0,1,17,17L57,128l55.5,55.51A12,12,0,0,1,112.49,199.51ZM177,128l55.5-55.51a12,12,0,0,0-17-17l-64,64a12,12,0,0,0,0,17l64,64a12,12,0,0,0,17-17Z" />
          </svg>
        </InputGroup.Button>
        <InputGroup.Button
          :aria-label="context.labels.value.previousPage"
          :disabled="isFirstPage"
          variant="secondary"
          @click="goToPage(context.page.value - 1)"
        >
          <svg viewBox="0 0 256 256" focusable="false" aria-hidden="true">
            <path d="M165.66,202.34a12,12,0,0,1-17,0l-64-64a12,12,0,0,1,0-17l64-64a12,12,0,0,1,17,17L110.17,128l55.49,55.51A12,12,0,0,1,165.66,202.34Z" />
          </svg>
        </InputGroup.Button>
        <PaginationSelect
          v-if="showFullControls && props.pageSelector === 'dropdown'"
          class-name="phi-pagination__select--page"
          :label="context.labels.value.pageNumber"
          :model-value="context.page.value"
          :options="pages"
          @change="handleSelect"
        />
        <InputGroup.Input
          v-else-if="showFullControls"
          :model-value="context.editingPage.value"
          :aria-label="context.labels.value.pageNumber"
          autoComplete="off"
          class="phi-pagination__input"
          data-1p-ignore
          data-form-type="other"
          data-lpignore="true"
          inputmode="numeric"
          @blur="commitInput"
          @keydown.enter="commitInput"
          @update:model-value="handleInput"
        />
        <InputGroup.Button
          :aria-label="context.labels.value.nextPage"
          :disabled="isNextDisabled"
          variant="secondary"
          @click="goToPage(context.page.value + 1)"
        >
          <svg viewBox="0 0 256 256" focusable="false" aria-hidden="true">
            <path d="M171.31,138.34l-64,64a12,12,0,0,1-17-17L145.83,128,90.34,72.49a12,12,0,0,1,17-17l64,64A12,12,0,0,1,171.31,138.34Z" />
          </svg>
        </InputGroup.Button>
        <InputGroup.Button
          v-if="showFullControls"
          :aria-label="context.labels.value.lastPage"
          :disabled="isNextDisabled"
          variant="secondary"
          @click="goToPage(context.maxPage.value)"
        >
          <svg viewBox="0 0 256 256" focusable="false" aria-hidden="true">
            <path d="M104.49,119.51a12,12,0,0,1,0,17l-64,64a12,12,0,1,1-17-17L78.83,128,23.34,72.49a12,12,0,0,1,17-17ZM160.49,55.51a12,12,0,0,0-17,17L199,128l-55.5,55.51a12,12,0,0,0,17,17l64-64a12,12,0,0,0,0-17Z" />
          </svg>
        </InputGroup.Button>
      </InputGroup>
    </nav>
  </div>
</template>
