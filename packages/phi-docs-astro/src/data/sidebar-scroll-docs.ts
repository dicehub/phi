export const sidebarScrollCode = `<script setup lang="ts">
import { Sidebar, useSidebar } from "@dicehub/phi/components/sidebar";

// Call inside a component rendered below Sidebar.Provider.
const { scrollItemIntoView, scrollToItem } = useSidebar();
const reveal = () => scrollItemIntoView("settings", { align: "center" });
const align = () => scrollToItem("settings", { align: "start" });
</script>

<template>
  <Sidebar.Content>
    <Sidebar.Menu>
      <Sidebar.MenuButton item-id="settings">Settings</Sidebar.MenuButton>
    </Sidebar.Menu>
  </Sidebar.Content>
  <button @click="reveal">Reveal settings if outside the viewport</button>
  <button @click="align">Align settings with the top</button>
</template>`;
