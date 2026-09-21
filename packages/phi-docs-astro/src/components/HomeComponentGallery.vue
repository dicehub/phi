<script setup lang="ts">
import { Autocomplete } from "@dicehub/phi/components/autocomplete";
import { Badge } from "@dicehub/phi/components/badge";
import { Banner } from "@dicehub/phi/components/banner";
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { Button } from "@dicehub/phi/components/button";
import { CodeHighlighted, ShikiProvider } from "@dicehub/phi/code";
import { Checkbox } from "../../../phi/src/components/checkbox";
import { ClipboardText } from "../../../phi/src/components/clipboard-text";
import { Collapsible } from "@dicehub/phi/components/collapsible";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";
import { CommandPalette } from "@dicehub/phi/components/command-palette";
import { DatePicker } from "@dicehub/phi/components/date-picker";
import { Empty } from "@dicehub/phi/components/empty";
import { Flow } from "@dicehub/phi/components/flow";
import { Grid, GridItem } from "@dicehub/phi/components/grid";
import { Input, InputArea } from "@dicehub/phi/components/input";
import { InputGroup } from "@dicehub/phi/components/input-group";
import { Label } from "@dicehub/phi/components/label";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Link } from "@dicehub/phi/components/link";
import { Loader } from "@dicehub/phi/components/loader";
import { MenuBar, type MenuBarOption } from "@dicehub/phi/components/menubar";
import { Meter } from "@dicehub/phi/components/meter";
import { Pagination } from "@dicehub/phi/components/pagination";
import { Popover } from "@dicehub/phi/components/popover";
import { Radio } from "@dicehub/phi/components/radio";
import { Select } from "@dicehub/phi/components/select";
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";
import { Sidebar } from "@dicehub/phi/components/sidebar";
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
import { Switch } from "@dicehub/phi/components/switch";
import { Table } from "@dicehub/phi/components/table";
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";
import { Tabs, type TabsItem } from "@dicehub/phi/components/tabs";
import { TagInput } from "@dicehub/phi/components/tag-input";
import { Text } from "@dicehub/phi/components/text";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";
import { DicehubLogo } from "../../../phi/src/components/dicehub-logo";
import {
  PhFunnelSimple,
  PhHouse,
  PhMagnifyingGlass,
  PhTextBolder,
  PhTextItalic,
  PhWarning,
} from "@phosphor-icons/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
import { Dialog } from "@ark-ui/vue/dialog";
import { computed, ref } from "vue";

type DemoKind =
  | "autocomplete"
  | "badge"
  | "banner"
  | "breadcrumbs"
  | "button"
  | "checkbox"
  | "clipboard-text"
  | "code-highlighted"
  | "collapsible"
  | "combobox"
  | "command-palette"
  | "date-picker"
  | "dicehub-logo"
  | "dialog"
  | "dropdown"
  | "empty"
  | "flow"
  | "grid"
  | "input"
  | "input-area"
  | "input-group"
  | "input-validation"
  | "label"
  | "layer-card"
  | "link"
  | "loader"
  | "menu-bar"
  | "meter"
  | "pagination"
  | "popover"
  | "radio"
  | "select"
  | "sensitive-input"
  | "sidebar"
  | "skeleton-line"
  | "switch"
  | "table"
  | "table-of-contents"
  | "tabs"
  | "tag-input"
  | "text"
  | "toolbar"
  | "toast"
  | "tooltip";

const issueItems = [
  { label: "bug", value: "bug" },
  { label: "documentation", value: "documentation" },
  { label: "enhancement", value: "enhancement" },
  { label: "help wanted", value: "help-wanted" },
  { label: "good first issue", value: "good-first-issue" },
];
const collectionOptions = {
  itemToString: (item: { label: string }) => item.label,
  itemToValue: (item: { value: string }) => item.value,
};

