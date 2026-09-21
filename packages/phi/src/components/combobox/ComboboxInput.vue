<script setup lang="ts">
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { usePhiComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const context = usePhiComboboxContext();
const combobox = useComboboxContext();

const handleInput = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement;

  context.setFilterValue(input.value);
  combobox.value.setInputValue(input.value, "input-change");
  combobox.value.setOpen(true, "input-change");
};
</script>

<template>
  <input
    v-bind="$attrs"
    class="phi-combobox-search-input"
    :aria-describedby="context.describedBy.value"
    autocomplete="off"
    autocapitalize="none"
    autocorrect="off"
    role="searchbox"
    spellcheck="false"
    type="text"
    :value="context.filterValue.value"
    @input="handleInput"
    @pointerdown.stop
  />
</template>
