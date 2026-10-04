export const deleteResourceInstallCode = `pnpm add @dicehub/phi@beta`;

export const deleteResourceImportCode = `import { DeleteResource } from "@dicehub/phi/blocks/delete-resource";`;

export const pageHeaderUsageCode = `<script setup lang="ts">
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { PhHouse } from "@phosphor-icons/vue";
import PageHeader from "./components/phi/page-header/PageHeader.vue";

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Settings", value: "settings" },
];

function handleValueChange(value: string) {
  console.log(value);
}
</script>

<template>
  <PageHeader
    :tabs="tabs"
    default-tab="overview"
    @value-change="handleValueChange"
  >
    <template #breadcrumbs>
      <Breadcrumbs>
        <Breadcrumbs.Link :icon="PhHouse" href="#">Home</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
      </Breadcrumbs>
    </template>
  </PageHeader>
</template>`;

export const resourceListUsageCode = `<script setup lang="ts">
import ResourceListPage from "./components/phi/resource-list-page/ResourceListPage.vue";
</script>

<template>
  <ResourceListPage
    title="Databases"
    description="Manage your database instances and configurations"
  >
    <template #icon>
      <DatabaseIcon />
    </template>

    <section>
      Your resource list content
    </section>
  </ResourceListPage>
</template>`;

export const deleteResourceUsageCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { DeleteResource } from "@dicehub/phi/blocks/delete-resource";

const open = ref(false);
const isDeleting = ref(false);

async function handleDelete() {
  isDeleting.value = true;
  try {
    await deleteZone("example.com");
    open.value = false;
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <Button variant="destructive" @click="open = true">
    Delete Zone
  </Button>

  <DeleteResource
    v-model:open="open"
    resource-type="Zone"
    resource-name="example.com"
    :is-deleting="isDeleting"
    @delete="handleDelete"
  />
</template>`;

export const pageHeaderHeroCode = `<script setup lang="ts">
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { Button } from "@dicehub/phi/components/button";
import { PhCode, PhGlobe, PhHouse } from "@phosphor-icons/vue";
import PageHeader from "./components/phi/page-header/PageHeader.vue";

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Metrics", value: "metrics" },
  { label: "Deployments", value: "deployments" },
  { label: "Bindings", value: "bindings" },
  { label: "Observability", value: "observability" },
  { label: "Settings", value: "settings" },
];
</script>

<template>
  <PageHeader
    :tabs="tabs"
    default-tab="overview"
    @value-change="(value) => console.log(value)"
  >
    <template #breadcrumbs>
      <Breadcrumbs>
        <Breadcrumbs.Link :icon="PhHouse" href="#">
          Workers & Pages
        </Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>cloudflare-dev-platform</Breadcrumbs.Current>
      </Breadcrumbs>
    </template>

    <Button :icon="PhCode">Edit code</Button>
    <Button :icon="PhGlobe" variant="primary">Visit</Button>
  </PageHeader>
</template>`;

export const pageHeaderProps = [
  { name: "spacing", type: "\"compact\" | \"base\" | \"relaxed\"", defaultValue: "\"base\"", description: "Vertical gap between the breadcrumbs, heading, and tab row." },
  { name: "breadcrumbs", type: "slot", defaultValue: "-", description: "Breadcrumb trail rendered above the title." },
  { name: "title", type: "string", defaultValue: "-", description: "Page title. Omit to hide the heading block." },
  { name: "description", type: "string", defaultValue: "-", description: "Supporting sentence below the title." },
  { name: "tabs", type: "TabsItem[]", defaultValue: "-", description: "Page sections rendered as a tab row." },
  { name: "defaultTab", type: "string", defaultValue: "-", description: "Value of the tab selected on first render." },
  { name: "valueChange", type: "(value: string) => void", defaultValue: "-", description: "Emitted when the selected tab changes." },
  { name: "default slot", type: "slot", defaultValue: "-", description: "Actions rendered at the end of the tab row. Rendered only when tabs are set." },
  { name: "class", type: "string", defaultValue: "-", description: "Forwarded to the root element." },
];

export const tabsItemProps = [
  { name: "label", type: "string" },
  { name: "value", type: "string" },
];

export const resourceListProps = [
  { name: "title", type: "string", description: "Page title displayed at the top." },
  { name: "description", type: "string", description: "Page description below the title." },
  { name: "icon", type: "slot", description: "Icon displayed next to the title." },
  { name: "usage", type: "slot", description: "Sidebar content for usage examples or quick start guides." },
  { name: "additionalContent", type: "slot", description: "Additional sidebar content such as resources or links." },
  { name: "default slot", type: "slot", description: "Main content area for the resource list. Rendered before the sidebar in the DOM." },
  { name: "class", type: "string", description: "Additional class for the root element." },
];

export const deleteResourceProps = [
  { name: "size", type: "\"sm\" | \"base\"", defaultValue: "\"base\"", description: "Dialog size variant." },
  { name: "open*", type: "boolean", defaultValue: "-", description: "Whether the dialog is open. In Vue, use v-model:open." },
  { name: "resourceType*", type: "string", defaultValue: "-", description: "The type of resource being deleted." },
  { name: "resourceName*", type: "string", defaultValue: "-", description: "The exact resource name the user must type." },
  { name: "isDeleting", type: "boolean", defaultValue: "false", description: "Whether the delete action is in progress." },
  { name: "caseSensitive", type: "boolean", defaultValue: "true", description: "Whether the confirmation input must match case exactly." },
  { name: "deleteButtonText", type: "string", defaultValue: "`Delete ${resourceType}`", description: "Custom destructive action label." },
  { name: "className", type: "string", defaultValue: "-", description: "Additional class for the dialog." },
  { name: "errorMessage", type: "string", defaultValue: "-", description: "Error message displayed above the confirmation copy." },
];

export const deleteResourceEvents = [
  { name: "delete", type: "() => void", description: "Emitted when the user confirms deletion." },
  { name: "openChange", type: "(open: boolean) => void", description: "Emitted whenever the dialog open state changes." },
  { name: "update:open", type: "(open: boolean) => void", description: "Used by v-model:open for controlled state." },
];
