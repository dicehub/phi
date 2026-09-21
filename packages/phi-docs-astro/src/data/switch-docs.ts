export const switchBarrelCode = `import { Switch } from "@dicehub/phi";`;

export const switchGranularCode = `import { Switch } from "@dicehub/phi/components/switch";`;

export const switchPreviewCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/phi/components/switch";

const checked = ref(false);
</script>

<template>
  <Switch v-model:checked="checked" label="Switch" />
</template>`;

export const switchUsageCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/phi/components/switch";

const checked = ref(false);
</script>

<template>
  <Switch v-model:checked="checked" label="Switch" />
</template>`;

const switchOffCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch label="Switch" :checked="false" />
</template>`;

const switchOnCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch label="Switch" :checked="true" />
</template>`;

const switchDisabledCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch label="Disabled" :checked="false" disabled />
</template>`;

const switchVariantsCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <div class="switch-demo-grid">
    <Switch label="Default off" :checked="false" />
    <Switch label="Default on" :checked="true" />
    <Switch label="Neutral off" variant="neutral" :checked="false" />
    <Switch label="Neutral on" variant="neutral" :checked="true" />
  </div>
</template>`;

const switchNeutralCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/phi/components/switch";

const checked = ref(false);
</script>

<template>
  <Switch v-model:checked="checked" label="Neutral switch" variant="neutral" />
</template>`;

const switchNeutralStatesCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <div class="switch-demo-stack">
    <Switch label="Neutral off" variant="neutral" :checked="false" />
    <Switch label="Neutral on" variant="neutral" :checked="true" />
    <Switch label="Neutral disabled" variant="neutral" :checked="false" disabled />
  </div>
</template>`;

const switchSizesCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <div class="switch-demo-stack">
    <Switch label="Small" size="sm" :checked="true" />
    <Switch label="Base (default)" size="base" :checked="true" />
    <Switch label="Large" size="lg" :checked="true" />
  </div>
</template>`;

const switchCustomIdCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/phi/components/switch";

const checked = ref(false);
</script>

<template>
  <Switch id="my-custom-switch" v-model:checked="checked" label="Custom ID" />
</template>`;

const switchGroupCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch.Group legend="Notification settings">
    <Switch.Item label="Email notifications" />
    <Switch.Item label="SMS notifications" />
    <Switch.Item label="Push notifications" />
  </Switch.Group>
</template>`;

const switchLegendSrOnlyCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch.Group>
    <Switch.Legend class-name="phi-sr-only">Notification settings</Switch.Legend>
    <Switch.Item label="Email notifications" />
    <Switch.Item label="SMS notifications" />
    <Switch.Item label="Push notifications" />
  </Switch.Group>
</template>`;

const switchLegendCustomCode = `<script setup>
import { Switch } from "@dicehub/phi/components/switch";
</script>

<template>
  <Switch.Group>
    <Switch.Legend class-name="switch-demo-legend-subtle">
      Notification settings
    </Switch.Legend>
    <Switch.Item label="Email notifications" />
    <Switch.Item label="SMS notifications" />
    <Switch.Item label="Push notifications" />
  </Switch.Group>
</template>`;

export const switchExamples = [
  { id: "off-state", title: "Off State", variant: "off", description: "Switch in the off state.", code: switchOffCode },
  { id: "on-state", title: "On State", variant: "on", description: "Switch in the on state.", code: switchOnCode },
  { id: "disabled", title: "Disabled", variant: "disabled", description: "Disabled switches cannot be toggled.", code: switchDisabledCode },
  {
    id: "variants",
    title: "Variants",
    variant: "variants",
    description: "The Switch supports two variants: `default` (blue when on) and `neutral` (monochrome). Both use a squircle shape.",
    code: switchVariantsCode,
  },
  {
    id: "neutral-variant",
    title: "Neutral Variant",
    variant: "neutral",
    description: "The neutral variant uses monochrome colors and a squircle shape, ideal for subtle, less prominent toggles.",
    code: switchNeutralCode,
  },
  {
    id: "neutral-states",
    title: "Neutral States",
    variant: "neutral-states",
    description: "Neutral variant in different states.",
    code: switchNeutralStatesCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Three sizes available: `sm`, `base` (default), and `lg`.",
    code: switchSizesCode,
  },
  {
    id: "custom-id",
    title: "Custom ID",
    variant: "custom-id",
    description: "When a custom `id` is provided, clicking the label still toggles the switch.",
    code: switchCustomIdCode,
  },
  {
    id: "switch-group",
    title: "Switch Group",
    variant: "group",
    description: "Group related switches with `Switch.Group`. Provides a shared legend, description, and error message for the group.",
    code: switchGroupCode,
  },
  {
    id: "visually-hidden-legend",
    title: "Visually Hidden Legend",
    variant: "legend-sr-only",
    description: "Use `Switch.Legend` with `class-name=\"phi-sr-only\"` to keep the legend accessible while hiding it visually.",
    code: switchLegendSrOnlyCode,
  },
  {
    id: "custom-legend-styling",
    title: "Custom Legend Styling",
    variant: "legend-custom",
    description: "`Switch.Legend` accepts `className` for full control over legend presentation.",
    code: switchLegendCustomCode,
  },
] as const;
