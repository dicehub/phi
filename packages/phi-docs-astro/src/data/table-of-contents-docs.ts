export const tableOfContentsBarrelCode = `import { TableOfContents } from "@dicehub/phi";`;

export const tableOfContentsGranularCode = `import {
  TableOfContents,
  useTableOfContentsActiveId,
} from "@dicehub/phi/components/table-of-contents";`;

const headingsCode = `const headings = [
  { text: "Introduction" },
  { text: "Installation" },
  { text: "Usage" },
  { text: "API Reference" },
  { text: "Examples" },
];`;

export const tableOfContentsPreviewCode = `<script setup>
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";

${headingsCode}
</script>

<template>
  <div class="min-w-48">
    <TableOfContents>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item
          v-for="heading in headings"
          :key="heading.text"
          :active="heading.text === 'Usage'"
          class-name="cursor-pointer"
        >
          {{ heading.text }}
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>
  </div>
</template>`;

export const tableOfContentsUsageCode = `<script setup>
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";
</script>

<template>
  <TableOfContents>
    <TableOfContents.Title>On this page</TableOfContents.Title>
    <TableOfContents.List>
      <TableOfContents.Item href="#intro" active>
        Introduction
      </TableOfContents.Item>
      <TableOfContents.Item href="#api">API Reference</TableOfContents.Item>
    </TableOfContents.List>
  </TableOfContents>
</template>`;

const interactiveCode = `<script setup>
import { ref } from "vue";
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";

${headingsCode}

const active = ref("Introduction");
</script>

<template>
  <div class="min-w-48">
    <TableOfContents>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item
          v-for="heading in headings"
          :key="heading.text"
          :active="heading.text === active"
          class-name="cursor-pointer"
          @click="active = heading.text"
        >
          {{ heading.text }}
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>
  </div>
</template>`;

const noActiveCode = `<script setup>
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";

${headingsCode}
</script>

<template>
  <div class="min-w-48">
    <TableOfContents>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item
          v-for="heading in headings"
          :key="heading.text"
          class-name="cursor-pointer"
        >
          {{ heading.text }}
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>
  </div>
</template>`;

const scrollTrackingCode = `<script setup>
import { ref } from "vue";
import {
  TableOfContents,
  useTableOfContentsActiveId,
} from "@dicehub/phi/components/table-of-contents";

const root = ref(null);
const sections = [
  { id: "overview", title: "Overview" },
  { id: "installation", title: "Installation" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
];
const { activeId, selectSection } = useTableOfContentsActiveId({
  ids: sections.map((section) => section.id),
  root,
  trackHash: false,
});

function goToSection(id) {
  selectSection(id);
  root.value?.querySelector(\`#\${id}\`)?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <TableOfContents>
    <TableOfContents.List>
      <TableOfContents.Item
        v-for="section in sections"
        :key="section.id"
        as="button"
        :active="activeId === section.id"
        @click="goToSection(section.id)"
      >
        {{ section.title }}
      </TableOfContents.Item>
    </TableOfContents.List>
  </TableOfContents>
  <div ref="root" class="h-64 overflow-y-auto">
    <section v-for="section in sections" :id="section.id" :key="section.id">
      {{ section.title }}
    </section>
  </div>
</template>`;

const groupCode = `<script setup>
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";
</script>

<template>
  <div class="min-w-48">
    <TableOfContents>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item active class-name="cursor-pointer">
          Overview
        </TableOfContents.Item>
        <TableOfContents.Group label="Examples" href="#examples-demo">
          <TableOfContents.Item class-name="cursor-pointer">Basic example</TableOfContents.Item>
          <TableOfContents.Item class-name="cursor-pointer">Advanced example</TableOfContents.Item>
        </TableOfContents.Group>
        <TableOfContents.Group label="Getting Started">
          <TableOfContents.Item class-name="cursor-pointer">Installation</TableOfContents.Item>
          <TableOfContents.Item class-name="cursor-pointer">Configuration</TableOfContents.Item>
        </TableOfContents.Group>
        <TableOfContents.Group label="API" href="#api-demo">
          <TableOfContents.Item class-name="cursor-pointer">Props</TableOfContents.Item>
          <TableOfContents.Item class-name="cursor-pointer">Events</TableOfContents.Item>
        </TableOfContents.Group>
      </TableOfContents.List>
    </TableOfContents>
  </div>
</template>`;

