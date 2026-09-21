<script setup lang="ts">
import { defineComponent, h, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Sidebar, useSidebar } from "@dicehub/phi/components/sidebar";

const showTarget = ref(true);
const targetId = ref("item-24");
const ScrollControls = defineComponent({
  setup() {
    const { scrollToItem, scrollItemIntoView } = useSidebar();
    const actions = [
      ["Reveal item 24", () => scrollItemIntoView("item-24", { align: "center", behavior: "smooth" })],
      ["Align item 24", () => scrollToItem("item-24", { align: "start" })],
      ["Reveal first item", () => scrollItemIntoView("item-1")],
      ["Reveal wrapped item", () => scrollItemIntoView("item-12", { align: "center" })],
      ["Reveal nested button", () => scrollItemIntoView("item-16", { align: "end" })],
      ["Reveal renamed item", () => scrollItemIntoView("renamed", { align: "center" })],
    ] as const;
    return () => h("div", { class: "sidebar-scroll-demo__actions" }, actions.map(([label, onClick]) =>
      h(Button, { size: "sm", variant: "secondary", onClick }, () => label),
    ));
  },
});
</script>

<template>
  <Sidebar.Provider contained collapsible="none" :mobile-breakpoint="1" class="sidebar-scroll-demo">
    <Sidebar>
      <Sidebar.Header>Project navigation</Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Menu>
          <template v-for="item in 40" :key="item">
            <Sidebar.MenuItem v-if="item === 12" item-id="item-12">
              <Sidebar.MenuButton>Item 12</Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem v-else-if="item === 16">
              <Sidebar.MenuButton item-id="item-16">Item 16</Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuButton
              v-else-if="item !== 24 || showTarget"
              :item-id="item === 24 ? targetId : `item-${item}`"
            >Item {{ item }}</Sidebar.MenuButton>
          </template>
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar>
    <div class="sidebar-scroll-demo__panel">
      <ScrollControls />
      <label><input v-model="showTarget" type="checkbox" /> Show item 24</label>
      <label><input v-model="targetId" type="checkbox" true-value="renamed" false-value="item-24" /> Rename item 24</label>
    </div>
  </Sidebar.Provider>
</template>

<style scoped>
.sidebar-scroll-demo {
  height: 22rem;
  width: 100%;
}

.sidebar-scroll-demo__panel {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  padding: 1rem;
  min-width: 0;
}

.sidebar-scroll-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
