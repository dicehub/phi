<script setup lang="ts">
import { computed } from "vue";
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { getComboboxAriaProps, type ComboboxAriaProps } from "./combobox-aria";
import { usePhiComboboxContext, type ComboboxSize } from "./combobox-context";

defineOptions({ inheritAttrs: false });

defineSlots<{
  default?: (props: { items: unknown[]; label: string; value: string[] }) => unknown;
}>();

const props = defineProps<ComboboxAriaProps & {
  asChild?: boolean;
  placeholder?: string;
  size?: ComboboxSize;
}>();

const arkCombobox = useComboboxContext();
const phiCombobox = usePhiComboboxContext();
const ariaProps = computed(() => getComboboxAriaProps(props, phiCombobox.describedBy.value));
const resolvedSize = computed(() => props.size ?? phiCombobox.size.value);
const selectedLabel = computed(() => arkCombobox.value.valueAsString);
const selectedValue = computed(() => arkCombobox.value.value);
const selectedItems = computed(() => arkCombobox.value.selectedItems ?? phiCombobox.collection.value.findMany(arkCombobox.value.value ?? []));
const displayLabel = computed(() => selectedLabel.value || props.placeholder || "Select an option");
</script>

<template>
  <Combobox.Trigger
    v-if="asChild"
    v-bind="{ ...$attrs, ...ariaProps }"
    as-child
    :data-invalid="phiCombobox.invalid.value ? '' : undefined"
  >
    <slot :items="selectedItems" :label="displayLabel" :value="selectedValue" />
  </Combobox.Trigger>

  <Combobox.Trigger
    v-else
    v-bind="{ ...$attrs, ...ariaProps }"
    class="phi-combobox-value-trigger"
    :class="`phi-combobox-value-trigger--${resolvedSize}`"
    :data-invalid="phiCombobox.invalid.value ? '' : undefined"
  >
    <span class="phi-combobox-value-trigger__label" :data-placeholder="selectedLabel ? undefined : ''">
      <slot :items="selectedItems" :label="displayLabel" :value="selectedValue">
        {{ displayLabel }}
      </slot>
    </span>
    <span class="phi-combobox-caret-icon" aria-hidden="true"></span>
  </Combobox.Trigger>
</template>