const withoutTitleCode = `<script setup>
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";

${headingsCode}
</script>

<template>
  <div class="min-w-48">
    <TableOfContents>
      <TableOfContents.List>
        <TableOfContents.Item
          v-for="heading in headings.slice(0, 3)"
          :key="heading.text"
          :active="heading.text === 'Introduction'"
          class-name="cursor-pointer"
        >
          {{ heading.text }}
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>
  </div>
</template>`;

const customElementCode = `<script setup>
import { ref } from "vue";
import { TableOfContents } from "@dicehub/phi/components/table-of-contents";

const clicked = ref(null);
</script>

<template>
  <div class="min-w-48 space-y-3">
    <TableOfContents>
      <TableOfContents.List>
        <TableOfContents.Item
          as="button"
          active
          @click="clicked = 'Introduction'"
        >
          Introduction
        </TableOfContents.Item>
        <TableOfContents.Item
          as="button"
          @click="clicked = 'Installation'"
        >
          Installation
        </TableOfContents.Item>
        <TableOfContents.Item
          as="button"
          @click="clicked = 'Usage'"
        >
          Usage
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>
    <p v-if="clicked" class="text-xs" style="color: var(--phi-muted)">Clicked: {{ clicked }}</p>
  </div>
</template>`;

export const tableOfContentsCustomElementSnippets = [
  {
    id: "vue-router",
    title: "Vue Router",
    code: `<template>
  <TableOfContents.Item :as="RouterLink" to="/intro" active>
    Introduction
  </TableOfContents.Item>
</template>`,
  },
  {
    id: "nuxt-link",
    title: "Nuxt",
    code: `<template>
  <TableOfContents.Item as="NuxtLink" to="/intro" active>
    Introduction
  </TableOfContents.Item>
</template>`,
  },
  {
    id: "button-no-navigation",
    title: "Button (no navigation)",
    code: `<template>
  <TableOfContents.Item as="button" @click="handleClick">
    Introduction
  </TableOfContents.Item>
</template>`,
  },
] as const;

export const tableOfContentsExamples = [
  {
    id: "interactive",
    title: "Interactive",
    variant: "interactive",
    description: "Click an item to set it as active. The consumer controls state via `active` and `@click`.",
    code: interactiveCode,
  },
  {
    id: "no-active-item",
    title: "No active item",
    variant: "no-active",
    description: "When no item has `active` set, all items show the default subtle text style with a hover indicator.",
    code: noActiveCode,
  },
  {
    id: "scroll-tracking",
    title: "Scroll tracking",
    variant: "scroll-tracking",
    description:
      "Pair the component with `useTableOfContentsActiveId` to track the viewport or a custom scroll root, handle hash navigation, and pin clicked sections until scrolling settles.",
    code: scrollTrackingCode,
  },
  {
    id: "groups",
    title: "Groups",
    variant: "group",
    description:
      "Use `TableOfContents.Group` to organize items into labeled sections with indented children. Pass `href` to make the group label a clickable link, or omit it for a plain non-interactive title.",
    code: groupCode,
  },
  {
    id: "without-title",
    title: "Without title",
    variant: "without-title",
    description: "The title sub-component is optional; use `TableOfContents.List` directly if you don't need a heading.",
    code: withoutTitleCode,
  },
  {
    id: "custom-element",
    title: "Custom element",
    variant: "custom-element",
    description: "Use `as` to swap the default anchor for a button, router link, or any element.",
    code: customElementCode,
  },
] as const;

