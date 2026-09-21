<script setup lang="ts">
import { useSidebarContext } from "./sidebar-context";

const sidebar = useSidebarContext();
</script>

<template>
  <button
    type="button"
    data-sidebar="rail"
    data-phi-component="Sidebar"
    data-phi-part="rail"
    aria-label="Toggle sidebar"
    tabindex="-1"
    class="phi-sidebar-rail"
    @click="sidebar.toggleSidebar"
  />
</template>