const comboboxCollection = createComboboxCollection({ items: issueItems, ...collectionOptions });
const checked = ref(true);
const homeDate = ref(new Date(2026, 5, 4));
const homeTags = ref(["docs"]);
const homeMenuBarActive = ref<string | undefined>("bold");
const homePaginationPage = ref(1);
const homeRadioValue = ref("email");
const homeToastManager = createPhiToastManager();
const switchChecked = ref(true);
const commandPaletteOpen = ref(false);
const commandPaletteSearch = ref("");
const commandPaletteItems = [
  { id: "create", title: "Create Project" },
  { id: "settings", title: "Open Settings" },
  { id: "docs", title: "Search Docs" },
];
const filteredCommandPaletteItems = computed(() =>
  commandPaletteItems.filter((option) =>
    option.title.toLowerCase().includes(commandPaletteSearch.value.trim().toLowerCase()),
  ),
);
const homeMenuBarOptions: MenuBarOption[] = [
  {
    icon: PhTextBolder,
    id: "bold",
    tooltip: "Bold",
    onClick: () => {
      homeMenuBarActive.value = homeMenuBarActive.value === "bold" ? undefined : "bold";
    },
  },
  {
    icon: PhTextItalic,
    id: "italic",
    tooltip: "Italic",
    onClick: () => {
      homeMenuBarActive.value = homeMenuBarActive.value === "italic" ? undefined : "italic";
    },
  },
];
const homeTabs: TabsItem[] = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "settings", label: "Settings" },
];
const setHomePaginationPage = (page: number) => {
  homePaginationPage.value = page;
};
const showHomeToast = () => {
  homeToastManager.add({
    id: "home-toast",
    title: "Toast created",
    description: "Ready to ship.",
    variant: "success",
  });
};

const routes: Record<string, string> = {
  badge: "/docs/components/badge",
  banner: "/docs/components/banner",
  breadcrumbs: "/docs/components/breadcrumbs",
  button: "/docs/components/button",
  checkbox: "/docs/components/checkbox",
  "clipboard-text": "/docs/components/clipboard-text",
  autocomplete: "/docs/components/autocomplete",
  "code-highlighted": "/docs/components/code-highlighted",
  collapsible: "/docs/components/collapsible",
  combobox: "/docs/components/combobox",
  "command-palette": "/docs/components/command-palette",
  "date-picker": "/docs/components/date-picker",
  "dicehub-logo": "/docs/components/dicehub-logo",
  dialog: "/docs/components/dialog",
  dropdown: "/docs/components/dropdown",
  empty: "/docs/components/empty",
  flow: "/docs/components/flow",
  grid: "/docs/components/grid",
  label: "/docs/components/label",
  input: "/docs/components/input",
  "input-area": "/docs/components/input-area",
  "input-group": "/docs/components/input-group",
  label: "/docs/components/label",
  "layer-card": "/docs/components/layer-card",
  link: "/docs/components/link",
  loader: "/docs/components/loader",
  "menu-bar": "/docs/components/menu-bar",
  meter: "/docs/components/meter",
  pagination: "/docs/components/pagination",
  popover: "/docs/components/popover",
  radio: "/docs/components/radio",
  select: "/docs/components/select",
  "sensitive-input": "/docs/components/sensitive-input",
  sidebar: "/docs/components/sidebar",
  "skeleton-line": "/docs/components/skeleton-line",
  switch: "/docs/components/switch",
  table: "/docs/components/table",
  "table-of-contents": "/docs/components/table-of-contents",
  tabs: "/docs/components/tabs",
  "tag-input": "/docs/components/tag-input",
  text: "/docs/components/text",
  toolbar: "/docs/components/toolbar",
  toast: "/docs/components/toast",
  tooltip: "/docs/components/tooltip",
};

const components: Array<{ name: string; id: string; demo: DemoKind }> = [
  { name: "Button", id: "button", demo: "button" },
  { name: "Input", id: "input", demo: "input" },
  { name: "Select", id: "select", demo: "select" },
  { name: "Autocomplete", id: "autocomplete", demo: "autocomplete" },
  { name: "Combobox", id: "combobox", demo: "combobox" },
  { name: "Switch", id: "switch", demo: "switch" },
  { name: "Input (with validation)", id: "input", demo: "input-validation" },
  { name: "Dialog", id: "dialog", demo: "dialog" },
  { name: "Tooltip", id: "tooltip", demo: "tooltip" },
  { name: "Dropdown", id: "dropdown", demo: "dropdown" },
  { name: "Collapsible", id: "collapsible", demo: "collapsible" },
  { name: "Checkbox", id: "checkbox", demo: "checkbox" },
  { name: "LayerCard", id: "layer-card", demo: "layer-card" },
  { name: "Loader", id: "loader", demo: "loader" },
  { name: "SkeletonLine", id: "skeleton-line", demo: "skeleton-line" },
  { name: "CodeHighlighted", id: "code-highlighted", demo: "code-highlighted" },
  { name: "Banner", id: "banner", demo: "banner" },
  { name: "Tabs", id: "tabs", demo: "tabs" },
  { name: "Badge", id: "badge", demo: "badge" },
  { name: "Toast", id: "toast", demo: "toast" },
  { name: "InputArea", id: "input-area", demo: "input-area" },
  { name: "InputGroup", id: "input-group", demo: "input-group" },
  { name: "MenuBar", id: "menu-bar", demo: "menu-bar" },
  { name: "Meter", id: "meter", demo: "meter" },
  { name: "Pagination", id: "pagination", demo: "pagination" },
  { name: "DatePicker", id: "date-picker", demo: "date-picker" },
  { name: "Breadcrumbs", id: "breadcrumbs", demo: "breadcrumbs" },
  { name: "ClipboardText", id: "clipboard-text", demo: "clipboard-text" },
  { name: "dicehub logo", id: "dicehub-logo", demo: "dicehub-logo" },
  { name: "CommandPalette", id: "command-palette", demo: "command-palette" },
  { name: "Flow", id: "flow", demo: "flow" },
  { name: "Link", id: "link", demo: "link" },
  { name: "Empty", id: "empty", demo: "empty" },
  { name: "Grid", id: "grid", demo: "grid" },
  { name: "Label", id: "label", demo: "label" },
  { name: "Popover", id: "popover", demo: "popover" },
  { name: "Radio", id: "radio", demo: "radio" },
  { name: "SensitiveInput", id: "sensitive-input", demo: "sensitive-input" },
  { name: "Sidebar", id: "sidebar", demo: "sidebar" },
  { name: "Table", id: "table", demo: "table" },
  { name: "Table of Contents", id: "table-of-contents", demo: "table-of-contents" },
  { name: "TagInput", id: "tag-input", demo: "tag-input" },
  { name: "Text", id: "text", demo: "text" },
  { name: "Toolbar", id: "toolbar", demo: "toolbar" },
];
</script>

