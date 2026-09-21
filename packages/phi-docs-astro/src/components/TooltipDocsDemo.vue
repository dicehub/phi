<script setup lang="ts">
import { PhInfo, PhPlus, PhTranslate } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Tooltip, TooltipProvider } from "@dicehub/phi/components/tooltip";
import { Text } from "@dicehub/phi/components/text";

type DemoVariant = "preview" | "basic" | "multiple" | "overflow" | "delay" | "custom-trigger";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const longContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
</script>

<template>
  <TooltipProvider>
    <div class="tooltip-demo">
      <Tooltip
        v-if="props.variant === 'preview'"
        as-child
        content="Add new item"
      >
        <Button shape="square" :icon="PhPlus" aria-label="Add new item" />
      </Tooltip>

      <Tooltip
        v-else-if="props.variant === 'basic'"
        as-child
        content="Add"
      >
        <Button shape="square" :icon="PhPlus" aria-label="Add" />
      </Tooltip>

      <div v-else-if="props.variant === 'multiple'" class="tooltip-demo__row">
        <Tooltip as-child content="Add">
          <Button shape="square" :icon="PhPlus" aria-label="Add" />
        </Tooltip>
        <Tooltip as-child content="Change language">
          <Button shape="square" :icon="PhTranslate" aria-label="Change language" />
        </Tooltip>
      </div>

      <div v-else-if="props.variant === 'overflow'" class="tooltip-demo__overflow">
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

      <div v-else-if="props.variant === 'delay'" class="tooltip-demo__row tooltip-demo__row--wrap">
        <Tooltip as-child content="Opens after 1 second" :delay="1000">
          <Button variant="secondary">1s open delay</Button>
        </Tooltip>
        <Tooltip as-child content="Stays open 500ms after leaving" :close-delay="500">
          <Button variant="secondary">500ms close delay</Button>
        </Tooltip>
        <Tooltip as-child content="Instant open, stays 1s" :delay="0" :close-delay="1000">
          <Button variant="secondary">Instant + 1s close</Button>
        </Tooltip>
      </div>

      <div v-else class="tooltip-demo__row">
        <Tooltip
          content="Click to learn more"
          class-name="tooltip-demo__custom-trigger"
        >
          <PhInfo aria-hidden="true" />
          <span>Help</span>
        </Tooltip>
        <div class="tooltip-demo__text-parent">
          <Tooltip content="Project environments and deployment settings">
            <Text truncate class="tooltip-demo__nested-text">Project environments and deployment settings</Text>
          </Tooltip>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>

<style scoped>
.tooltip-demo {
  display: flex;
  width: 100%;
  min-height: 4.5rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.tooltip-demo__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.tooltip-demo__row--wrap {
  flex-wrap: wrap;
}

.tooltip-demo__text-parent {
  line-height: 1.75rem;
}

.tooltip-demo__nested-text {
  max-width: 8rem;
}

.tooltip-demo__overflow {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

:global(.tooltip-demo__custom-trigger) {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: var(--phi-accent);
  color: var(--phi-accent-contrast);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  box-shadow: 0 10px 20px -12px var(--phi-focus);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
}

:global(.tooltip-demo__custom-trigger:hover) {
  transform: translateY(-1px);
}

:global(.tooltip-demo__custom-trigger svg) {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 42rem) {
  .tooltip-demo__overflow {
    flex-direction: column;
  }
}
</style>
