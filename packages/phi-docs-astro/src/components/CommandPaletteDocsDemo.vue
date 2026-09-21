<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { CommandPalette } from "@dicehub/phi/components/command-palette";
import {
  PhChartLine,
  PhFile,
  PhFolder,
  PhGear,
  PhHouse,
  PhMagnifyingGlass,
  PhUsers,
} from "@phosphor-icons/vue";

type DemoVariant = "hero" | "grouped" | "simple" | "loading" | "autocomplete-off" | "result-item";

type CommandItem = {
  icon?: object;
  id: string;
  title: string;
};

type CommandGroup = {
  id: string;
  items: CommandItem[];
  label: string;
};

type SearchResult = {
  breadcrumbs: string[];
  description?: string;
  id: string;
  title: string;
};

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const sampleGroups: CommandGroup[] = [
  {
    id: "commands",
    label: "Commands",
    items: [
      { id: "new-project", title: "Create New Project", icon: PhFolder },
      { id: "settings", title: "Open Settings", icon: PhGear },
      { id: "search", title: "Search Files", icon: PhMagnifyingGlass },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    items: [
      { id: "home", title: "Home", icon: PhHouse },
      { id: "dashboard", title: "Dashboard", icon: PhChartLine },
      { id: "users", title: "Users", icon: PhUsers },
    ],
  },
];

const simpleItems: CommandItem[] = [
  { id: "copy", title: "Copy" },
  { id: "paste", title: "Paste" },
  { id: "cut", title: "Cut" },
  { id: "delete", title: "Delete" },
  { id: "select-all", title: "Select All" },
];

const searchResults: SearchResult[] = [
  { id: "button", title: "Button", breadcrumbs: ["Components"] },
  { id: "dialog", title: "Dialog", breadcrumbs: ["Components"] },
  { id: "page-header", title: "Page Header", breadcrumbs: ["Blocks"], description: "Layout block" },
];

const filterGroupsWithItems = (groups: CommandGroup[], query: string) => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return groups;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(lowerQuery)),
    }))
    .filter((group) => group.items.length);
};

const filterItems = <T extends { title: string }>(items: T[], query: string) => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return items;

  return items.filter((item) => item.title.toLowerCase().includes(lowerQuery));
};

const getSelectableItems = (groups: unknown[]) =>
  (groups as CommandGroup[]).flatMap((group) => group.items);
const itemToTitle = (item: unknown) => (item as { title?: string }).title ?? "";

const groupedOpen = ref(false);
const groupedSearch = ref("");
const groupedSelected = ref("");
const simpleOpen = ref(false);
const simpleSearch = ref("");
const loadingOpen = ref(false);
const loadingSearch = ref("");
const loading = ref(false);
const autocompleteOpen = ref(false);
const autocompleteSearch = ref("");
const resultOpen = ref(false);
const resultSearch = ref("");

const filteredGroups = computed(() => filterGroupsWithItems(sampleGroups, groupedSearch.value));
const filteredSimpleItems = computed(() => filterItems(simpleItems, simpleSearch.value));
const filteredLoadingGroups = computed(() => filterGroupsWithItems(sampleGroups, loadingSearch.value));
const filteredAutocompleteGroups = computed(() => filterGroupsWithItems(sampleGroups, autocompleteSearch.value));
const filteredSearchResults = computed(() => filterItems(searchResults, resultSearch.value));

const selectGroupedItem = (item: unknown) => {
  groupedSelected.value = itemToTitle(item);
  groupedOpen.value = false;
  groupedSearch.value = "";
};

const closeSimple = () => {
  simpleOpen.value = false;
  simpleSearch.value = "";
};

const closeAutocomplete = () => {
  autocompleteOpen.value = false;
  autocompleteSearch.value = "";
};

const closeResult = () => {
  resultOpen.value = false;
  resultSearch.value = "";
};

const openLoading = () => {
  loadingOpen.value = true;
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 800);
};
</script>

