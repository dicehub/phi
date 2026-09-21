<script setup lang="ts">
import { useSidebarCollapseContext } from "./sidebar-context";

const collapse = useSidebarCollapseContext();
</script>

<template>
  <span
    aria-hidden="true"
    :class="['phi-sidebar-menu-chevron', { 'phi-sidebar-menu-chevron--open': collapse.isOpen.value }]"
  />
</template>
