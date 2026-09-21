<script setup lang="ts">
import { provideSidebarMenuSubItemContext } from "./sidebar-context";

provideSidebarMenuSubItemContext();
</script>

<template>
  <li data-sidebar="menu-sub-item" class="phi-sidebar-menu-sub-item">
    <slot />
  </li>
</template>