<template>
  <div class="command-palette-demo">
    <template v-if="variant === 'hero' || variant === 'grouped'">
      <Button @click="groupedOpen = true">Open Command Palette</Button>
      <p v-if="groupedSelected" class="command-palette-demo__selected">
        Last selected: <span>{{ groupedSelected }}</span>
      </p>
      <CommandPalette.Root
        v-model:open="groupedOpen"
        v-model:value="groupedSearch"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :items="filteredGroups"
        :item-to-string-value="(group) => (group as CommandGroup).label"
        @select="selectGroupedItem"
      >
        <CommandPalette.Input placeholder="Type a command or search..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item: group }">
            <CommandPalette.Group :items="(group as CommandGroup).items">
              <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
              <CommandPalette.Items v-slot="{ item }">
                <CommandPalette.Item :value="item">
                  <span class="command-palette-demo__item">
                    <component :is="(item as CommandItem).icon" v-if="(item as CommandItem).icon" :size="16" />
                    <span>{{ (item as CommandItem).title }}</span>
                  </span>
                </CommandPalette.Item>
              </CommandPalette.Items>
            </CommandPalette.Group>
          </CommandPalette.Results>
          <CommandPalette.Empty>No commands found</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </template>

    <template v-else-if="variant === 'simple'">
      <Button @click="simpleOpen = true">Open Simple Palette</Button>
      <CommandPalette.Root
        v-model:open="simpleOpen"
        v-model:value="simpleSearch"
        :filter="false"
        :get-selectable-items="(items) => items"
        :items="filteredSimpleItems"
        :item-to-string-value="itemToTitle"
        @select="closeSimple"
      >
        <CommandPalette.Input placeholder="Search actions..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item }">
            <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
          </CommandPalette.Results>
          <CommandPalette.Empty>No actions found</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else-if="variant === 'loading'">
      <Button @click="openLoading">Open with Loading</Button>
      <CommandPalette.Root
        v-model:open="loadingOpen"
        v-model:value="loadingSearch"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :items="loading ? [] : filteredLoadingGroups"
      >
        <CommandPalette.Input placeholder="Search..." />
        <CommandPalette.List>
          <CommandPalette.Loading v-if="loading" />
          <template v-else>
            <CommandPalette.Results v-slot="{ item: group }">
              <CommandPalette.Group :items="(group as CommandGroup).items">
                <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
                <CommandPalette.Items v-slot="{ item }">
                  <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
                </CommandPalette.Items>
              </CommandPalette.Group>
            </CommandPalette.Results>
            <CommandPalette.Empty>No results found</CommandPalette.Empty>
          </template>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else-if="variant === 'autocomplete-off'">
      <Button @click="autocompleteOpen = true">Open Palette (No Autocomplete)</Button>
      <CommandPalette.Root
        v-model:open="autocompleteOpen"
        v-model:value="autocompleteSearch"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :items="filteredAutocompleteGroups"
        @select="closeAutocomplete"
      >
        <CommandPalette.Input
          autocomplete="off"
          autocapitalize="none"
          autocorrect="off"
          data-1p-ignore="true"
          data-lpignore="true"
          placeholder="Search commands..."
          :spellcheck="false"
        />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item: group }">
            <CommandPalette.Group :items="(group as CommandGroup).items">
              <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
              <CommandPalette.Items v-slot="{ item }">
                <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
              </CommandPalette.Items>
            </CommandPalette.Group>
          </CommandPalette.Results>
          <CommandPalette.Empty>No commands found</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else>
      <Button @click="resultOpen = true">Open with ResultItem</Button>
      <CommandPalette.Root
        v-model:open="resultOpen"
        v-model:value="resultSearch"
        :filter="false"
        :get-selectable-items="(items) => items"
        :items="filteredSearchResults"
        :item-to-string-value="itemToTitle"
        @select="closeResult"
      >
        <CommandPalette.Input placeholder="Search documentation..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item }">
            <CommandPalette.ResultItem
              :breadcrumbs="(item as SearchResult).breadcrumbs"
              :description="(item as SearchResult).description"
              :title="(item as SearchResult).title"
              :value="item"
            >
              <template #icon><PhFile :size="16" /></template>
            </CommandPalette.ResultItem>
          </CommandPalette.Results>
          <CommandPalette.Empty>No pages found</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>⌘↵</kbd> Open in new tab</span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </template>
  </div>
</template>

<style scoped>
.command-palette-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.command-palette-demo__selected {
  margin: 0;
  color: var(--phi-subtle);
  font-size: 0.875rem;
}

.command-palette-demo__selected span {
  color: var(--phi-default);
}

.command-palette-demo__item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.command-palette-demo__item svg {
  color: var(--phi-subtle);
}
</style>
