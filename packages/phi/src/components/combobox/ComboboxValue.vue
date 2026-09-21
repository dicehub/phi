<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { usePhiComboboxContext } from "./combobox-context";

defineProps<{
  placeholder?: string;
}>();

const combobox = useComboboxContext();
const phiCombobox = usePhiComboboxContext();
const selectedLabel = computed(() => combobox.value.valueAsString);
const selectedValue = computed(() => combobox.value.value);
const selectedItems = computed(() => combobox.value.selectedItems ?? phiCombobox.collection.value.findMany(combobox.value.value ?? []));
</script>

<template>
  <span class="phi-combobox-value" :data-placeholder="selectedLabel ? undefined : ''">
    <slot :items="selectedItems" :value="selectedValue">
      {{ selectedLabel || placeholder || "Select an option" }}
    </slot>
  </span>
</template>
