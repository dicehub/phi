<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, watchEffect } from "vue";
import { Combobox } from "@ark-ui/vue/combobox";
import {
  COMBOBOX_POSITIONING_KEYS,
  getComboboxContentPositioning,
  type ComboboxContentProps,
} from "./combobox";
import { usePhiComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = defineProps<ComboboxContentProps>();
const context = usePhiComboboxContext();
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasProp = (key: string) => {
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  return Object.prototype.hasOwnProperty.call(vnodeProps, key) || Object.prototype.hasOwnProperty.call(vnodeProps, kebabKey);
};
const positioning = computed(() =>
  getComboboxContentPositioning(
    Object.fromEntries(
      COMBOBOX_POSITIONING_KEYS.filter((key) => hasProp(key)).map((key) => [key, props[key]]),
    ) as ComboboxContentProps,
  ),
);

watchEffect(() => {
  context.setContentPositioning(positioning.value);
});

onBeforeUnmount(() => {
  context.clearContentPositioning();
});
</script>

<template>
  <Combobox.Positioner class="phi-combobox-positioner">
    <Combobox.Content v-bind="$attrs" class="phi-combobox-content">
      <slot />
    </Combobox.Content>
  </Combobox.Positioner>
</template>
