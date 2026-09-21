<script setup lang="ts">
import { computed } from "vue";
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import { DIALOG_DEFAULT_SIZE, resolveDialogSize, type DialogSize } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    size?: DialogSize;
    teleportTo?: string | HTMLElement;
  }>(),
  {
    size: DIALOG_DEFAULT_SIZE,
    teleportTo: "body",
  },
);

const resolvedSize = computed(() => resolveDialogSize(props.size));
</script>

<template>
  <Teleport :to="teleportTo">
    <ArkDialog.Backdrop class="phi-dialog-backdrop" />
    <ArkDialog.Positioner class="phi-dialog-positioner">
      <ArkDialog.Content
        v-bind="$attrs"
        class="phi-dialog-content"
        :class="`phi-dialog-content--${resolvedSize}`"
      >
        <slot />
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  </Teleport>
</template>

<style src="./dialog.css"></style>
