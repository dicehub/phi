export const tabsBarrelCode = `import { Tabs } from "@dicehub/phi";`;

export const tabsGranularCode = `import { Tabs } from "@dicehub/phi/components/tabs";`;

const baseTabsCode = `const tabs = [
  { value: "tab1", label: "Tab 1" },
  { value: "tab2", label: "Tab 2" },
  { value: "tab3", label: "Tab 3" },
];`;

export const tabsPreviewCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

${baseTabsCode}
</script>

<template>
  <div class="tabs-demo__stack">
    <div>
      <p class="tabs-demo__label">Segmented (default)</p>
      <Tabs :tabs="tabs" selected-value="tab1" variant="segmented" />
    </div>
    <div>
      <p class="tabs-demo__label">Underline</p>
      <Tabs :tabs="tabs" selected-value="tab1" variant="underline" />
    </div>
  </div>
</template>`;

export const tabsUsageCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "settings", label: "Settings" },
];
</script>

<template>
  <Tabs :tabs="tabs" selected-value="overview" />
</template>`;

const segmentedCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

${baseTabsCode}
</script>

<template>
  <Tabs :tabs="tabs" selected-value="tab1" variant="segmented" />
</template>`;

const underlineCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

${baseTabsCode}
</script>

<template>
  <Tabs :tabs="tabs" selected-value="tab1" variant="underline" />
</template>`;

const smallSizeCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

${baseTabsCode}
</script>

<template>
  <div class="tabs-demo__stack">
    <div>
      <p class="tabs-demo__label">Segmented sm</p>
      <Tabs :tabs="tabs" selected-value="tab1" size="sm" />
    </div>
    <div>
      <p class="tabs-demo__label">Underline sm</p>
      <Tabs :tabs="tabs" selected-value="tab1" variant="underline" size="sm" />
    </div>
  </div>
</template>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Tabs } from "@dicehub/phi/components/tabs";

${baseTabsCode}

const activeTab = ref("tab1");
</script>

<template>
  <div class="tabs-demo__stack">
    <Tabs v-model:value="activeTab" :tabs="tabs" />
    <p class="tabs-demo__status">Active tab: <code>{{ activeTab }}</code></p>
  </div>
</template>`;

const overflowTabsCode = `<script setup>
import { Tabs } from "@dicehub/phi/components/tabs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "notifications", label: "Notifications" },
  { value: "settings", label: "Settings" },
  { value: "billing", label: "Billing" },
  { value: "security", label: "Security" },
  { value: "integrations", label: "Integrations" },
];
</script>

<template>
  <div class="tabs-demo__overflow">
    <Tabs :tabs="tabs" selected-value="overview" />
  </div>
</template>`;

export const tabsExamples = [
  {
    id: "segmented-default",
    title: "Segmented (Default)",
    variant: "segmented",
    description: "A pill-shaped indicator slides between tabs on a subtle background.",
    code: segmentedCode,
  },
  {
    id: "underline",
    title: "Underline",
    variant: "underline",
    description: "A bottom border with a primary-colored indicator. The active tab has bolder text for emphasis.",
    code: underlineCode,
  },
  {
    id: "small-size",
    title: "Small Size",
    variant: "small",
    description: "Use `size=\"sm\"` for a compact tab bar that matches input `size=\"sm\"` height (`h-6.5` / 26px). Useful inside toolbars and filter rows.",
    code: smallSizeCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    variant: "controlled",
    description: "Use `v-model:value` or `value` with `@value-change` for controlled state.",
    code: controlledCode,
  },
  {
    id: "horizontal-overflow",
    title: "Horizontal Overflow",
    variant: "overflow",
    description: "When segmented tabs overflow their container, flat scroll controls appear at the clipped edge. Use them, horizontal scrolling, or mouse drag to reveal off-screen tabs. Underline tabs keep native horizontal scrolling without controls.",
    code: overflowTabsCode,
  },
] as const;
