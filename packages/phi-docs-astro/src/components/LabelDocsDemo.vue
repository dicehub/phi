<script setup lang="ts">
import { Select, createListCollection as createSelectCollection } from "@ark-ui/vue/select";
import { Checkbox } from "@dicehub/phi/components/checkbox";
import { Input } from "@dicehub/phi/components/input";
import { Label } from "@dicehub/phi/components/label";
import { PhCaretUpDown, PhCheck } from "@phosphor-icons/vue";

type DemoVariant = "preview" | "optional" | "tooltip" | "rich" | "mixed" | "standalone";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const countryItems = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
];

const countryCollection = createSelectCollection({
  items: countryItems,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="label-demo" :class="`label-demo--${variant}`">
    <div v-if="variant === 'preview'" class="label-demo__stack">
      <Label>Default Label</Label>
      <Label show-optional>Optional Label</Label>
      <Label tooltip="More information about this field">Label with Tooltip</Label>
    </div>

    <div v-else-if="variant === 'optional'" class="label-demo__control">
      <Input
        label="Phone Number"
        :required="false"
        placeholder="+1 555-0000"
      />
    </div>

    <div v-else-if="variant === 'tooltip'" class="label-demo__control">
      <Input
        label="API Key"
        label-tooltip="Find this in your dashboard settings under API > Keys"
        placeholder="sk_live_..."
      />
    </div>

    <Checkbox v-else-if="variant === 'rich'" default-checked>
      <span>I agree to the <strong>Terms of Service</strong></span>
    </Checkbox>

    <div v-else-if="variant === 'mixed'" class="label-demo__form">
      <Input label="Full Name" placeholder="John Doe" />
      <Input
        label="Email"
        label-tooltip="We'll send your receipt here"
        placeholder="john@example.com"
        type="email"
      />
      <Input label="Company" :required="false" placeholder="Acme Inc." />
      <Select.Root :collection="countryCollection" class="label-demo__select-field">
        <Select.Label class="label-demo__select-label">Country</Select.Label>
        <Select.Control>
          <Select.Trigger class="label-demo__select-trigger" aria-label="Country">
            <Select.ValueText placeholder="Select a country" />
            <Select.Indicator class="label-demo__select-indicator">
              <PhCaretUpDown :size="16" aria-hidden="true" />
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content class="label-demo__select-content">
            <Select.Item
              v-for="country in countryItems"
              :key="country.value"
              :item="country"
              class="label-demo__select-item"
            >
              <Select.ItemText>{{ country.label }}</Select.ItemText>
              <Select.ItemIndicator class="label-demo__select-item-indicator">
                <PhCheck :size="16" aria-hidden="true" />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Content>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.Root>
    </div>

    <div v-else class="label-demo__stack">
      <Label>Default</Label>
      <Label show-optional>Optional</Label>
      <Label tooltip="Important field">With Tooltip</Label>
    </div>
  </div>
</template>

<style scoped>
.label-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.label-demo__stack,
.label-demo__form {
  display: grid;
  gap: 1rem;
}

.label-demo__control,
.label-demo__form {
  width: 14.125rem;
  max-width: 100%;
}

.label-demo__control :deep(.phi-input-field) {
  width: 100%;
}

.label-demo__select-field {
  display: grid;
  width: 100%;
  gap: 0.5rem;
}

.label-demo__select-label {
  display: block;
  width: 100%;
  margin: 0;
  color: var(--phi-default, #17191f);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  user-select: none;
}

.label-demo__select-trigger {
  display: inline-flex;
  width: max-content;
  height: 2.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--phi-base, #ffffff);
  box-shadow: 0 0 0 1px var(--phi-line, rgba(20, 20, 20, 0.1));
  color: var(--phi-default, #17191f);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
}

.label-demo__select-trigger:hover {
  background: var(--phi-tint, #f8fafc);
}

.label-demo__select-trigger:focus-visible {
  outline: 2px solid var(--phi-focus, #4c63ff);
  outline-offset: 2px;
}

.label-demo__select-indicator {
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--phi-subtle, #6c7480);
}

.label-demo__select-indicator svg {
  width: 1rem;
  height: 1rem;
  flex: none;
  fill: currentColor;
}

.label-demo__select-content {
  z-index: 80;
  display: flex;
  box-sizing: border-box;
  min-width: calc(var(--reference-width, 9.375rem) + 3px);
  max-height: var(--available-height, 18rem);
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.375rem 0;
  border-radius: 0.5rem;
  background: var(--phi-base, #ffffff);
  box-shadow:
    0 0 0 1px var(--phi-line, rgba(20, 20, 20, 0.1)),
    0 12px 28px rgba(16, 24, 40, 0.14);
  color: var(--phi-default, #17191f);
}

.label-demo__select-content[hidden],
.label-demo__select-content[data-state="closed"] {
  display: none;
}

.label-demo__select-item {
  display: flex;
  min-height: 2rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.25rem;
  color: var(--phi-default, #17191f);
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.25rem;
  outline: none;
}

.label-demo__select-item[data-highlighted] {
  background: var(--phi-tint, #f8fafc);
}

.label-demo__select-item[data-disabled] {
  color: var(--phi-subtle, #6c7480);
  cursor: not-allowed;
}

.label-demo__select-item-indicator {
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--phi-default, #17191f);
}

.label-demo__select-item-indicator[hidden],
.label-demo__select-item-indicator[data-state="unchecked"] {
  display: none;
}

.label-demo__select-item-indicator svg {
  width: 1rem;
  height: 1rem;
}
</style>
