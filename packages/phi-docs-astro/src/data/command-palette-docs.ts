export const barrelCode = `import { CommandPalette } from "@dicehub/phi";`;

export const granularCode = `import { CommandPalette } from "@dicehub/phi/components/command-palette";`;

export const previewCode = `<script setup>
import { computed, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { CommandPalette } from "@dicehub/phi/components/command-palette";
import { PhFolder, PhGear, PhHouse, PhMagnifyingGlass } from "@phosphor-icons/vue";

const open = ref(false);
const search = ref("");
const selectedItem = ref("");

const groups = [
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
      { id: "dashboard", title: "Dashboard" },
      { id: "users", title: "Users" },
    ],
  },
];

const filteredGroups = computed(() =>
  groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(search.value.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length),
);

const getSelectableItems = (groups) => groups.flatMap((group) => group.items);

const selectItem = (item) => {
  selectedItem.value = item.title;
  open.value = false;
  search.value = "";
};
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Button @click="open = true">Open Command Palette</Button>
    <p v-if="selectedItem">Last selected: {{ selectedItem }}</p>

    <CommandPalette.Root
      v-model:open="open"
      v-model:value="search"
      :filter="false"
      :get-selectable-items="getSelectableItems"
      :items="filteredGroups"
      :item-to-string-value="(group) => group.label"
      @select="selectItem"
    >
      <CommandPalette.Input placeholder="Type a command or search..." />
      <CommandPalette.List>
        <CommandPalette.Results v-slot="{ item: group }">
          <CommandPalette.Group :items="group.items">
            <CommandPalette.GroupLabel>{{ group.label }}</CommandPalette.GroupLabel>
            <CommandPalette.Items v-slot="{ item }">
              <CommandPalette.Item :value="item">
                <span class="flex items-center gap-3">
                  <component :is="item.icon" v-if="item.icon" :size="16" />
                  <span>{{ item.title }}</span>
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
  </div>
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { CommandPalette } from "@dicehub/phi/components/command-palette";

const open = ref(false);
const search = ref("");
const items = [
  { id: "create", title: "Create Project" },
  { id: "settings", title: "Open Settings" },
];
</script>

<template>
  <button @click="open = true">Open</button>
  <CommandPalette.Root
    v-model:open="open"
    v-model:value="search"
    :get-selectable-items="(items) => items"
    :items="items"
    :item-to-string-value="(item) => item.title"
    @select="open = false"
  >
    <CommandPalette.Input placeholder="Search..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
      </CommandPalette.Results>
      <CommandPalette.Empty>No results</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const simpleCode = `<script setup>
