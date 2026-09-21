<script setup lang="ts">
import { Combobox } from "@dicehub/phi/components/combobox";
import { InputGroup } from "@dicehub/phi/components/input-group";
import { Select } from "@dicehub/phi/components/select";
import { Toolbar, type ToolbarSize } from "@dicehub/phi/components/toolbar";
import {
  PhBookOpen,
  PhDownloadSimple,
  PhFunnelSimple,
  PhGearSix,
  PhMagnifyingGlass,
  PhUploadSimple,
} from "@phosphor-icons/vue";

type ToolbarDocsDemoVariant =
  | "preview"
  | "select"
  | "combobox"
  | "input-shorthand"
  | "input-group"
  | "sizes"
  | "button-actions"
  | "links"
  | "accessible-labels";

withDefaults(
  defineProps<{
    variant?: ToolbarDocsDemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const sizes: ToolbarSize[] = ["xs", "sm", "base", "lg"];
const sortItems = { name: "Name", created: "Created date", status: "Status" };
const statusItems = ["All records", "Active", "Paused", "Failed"];
</script>

<template>
  <Toolbar v-if="variant === 'preview'" class="toolbar-demo__wide">
    <Toolbar.InputGroup aria-label="Search DNS records" class="toolbar-demo__grow">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search DNS records" />
    </Toolbar.InputGroup>
    <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
    <Toolbar.Button :icon="PhGearSix" aria-label="Settings" />
  </Toolbar>

  <Toolbar v-else-if="variant === 'select'">
    <Toolbar.Button :icon="PhFunnelSimple">Filter</Toolbar.Button>
    <Select aria-label="Sort records" default-value="name" :items="sortItems">
      <template #trigger="{ label }">
        <Toolbar.Button>{{ label }}</Toolbar.Button>
      </template>
    </Select>
    <Toolbar.Button :icon="PhGearSix" aria-label="View settings" />
  </Toolbar>

  <div v-else-if="variant === 'combobox'" class="toolbar-demo-stack">
    <Toolbar class="toolbar-demo__wide">
      <Toolbar.Button :icon="PhFunnelSimple">Status</Toolbar.Button>
      <Combobox :default-value="['All records']" :items="statusItems">
        <Combobox.TriggerInput as-child>
          <Toolbar.Input
            aria-label="Filter status"
            class="toolbar-demo__grow"
            placeholder="Filter status…"
          />
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
      <Toolbar.Button :icon="PhGearSix" aria-label="Status settings" />
    </Toolbar>

    <Toolbar>
      <Combobox :default-value="['All records']" :items="statusItems">
        <Combobox.TriggerValue v-slot="{ label }" as-child aria-label="Choose status">
          <Toolbar.Button>{{ label }}</Toolbar.Button>
        </Combobox.TriggerValue>
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">{{ item }}</Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Toolbar.Button>Apply</Toolbar.Button>
    </Toolbar>
  </div>

  <Toolbar v-else-if="variant === 'input-shorthand'" class="toolbar-demo__wide">
    <Toolbar.Input
      aria-label="Search DNS records"
      class="toolbar-demo__grow"
      placeholder="Search DNS records"
    />
    <Toolbar.Button :icon="PhFunnelSimple" aria-label="Filter" />
    <Toolbar.Button :icon="PhGearSix" aria-label="Settings" />
  </Toolbar>

  <Toolbar v-else-if="variant === 'input-group'" class="toolbar-demo__wide toolbar-demo__wide--lg">
    <Toolbar.InputGroup aria-label="Worker subdomain" class="toolbar-demo__grow">
      <InputGroup.Input placeholder="my-worker" />
      <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
    </Toolbar.InputGroup>
    <Toolbar.Button>Visit</Toolbar.Button>
  </Toolbar>

  <div v-else-if="variant === 'sizes'" class="toolbar-demo-sizes">
    <div v-for="size in sizes" :key="size" class="toolbar-demo-size-row">
      <span class="toolbar-demo-size-label">{{ size }}</span>
      <Toolbar :size="size">
        <Toolbar.Input :aria-label="`${size} search`" placeholder="Search..." />
        <Toolbar.Button>Apply</Toolbar.Button>
      </Toolbar>
    </div>
  </div>

  <Toolbar v-else-if="variant === 'button-actions'">
    <Toolbar.Button :icon="PhUploadSimple">Upload</Toolbar.Button>
    <Toolbar.Button :icon="PhDownloadSimple">Download</Toolbar.Button>
  </Toolbar>

  <Toolbar v-else-if="variant === 'links'">
    <Toolbar.Link href="/docs/components/button" :icon="PhBookOpen">Button docs</Toolbar.Link>
    <Toolbar.Button :icon="PhDownloadSimple">Download</Toolbar.Button>
  </Toolbar>

  <Toolbar v-else class="toolbar-demo__wide toolbar-demo__wide--lg">
    <Toolbar.Input aria-label="Search records" class="toolbar-demo__grow" placeholder="Search" />
    <Toolbar.Button :icon="PhMagnifyingGlass" aria-label="Search" />
  </Toolbar>
</template>

<style>
.toolbar-demo__wide {
  width: min(100%, 28rem);
}

.toolbar-demo__wide--lg {
  width: min(100%, 32rem);
}

.phi-toolbar .toolbar-demo__grow.phi-toolbar__item {
  flex: 1 1 auto;
}

.toolbar-demo-stack {
  display: grid;
  gap: 0.75rem;
}

.toolbar-demo-sizes {
  display: grid;
  gap: 0.75rem;
}

.toolbar-demo-size-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-demo-size-label {
  width: 2.5rem;
  color: var(--docs-subtle);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
