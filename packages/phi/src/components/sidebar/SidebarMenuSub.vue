<script setup lang="ts">
import { provideSidebarMenuSubItemContext } from "./sidebar-context";

// A nested list starts a new item boundary, even inside an outer submenu item.
provideSidebarMenuSubItemContext(false);
</script>

<template>
  <ul data-sidebar="menu-sub" class="phi-sidebar-menu-sub">
    <li aria-hidden="true" class="phi-sidebar-menu-sub__line" />
    <slot />
  </ul>
</template>
