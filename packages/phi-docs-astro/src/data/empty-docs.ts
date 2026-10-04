export const emptyBarrelCode = `import { Empty } from "@dicehub/phi";`;

export const emptyGranularCode = `import { Empty } from "@dicehub/phi/components/empty";`;

export const emptyPreviewCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Empty } from "@dicehub/phi/components/empty";
import { PhCode, PhGlobe, PhPackage } from "@phosphor-icons/vue";
</script>

<template>
  <Empty
    :icon="PhPackage"
    title="No packages found"
    description="Get started by installing your first package."
    command-line="pnpm add @dicehub/phi@beta"
  >
    <Button :icon="PhCode">See examples</Button>
    <Button :icon="PhGlobe" variant="primary">View documentation</Button>
  </Empty>
</template>`;

export const emptyUsageCode = `<script setup>
import { Empty } from "@dicehub/phi/components/empty";
import { PhPackage } from "@phosphor-icons/vue";
</script>

<template>
  <Empty
    :icon="PhPackage"
    title="No packages found"
    description="Get started by installing your first package."
    command-line="pnpm add @dicehub/phi@beta"
  />
</template>`;

const basicCode = `<script setup>
import { Empty } from "@dicehub/phi/components/empty";
</script>

<template>
  <Empty
    title="No results found"
    description="Try adjusting your search or filter to find what you're looking for."
  />
</template>`;

const sizesCode = `<script setup>
import { Empty } from "@dicehub/phi/components/empty";
import { PhDatabase } from "@phosphor-icons/vue";
</script>

<template>
  <Empty
    size="sm"
    :icon="PhDatabase"
    title="No data available"
    description="There is no data to display."
  />
  <Empty
    size="base"
    :icon="PhDatabase"
    title="No data available"
    description="There is no data to display."
  />
  <Empty
    size="lg"
    :icon="PhDatabase"
    title="No data available"
    description="There is no data to display."
  />
</template>`;

const commandCode = `<script setup>
import { Empty } from "@dicehub/phi/components/empty";
import { PhFolderOpen } from "@phosphor-icons/vue";
</script>

<template>
  <Empty
    :icon="PhFolderOpen"
    title="No projects found"
    description="Get started by creating your first project using the command below."
    command-line="pnpm create phi-project"
  />
</template>`;

const actionsCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Empty } from "@dicehub/phi/components/empty";
import { PhCloudSlash } from "@phosphor-icons/vue";
</script>

<template>
  <Empty
    :icon="PhCloudSlash"
    title="No connection"
    description="Unable to connect to the server. Please check your connection and try again."
  >
    <Button variant="primary">Retry</Button>
    <Button variant="secondary">Go Back</Button>
  </Empty>
</template>`;

const minimalCode = `<script setup>
import { Empty } from "@dicehub/phi/components/empty";
</script>

<template>
  <Empty title="Nothing here" />
</template>`;

export const emptyExamples = [
  { id: "basic", title: "Basic", variant: "basic", code: basicCode },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Empty states come in three sizes to fit different container contexts.",
    code: sizesCode,
  },
  {
    id: "with-command-line",
    title: "With Command Line",
    variant: "command",
    description: "Include a copyable command to help users get started.",
    code: commandCode,
  },
  {
    id: "with-actions",
    title: "With Actions",
    variant: "actions",
    description: "Add custom action buttons using the default slot.",
    code: actionsCode,
  },
  {
    id: "minimal",
    title: "Minimal",
    variant: "minimal",
    description: "At minimum, only a title is required.",
    code: minimalCode,
  },
] as const;

export const emptyProps = [
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Size of the empty state container." },
  { name: "icon", type: "Component", defaultValue: "-", description: "Decorative Vue icon component displayed above the title." },
  { name: "iconProps", type: "Record<string, unknown>", defaultValue: "{}", description: "Props forwarded to the icon component." },
  { name: "title", type: "string", defaultValue: "-", description: "Required primary heading text for the empty state." },
  { name: "description", type: "string", defaultValue: "-", description: "Secondary description text displayed below the title." },
  { name: "commandLine", type: "string", defaultValue: "-", description: "Shell command displayed in a copyable command block." },
  { name: "labels", type: "{ copyCommand?: string; copiedCommand?: string }", defaultValue: "{}", description: "Accessible labels and copied feedback for the command copy button." },
  { name: "@copy-command", type: "(details: { command: string }) => void", defaultValue: "-", description: "Emitted after the command is copied." },
  { name: "#icon", type: "slot", defaultValue: "-", description: "Custom icon slot. Overrides the icon prop." },
  { name: "default slot", type: "slot", defaultValue: "-", description: "Additional action content rendered below the description or command." },
] as const;
