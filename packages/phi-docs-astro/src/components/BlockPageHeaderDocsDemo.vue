<script setup lang="ts">
import { computed, ref } from "vue";
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { Button } from "@dicehub/phi/components/button";
import { PhCode, PhGear, PhGlobe, PhHouse, PhPlus } from "@phosphor-icons/vue";
import PageHeader from "../../../phi/templates/blocks/page-header/PageHeader.vue";

type DemoTab = {
  label: string;
  value: string;
};

type DemoVariant = "actions" | "basic" | "complete" | "hero" | "icons" | "tabs" | "title" | "title-description";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const heroTabs: DemoTab[] = [
  { label: "Overview", value: "overview" },
  { label: "Metrics", value: "metrics" },
  { label: "Deployments", value: "deployments" },
  { label: "Bindings", value: "bindings" },
  { label: "Observability", value: "observability" },
  { label: "Settings", value: "settings" },
];
const settingsTabs: DemoTab[] = [
  { label: "General", value: "general" },
  { label: "Security", value: "security" },
  { label: "Notifications", value: "notifications" },
];
const projectTabs: DemoTab[] = [
  { label: "Overview", value: "overview" },
  { label: "Settings", value: "settings" },
];
const completeTabs: DemoTab[] = [
  { label: "Overview", value: "overview" },
  { label: "Analytics", value: "analytics" },
  { label: "Settings", value: "settings" },
];

const hasTitle = computed(() => ["title", "title-description", "complete"].includes(props.variant));
const hasDescription = computed(() => ["title-description", "complete"].includes(props.variant));
const hasActions = computed(() => ["actions", "complete", "hero"].includes(props.variant));
const tabs = computed(() => {
  if (props.variant === "hero") return heroTabs;
  if (props.variant === "tabs") return settingsTabs;
  if (props.variant === "actions") return projectTabs;
  if (props.variant === "complete") return completeTabs;
  return [];
});

const description = computed(() => {
  if (props.variant === "title-description") {
    return "Action-led, value-oriented description of what this page does. Optional second sentence with use cases or prerequisites.";
  }

  return "Action-led, value-oriented description of what this page does";
});

const lastTabValue = ref("");
</script>

<template>
  <div class="block-page-header-demo" :data-variant="props.variant">
    <PageHeader
      :default-tab="tabs[0]?.value"
      :description="hasDescription ? description : undefined"
      :tabs="tabs"
      :title="hasTitle ? 'Page title' : undefined"
      @value-change="lastTabValue = $event"
    >
      <template #breadcrumbs>
        <Breadcrumbs v-if="props.variant === 'hero'">
          <Breadcrumbs.Link :icon="PhHouse" href="#">Workers &amp; Pages</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>cloudflare-dev-platform</Breadcrumbs.Current>
        </Breadcrumbs>

        <Breadcrumbs v-else-if="props.variant === 'basic'">
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Dashboard</Breadcrumbs.Current>
        </Breadcrumbs>

        <Breadcrumbs v-else-if="props.variant === 'icons'">
          <Breadcrumbs.Link :icon="PhHouse" href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current :icon="PhGear">Settings</Breadcrumbs.Current>
        </Breadcrumbs>

        <Breadcrumbs v-else-if="props.variant === 'tabs'">
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
        </Breadcrumbs>

        <Breadcrumbs v-else-if="props.variant === 'actions'">
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
        </Breadcrumbs>

        <Breadcrumbs v-else>
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Page title</Breadcrumbs.Current>
        </Breadcrumbs>
      </template>

      <template v-if="hasActions" #default>
        <template v-if="props.variant === 'hero'">
          <Button :icon="PhCode" size="sm">Edit code</Button>
          <Button :icon="PhGlobe" size="sm" variant="primary">Visit</Button>
        </template>
        <template v-else-if="props.variant === 'complete'">
          <Button variant="outline">Export</Button>
          <Button :icon="PhPlus" variant="primary">New Item</Button>
        </template>
        <Button v-else variant="primary">Deploy</Button>
      </template>
    </PageHeader>

    <p v-if="tabs.length" class="block-page-header-demo__status" data-last-tab-value>{{ lastTabValue }}</p>
  </div>
</template>

<style scoped>
.block-page-header-demo {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 0.5rem;
}

.block-page-header-demo[data-variant="tabs"] {
  min-width: 269.2px;
}

.block-page-header-demo[data-variant="actions"] {
  min-width: 245.23px;
}

.block-page-header-demo[data-variant="complete"] {
  min-width: 26.412rem;
}

.block-page-header-demo__status {
  min-height: 1rem;
  margin: 0;
  color: var(--phi-subtle);
  font-family: var(--phi-font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
