<script setup lang="ts">
import { computed } from "vue";
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { usePhiComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    item?: unknown;
    removable?: boolean;
    value?: string;
  }>(),
  {
    removable: true,
  },
);

const arkCombobox = useComboboxContext();
const phiCombobox = usePhiComboboxContext();
const resolvedValue = computed(() => props.value ?? phiCombobox.collection.value.getItemValue(props.item) ?? "");
const resolvedLabel = computed(
  () => phiCombobox.collection.value.stringifyItem(props.item) ?? resolvedValue.value,
);

const remove = () => {
  if (!resolvedValue.value) return;
  arkCombobox.value.setValue(arkCombobox.value.value.filter((value) => value !== resolvedValue.value));
};
</script>

<template>
  <span v-bind="$attrs" class="phi-combobox-chip">
    <span class="phi-combobox-chip__label"><slot>{{ resolvedLabel }}</slot></span>
    <button
      v-if="removable"
      class="phi-combobox-chip__remove"
      type="button"
      :aria-label="`Remove ${resolvedLabel}`"
      @click.stop.prevent="remove"
    >
      <span class="phi-combobox-clear-icon" aria-hidden="true"></span>
    </button>
  </span>
</template>
