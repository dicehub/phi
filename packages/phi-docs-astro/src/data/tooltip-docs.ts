export const tooltipBarrelCode = `import { Tooltip, TooltipProvider } from "@dicehub/phi";`;

export const tooltipGranularCode = `import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";`;

export const tooltipPreviewCode = `<script setup lang="ts">
import { PhPlus } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <TooltipProvider>
    <Tooltip as-child content="Add new item">
      <Button shape="square" :icon="PhPlus" aria-label="Add new item" />
    </Tooltip>
  </TooltipProvider>
</template>`;

export const tooltipUsageCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Tooltip } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <Tooltip as-child content="Tooltip text">
    <Button>Hover me</Button>
  </Tooltip>
</template>`;

const basicCode = `<script setup lang="ts">
import { PhPlus } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <TooltipProvider>
    <Tooltip as-child content="Add">
      <Button shape="square" :icon="PhPlus" aria-label="Add" />
    </Tooltip>
  </TooltipProvider>
</template>`;

const multipleCode = `<script setup lang="ts">
import { PhPlus, PhTranslate } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <TooltipProvider>
    <div class="flex gap-2">
      <Tooltip as-child content="Add">
        <Button shape="square" :icon="PhPlus" aria-label="Add" />
      </Tooltip>
      <Tooltip as-child content="Change language">
        <Button shape="square" :icon="PhTranslate" aria-label="Change language" />
      </Tooltip>
    </div>
  </TooltipProvider>
</template>`;

const overflowCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";

const longContent = "Long tooltip text that wraps within the available viewport width.";
</script>

<template>
  <TooltipProvider>
    <div class="flex w-full justify-between gap-3">
      <Tooltip as-child :content="longContent" side="bottom">
        <Button variant="secondary">Near left edge</Button>
      </Tooltip>
      <Tooltip as-child :content="longContent" side="bottom">
        <Button variant="secondary">Centered</Button>
      </Tooltip>
      <Tooltip as-child :content="longContent" side="bottom">
        <Button variant="secondary">Near right edge</Button>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>`;

const delayCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-wrap gap-4">
      <Tooltip as-child content="Opens after 1 second" :delay="1000">
        <Button variant="secondary">1s open delay</Button>
      </Tooltip>
      <Tooltip as-child content="Stays open 500ms after leaving" :close-delay="500">
        <Button variant="secondary">500ms close delay</Button>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>`;

const customTriggerCode = `<script setup lang="ts">
import { PhInfo } from "@phosphor-icons/vue";
import { Text } from "@dicehub/phi/components/text";
import { Tooltip } from "@dicehub/phi/components/tooltip";
</script>

<template>
  <Tooltip content="Click to learn more" class-name="help-trigger">
    <PhInfo aria-hidden="true" />
    <span>Help</span>
  </Tooltip>
  <div style="line-height: 1.75rem">
    <Tooltip content="Project environments and deployment settings">
      <Text truncate style="max-width: 8rem">Project environments and deployment settings</Text>
    </Tooltip>
  </div>
</template>`;

export const tooltipExamples = [
  {
    id: "basic-tooltip",
    title: "Basic Tooltip",
    variant: "basic",
    description: "A concise tooltip for labeling an icon-only control.",
    code: basicCode,
  },
  {
    id: "multiple-tooltips",
    title: "Multiple Tooltips",
    variant: "multiple",
    description: "Wrap nearby tooltips in TooltipProvider to group open delay behavior.",
    code: multipleCode,
  },
  {
    id: "long-content-overflow",
    title: "Long Content / Overflow",
    variant: "overflow",
    description: "Long tooltip content wraps within the available viewport width.",
    code: overflowCode,
  },
  {
    id: "delay-control",
    title: "Delay Control",
    variant: "delay",
    description: "Use delay and closeDelay to tune hover and focus timing.",
    code: delayCode,
  },
  {
    id: "custom-trigger",
    title: "Custom Trigger",
    variant: "custom-trigger",
    description: "Without asChild, Tooltip renders an internal trigger button and applies className to it. The trigger inherits line height so nested Text retains its normal height.",
    code: customTriggerCode,
  },
] as const;

export const tooltipApiSections = [
  {
    id: "tooltip-api",
    title: "Tooltip",
    description: "The root convenience component. It renders the trigger and tooltip content.",
    rows: [
      { name: "content", type: "string | number | null", defaultValue: "-", description: "Text shown inside the tooltip. Use the content slot for custom content." },
      { name: "asChild", type: "boolean", defaultValue: "false", description: "Render the slotted element as the trigger. In templates, use as-child." },
      { name: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"', description: "Preferred side of the trigger." },
      { name: "align", type: '"start" | "center" | "end"', defaultValue: '"center"', description: "Alignment along the trigger." },
      { name: "delay", type: "number", defaultValue: "600", description: "How long to wait before opening, in milliseconds." },
      { name: "closeDelay", type: "number", defaultValue: "0", description: "How long to wait before closing, in milliseconds." },
      { name: "container", type: "string | HTMLElement", defaultValue: '"body"', description: "Teleport target for the portalled content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional classes for the trigger." },
      { name: "contentClassName", type: "string", defaultValue: "-", description: "Additional classes for the tooltip popup." },
      { name: "v-model:open", type: "boolean", defaultValue: "-", description: "Vue controlled open state." },
      { name: "@open-change", type: "(details: TooltipOpenChangeDetails) => void", defaultValue: "-", description: "Emitted whenever the tooltip opens or closes." },
      { name: "positioning", type: "TooltipRootProps['positioning']", defaultValue: "-", description: "Advanced Ark positioning options." },
    ],
  },
  {
    id: "tooltip-provider-api",
    title: "TooltipProvider",
    description: "Groups nearby tooltips so switching between them can skip the open delay.",
    rows: [
      { name: "delay", type: "number", defaultValue: "600", description: "Default open delay for tooltips inside the provider." },
      { name: "closeDelay", type: "number", defaultValue: "0", description: "Default close delay for tooltips inside the provider." },
      { name: "timeout", type: "number", defaultValue: "400", description: "Grace period during which a just-closed tooltip causes the next tooltip to open instantly." },
    ],
  },
] as const;
