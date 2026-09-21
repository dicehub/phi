<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { navigate } from "astro:transitions/client";
import {
  PhBookOpen,
  PhChartLine,
  PhCube,
  PhStack,
  type Icon,
} from "@phosphor-icons/vue";
import { CommandPalette } from "@dicehub/phi/components/command-palette";
import {
  docsSearchItems,
  type DocsSearchItem,
  type DocsSearchKind,
} from "../data/docs-nav";

type SearchGroup = {
  items: DocsSearchItem[];
  label: string;
};

const sectionOrder = ["Guides", "Components", "Charts", "Blocks"];
const kindIcons: Record<DocsSearchKind, Icon> = {
  block: PhStack,
  chart: PhChartLine,
  component: PhCube,
  guide: PhBookOpen,
};

const open = ref(false);
const query = ref("");

const normalizedQuery = computed(() => query.value.trim().toLowerCase());
const queryTerms = computed(() => normalizedQuery.value.split(/\s+/).filter(Boolean));

const scoreItem = (item: DocsSearchItem) => {
  if (!normalizedQuery.value) return 0;

  const label = item.label.toLowerCase();
  const section = item.section.toLowerCase();
  const description = item.description.toLowerCase();
  const href = item.href.toLowerCase();
  const searchable = `${label} ${section} ${description} ${href}`;

  if (!queryTerms.value.every((term) => searchable.includes(term))) return Number.POSITIVE_INFINITY;
  if (label === normalizedQuery.value) return 0;
  if (label.startsWith(normalizedQuery.value)) return 1;
  if (label.includes(normalizedQuery.value)) return 2;
  if (section.includes(normalizedQuery.value)) return 3;
  if (description.includes(normalizedQuery.value)) return 4;
  return 5;
};

const filteredItems = computed(() =>
  docsSearchItems
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label))
    .map(({ item }) => item),
);

const searchGroups = computed<SearchGroup[]>(() => {
  if (normalizedQuery.value) {
    return filteredItems.value.length ? [{ label: "Results", items: filteredItems.value }] : [];
  }

  return sectionOrder
    .map((section) => ({
      label: section,
      items: docsSearchItems.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length);
});

const getSelectableItems = (groups: unknown[]) =>
  (groups as SearchGroup[]).flatMap((group) => group.items);
const itemToStringValue = (item: unknown) => (item as DocsSearchItem).label;
const findHighlights = (text: string) => {
  if (!normalizedQuery.value) return [];
  const index = text.toLowerCase().indexOf(normalizedQuery.value);
  return index === -1 ? [] : [[index, index + normalizedQuery.value.length - 1] as [number, number]];
};

const setOpen = (nextOpen: boolean) => {
  open.value = nextOpen;
};

const openSearch = () => {
  open.value = true;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target;
  if (target instanceof Element && target.closest("[data-docs-search-open]")) openSearch();
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && open.value) {
    event.preventDefault();
    open.value = false;
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    open.value = true;
  }
};

const navigateToItem = async (item: unknown, options: { newTab: boolean }) => {
  const result = item as DocsSearchItem;
  open.value = false;
  if (options.newTab) {
    window.open(result.href, "_blank", "noopener,noreferrer");
  } else {
    await navigate(result.href);
  }
};

const syncTriggers = () => {
  document.querySelectorAll<HTMLElement>("[data-docs-search-open]").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", open.value ? "true" : "false");
    trigger.setAttribute("data-docs-search-ready", "true");
  });
};

watch(open, (isOpen) => {
  syncTriggers();
  if (!isOpen) query.value = "";
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
  syncTriggers();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleDocumentKeydown);
  document.querySelectorAll<HTMLElement>("[data-docs-search-open]").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("data-docs-search-ready");
  });
});
</script>

<template>
  <div class="docs-search-dialog-host">
    <CommandPalette.Root
      id="docs-search-dialog"
      v-model:open="open"
      v-model:value="query"
      aria-label="Search documentation"
      class="docs-search-dialog"
      :filter="false"
      :get-selectable-items="getSelectableItems"
      :item-to-string-value="itemToStringValue"
      :items="searchGroups"
      @open-change="setOpen"
      @select="navigateToItem"
    >
      <CommandPalette.Input placeholder="Search documentation..." />
      <CommandPalette.List>
        <CommandPalette.Results v-slot="{ item: group }">
          <CommandPalette.Group :items="(group as SearchGroup).items">
            <CommandPalette.GroupLabel>{{ (group as SearchGroup).label }}</CommandPalette.GroupLabel>
            <CommandPalette.Items v-slot="{ item }">
              <CommandPalette.ResultItem
                data-docs-search-result
                :breadcrumbs="[(item as DocsSearchItem).section]"
                :description="(item as DocsSearchItem).description"
                :title="(item as DocsSearchItem).label"
                :title-highlights="findHighlights((item as DocsSearchItem).label)"
                :value="item"
              >
                <template #icon>
                  <component :is="kindIcons[(item as DocsSearchItem).kind]" :size="16" weight="duotone" />
                </template>
              </CommandPalette.ResultItem>
            </CommandPalette.Items>
          </CommandPalette.Group>
        </CommandPalette.Results>
        <CommandPalette.Empty>
          {{ normalizedQuery ? `No results found for “${query.trim()}”` : "No documentation pages found" }}
        </CommandPalette.Empty>
      </CommandPalette.List>
      <CommandPalette.Footer>
        <span>{{ filteredItems.length }} {{ filteredItems.length === 1 ? "result" : "results" }}</span>
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> Open</span>
        <span><kbd>Esc</kbd> Close</span>
      </CommandPalette.Footer>
    </CommandPalette.Root>
  </div>
</template>

<style scoped>
.docs-search-dialog-host {
  display: contents;
}

:deep(.docs-search-dialog) {
  --phi-elevated: var(--docs-base);
}

:deep(.phi-command-palette-result-item__description) {
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  :deep(.phi-command-palette-footer) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.5rem 1rem;
  }
}
</style>