<template>
  <ul class="home-gallery">
    <li v-for="item in components" :key="`${item.name}-${item.demo}`" class="home-gallery__item">
      <a v-if="routes[item.id]" :href="routes[item.id]" class="home-gallery__title">{{ item.name }}</a>
      <span v-else class="home-gallery__title home-gallery__title--pending">{{ item.name }}</span>

      <div class="home-gallery__body">
        <div v-if="item.demo === 'button'" class="home-stack">
          <Button variant="primary">Create Worker</Button>
          <Button variant="secondary">Settings</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>

        <div v-else-if="item.demo === 'input'" class="home-stack">
          <Input class="home-phi-input" placeholder="Type something..." aria-label="Example input" />
          <Input class="home-phi-input" default-value="Invalid!" aria-label="Invalid input" error="Invalid input." />
        </div>

        <Select
          v-else-if="item.demo === 'select'"
          class="home-select-trigger"
          aria-label="Select a version"
          default-value="all"
          :items="{
            all: 'All deployed versions',
            active: 'Active versions',
            specific: 'Specific versions',
          }"
        />

        <Autocomplete
          v-else-if="item.demo === 'autocomplete'"
          class="home-autocomplete"
          :items="issueItems"
          aria-label="Search docs"
          default-input-value="documentation"
          placeholder="Search docs..."
        />

        <Combobox
          v-else-if="item.demo === 'combobox'"
          :collection="comboboxCollection"
          :default-value="['bug']"
          class="home-autocomplete"
        >
          <Combobox.TriggerInput placeholder="Select an issue..." />
          <Combobox.Content>
            <Combobox.List>
              <template #default="{ item: option }">
                <Combobox.Item :item="option">{{ option.label }}</Combobox.Item>
              </template>
            </Combobox.List>
          </Combobox.Content>
        </Combobox>

        <Switch
          v-else-if="item.demo === 'switch'"
          v-model:checked="switchChecked"
          aria-label="Enable setting"
        />

        <Input
          v-else-if="item.demo === 'input-validation'"
          class="home-phi-input"
          label="Email"
          type="email"
          default-value="name"
          error="Please enter a valid email."
        />

        <InputArea
          v-else-if="item.demo === 'input-area'"
          class="home-phi-input-area"
          placeholder="Enter your name"
          aria-label="Input area example"
        />

        <Dialog.Root v-else-if="item.demo === 'dialog'">
          <Dialog.Trigger as-child>
            <Button>Click me!</Button>
          </Dialog.Trigger>
          <Dialog.Backdrop class="home-dialog-backdrop" />
          <Dialog.Positioner class="home-dialog-positioner">
            <Dialog.Content class="home-dialog-content">
              <Dialog.Title>Hello!</Dialog.Title>
              <Dialog.Description>I'm a dialog.</Dialog.Description>
              <Dialog.CloseTrigger class="home-mini-button">Close</Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>

        <div v-else-if="item.demo === 'tooltip'" class="home-row">
          <TooltipProvider :delay="120">
            <Tooltip as-child content="Add" default-open>
              <button class="home-icon-button" type="button" aria-label="Add">+</button>
            </Tooltip>
            <Tooltip as-child content="Change language">
              <button class="home-icon-button" type="button" aria-label="Change language">T</button>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu v-else-if="item.demo === 'dropdown'" :positioning="{ placement: 'bottom-start', gutter: 8 }">
          <DropdownMenuTrigger>
            <Button>Add</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="worker">Worker</DropdownMenuItem>
            <DropdownMenuItem value="pages">Pages</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Collapsible v-else-if="item.demo === 'collapsible'" class="home-collapsible">
          <Collapsible.DefaultTrigger>What is Phi?</Collapsible.DefaultTrigger>
          <Collapsible.DefaultPanel>Phi is a Vue component library.</Collapsible.DefaultPanel>
        </Collapsible>

        <Checkbox v-else-if="item.demo === 'checkbox'" v-model:checked="checked" class="home-check" label="Max bandwidth" />

        <ClipboardText v-else-if="item.demo === 'clipboard-text'" text="0c239dd2" size="base" />

        <div v-else-if="item.demo === 'badge'" class="home-badges">
          <Badge variant="blue">Blue</Badge>
          <Badge variant="green">Green</Badge>
          <Badge variant="orange">Orange</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="red">Red</Badge>
        </div>

        <Banner
          v-else-if="item.demo === 'banner'"
          :icon="PhWarning"
          :icon-props="{ weight: 'fill' }"
          class="home-banner"
          variant="alert"
          title="Session expiring"
          description="Expires in 5 minutes."
        />

        <Tabs
          v-else-if="item.demo === 'tabs'"
          class="home-tabs"
          :tabs="homeTabs"
          selected-value="overview"
          size="sm"
        />

        <Breadcrumbs v-else-if="item.demo === 'breadcrumbs'" class="home-breadcrumbs" size="sm">
          <Breadcrumbs.Link :icon="PhHouse" :icon-props="{ size: 16 }" href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Project</Breadcrumbs.Current>
        </Breadcrumbs>

        <ShikiProvider
          v-else-if="item.demo === 'code-highlighted'"
          engine="javascript"
          :languages="['typescript']"
        >
          <CodeHighlighted
            class="home-code-highlighted"
            code="const status: string = 'ready';"
            lang="typescript"
          />
        </ShikiProvider>

        <DicehubLogo v-else-if="item.demo === 'dicehub-logo'" style="width: 8rem;" />

        <DatePicker
          v-else-if="item.demo === 'date-picker'"
          v-model:selected="homeDate"
          class="home-date-picker"
          placeholder="Pick a day"
        />

        <Empty
          v-else-if="item.demo === 'empty'"
          class="home-empty"
          size="sm"
          title="No results"
          description="Try another filter."
        />

        <Flow v-else-if="item.demo === 'flow'" class="home-flow" :padding="{ x: 12, y: 42 }">
          <Flow.Node>Start</Flow.Node>
          <Flow.Parallel>
            <Flow.Node>A</Flow.Node>
            <Flow.Node>B</Flow.Node>
          </Flow.Parallel>
          <Flow.Node>End</Flow.Node>
        </Flow>

        <Grid v-else-if="item.demo === 'grid'" class="home-grid" variant="2up" gap="sm">
          <GridItem><span>1</span></GridItem>
          <GridItem><span>2</span></GridItem>
          <GridItem><span>3</span></GridItem>
          <GridItem><span>4</span></GridItem>
        </Grid>

        <div v-else-if="item.demo === 'command-palette'" class="home-row">
          <Button size="sm" @click="commandPaletteOpen = true">Open palette</Button>
          <CommandPalette.Root
            v-model:open="commandPaletteOpen"
            v-model:value="commandPaletteSearch"
            :filter="false"
            :items="filteredCommandPaletteItems"
            @select="commandPaletteOpen = false"
          >
            <CommandPalette.Input placeholder="Search actions..." />
            <CommandPalette.List>
              <CommandPalette.Results v-slot="{ item: option }">
                <CommandPalette.Item :value="option">{{ option.title }}</CommandPalette.Item>
              </CommandPalette.Results>
              <CommandPalette.Empty>No actions found</CommandPalette.Empty>
            </CommandPalette.List>
          </CommandPalette.Root>
        </div>

        <InputGroup v-else-if="item.demo === 'input-group'" class="home-phi-input-group">
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input default-value="phi.example.com" aria-label="Project URL" />
        </InputGroup>

        <div v-else-if="item.demo === 'label'" class="home-label-stack">
          <Label>Default Label</Label>
          <Label show-optional>Optional Field</Label>
          <Label tooltip="More info">With Tooltip</Label>
        </div>

        <LayerCard v-else-if="item.demo === 'layer-card'" class="home-layer-card">
          <LayerCard.Secondary>Next Steps</LayerCard.Secondary>
          <LayerCard.Primary>Get started with Phi</LayerCard.Primary>
        </LayerCard>

        <div v-else-if="item.demo === 'link'" class="home-link-stack">
          <p>Open <Link href="/docs/components/link">Link docs</Link></p>
          <Link href="https://example.com" target="_blank" rel="noopener noreferrer" variant="plain">
            External <Link.ExternalIcon />
          </Link>
        </div>

        <Loader v-else-if="item.demo === 'loader'" size="lg" class="home-loader" />

        <div v-else-if="item.demo === 'skeleton-line'" class="home-skeleton-lines">
          <SkeletonLine :min-width="80" :max-width="100" />
          <SkeletonLine :min-width="60" :max-width="80" />
          <SkeletonLine :min-width="40" :max-width="60" />
        </div>

        <Meter
          v-else-if="item.demo === 'meter'"
          class="home-meter"
          label="Storage used"
          :value="65"
        />

        <Pagination
          v-else-if="item.demo === 'pagination'"
          class="home-pagination"
          :page="homePaginationPage"
          :set-page="setHomePaginationPage"
          :per-page="10"
          :total-count="100"
          controls="simple"
        />

        <MenuBar
          v-else-if="item.demo === 'menu-bar'"
          class="home-menubar"
          :is-active="homeMenuBarActive"
          :options="homeMenuBarOptions"
          option-ids
        />

        <Popover v-else-if="item.demo === 'popover'">
          <Popover.Trigger as-child>
            <Button size="sm">Notifications</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Notifications</Popover.Title>
            <Popover.Description>All caught up.</Popover.Description>
          </Popover.Content>
        </Popover>

        <Radio.Group
          v-else-if="item.demo === 'radio'"
          v-model="homeRadioValue"
          class="home-radio"
          legend="Select option"
        >
          <Radio.Item label="Email" value="email" />
          <Radio.Item label="SMS" value="sms" />
        </Radio.Group>

        <SensitiveInput
          v-else-if="item.demo === 'sensitive-input'"
          class="home-phi-input"
          aria-label="API key"
          default-value="sk_live_abc123"
        />

        <div v-else-if="item.demo === 'sidebar'" style="width: 100%; height: 9rem; overflow: hidden; border: 1px solid var(--phi-line, #e3e6eb); border-radius: 0.5rem;">
          <Sidebar.Provider contained default-open style="height: 100%; min-height: 0;">
            <Sidebar>
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.Menu>
                    <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
                    <Sidebar.MenuButton :icon="PhWarning">Alerts</Sidebar.MenuButton>
                  </Sidebar.Menu>
                </Sidebar.Group>
              </Sidebar.Content>
              <Sidebar.Footer>
                <Sidebar.Trigger />
              </Sidebar.Footer>
            </Sidebar>
            <div style="flex: 1;"></div>
          </Sidebar.Provider>
        </div>

        <LayerCard v-else-if="item.demo === 'table'" class="home-table-card">
          <Table class="home-table">
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Status</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Worker 1</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Worker 2</Table.Cell>
                <Table.Cell>Paused</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Worker 3</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </LayerCard>

        <TableOfContents v-else-if="item.demo === 'table-of-contents'" class="home-toc">
          <TableOfContents.List>
            <TableOfContents.Item active>Overview</TableOfContents.Item>
            <TableOfContents.Item>Usage</TableOfContents.Item>
            <TableOfContents.Item>API</TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents>

        <div v-else-if="item.demo === 'text'" class="home-text-stack">
          <Text variant="heading3" as="span">Heading 3</Text>
          <Text variant="secondary" size="sm">Muted secondary copy</Text>
          <Text variant="mono-secondary">text-base (14px)</Text>
        </div>

        <Toolbar v-else-if="item.demo === 'toolbar'" class="home-toolbar">
          <Toolbar.Input aria-label="Search records" placeholder="Search..." />
          <Toolbar.Button :icon="PhMagnifyingGlass" aria-label="Search" />
          <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
        </Toolbar>

        <Toasty v-else-if="item.demo === 'toast'" :toast-manager="homeToastManager">
          <Button size="sm" @click="showHomeToast">Show toast</Button>
        </Toasty>

        <TagInput
          v-else-if="item.demo === 'tag-input'"
          v-model="homeTags"
          aria-label="Example tags"
          class="home-phi-input"
          placeholder="Add a tag"
        />

        <div v-else :class="['home-static', `home-static--${item.demo}`]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </li>
  </ul>
</template>
