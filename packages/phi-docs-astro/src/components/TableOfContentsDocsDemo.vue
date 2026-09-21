<script setup lang="ts">
import { ref } from "vue";
import {
  TableOfContents,
  useTableOfContentsActiveId,
} from "@dicehub/phi/components/table-of-contents";

type DemoVariant =
  | "preview"
  | "interactive"
  | "scroll-tracking"
  | "no-active"
  | "group"
  | "without-title"
  | "custom-element";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const headings = [
  { text: "Introduction" },
  { text: "Installation" },
  { text: "Usage" },
  { text: "API Reference" },
  { text: "Examples" },
];

const active = ref("Introduction");
const clicked = ref<string | null>(null);
const scrollRoot = ref<HTMLElement | null>(null);
const scrollspySections = [
  { id: "scrollspy-demo-overview", title: "Overview" },
  { id: "scrollspy-demo-installation", title: "Installation" },
  { id: "scrollspy-demo-usage", title: "Usage" },
  { id: "scrollspy-demo-api", title: "API" },
];
const inactiveScrollspyId = ref<string | null>(null);
const scrollTracking = props.variant === "scroll-tracking"
  ? useTableOfContentsActiveId({
      ids: scrollspySections.map((section) => section.id),
      root: scrollRoot,
      trackHash: false,
    })
  : {
      activeId: inactiveScrollspyId,
      selectSection: (_id: string) => undefined,
    };

const scrollToSection = (id: string) => {
  scrollTracking.selectSection(id);
  scrollRoot.value?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
</script>

<template>
  <div class="table-of-contents-demo">
    <TableOfContents v-if="variant === 'interactive'">
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

    <div v-else-if="variant === 'scroll-tracking'" class="table-of-contents-demo__scrollspy">
      <TableOfContents>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Item
            v-for="section in scrollspySections"
            :key="section.id"
            as="button"
            :active="scrollTracking.activeId.value === section.id"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents>
      <div ref="scrollRoot" class="table-of-contents-demo__scroll-root" data-scrollspy-root>
        <section v-for="section in scrollspySections" :key="section.id">
          <h4 :id="section.id">{{ section.title }}</h4>
          <p>
            Scrollable content for the {{ section.title }} section demonstrates active-section tracking.
          </p>
        </section>
      </div>
    </div>

    <TableOfContents v-else-if="variant === 'no-active'">
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item v-for="heading in headings" :key="heading.text" class-name="cursor-pointer">
          {{ heading.text }}
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents>

    <div v-else-if="variant === 'group'" class="table-of-contents-demo__stack">
      <TableOfContents>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Item active class-name="cursor-pointer">Overview</TableOfContents.Item>
          <TableOfContents.Group label="Examples" href="#examples-demo" @click="clicked = 'Examples'">
            <TableOfContents.Item as="button" @click="clicked = 'Basic example'">
              Basic example
            </TableOfContents.Item>
            <TableOfContents.Item as="button">Advanced example</TableOfContents.Item>
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
      <p v-if="clicked" class="table-of-contents-demo__clicked">Clicked: {{ clicked }}</p>
    </div>

    <TableOfContents v-else-if="variant === 'without-title'">
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

    <div v-else-if="variant === 'custom-element'" class="table-of-contents-demo__stack">
      <TableOfContents>
        <TableOfContents.List>
          <TableOfContents.Item
            v-for="heading in headings.slice(0, 3)"
            :key="heading.text"
            as="button"
            :active="heading.text === 'Introduction'"
            @click="clicked = heading.text"
          >
            {{ heading.text }}
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents>
      <p v-if="clicked" class="table-of-contents-demo__clicked">Clicked: {{ clicked }}</p>
    </div>

    <TableOfContents v-else>
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
</template>

<style>
.table-of-contents-demo {
  min-width: 12rem;
}

.table-of-contents-demo .cursor-pointer {
  cursor: pointer;
}

.table-of-contents-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.table-of-contents-demo__scrollspy {
  display: grid;
  width: min(100%, 42rem);
  grid-template-columns: minmax(10rem, 12rem) minmax(0, 1fr);
  align-items: start;
  gap: 1.5rem;
}

.table-of-contents-demo__scroll-root {
  height: 16rem;
  overflow-y: auto;
  border: 1px solid var(--phi-line, #e3e6eb);
  border-radius: 0.5rem;
  padding: 1rem;
  scroll-behavior: smooth;
}

.table-of-contents-demo__scroll-root section {
  min-height: 12rem;
  scroll-margin-top: 0.5rem;
}

.table-of-contents-demo__scroll-root h4,
.table-of-contents-demo__scroll-root p {
  margin: 0;
}

.table-of-contents-demo__scroll-root p {
  margin-top: 0.5rem;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.table-of-contents-demo__clicked {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
  line-height: 1rem;
}

@media (max-width: 640px) {
  .table-of-contents-demo__scrollspy {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
