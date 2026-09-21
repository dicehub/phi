<script setup lang="ts">
import { provideSidebarMenuItemContext } from "./sidebar-context";
import { useSidebarItem } from "./use-sidebar-item";

const props = defineProps<{ itemId?: string }>();
const itemRef = useSidebarItem(() => props.itemId);

provideSidebarMenuItemContext();
</script>

<template>
  <li ref="itemRef" :data-sidebar-item-id="itemId" data-sidebar="menu-item" class="phi-sidebar-menu-item">
    <slot />
  </li>
</template>
