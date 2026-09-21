<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    modal?: boolean;
    open?: boolean;
  }>(),
  {
    ariaLabel: "Command palette",
    closeOnEscape: true,
    closeOnInteractOutside: true,
    modal: true,
    open: false,
  },
);

const emit = defineEmits<{
  backdropClick: [event: MouseEvent];
  openChange: [open: boolean];
  "update:open": [open: boolean];
}>();

const setOpen = (open: boolean) => {
  emit("update:open", open);
  emit("openChange", open);
};

const handleOpenChange = (details: { open: boolean }) => {
  setOpen(details.open);
};

const handleBackdropClick = (event: MouseEvent) => {
  emit("backdropClick", event);
  setOpen(false);
};
</script>

<template>
  <Dialog.Root
    :close-on-escape="closeOnEscape"
    :close-on-interact-outside="closeOnInteractOutside"
    :modal="modal"
    :open="open"
    :prevent-scroll="modal"
    :trap-focus="modal"
    @open-change="handleOpenChange"
  >
    <Teleport to="body">
      <div v-if="open" class="phi-command-palette-dialog">
        <Dialog.Backdrop class="phi-command-palette-backdrop" @click="handleBackdropClick" />
        <Dialog.Positioner class="phi-command-palette-positioner">
          <Dialog.Content
            v-bind="$attrs"
            :aria-label="ariaLabel"
            class="phi-command-palette-content"
          >
            <slot />
          </Dialog.Content>
        </Dialog.Positioner>
      </div>
    </Teleport>
  </Dialog.Root>
</template>

<style src="./command-palette.css"></style>
