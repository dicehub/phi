<script setup lang="ts">
import { ref } from "vue";
import {
  Checkbox,
  type CheckboxCheckedState,
} from "../../../phi/src/components/checkbox";

withDefaults(
  defineProps<{
    variant?:
      | "basic"
      | "usage"
      | "default"
      | "checked"
      | "indeterminate"
      | "label-first"
      | "disabled"
      | "error"
      | "group"
      | "group-error"
      | "legend-sr-only"
      | "legend-custom";
  }>(),
  {
    variant: "basic",
  },
);

const basicChecked = ref(false);
const usageChecked = ref(false);
const defaultChecked = ref(false);
const checked = ref(true);
const indeterminate = ref<CheckboxCheckedState>("indeterminate");
const labelFirstChecked = ref(false);
const preferences = ref(["email"]);
const hiddenLegendPreferences = ref(["email"]);
const customLegendPreferences = ref(["email"]);
</script>

<template>
  <div
    class="checkbox-demo"
    :class="{ 'checkbox-demo--group': ['group', 'group-error', 'legend-sr-only', 'legend-custom'].includes(variant) }"
  >
    <Checkbox
      v-if="variant === 'basic'"
      v-model:checked="basicChecked"
      label="Accept terms and conditions"
    />

    <Checkbox v-else-if="variant === 'usage'" v-model:checked="usageChecked" label="Accept terms" />

    <Checkbox
      v-else-if="variant === 'default'"
      v-model:checked="defaultChecked"
      label="Enable notifications"
    />

    <Checkbox v-else-if="variant === 'checked'" v-model:checked="checked" label="I agree" />

    <Checkbox
      v-else-if="variant === 'indeterminate'"
      v-model:checked="indeterminate"
      label="Select all"
    />

    <Checkbox
      v-else-if="variant === 'label-first'"
      v-model:checked="labelFirstChecked"
      label="Remember me"
      :control-first="false"
    />

    <Checkbox v-else-if="variant === 'disabled'" label="Disabled option" disabled />

    <Checkbox v-else-if="variant === 'error'" label="Invalid option" variant="error" />

    <Checkbox.Group
      v-else-if="variant === 'group'"
      v-model="preferences"
      legend="Email preferences"
      description="Choose how you'd like to receive updates"
    >
      <Checkbox.Item value="email" label="Email notifications" />
      <Checkbox.Item value="sms" label="SMS notifications" />
      <Checkbox.Item value="push" label="Push notifications" />
    </Checkbox.Group>

    <Checkbox.Group
      v-else-if="variant === 'group-error'"
      legend="Required preferences"
      error="Please select at least one notification method"
      :model-value="[]"
    >
      <Checkbox.Item value="email" label="Email" variant="error" />
      <Checkbox.Item value="sms" label="SMS" variant="error" />
    </Checkbox.Group>

    <Checkbox.Group
      v-else-if="variant === 'legend-sr-only'"
      v-model="hiddenLegendPreferences"
      appearance="card"
      orientation="horizontal"
    >
      <Checkbox.Legend class="phi-sr-only">Notification preferences</Checkbox.Legend>
      <Checkbox.Item value="email" label="Email notifications" />
      <Checkbox.Item value="sms" label="SMS notifications" />
      <Checkbox.Item value="push" label="Push notifications" />
    </Checkbox.Group>

    <div v-else class="checkbox-demo__legends">
      <Checkbox.Group v-model="customLegendPreferences">
        <Checkbox.Legend style="font-size: 0.875rem; font-weight: 400; color: var(--phi-subtle);">
          Notification preferences
        </Checkbox.Legend>
        <Checkbox.Item value="email" label="Email notifications" />
        <Checkbox.Item value="sms" label="SMS notifications" />
        <Checkbox.Item value="push" label="Push notifications" />
      </Checkbox.Group>
      <Checkbox.Group v-model="customLegendPreferences" appearance="card" orientation="horizontal">
        <Checkbox.Legend style="font-size: 0.875rem; font-weight: 400; color: var(--phi-subtle);">
          Notification preferences
        </Checkbox.Legend>
        <Checkbox.Item value="email" label="Email notifications" />
        <Checkbox.Item value="sms" label="SMS notifications" appearance="default" />
        <Checkbox.Item value="push" label="Push notifications" />
      </Checkbox.Group>
    </div>
  </div>
</template>

<style scoped>
.checkbox-demo {
  display: flex;
  min-height: 4.5rem;
  align-items: center;
  justify-content: center;
}

.checkbox-demo__legends {
  display: grid;
  gap: 1.5rem;
}

.checkbox-demo--group {
  min-height: 9rem;
  align-items: center;
}
</style>