import { computed, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { CommandPalette } from "@dicehub/phi/components/command-palette";

const open = ref(false);
const search = ref("");
const actions = [
  { id: "copy", title: "Copy" },
  { id: "paste", title: "Paste" },
  { id: "cut", title: "Cut" },
  { id: "delete", title: "Delete" },
  { id: "select-all", title: "Select All" },
];

const filteredActions = computed(() =>
  actions.filter((item) =>
    item.title.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
</script>

<template>
  <Button @click="open = true">Open Simple Palette</Button>
  <CommandPalette.Root
    v-model:open="open"
    v-model:value="search"
    :filter="false"
    :get-selectable-items="(items) => items"
    :items="filteredActions"
    :item-to-string-value="(item) => item.title"
    @select="open = false"
  >
    <CommandPalette.Input placeholder="Search actions..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
      </CommandPalette.Results>
      <CommandPalette.Empty>No actions found</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const loadingCode = `<script setup>
import { computed, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { CommandPalette } from "@dicehub/phi/components/command-palette";

const open = ref(false);
const loading = ref(false);
const search = ref("");
const groups = [
  { id: "commands", label: "Commands", items: [{ id: "settings", title: "Open Settings" }] },
  { id: "pages", label: "Pages", items: [{ id: "dashboard", title: "Dashboard" }] },
];

const filteredGroups = computed(() =>
  groups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase()),
    ),
  })).filter((group) => group.items.length),
);

const openPalette = () => {
  open.value = true;
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1500);
};
</script>

<template>
  <Button @click="openPalette">Open with Loading</Button>
  <CommandPalette.Root
    v-model:open="open"
    v-model:value="search"
    :filter="false"
    :get-selectable-items="(groups) => groups.flatMap((group) => group.items)"
    :items="loading ? [] : filteredGroups"
  >
    <CommandPalette.Input placeholder="Search..." />
    <CommandPalette.List>
      <CommandPalette.Loading v-if="loading" />
      <template v-else>
        <CommandPalette.Results v-slot="{ item: group }">
          <CommandPalette.Group :items="group.items">
            <CommandPalette.GroupLabel>{{ group.label }}</CommandPalette.GroupLabel>
            <CommandPalette.Items v-slot="{ item }">
              <CommandPalette.Item :value="item">{{ item.title }}</CommandPalette.Item>
            </CommandPalette.Items>
          </CommandPalette.Group>
        </CommandPalette.Results>
        <CommandPalette.Empty>No results found</CommandPalette.Empty>
      </template>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`;

export const autocompleteCode = `<CommandPalette.Input
  autocomplete="off"
  autocapitalize="none"
  autocorrect="off"
  data-1p-ignore="true"
  data-lpignore="true"
  placeholder="Search commands..."
  :spellcheck="false"
/>`;

export const resultItemCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { CommandPalette } from "@dicehub/phi/components/command-palette";
import { PhFile } from "@phosphor-icons/vue";

const open = ref(false);
const search = ref("");
const results = [
  { id: "button", title: "Button", breadcrumbs: ["Components"] },
  { id: "dialog", title: "Dialog", breadcrumbs: ["Components"] },
  { id: "page-header", title: "Page Header", breadcrumbs: ["Blocks"] },
];
</script>

<template>
  <Button @click="open = true">Open with ResultItem</Button>
  <CommandPalette.Root
    v-model:open="open"
    v-model:value="search"
    :get-selectable-items="(items) => items"
    :items="results"
    :item-to-string-value="(item) => item.title"
    @select="open = false"
  >
    <CommandPalette.Input placeholder="Search documentation..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }">
        <CommandPalette.ResultItem
          :breadcrumbs="item.breadcrumbs"
          :title="item.title"
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
</template>`;

export const keyboardShortcuts = [
  { keys: ["↑", "↓"], description: "Move highlight between items" },
  { keys: ["Enter"], description: "Select highlighted item" },
  { keys: ["⌘/Ctrl", "Enter"], description: "Select with newTab: true" },
  { keys: ["Escape"], description: "Close the dialog" },
];

export const componentParts = [
  { id: "command-palette-root", component: "CommandPalette.Root", description: "The main wrapper that combines Dialog and Panel. Manages open state and Combobox behavior." },
  { id: "command-palette-dialog", component: "CommandPalette.Dialog", description: "Modal dialog wrapper. Use with Panel for swappable content, such as drill-down navigation." },
  { id: "command-palette-panel", component: "CommandPalette.Panel", description: "Combobox panel without the dialog wrapper. Use inside Dialog when content can swap without remounting." },
  { id: "command-palette-input", component: "CommandPalette.Input", description: "Search input field with autofocus and keyboard handling." },
  { id: "command-palette-list", component: "CommandPalette.List", description: "Scrollable container for results." },
  { id: "command-palette-results", component: "CommandPalette.Results", description: "Slot iterator for items or groups." },
  { id: "command-palette-group", component: "CommandPalette.Group", description: "Category grouping container." },
  { id: "command-palette-group-label", component: "CommandPalette.GroupLabel", description: "Section header text within a group." },
  { id: "command-palette-items", component: "CommandPalette.Items", description: "Slot iterator for items within a group." },
  { id: "command-palette-item", component: "CommandPalette.Item", description: "Basic selectable item." },
  { id: "command-palette-result-item", component: "CommandPalette.ResultItem", description: "Rich item with breadcrumbs, icons, and text highlighting." },
  { id: "command-palette-highlighted-text", component: "CommandPalette.HighlightedText", description: "Renders text with highlighted portions based on match indices." },
  { id: "command-palette-empty", component: "CommandPalette.Empty", description: "Empty state when no results match." },
  { id: "command-palette-loading", component: "CommandPalette.Loading", description: "Loading spinner state." },
  { id: "command-palette-footer", component: "CommandPalette.Footer", description: "Footer for keyboard hints or other content." },
];

export const rootApiCode = `interface CommandPaletteRootProps<TGroup, TItem = TGroup> {
  // Dialog state
  open?: boolean;
  defaultValue?: string;
  value?: string;

  // Combobox
  items: TGroup[];
  filter?: false | ((item: TGroup, query: string) => boolean);
  itemToStringValue?: (item: TGroup) => string;
  getSelectableItems?: (items: TGroup[]) => TItem[];
}

type CommandPaletteRootEmits<TItem> = {
  "update:open": [open: boolean];
  "update:value": [value: string];
  openChange: [open: boolean];
  valueChange: [value: string];
  select: [item: TItem, options: { newTab: boolean }];
  itemHighlighted: [item: TItem | undefined, details: { index: number; reason: string }];
  close: [];
};`;

export const resultItemApiCode = `interface CommandPaletteResultItemProps<T> {
  value: T;
  title: string;
  breadcrumbs?: string[];
  titleHighlights?: [number, number][];
  breadcrumbHighlights?: [number, number][][];
  description?: string;
  showArrow?: boolean; // default: true
  external?: boolean;
  nonInteractive?: boolean;
}`;
