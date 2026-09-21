export const toolbarBarrelCode = `import { Toolbar } from "@dicehub/phi";`;

export const toolbarGranularCode = `import { Toolbar } from "@dicehub/phi/components/toolbar";`;

export const toolbarPreviewCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhFunnelSimple, PhGearSix, PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar class="toolbar-demo__wide">
    <Toolbar.InputGroup aria-label="Search DNS records" class="toolbar-demo__grow">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search DNS records" />
    </Toolbar.InputGroup>
    <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
    <Toolbar.Button :icon="PhGearSix" aria-label="Settings" />
  </Toolbar>
</template>`;

export const toolbarUsageCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhFunnelSimple, PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar>
    <Toolbar.InputGroup aria-label="Search DNS records">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search DNS records" />
    </Toolbar.InputGroup>
    <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
  </Toolbar>
</template>`;

export const toolbarSelectCode = `<script setup>
import { Select } from "@dicehub/phi/components/select";
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhFunnelSimple, PhGearSix } from "@phosphor-icons/vue";

const sortItems = { name: "Name", created: "Created date", status: "Status" };
</script>

<template>
  <Toolbar>
    <Toolbar.Button :icon="PhFunnelSimple">Filter</Toolbar.Button>
    <Select aria-label="Sort records" default-value="name" :items="sortItems">
      <template #trigger="{ label }">
        <Toolbar.Button>{{ label }}</Toolbar.Button>
      </template>
    </Select>
    <Toolbar.Button :icon="PhGearSix" aria-label="View settings" />
  </Toolbar>
</template>`;

export const toolbarComboboxCode = `<script setup>
import { Combobox } from "@dicehub/phi/components/combobox";
import { Toolbar } from "@dicehub/phi/components/toolbar";

const statusItems = ["All records", "Active", "Paused", "Failed"];
</script>

<template>
  <Toolbar>
    <Toolbar.Button>Status</Toolbar.Button>
    <Combobox :default-value="['All records']" :items="statusItems">
      <Combobox.TriggerInput as-child>
        <Toolbar.Input aria-label="Filter status" placeholder="Filter status…" />
      </Combobox.TriggerInput>
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  </Toolbar>

  <Toolbar>
    <Combobox :default-value="['All records']" :items="statusItems">
      <Combobox.TriggerValue v-slot="{ label }" as-child aria-label="Choose status">
        <Toolbar.Button>{{ label }}</Toolbar.Button>
      </Combobox.TriggerValue>
      <Combobox.Content>
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
    <Toolbar.Button>Apply</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarInputShorthandCode = `<script setup>
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhFunnelSimple, PhGearSix } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar class="toolbar-demo__wide">
    <Toolbar.Input
      aria-label="Search DNS records"
      class="toolbar-demo__grow"
      placeholder="Search DNS records"
    />
    <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
    <Toolbar.Button :icon="PhGearSix" aria-label="Settings" />
  </Toolbar>
</template>`;

export const toolbarInputGroupCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { Toolbar } from "@dicehub/phi/components/toolbar";
</script>

<template>
  <Toolbar class="toolbar-demo__wide toolbar-demo__wide--lg">
    <Toolbar.InputGroup aria-label="Worker subdomain" class="toolbar-demo__grow">
      <InputGroup.Input placeholder="my-worker" />
      <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
    </Toolbar.InputGroup>
    <Toolbar.Button>Visit</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarSizesCode = `<script setup>
import { Toolbar, type ToolbarSize } from "@dicehub/phi/components/toolbar";

const sizes: ToolbarSize[] = ["xs", "sm", "base", "lg"];
</script>

<template>
  <div class="toolbar-demo-sizes">
    <div v-for="size in sizes" :key="size" class="toolbar-demo-size-row">
      <span class="toolbar-demo-size-label">{{ size }}</span>
      <Toolbar :size="size">
        <Toolbar.Input :aria-label="\`\${size} search\`" placeholder="Search..." />
        <Toolbar.Button>Apply</Toolbar.Button>
      </Toolbar>
    </div>
  </div>
