export const popoverBarrelCode = `import { Popover } from "@dicehub/phi";`;

export const popoverGranularCode = `import { Popover } from "@dicehub/phi/components/popover";`;

export const popoverPreviewCode = `<script setup lang="ts">
import { PhBell } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child>
      <Button shape="square" :icon="PhBell" aria-label="Notifications" />
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Notifications</Popover.Title>
      <Popover.Description>You are all caught up. Good job!</Popover.Description>
    </Popover.Content>
  </Popover>
</template>`;

export const popoverUsageCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child>
      <Button>Open</Button>
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Popover Title</Popover.Title>
      <Popover.Description>Popover content goes here.</Popover.Description>
    </Popover.Content>
  </Popover>
</template>`;

const basicCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child>
      <Button>Open Popover</Button>
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Popover Title</Popover.Title>
      <Popover.Description>
        This is a basic popover with a title and description.
      </Popover.Description>
    </Popover.Content>
  </Popover>
</template>`;

const withCloseCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child>
      <Button>Open Settings</Button>
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Settings</Popover.Title>
      <Popover.Description>Configure your preferences below.</Popover.Description>
      <div class="mt-3">
        <Popover.Close as-child>
          <Button variant="secondary" size="sm">Close</Button>
        </Popover.Close>
      </div>
    </Popover.Content>
  </Popover>
</template>`;

const positioningCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover, type PopoverSide } from "@dicehub/phi/components/popover";

const sides: PopoverSide[] = ["bottom", "top", "left", "right"];
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Popover v-for="side in sides" :key="side">
      <Popover.Trigger as-child>
        <Button variant="secondary">{{ side }}</Button>
      </Popover.Trigger>
      <Popover.Content :side="side">
        <Popover.Title>{{ side }}</Popover.Title>
        <Popover.Description>Popover on {{ side }}.</Popover.Description>
      </Popover.Content>
    </Popover>
  </div>
</template>`;

const customContentCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child>
      <Button>User Profile</Button>
    </Popover.Trigger>
    <Popover.Content class-name="w-64">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-full bg-recessed" />
        <div>
          <Popover.Title>Jane Doe</Popover.Title>
          <p class="text-sm text-subtle">jane@example.com</p>
        </div>
      </div>
      <div class="mt-3 flex gap-2 border-t pt-3">
        <Button variant="secondary" size="sm" class="flex-1">Profile</Button>
        <Popover.Close as-child>
          <Button variant="ghost" size="sm" class="flex-1">Sign Out</Button>
        </Popover.Close>
      </div>
    </Popover.Content>
  </Popover>
</template>`;

const openOnHoverCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Popover } from "@dicehub/phi/components/popover";
</script>

<template>
  <Popover>
    <Popover.Trigger as-child open-on-hover :delay="200">
      <Button variant="secondary">Hover Me</Button>
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Hover Triggered</Popover.Title>
      <Popover.Description>
        This popover opens on hover with a 200ms delay. It can still contain
        interactive content like buttons and links.
      </Popover.Description>
      <div class="mt-3">
        <Popover.Close as-child>
          <Button variant="secondary" size="sm">Got it</Button>
        </Popover.Close>
      </div>
    </Popover.Content>
  </Popover>
</template>`;

const virtualAnchorCode = `<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Popover, type PopoverOpenChangeDetails } from "@dicehub/phi/components/popover";

const selectedRow = ref<string | null>(null);
const selectedRowElement = shallowRef<HTMLTableRowElement | null>(null);
const anchor = computed(() => {
  const row = selectedRowElement.value;
  return row
    ? {
        contextElement: row,
        getBoundingClientRect: () => row.getBoundingClientRect(),
      }
    : undefined;
});

async function editRow(row: HTMLTableRowElement, id: string) {
  selectedRowElement.value = row;
  await nextTick();
  selectedRow.value = id;
}

function onOpenChange(details: PopoverOpenChangeDetails) {
  if (!details.open) {
    selectedRow.value = null;
    selectedRowElement.value = null;
  }
}
</script>

<template>
  <table>
    <!-- call editRow(rowElement, id) from each row action -->
  </table>
  <Popover :open="Boolean(selectedRow)" @open-change="onOpenChange">
    <Popover.Content side="left" :anchor="anchor">
      <Popover.Title>Edit {{ selectedRow }}</Popover.Title>
      <Popover.Description>
        The popover anchors to the selected row, not the icon button.
      </Popover.Description>
      <Popover.Close as-child>
        <Button variant="secondary" size="sm">Close</Button>
      </Popover.Close>
    </Popover.Content>
  </Popover>
</template>`;