export const tableOfContentsApiSections = [
  {
    id: "table-of-contents",
    title: "TableOfContents",
    description: "Root nav container with a default `aria-label` of `Table of contents`.",
    rows: [
      { name: "ariaLabel", type: "string", defaultValue: '"Table of contents"', description: "Vue prop alias for the root `aria-label`." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "`TableOfContents.Title` and `TableOfContents.List` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the root `nav`." },
      { name: "$attrs", type: "HTMLAttributes<HTMLElement>", defaultValue: "-", description: "Native nav attributes. `aria-label` is supported." },
    ],
  },
  {
    id: "table-of-contents-title",
    title: "TableOfContents.Title",
    description: "Optional uppercase heading displayed above the list. Renders a `p`.",
    rows: [
      { name: "default slot", type: "slot", defaultValue: "-", description: "Title content." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `p`." },
      { name: "$attrs", type: "HTMLAttributes<HTMLParagraphElement>", defaultValue: "-", description: "Native paragraph attributes." },
    ],
  },
  {
    id: "table-of-contents-list",
    title: "TableOfContents.List",
    description: "List container with a left border rail.",
    rows: [
      { name: "default slot", type: "slot", defaultValue: "-", description: "`TableOfContents.Item` and `TableOfContents.Group` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the `ul`." },
      { name: "$attrs", type: "HTMLAttributes<HTMLUListElement>", defaultValue: "-", description: "Native list attributes." },
    ],
  },
  {
    id: "table-of-contents-item",
    title: "TableOfContents.Item",
    description: "Individual navigation item. Set `active` for the current section and `as` to customize the rendered element.",
    rows: [
      { name: "active", type: "boolean", defaultValue: "false", description: "Marks the item as current and sets `aria-current=\"true\"`." },
      { name: "as", type: "string | Component", defaultValue: '"a"', description: "Element or component to render as the item control." },
      { name: "href", type: "string", defaultValue: "-", description: "Anchor URL when rendering the default anchor." },
      { name: "target", type: "string", defaultValue: "-", description: "Anchor target." },
      { name: "rel", type: "string", defaultValue: "-", description: "Anchor rel attribute." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "Item label." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the rendered item control." },
      { name: "$attrs", type: "AnchorHTMLAttributes | ButtonHTMLAttributes", defaultValue: "-", description: "Native attributes and listeners for the rendered item control." },
    ],
  },
  {
    id: "table-of-contents-group",
    title: "TableOfContents.Group",
    description: "Groups items under a labeled section with indented children. Pass `href` to make the label a clickable link, or omit it for a plain title.",
    rows: [
      { name: "label", type: "string", defaultValue: "-", description: "Label displayed above the group's items." },
      { name: "href", type: "string", defaultValue: "-", description: "URL for a clickable group label." },
      { name: "active", type: "boolean", defaultValue: "false", description: "Marks a clickable group label as current and sets `aria-current=\"true\"`." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "`TableOfContents.Item` children." },
      { name: "className", type: "string", defaultValue: "-", description: "Additional CSS classes applied to the group `li`." },
      { name: "$attrs", type: "HTMLAttributes<HTMLLIElement>", defaultValue: "-", description: "Native list item attributes. Click listeners target the label link when `href` is set." },
    ],
  },
  {
    id: "use-table-of-contents-active-id",
    title: "useTableOfContentsActiveId",
    description: "SSR-safe active-section tracking for `TableOfContents`. Options accept plain values, refs, or getters.",
    rows: [
      { name: "ids", type: "MaybeRefOrGetter<readonly string[]>", defaultValue: "-", description: "Section anchor ids in document order." },
      { name: "offset", type: "MaybeRefOrGetter<number>", defaultValue: "0", description: "Activation-line offset from the top of the viewport or root." },
      { name: "root", type: "MaybeRefOrGetter<Element | null>", defaultValue: "null", description: "Custom scroll container. Defaults to the viewport." },
      { name: "trackHash", type: "MaybeRefOrGetter<boolean>", defaultValue: "true", description: "Selects matching location hashes on mount and hash changes." },
      { name: "activeId", type: "Readonly<Ref<string | null>>", defaultValue: "null", description: "Currently active section id." },
      { name: "selectSection", type: "(id: string) => void", defaultValue: "-", description: "Pins a selected section until scrolling settles." },
    ],
  },
] as const;