</template>`;

export const toolbarActionsCode = `<script setup>
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhDownloadSimple, PhUploadSimple } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar>
    <Toolbar.Button :icon="PhUploadSimple">Upload</Toolbar.Button>
    <Toolbar.Button :icon="PhDownloadSimple">Download</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarLinksCode = `<script setup>
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhBookOpen, PhDownloadSimple } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar>
    <Toolbar.Link href="/docs/components/button" :icon="PhBookOpen">Button docs</Toolbar.Link>
    <Toolbar.Button :icon="PhDownloadSimple">Download</Toolbar.Button>
  </Toolbar>
</template>`;

export const toolbarLabelsCode = `<script setup>
import { Toolbar } from "@dicehub/phi/components/toolbar";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <Toolbar class="toolbar-demo__wide toolbar-demo__wide--lg">
    <Toolbar.Input
      aria-label="Search records"
      class="toolbar-demo__grow"
      placeholder="Search"
    />
    <Toolbar.Button :icon="PhMagnifyingGlass" aria-label="Search" />
  </Toolbar>
</template>`;

export const toolbarExamples = [
  {
    id: "select",
    title: "Select",
    variant: "select",
    description: "Use the Select `trigger` slot to apply Ark UI behavior to a `Toolbar.Button`.",
    code: toolbarSelectCode,
  },
  {
    id: "combobox",
    title: "Combobox",
    variant: "combobox",
    description: "Use `as-child` with `Combobox.TriggerInput` or `Combobox.TriggerValue` to keep regular Combobox behavior in a toolbar control.",
    code: toolbarComboboxCode,
  },
  {
    id: "input-shorthand",
    title: "Input Shorthand",
    variant: "input-shorthand",
    description: "Use `Toolbar.Input` for simple text inputs that do not need addons.",
    code: toolbarInputShorthandCode,
  },
  {
    id: "input-group",
    title: "Input Group",
    variant: "input-group",
    description: "Use `Toolbar.InputGroup` when one toolbar item needs its own inline addon or suffix.",
    code: toolbarInputGroupCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "The `size` prop supports `xs`, `sm`, `base`, and `lg`. Every supported toolbar item is locked to the same size.",
    code: toolbarSizesCode,
  },
  {
    id: "button-actions",
    title: "Button Actions",
    variant: "button-actions",
    description: "Toolbar buttons use quiet styling so grouped actions remain visually quiet and consistent.",
    code: toolbarActionsCode,
  },
  {
    id: "links",
    title: "Links",
    variant: "links",
    description: "Use `Toolbar.Link` for navigation. It uses `LinkButton` behavior with toolbar size, quiet styling, and arrow-key navigation.",
    code: toolbarLinksCode,
  },
  {
    id: "accessible-labels",
    title: "Accessible Labels",
    variant: "accessible-labels",
    description: "Use `aria-label` for compact toolbar controls that do not have visible labels.",
    code: toolbarLabelsCode,
  },
] as const;

export const toolbarSelectCompositionCode = `<Select aria-label="Sort records" :items="sortItems">
  <template #trigger="{ label }">
    <Toolbar.Button>{{ label }}</Toolbar.Button>
  </template>
</Select>`;

export const toolbarComboboxCompositionCode = `<Combobox.TriggerInput as-child>
  <Toolbar.Input aria-label="Filter records" />
</Combobox.TriggerInput>

<Combobox.TriggerValue v-slot="{ label }" as-child>
  <Toolbar.Button>{{ label }}</Toolbar.Button>
</Combobox.TriggerValue>`;

export const toolbarProps = [
  {
    name: "default",
    type: "slot",
    defaultValue: "-",
    description: "Toolbar controls rendered as one grouped card.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Locks every supported toolbar item to this size.",
  },
  {
    name: "class",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes merged onto the toolbar root.",
  },
] as const;
