<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@dicehub/phi/components/switch";

type DemoVariant =
  | "preview"
  | "off"
  | "on"
  | "disabled"
  | "variants"
  | "neutral"
  | "neutral-states"
  | "sizes"
  | "custom-id"
  | "group"
  | "legend-sr-only"
  | "legend-custom";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const checked = ref(false);
const neutralChecked = ref(false);
const customIdChecked = ref(false);
</script>

<template>
  <div class="switch-demo">
    <Switch v-if="variant === 'off'" label="Switch" :checked="false" />
    <Switch v-else-if="variant === 'on'" label="Switch" :checked="true" />
    <Switch v-else-if="variant === 'disabled'" label="Disabled" :checked="false" disabled />

    <div v-else-if="variant === 'variants'" class="switch-demo__grid">
      <Switch label="Default off" :checked="false" />
      <Switch label="Default on" :checked="true" />
      <Switch label="Neutral off" variant="neutral" :checked="false" />
      <Switch label="Neutral on" variant="neutral" :checked="true" />
    </div>

    <Switch
      v-else-if="variant === 'neutral'"
      v-model:checked="neutralChecked"
      label="Neutral switch"
      variant="neutral"
    />

    <div v-else-if="variant === 'neutral-states'" class="switch-demo__stack">
      <Switch label="Neutral off" variant="neutral" :checked="false" />
      <Switch label="Neutral on" variant="neutral" :checked="true" />
      <Switch label="Neutral disabled" variant="neutral" :checked="false" disabled />
    </div>

    <div v-else-if="variant === 'sizes'" class="switch-demo__stack">
      <Switch label="Small" size="sm" :checked="true" />
      <Switch label="Base (default)" size="base" :checked="true" />
      <Switch label="Large" size="lg" :checked="true" />
    </div>

    <Switch
      v-else-if="variant === 'custom-id'"
      id="my-custom-switch"
      v-model:checked="customIdChecked"
      label="Custom ID"
    />

    <Switch.Group v-else-if="variant === 'group'" legend="Notification settings">
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>

    <Switch.Group v-else-if="variant === 'legend-sr-only'">
      <Switch.Legend class-name="phi-sr-only">Notification settings</Switch.Legend>
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>

    <Switch.Group v-else-if="variant === 'legend-custom'">
      <Switch.Legend class-name="switch-demo__legend-subtle">Notification settings</Switch.Legend>
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>

    <Switch v-else v-model:checked="checked" label="Switch" />
  </div>
</template>

<style>
.switch-demo {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.switch-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 1rem 2rem;
}

.switch-demo__stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.switch-demo__legend-subtle {
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
}
</style>
