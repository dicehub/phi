<script setup lang="ts">
import { computed, useAttrs, useId, useSlots } from "vue";
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    asChild?: boolean;
  }>(),
  {
    asChild: false,
  },
);

const slots = useSlots();
const attrs = useAttrs();
const generatedId = useId();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const closeId = computed(() => {
  const id = attrs.id;
  return typeof id === "string" && id ? id : `phi-dialog-close-${generatedId}`;
});
const closeAttrs = computed(() => ({ ...attrs, id: closeId.value }));
</script>

<template>
  <Dialog.CloseTrigger
    v-if="hasDefaultSlot"
    v-bind="closeAttrs"
    :as-child="asChild"
    class="phi-dialog-close-trigger"
  >
    <slot />
  </Dialog.CloseTrigger>
  <Dialog.CloseTrigger
    v-else
    v-bind="closeAttrs"
    class="phi-dialog-close"
    aria-label="Close"
    type="button"
  >
    <span class="phi-dialog-close__icon" aria-hidden="true" />
  </Dialog.CloseTrigger>
</template>
