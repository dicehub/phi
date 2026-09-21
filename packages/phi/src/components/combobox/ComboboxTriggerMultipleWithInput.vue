<script setup lang="ts">
import { computed } from "vue";
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import ComboboxChip from "./ComboboxChip.vue";
import { usePhiComboboxContext, type ComboboxSize } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    clearable?: boolean;
    inputSide?: "right" | "top";
    placeholder?: string;
    showTrigger?: boolean;
    size?: ComboboxSize;
  }>(),
  {
    clearable: true,
    inputSide: "right",
    showTrigger: true,
  },
);

const arkCombobox = useComboboxContext();
const phiCombobox = usePhiComboboxContext();
const resolvedSize = computed(() => props.size ?? phiCombobox.size.value);
const selectedItems = computed(() => arkCombobox.value.selectedItems ?? phiCombobox.collection.value.findMany(arkCombobox.value.value ?? []));
const itemToKey = (item: unknown) => phiCombobox.collection.value.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <Combobox.Control
    v-bind="$attrs"
    class="phi-combobox-multi-control"
    :class="[`phi-combobox-multi-control--${resolvedSize}`, `phi-combobox-multi-control--input-${inputSide}`]"
    :data-invalid="phiCombobox.invalid.value ? '' : undefined"
  >
    <div class="phi-combobox-chip-list">
      <slot name="chip-list" :items="selectedItems">
        <ComboboxChip v-for="item in selectedItems" :key="itemToKey(item)" :item="item" />
      </slot>
      <Combobox.Input
        class="phi-combobox-multi-input"
        :aria-describedby="phiCombobox.describedBy.value"
        :placeholder="placeholder"
      />
    </div>
    <Combobox.ClearTrigger v-if="clearable" class="phi-combobox-icon-button" aria-label="Clear selection">
      <span class="phi-combobox-clear-icon" aria-hidden="true"></span>
    </Combobox.ClearTrigger>
    <Combobox.Trigger v-if="showTrigger" class="phi-combobox-icon-button" aria-label="Toggle options">
      <span class="phi-combobox-caret-icon" aria-hidden="true"></span>
    </Combobox.Trigger>
  </Combobox.Control>
</template>
