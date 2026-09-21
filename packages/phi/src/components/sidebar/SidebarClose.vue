<script setup lang="ts">
import { Button } from "../button";
import { useSidebarContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const sidebar = useSidebarContext();

const close = (event: MouseEvent) => {
  emit("click", event);
  sidebar.setOpenMobile(false);
};
</script>

<template>
  <Button
    v-bind="$attrs"
    type="button"
    variant="ghost"
    shape="square"
    size="sm"
    data-sidebar="close"
    data-phi-component="Sidebar"
    data-phi-part="close"
    aria-label="Close navigation"
    class="phi-sidebar-close"
    @click="close"
  >
    <slot>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="m6.75 6.75 10.5 10.5M17.25 6.75l-10.5 10.5" />
      </svg>
    </slot>
  </Button>
</template>
