<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Collapsible } from "@dicehub/phi/components/collapsible";

type DemoVariant = "hero" | "basic" | "multiple" | "custom-trigger" | "keep-mounted" | "accordion";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const heroOpen = ref(true);
const basicOpen = ref(false);
const firstOpen = ref(false);
const secondOpen = ref(false);
const thirdOpen = ref(false);
const customOpen = ref(false);
const keepMountedOpen = ref(true);
const keptName = ref("");
const activeIndex = ref(0);

const items = [
  {
    title: "What is Phi?",
    content: "Phi is a Vue component library built on accessible primitives.",
  },
  {
    title: "How do I install it?",
    content: "Install the package and import the components you need.",
  },
  {
    title: "Is it accessible?",
    content: "Yes. Phi components keep keyboard and screen reader behavior in the primitive layer.",
  },
];

const setAccordionItem = (index: number, open: boolean) => {
  activeIndex.value = open ? index : -1;
};
</script>

<template>
  <div class="collapsible-demo" :class="`collapsible-demo--${variant}`">
    <Collapsible v-if="variant === 'hero'" v-model:open="heroOpen">
      <Collapsible.DefaultTrigger>What is Phi?</Collapsible.DefaultTrigger>
      <Collapsible.DefaultPanel>
        <p>Phi is a Vue component library.</p>
      </Collapsible.DefaultPanel>
    </Collapsible>

    <Collapsible v-else-if="variant === 'basic'" v-model:open="basicOpen">
      <Collapsible.DefaultTrigger>What is Phi?</Collapsible.DefaultTrigger>
      <Collapsible.DefaultPanel>
        <p>Phi is a Vue component library.</p>
      </Collapsible.DefaultPanel>
    </Collapsible>

    <div v-else-if="variant === 'multiple'" class="collapsible-demo__stack">
      <Collapsible v-model:open="firstOpen">
        <Collapsible.DefaultTrigger>What is Phi?</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <p>Phi is a Vue component library.</p>
        </Collapsible.DefaultPanel>
      </Collapsible>
      <Collapsible v-model:open="secondOpen">
        <Collapsible.DefaultTrigger>How do I use it?</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <p>Install the components and import them into your project.</p>
        </Collapsible.DefaultPanel>
      </Collapsible>
      <Collapsible v-model:open="thirdOpen">
        <Collapsible.DefaultTrigger>Is it open source?</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <p>Check the repository for license information.</p>
        </Collapsible.DefaultPanel>
      </Collapsible>
    </div>

    <Collapsible v-else-if="variant === 'custom-trigger'" v-model:open="customOpen">
      <Collapsible.Trigger as-child>
        <Button variant="secondary" size="sm">
          {{ customOpen ? "Hide details" : "Show details" }}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Panel class="collapsible-demo__custom-panel">
        <p>This panel uses custom styling instead of the default border-left accent.</p>
      </Collapsible.Panel>
    </Collapsible>

    <Collapsible v-else-if="variant === 'keep-mounted'" v-model:open="keepMountedOpen">
      <Collapsible.DefaultTrigger>Edit details</Collapsible.DefaultTrigger>
      <Collapsible.DefaultPanel>
        <p>
          Type something below, then collapse and re-open. Your input is preserved because panels
          stay mounted by default.
        </p>
        <label class="collapsible-demo__field">
          <span>Name</span>
          <input v-model="keptName" placeholder="Type here..." />
        </label>
      </Collapsible.DefaultPanel>
    </Collapsible>

    <div v-else class="collapsible-demo__stack">
      <Collapsible
        v-for="(item, index) in items"
        :key="item.title"
        :open="activeIndex === index"
        @open-change="(details) => setAccordionItem(index, details.open)"
      >
        <Collapsible.DefaultTrigger>{{ item.title }}</Collapsible.DefaultTrigger>
        <Collapsible.DefaultPanel>
          <p>{{ item.content }}</p>
        </Collapsible.DefaultPanel>
      </Collapsible>
    </div>
  </div>
</template>

<style scoped>
.collapsible-demo {
  width: 100%;
}

.collapsible-demo__stack {
  display: grid;
  width: 100%;
  gap: 0.5rem;
}

.collapsible-demo__custom-panel {
  margin-top: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--phi-tint);
  color: var(--phi-default);
  font-size: 0.875rem;
  line-height: 1.5;
}

.collapsible-demo__field {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding-bottom: 0.25rem;
  color: var(--phi-default);
  font-size: 0.875rem;
  font-weight: 500;
}

.collapsible-demo__field input {
  width: min(100%, 18rem);
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid var(--phi-line);
  border-radius: 0.5rem;
  background: var(--phi-control);
  color: var(--phi-default);
  font: inherit;
  font-weight: 400;
  line-height: 1.25rem;
}

.collapsible-demo__field input:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px var(--phi-focus, rgba(76, 99, 255, 0.75)),
    0 0 0 4px var(--phi-focus-soft, rgba(76, 99, 255, 0.16));
}

.collapsible-demo p {
  margin: 0;
}
</style>