export const popoverExamples = [
  {
    id: "basic-popover",
    title: "Basic Popover",
    variant: "basic",
    description: "A simple popover with a title and description.",
    code: basicCode,
  },
  {
    id: "with-close-button",
    title: "With Close Button",
    variant: "with-close",
    description: "Use Popover.Close to dismiss interactive content from inside the popover.",
    code: withCloseCode,
  },
  {
    id: "positioning",
    title: "Positioning",
    variant: "positioning",
    description: "Use the side prop to control where the popover appears relative to the trigger.",
    code: positioningCode,
  },
  {
    id: "custom-content",
    title: "Custom Content",
    variant: "custom-content",
    description: "Popovers can contain custom layouts with avatars, buttons, and other rich content.",
    code: customContentCode,
  },
  {
    id: "open-on-hover",
    title: "Open on Hover",
    variant: "open-on-hover",
    description: "Use openOnHover on the trigger and add a delay when hover-triggered content is useful.",
    code: openOnHoverCode,
  },
  {
    id: "virtual-anchor",
    title: "Virtual Anchor",
    variant: "virtual-anchor",
    description: "Use anchor on Popover.Content to position against a custom element or virtual point.",
    code: virtualAnchorCode,
  },
] as const;

export const popoverComparisonRows = [
  ["Purpose", "Short, non-interactive text labels for identification", "Rich, interactive content containers"],
  ["Content", "Plain text only", "Any content: links, buttons, forms, images"],
  ["Trigger", "Hover or focus", "Click (default) or hover"],
  ["ARIA Role", 'role="tooltip"', "aria-haspopup"],
  ["Keyboard", "Not focusable", "Focus moves inside, traps when open"],
] as const;

export const popoverApiSections = [
  {
    id: "popover-api",
    title: "Popover",
    description: "The root component that manages popover state.",
    rows: [
      { name: "v-model:open", type: "boolean", defaultValue: "-", description: "Vue controlled open state." },
      { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled usage." },
      { name: "@open-change", type: "(details: PopoverOpenChangeDetails) => void", defaultValue: "-", description: "Emitted whenever the popover opens or closes." },
      { name: "modal", type: "boolean", defaultValue: "false", description: "Disables outside interaction and traps focus while open." },
      { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Close when Escape is pressed." },
      { name: "closeOnInteractOutside", type: "boolean", defaultValue: "true", description: "Close when interacting outside the popover." },
      { name: "portalled", type: "boolean", defaultValue: "true", description: "Proxy tab order when content is portalled." },
      { name: "positioning", type: "PopoverRootProps['positioning']", defaultValue: "-", description: "Advanced Ark positioning options for the content surface." },
    ],
  },
  {
    id: "popover-trigger-api",
    title: "Popover.Trigger",
    description: "A button that opens the popover when clicked. Use as-child to render your own element.",
    rows: [
      { name: "asChild", type: "boolean", defaultValue: "false", description: "Render the slotted element as the trigger." },
      { name: "openOnHover", type: "boolean", defaultValue: "false", description: "Open the popover on hover and focus." },
      { name: "delay", type: "number", defaultValue: "0", description: "Hover/focus delay in milliseconds." },
      { name: "value", type: "string", defaultValue: "-", description: "Value for identifying the active trigger." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes." },
    ],
  },
  {
    id: "popover-content-api",
    title: "Popover.Content",
    description: "The container for popover content. Controls its side, alignment, and offset.",
    rows: [
      { name: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"bottom"', description: "Which side of the trigger the popover appears on." },
      { name: "align", type: '"start" | "center" | "end"', defaultValue: '"center"', description: "Alignment along the trigger." },
      { name: "sideOffset", type: "number", defaultValue: "8", description: "Distance between the trigger and popover in pixels." },
      { name: "alignOffset", type: "number", defaultValue: "0", description: "Additional offset along the alignment axis." },
      { name: "positionMethod", type: '"absolute" | "fixed"', defaultValue: '"absolute"', description: "CSS positioning strategy." },
      { name: "anchor", type: "HTMLElement | VirtualElement | (() => ...)", defaultValue: "-", description: "Custom element or virtual element to anchor against." },
      { name: "container", type: "string | HTMLElement", defaultValue: '"body"', description: "Teleport target for the portalled content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes for the content panel." },
    ],
  },
  {
    id: "popover-title-api",
    title: "Popover.Title",
    description: "A heading that labels the popover for accessibility.",
    rows: [
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes." },
    ],
  },
  {
    id: "popover-description-api",
    title: "Popover.Description",
    description: "A paragraph providing additional context about the popover content.",
    rows: [
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes." },
    ],
  },
  {
    id: "popover-close-api",
    title: "Popover.Close",
    description: "A button that closes the popover when clicked. Use as-child to render your own element.",
    rows: [
      { name: "asChild", type: "boolean", defaultValue: "false", description: "Render the slotted element as the close trigger." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes." },
    ],
  },
] as const;
