<script setup lang="ts">
import { computed } from "vue";
import { useSidebarContext } from "./sidebar-context";

const sidebar = useSidebarContext();
const isOpen = computed(() =>
  sidebar.isMobile.value ? sidebar.openMobile.value : sidebar.open.value,
);
</script>

<template>
  <button
    type="button"
    data-sidebar="trigger"
    data-phi-component="Sidebar"
    data-phi-part="trigger"
    :aria-expanded="isOpen"
    :aria-label="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
    class="phi-sidebar-trigger"
    @click="sidebar.toggleSidebar"
  >
    <slot>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        class="phi-sidebar-trigger__icon"
      >
        <path d="M21.25 6.72v10.56a2.97 2.97 0 0 1-2.97 2.97H5.72a2.97 2.97 0 0 1-2.97-2.97V6.72a2.97 2.97 0 0 1 2.97-2.97h12.56a2.97 2.97 0 0 1 2.97 2.97" />
        <path d="M6.25 7.25v9.5" class="phi-sidebar-trigger__divider" />
      </svg>
    </slot>
  </button>
</template>
